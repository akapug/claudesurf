#!/bin/bash
# ClaudeSurf: Context Monitor Hook
# Fires after each tool use to monitor context saturation
# Reads real token counts from token-tracker if available

PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$(dirname "$(dirname "$(dirname "$0")")")}"
CONFIG_FILE="${PLUGIN_ROOT}/claudesurf.config.json"

# Load config
if [[ -f "$CONFIG_FILE" ]]; then
  AGENT_ID=$(jq -r '.agentId // "agent"' "$CONFIG_FILE")
  WARM_THRESHOLD=$(jq -r '.zones.warm // 50' "$CONFIG_FILE")
  COLD_THRESHOLD=$(jq -r '.zones.cold // 75' "$CONFIG_FILE")
  CRITICAL_THRESHOLD=$(jq -r '.zones.critical // 90' "$CONFIG_FILE")
else
  AGENT_ID="${CLAUDESURF_AGENT_ID:-agent}"
  WARM_THRESHOLD=50
  COLD_THRESHOLD=75
  CRITICAL_THRESHOLD=90
fi

# Read session ID from file created by session-restore.sh
SESSION_FILE="/tmp/claudesurf-session-${AGENT_ID}.id"
if [[ -f "$SESSION_FILE" ]]; then
  SESSION_ID=$(cat "$SESSION_FILE")
else
  SESSION_ID="default"
fi
TOKEN_STATE="/tmp/claudesurf-tokens-${AGENT_ID}-${SESSION_ID}.json"

# Read token state from tracker
if [[ -f "$TOKEN_STATE" ]]; then
  TOTAL_TOKENS=$(jq -r '.totalTokens // 0' "$TOKEN_STATE")
  CONTEXT_PERCENT=$(jq -r '.contextPercent // 0' "$TOKEN_STATE")
  TOOL_COUNT=$(jq -r '.toolCount // 0' "$TOKEN_STATE")
  ESTIMATED=$(jq -r '.estimatedFromLength // true' "$TOKEN_STATE")
else
  # Fallback to tool count heuristic
  TOOL_COUNT="${CLAUDESURF_TOOL_COUNT:-0}"
  TOOL_COUNT=$((TOOL_COUNT + 1))
  # Rough estimate: 1000 tokens per tool call on average
  TOTAL_TOKENS=$((TOOL_COUNT * 1000))
  CONTEXT_PERCENT=$((TOTAL_TOKENS * 100 / 200000))
  ESTIMATED="true"
fi

# Determine zone and emit appropriate warning
ZONE="hot"
if [[ $CONTEXT_PERCENT -ge $CRITICAL_THRESHOLD ]]; then
  ZONE="critical"
  echo ""
  echo "🔴 ClaudeSurf: CRITICAL context usage (~${CONTEXT_PERCENT}%)"
  echo "   Compaction imminent - save important context NOW"
  echo ""
elif [[ $CONTEXT_PERCENT -ge $COLD_THRESHOLD ]]; then
  ZONE="cold"
  echo ""
  echo "🟠 ClaudeSurf: Context at ~${CONTEXT_PERCENT}% (${TOTAL_TOKENS} tokens)"
  echo "   Consider saving key decisions and pending work"
  echo ""
elif [[ $CONTEXT_PERCENT -ge $WARM_THRESHOLD ]]; then
  ZONE="warm"
  # Only warn every 10 tool calls in warm zone
  if [[ $((TOOL_COUNT % 10)) -eq 0 ]]; then
    echo ""
    echo "🟡 ClaudeSurf: Context at ~${CONTEXT_PERCENT}% (${TOOL_COUNT} tool calls)"
    echo ""
  fi
fi

# Write zone info to state file for other hooks
echo "{\"zone\": \"${ZONE}\", \"contextPercent\": ${CONTEXT_PERCENT}, \"totalTokens\": ${TOTAL_TOKENS}, \"toolCount\": ${TOOL_COUNT}, \"estimated\": ${ESTIMATED}}" > "/tmp/claudesurf-zone-${AGENT_ID}.json"
