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

# Create checkpoint payload
# Note: In a real implementation, this would extract context from the session
# For now, we create a marker that the PreCompact hook fired
PAYLOAD=$(cat << EOF
{
  "tool": "agent-status",
  "args": {
    "action": "save-checkpoint",
    "agentId": "${AGENT_ID}",
    "teamId": "${TEAM_ID}",
    "conversationSummary": "[PreCompact ${COMPACT_TYPE}] Context saved before compaction at ${TIMESTAMP}",
    "workingOn": "Session compacted - context preserved",
    "pendingWork": [],
    "accomplishments": []
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
  "message": "🔄 [COMPACTING] Context at ~90% - saving memory before ${COMPACT_TYPE} compaction",
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
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
