#!/bin/bash
# ClaudeSurf: Pre-Compact Save Hook
# Fires BEFORE Claude's built-in compaction to save memory first
# This is the key Windsurf behavior - memory-first compaction

set -euo pipefail

COMPACT_TYPE="${1:-auto}"
PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$(dirname "$(dirname "$(dirname "$0")")")}"
CONFIG_FILE="${PLUGIN_ROOT}/claudesurf.config.json"

# Load config
if [[ -f "$CONFIG_FILE" ]]; then
  AGENT_ID=$(jq -r '.agentId // "unknown"' "$CONFIG_FILE")
  TEAM_ID=$(jq -r '.teamId // "unknown"' "$CONFIG_FILE")
  API_URL=$(jq -r '.apiUrl // "https://glue.elide.work"' "$CONFIG_FILE")
  ENABLE_GROUPCHAT=$(jq -r '.enableGroupChatNotifications // true' "$CONFIG_FILE")
else
  AGENT_ID="${CLAUDESURF_AGENT_ID:-unknown}"
  TEAM_ID="${CLAUDESURF_TEAM_ID:-unknown}"
  API_URL="${CLAUDESURF_API_URL:-https://glue.elide.work}"
  ENABLE_GROUPCHAT="true"
fi

# Skip if no agent configured
if [[ "$AGENT_ID" == "unknown" ]]; then
  exit 0
fi

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Load token data from tracker
# Read session ID from file created by session-restore.sh
SESSION_FILE="/tmp/claudesurf-session-${AGENT_ID}.id"
if [[ -f "$SESSION_FILE" ]]; then
  SESSION_ID=$(cat "$SESSION_FILE")
else
  SESSION_ID="default"
fi
TOKEN_STATE="/tmp/claudesurf-tokens-${AGENT_ID}-${SESSION_ID}.json"
MEMORY_STATE="/tmp/claudesurf-memory-${AGENT_ID}-${SESSION_ID}.json"

if [[ -f "$TOKEN_STATE" ]]; then
  TOTAL_TOKENS=$(jq -r '.totalTokens // 0' "$TOKEN_STATE")
  CONTEXT_PERCENT=$(jq -r '.contextPercent // 0' "$TOKEN_STATE")
  TOOL_COUNT=$(jq -r '.toolCount // 0' "$TOKEN_STATE")
else
  TOTAL_TOKENS=0
  CONTEXT_PERCENT=0
  TOOL_COUNT=0
fi

# Load categorized memories
if [[ -f "$MEMORY_STATE" ]]; then
  DECISIONS=$(jq -c '.decisions // []' "$MEMORY_STATE")
  PREFERENCES=$(jq -c '.preferences // []' "$MEMORY_STATE")
  ERRORS=$(jq -c '.errors // []' "$MEMORY_STATE")
  CONTEXT_ITEMS=$(jq -c '.context // []' "$MEMORY_STATE")
else
  DECISIONS="[]"
  PREFERENCES="[]"
  ERRORS="[]"
  CONTEXT_ITEMS="[]"
fi

# Build categorized context string for summary
CATEGORIES_SUMMARY=""
if [[ "$DECISIONS" != "[]" ]]; then
  DECISION_COUNT=$(echo "$DECISIONS" | jq 'length')
  CATEGORIES_SUMMARY="${CATEGORIES_SUMMARY}${DECISION_COUNT} decisions, "
fi
if [[ "$PREFERENCES" != "[]" ]]; then
  PREF_COUNT=$(echo "$PREFERENCES" | jq 'length')
  CATEGORIES_SUMMARY="${CATEGORIES_SUMMARY}${PREF_COUNT} preferences, "
fi
if [[ "$ERRORS" != "[]" ]]; then
  ERROR_COUNT=$(echo "$ERRORS" | jq 'length')
  CATEGORIES_SUMMARY="${CATEGORIES_SUMMARY}${ERROR_COUNT} errors, "
fi
if [[ "$CONTEXT_ITEMS" != "[]" ]]; then
  CTX_COUNT=$(echo "$CONTEXT_ITEMS" | jq 'length')
  CATEGORIES_SUMMARY="${CATEGORIES_SUMMARY}${CTX_COUNT} context items"
fi
CATEGORIES_SUMMARY="${CATEGORIES_SUMMARY:-no categorized memories}"

# Create checkpoint payload with token data and categories
PAYLOAD=$(jq -n \
  --arg agent "$AGENT_ID" \
  --arg team "$TEAM_ID" \
  --arg summary "[PreCompact ${COMPACT_TYPE}] ${CONTEXT_PERCENT}% (~${TOTAL_TOKENS} tokens). Categories: ${CATEGORIES_SUMMARY}" \
  --arg working "Session compacted - context preserved" \
  --arg recent "Tokens: ${TOTAL_TOKENS}, Context: ${CONTEXT_PERCENT}%, Tools: ${TOOL_COUNT}" \
  --argjson decisions "$DECISIONS" \
  --argjson preferences "$PREFERENCES" \
  --argjson errors "$ERRORS" \
  --argjson context "$CONTEXT_ITEMS" \
  '{
    tool: "agent-status",
    args: {
      action: "save-checkpoint",
      agentId: $agent,
      teamId: $team,
      conversationSummary: $summary,
      workingOn: $working,
      pendingWork: [],
      accomplishments: [],
      recentContext: $recent,
      decisions: $decisions,
      preferences: $preferences,
      errors: $errors,
      contextItems: $context
    }
  }'
)

# Save checkpoint to API
curl -s -X POST "${API_URL}/api/mcp" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" > /dev/null 2>&1 || true

# Notify GroupChat if enabled
if [[ "$ENABLE_GROUPCHAT" == "true" ]]; then
  CHAT_PAYLOAD=$(cat << EOF
{
  "teamId": "${TEAM_ID}",
  "author": "${AGENT_ID}",
  "authorType": "agent",
  "message": "🔄 [COMPACTING] Context at ${CONTEXT_PERCENT}% (~${TOTAL_TOKENS} tokens) - saving before ${COMPACT_TYPE} compaction",
  "channel": "dev"
}
EOF
)
  curl -s -X POST "${API_URL}/api/groupchat/send" \
    -H "Content-Type: application/json" \
    -d "$CHAT_PAYLOAD" > /dev/null 2>&1 || true
fi

# Output confirmation for Claude to see
echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║  💾 CLAUDESURF: Memory saved before ${COMPACT_TYPE} compaction              ║"
echo "║  📊 Context: ${CONTEXT_PERCENT}% (~${TOTAL_TOKENS} tokens, ${TOOL_COUNT} tool calls)     ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
