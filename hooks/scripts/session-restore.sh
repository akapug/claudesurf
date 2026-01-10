#!/bin/bash
# ClaudeSurf: Session Restore Hook
# Fires on SessionStart to load previous checkpoint

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

# Fetch checkpoint from API
CHECKPOINT=$(curl -s -X POST "${API_URL}/api/mcp" \
  -H "Content-Type: application/json" \
  -d "{\"tool\":\"agent-status\",\"args\":{\"action\":\"get-checkpoint\",\"agentId\":\"${AGENT_ID}\",\"teamId\":\"${TEAM_ID}\"}}" 2>/dev/null || echo "{}")

# Extract checkpoint data
SUMMARY=$(echo "$CHECKPOINT" | jq -r '.result.conversationSummary // empty' 2>/dev/null || echo "")
PENDING=$(echo "$CHECKPOINT" | jq -r '.result.pendingWork // [] | join("\n- ")' 2>/dev/null || echo "")
ACCOMPLISHMENTS=$(echo "$CHECKPOINT" | jq -r '.result.accomplishments // [] | join("\n- ")' 2>/dev/null || echo "")

# If we have checkpoint data, output it for Claude to see
if [[ -n "$SUMMARY" ]]; then
  cat << EOF

╔══════════════════════════════════════════════════════════════════╗
║  📦 CLAUDESURF: Previous Session Context Restored                ║
╚══════════════════════════════════════════════════════════════════╝

## Session Summary
${SUMMARY}

EOF

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

  echo "────────────────────────────────────────────────────────────────"
fi
