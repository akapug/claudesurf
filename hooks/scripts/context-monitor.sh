#!/bin/bash
# ClaudeSurf: Context Monitor Hook
# Fires after each tool use to monitor context saturation
# Lightweight - exits quickly if not in warning zone

set -euo pipefail

PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$(dirname "$(dirname "$(dirname "$0")")")}"
CONFIG_FILE="${PLUGIN_ROOT}/claudesurf.config.json"
STATE_FILE="/tmp/claudesurf-${CLAUDESURF_AGENT_ID:-agent}-state.json"

# Load thresholds from config
if [[ -f "$CONFIG_FILE" ]]; then
  WARM_THRESHOLD=$(jq -r '.zones.warm // 75' "$CONFIG_FILE")
  COLD_THRESHOLD=$(jq -r '.zones.cold // 90' "$CONFIG_FILE")
else
  WARM_THRESHOLD=75
  COLD_THRESHOLD=90
fi

# Try to get context usage from Claude's environment
# Note: This is a best-effort approach - Claude doesn't expose token counts directly
# We use a heuristic based on session duration and tool call count

TOOL_COUNT="${CLAUDESURF_TOOL_COUNT:-0}"
TOOL_COUNT=$((TOOL_COUNT + 1))
echo "{\"toolCount\": $TOOL_COUNT, \"lastCheck\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" > "$STATE_FILE"

# Heuristic: Warn after many tool calls (proxy for context growth)
# Real implementation would use actual token counts if available
if [[ $TOOL_COUNT -gt 50 ]]; then
  echo ""
  echo "⚠️  ClaudeSurf: High tool count ($TOOL_COUNT) - consider saving important context"
  echo ""
fi

# Export for next invocation
export CLAUDESURF_TOOL_COUNT=$TOOL_COUNT
