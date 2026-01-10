#!/bin/bash
# ClaudeSurf: Session Checkpoint Hook
# Fires on Stop to save session state

set -euo pipefail

PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$(dirname "$(dirname "$(dirname "$0")")")}"
CONFIG_FILE="${PLUGIN_ROOT}/claudesurf.config.json"

# Load config
if [[ -f "$CONFIG_FILE" ]]; then
  AGENT_ID=$(jq -r '.agentId // "unknown"' "$CONFIG_FILE")
  TEAM_ID=$(jq -r '.teamId // "unknown"' "$CONFIG_FILE")
  API_URL=$(jq -r '.apiUrl // "https://glue.elide.work"' "$CONFIG_FILE")
else
  AGENT_ID="${CLAUDESURF_AGENT_ID:-unknown}"
  TEAM_ID="${CLAUDESURF_TEAM_ID:-unknown}"
  API_URL="${CLAUDESURF_API_URL:-https://glue.elide.work}"
fi

# Skip if no agent configured
if [[ "$AGENT_ID" == "unknown" ]]; then
  exit 0
fi

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Create checkpoint payload
PAYLOAD=$(cat << EOF
{
  "tool": "agent-status",
  "args": {
    "action": "save-checkpoint",
    "agentId": "${AGENT_ID}",
    "teamId": "${TEAM_ID}",
    "conversationSummary": "Session ended at ${TIMESTAMP}",
    "workingOn": "Session complete",
    "pendingWork": [],
    "accomplishments": []
  }
}
EOF
)

# Save checkpoint to API (silent)
curl -s -X POST "${API_URL}/api/mcp" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" > /dev/null 2>&1 || true
