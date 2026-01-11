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
SESSION_ID="${CLAUDE_SESSION_ID:-$$}"
TOKEN_STATE="/tmp/claudesurf-tokens-${AGENT_ID}-${SESSION_ID}.json"
ZONE_STATE="/tmp/claudesurf-zone-${AGENT_ID}.json"

if [[ -f "$TOKEN_STATE" ]]; then
  TOTAL_TOKENS=$(jq -r '.totalTokens // 0' "$TOKEN_STATE")
  CONTEXT_PERCENT=$(jq -r '.contextPercent // 0' "$TOKEN_STATE")
  TOOL_COUNT=$(jq -r '.toolCount // 0' "$TOKEN_STATE")
else
  TOTAL_TOKENS=0
  CONTEXT_PERCENT=0
  TOOL_COUNT=0
fi

# Create checkpoint payload with token data
PAYLOAD=$(cat << EOF
{
  "tool": "agent-status",
  "args": {
    "action": "save-checkpoint",
    "agentId": "${AGENT_ID}",
    "teamId": "${TEAM_ID}",
    "conversationSummary": "[PreCompact ${COMPACT_TYPE}] Context saved at ${CONTEXT_PERCENT}% (~${TOTAL_TOKENS} tokens, ${TOOL_COUNT} tool calls)",
    "workingOn": "Session compacted - context preserved",
    "pendingWork": [],
    "accomplishments": [],
    "recentContext": "Tokens: ${TOTAL_TOKENS}, Context: ${CONTEXT_PERCENT}%, Tools: ${TOOL_COUNT}"
  }
}
EOF
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
