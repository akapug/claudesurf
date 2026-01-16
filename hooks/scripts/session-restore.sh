#!/bin/bash
# ClaudeSurf: Session Restore Hook
# Fires on SessionStart to load previous checkpoint

# Note: NOT using set -e because jq returns non-zero for null/missing fields

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Load common functions if available
if [[ -f "${SCRIPT_DIR}/lib/common.sh" ]]; then
  source "${SCRIPT_DIR}/lib/common.sh"
  load_config
  STATE_DIR="$(get_state_dir)"
else
  # Fallback for standalone mode
  PLUGIN_ROOT="${CLAUDESURF_ROOT:-${CLAUDE_PLUGIN_ROOT:-$(dirname "$(dirname "$(dirname "$0")")")}}"
  CONFIG_FILE="${PLUGIN_ROOT}/claudesurf.config.json"
  STATE_DIR="/tmp/claudesurf"
  mkdir -p "$STATE_DIR"

  if [[ -f "$CONFIG_FILE" ]]; then
    AGENT_ID=$(jq -r '.agentId // "unknown"' "$CONFIG_FILE")
    TEAM_ID=$(jq -r '.teamId // "unknown"' "$CONFIG_FILE")
    API_URL=$(jq -r '.apiUrl // "https://glue.elide.work"' "$CONFIG_FILE")
  else
    AGENT_ID="${CLAUDESURF_AGENT_ID:-unknown}"
    TEAM_ID="${CLAUDESURF_TEAM_ID:-unknown}"
    API_URL="${CLAUDESURF_API_URL:-https://glue.elide.work}"
  fi
fi

# Skip if no agent configured
if [[ "$AGENT_ID" == "unknown" ]]; then
  exit 0
fi

# Create session ID file for other hooks to use
# This ensures all hooks in the same session use the same identifier
SESSION_ID="$(date +%s)-$$"
SESSION_FILE="${STATE_DIR}/session-${AGENT_ID}.id"
echo "$SESSION_ID" > "$SESSION_FILE"

# Clean up old token/memory state files from previous sessions
rm -f "${STATE_DIR}/tokens-${AGENT_ID}-"*.json 2>/dev/null || true
rm -f "${STATE_DIR}/memory-${AGENT_ID}-"*.json 2>/dev/null || true

# Fetch checkpoint from API (JSON-RPC format)
RESPONSE=$(curl -s --max-time 10 -X POST "${API_URL}/api/mcp" \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"method\": \"tools/call\",
    \"params\": {
      \"name\": \"agent-status\",
      \"arguments\": {
        \"action\": \"get-checkpoint\",
        \"agentId\": \"${AGENT_ID}\",
        \"teamId\": \"${TEAM_ID}\"
      }
    },
    \"id\": 1
  }" 2>/dev/null || echo "{}")

# Parse JSON-RPC response - checkpoint is in result.content[0].text as JSON
CHECKPOINT_JSON=$(echo "$RESPONSE" | jq -r '.result.content[0].text // "{}"' 2>/dev/null || echo "{}")

# Extract checkpoint data from the nested structure
FOUND=$(echo "$CHECKPOINT_JSON" | jq -r '.found // false' 2>/dev/null || echo "false")
if [[ "$FOUND" != "true" ]]; then
  exit 0
fi

SUMMARY=$(echo "$CHECKPOINT_JSON" | jq -r '.checkpoint.conversationSummary // empty' 2>/dev/null || echo "")
PENDING=$(echo "$CHECKPOINT_JSON" | jq -r '.checkpoint.pendingWork // [] | join("\n- ")' 2>/dev/null || echo "")
ACCOMPLISHMENTS=$(echo "$CHECKPOINT_JSON" | jq -r '.checkpoint.accomplishments // [] | join("\n- ")' 2>/dev/null || echo "")
RECENT_CONTEXT=$(echo "$CHECKPOINT_JSON" | jq -r '.checkpoint.recentContext // empty' 2>/dev/null || echo "")

# Extract categorized memories
DECISIONS=$(echo "$CHECKPOINT_JSON" | jq -r '.checkpoint.decisions // [] | join("\n  - ")' 2>/dev/null || echo "")
PREFERENCES=$(echo "$CHECKPOINT_JSON" | jq -r '.checkpoint.preferences // [] | join("\n  - ")' 2>/dev/null || echo "")
ERRORS=$(echo "$CHECKPOINT_JSON" | jq -r '.checkpoint.errors // [] | join("\n  - ")' 2>/dev/null || echo "")
CONTEXT_ITEMS=$(echo "$CHECKPOINT_JSON" | jq -r '.checkpoint.contextItems // [] | join("\n  - ")' 2>/dev/null || echo "")

# If we have checkpoint data, output it for Claude to see
if [[ -n "$SUMMARY" ]]; then
  cat << EOF

╔══════════════════════════════════════════════════════════════════╗
║  📦 CLAUDESURF: Previous Session Context Restored                ║
╚══════════════════════════════════════════════════════════════════╝

## Session Summary
${SUMMARY}

EOF

  if [[ -n "$RECENT_CONTEXT" ]]; then
    echo "## Token Stats"
    echo "${RECENT_CONTEXT}"
    echo ""
  fi

  if [[ -n "$ACCOMPLISHMENTS" ]]; then
    echo "## Completed Last Session"
    echo "- ${ACCOMPLISHMENTS}"
    echo ""
  fi

  if [[ -n "$PENDING" ]]; then
    echo "## Pending Work"
    echo "- ${PENDING}"
    echo ""
  fi

  # Display categorized memories if any exist
  HAS_CATEGORIES=false
  if [[ -n "$DECISIONS" ]] || [[ -n "$PREFERENCES" ]] || [[ -n "$ERRORS" ]] || [[ -n "$CONTEXT_ITEMS" ]]; then
    HAS_CATEGORIES=true
    echo "## Preserved Memories"
  fi

  if [[ -n "$DECISIONS" ]]; then
    echo "### Decisions Made"
    echo "  - ${DECISIONS}"
    echo ""
  fi

  if [[ -n "$PREFERENCES" ]]; then
    echo "### User Preferences"
    echo "  - ${PREFERENCES}"
    echo ""
  fi

  if [[ -n "$ERRORS" ]]; then
    echo "### Errors Encountered"
    echo "  - ${ERRORS}"
    echo ""
  fi

  if [[ -n "$CONTEXT_ITEMS" ]]; then
    echo "### Important Context"
    echo "  - ${CONTEXT_ITEMS}"
    echo ""
  fi

  echo "────────────────────────────────────────────────────────────────"
fi
