#!/bin/bash
# ClaudeSurf: Status Line JSON Parser
# Parses Claude Code v2.1.6+ status line JSON for real-time context metrics
#
# Claude Code pipes JSON to status line scripts via stdin:
# {
#   "model": "claude-opus-4-5-20251101",
#   "context_window_size": 200000,
#   "current_usage": {
#     "input_tokens": 45000,
#     "cache_creation_input_tokens": 5000,
#     "cache_read_input_tokens": 2000
#   },
#   ...
# }
#
# This script can be used:
# 1. As a status line script (configure in ~/.claude/settings.json)
# 2. Called from other hooks to get accurate metrics
# 3. Run standalone to check current context

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
[[ -f "${SCRIPT_DIR}/lib/common.sh" ]] && source "${SCRIPT_DIR}/lib/common.sh"

# Fallback config if common.sh not available
load_config 2>/dev/null || {
  AGENT_ID="${CLAUDESURF_AGENT_ID:-agent}"
  DEBUG_MODE="${CLAUDESURF_DEBUG:-false}"
}

STATE_DIR="$(get_state_dir 2>/dev/null || echo /tmp/claudesurf)"
mkdir -p "$STATE_DIR"

# Read JSON from stdin (status line mode) or argument
if [[ -n "$1" ]]; then
  INPUT="$1"
else
  INPUT=$(cat)
fi

# Exit if no input
[[ -z "$INPUT" ]] && exit 0

# Parse status line JSON
CONTEXT_WINDOW=$(echo "$INPUT" | jq -r '.context_window_size // empty' 2>/dev/null)
INPUT_TOKENS=$(echo "$INPUT" | jq -r '.current_usage.input_tokens // empty' 2>/dev/null)
CACHE_CREATE=$(echo "$INPUT" | jq -r '.current_usage.cache_creation_input_tokens // 0' 2>/dev/null)
CACHE_READ=$(echo "$INPUT" | jq -r '.current_usage.cache_read_input_tokens // 0' 2>/dev/null)
MODEL=$(echo "$INPUT" | jq -r '.model // "unknown"' 2>/dev/null)

# Calculate if we have valid data
if [[ -n "$INPUT_TOKENS" && "$INPUT_TOKENS" != "null" && -n "$CONTEXT_WINDOW" && "$CONTEXT_WINDOW" != "null" ]]; then
  # Total tokens includes cache operations
  TOTAL_TOKENS=$((INPUT_TOKENS + CACHE_CREATE + CACHE_READ))
  CONTEXT_PERCENT=$((TOTAL_TOKENS * 100 / CONTEXT_WINDOW))
  TOKEN_SOURCE="status_line"

  # Determine zone
  ZONE="hot"
  [[ $CONTEXT_PERCENT -ge 50 ]] && ZONE="warm"
  [[ $CONTEXT_PERCENT -ge 75 ]] && ZONE="cold"
  [[ $CONTEXT_PERCENT -ge 90 ]] && ZONE="critical"

  # Save to state file for other hooks
  STATE_FILE="${STATE_DIR}/status-line-${AGENT_ID}.json"
  cat > "$STATE_FILE" << EOF
{
  "totalTokens": ${TOTAL_TOKENS},
  "inputTokens": ${INPUT_TOKENS},
  "cacheCreateTokens": ${CACHE_CREATE},
  "cacheReadTokens": ${CACHE_READ},
  "contextWindow": ${CONTEXT_WINDOW},
  "contextPercent": ${CONTEXT_PERCENT},
  "zone": "${ZONE}",
  "model": "${MODEL}",
  "tokenSource": "status_line",
  "lastUpdate": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

  # Debug log
  [[ "$DEBUG_MODE" == "true" ]] && echo "[$(date -u +%H:%M:%S)] status-line: ${CONTEXT_PERCENT}% (${TOTAL_TOKENS}/${CONTEXT_WINDOW})" >> "${STATE_DIR}/debug.log"

  # Output for status line display
  case "$ZONE" in
    hot)      ICON="🟢" ;;
    warm)     ICON="🟡" ;;
    cold)     ICON="🟠" ;;
    critical) ICON="🔴" ;;
  esac

  # Status line output format
  echo "${ICON} ${CONTEXT_PERCENT}% | ${MODEL}"
else
  # No valid context data - output model only
  [[ -n "$MODEL" && "$MODEL" != "null" ]] && echo "⚪ ${MODEL}"
fi
