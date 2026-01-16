#!/bin/bash
# ClaudeSurf: Token Tracker Hook
# Fires after each tool use to track token consumption
#
# Token data sources (in priority order):
# 1. context.current_tokens - Patched Claude Code (best, includes compaction)
# 2. usage.input_tokens/output_tokens - Per-call API usage
# 3. Estimate from content length - Fallback (unreliable)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Load common functions if available
if [[ -f "${SCRIPT_DIR}/lib/common.sh" ]]; then
  source "${SCRIPT_DIR}/lib/common.sh"
  load_config
  STATE_DIR="$(get_state_dir)"
  SESSION_ID="$(get_session_id)"
else
  # Fallback for standalone mode
  PLUGIN_ROOT="${CLAUDESURF_ROOT:-${CLAUDE_PLUGIN_ROOT:-$(dirname "$(dirname "$(dirname "$0")")")}}"
  CONFIG_FILE="${PLUGIN_ROOT}/claudesurf.config.json"
  STATE_DIR="/tmp/claudesurf"
  mkdir -p "$STATE_DIR"

  if [[ -f "$CONFIG_FILE" ]]; then
    AGENT_ID=$(jq -r '.agentId // "agent"' "$CONFIG_FILE")
    DEBUG_MODE=$(jq -r '.debug // false' "$CONFIG_FILE")
  else
    AGENT_ID="${CLAUDESURF_AGENT_ID:-agent}"
    DEBUG_MODE="${CLAUDESURF_DEBUG:-false}"
  fi

  SESSION_FILE="${STATE_DIR}/session-${AGENT_ID}.id"
  if [[ -f "$SESSION_FILE" ]]; then
    SESSION_ID=$(cat "$SESSION_FILE")
  else
    SESSION_ID="default"
  fi
fi

STATE_FILE="${STATE_DIR}/tokens-${AGENT_ID}-${SESSION_ID}.json"
DEBUG_LOG="${STATE_DIR}/debug.log"

# Read tool input from stdin (Claude passes JSON with tool result)
INPUT=$(cat)

# Debug: Log raw input (first 500 chars)
if [[ "$DEBUG_MODE" == "true" ]]; then
  echo "[$(date -u +%H:%M:%S)] token-tracker input: ${INPUT:0:500}" >> "$DEBUG_LOG"
fi

# === PRIORITY 1: Current context total from patched Claude Code ===
# The patch exposes actual current context usage (handles compaction/summarization)
CURRENT_CONTEXT=$(echo "$INPUT" | jq -r '.context.current_tokens // .context_tokens // .current_context_tokens // empty' 2>/dev/null)
CONTEXT_LIMIT_FROM_API=$(echo "$INPUT" | jq -r '.context.max_tokens // .context_limit // empty' 2>/dev/null)
CONTEXT_PERCENT_FROM_API=$(echo "$INPUT" | jq -r '.context.percent_used // .context_percent // empty' 2>/dev/null)

# === PRIORITY 2: Per-call usage from API response ===
INPUT_TOKENS=$(echo "$INPUT" | jq -r '.usage.input_tokens // .input_tokens // empty' 2>/dev/null)
OUTPUT_TOKENS=$(echo "$INPUT" | jq -r '.usage.output_tokens // .output_tokens // empty' 2>/dev/null)

# Load existing state
if [[ -f "$STATE_FILE" ]]; then
  PREV_TOTAL=$(jq -r '.totalTokens // 0' "$STATE_FILE")
  CUMULATIVE_INPUT=$(jq -r '.cumulativeInputTokens // 0' "$STATE_FILE")
  CUMULATIVE_OUTPUT=$(jq -r '.cumulativeOutputTokens // 0' "$STATE_FILE")
  TOOL_COUNT=$(jq -r '.toolCount // 0' "$STATE_FILE")
else
  PREV_TOTAL=0
  CUMULATIVE_INPUT=0
  CUMULATIVE_OUTPUT=0
  TOOL_COUNT=0
fi

TOOL_COUNT=$((TOOL_COUNT + 1))

# Determine token source and calculate totals
TOKEN_SOURCE="unknown"
CONTEXT_LIMIT=${CONTEXT_LIMIT_FROM_API:-${MAX_CONTEXT_TOKENS:-200000}}

if [[ -n "$CURRENT_CONTEXT" && "$CURRENT_CONTEXT" != "null" ]]; then
  # Best case: Patch provides current context total
  TOTAL_TOKENS=$CURRENT_CONTEXT
  TOKEN_SOURCE="patched_context"

  # Detect if context went DOWN (compaction happened!)
  if [[ $TOTAL_TOKENS -lt $PREV_TOTAL && $PREV_TOTAL -gt 0 ]]; then
    COMPACTION_DETECTED="true"
    TOKENS_FREED=$((PREV_TOTAL - TOTAL_TOKENS))
    if [[ "$DEBUG_MODE" == "true" ]]; then
      echo "[$(date -u +%H:%M:%S)] COMPACTION DETECTED! Tokens: $PREV_TOTAL -> $TOTAL_TOKENS (freed: $TOKENS_FREED)" >> "$DEBUG_LOG"
    fi
  else
    COMPACTION_DETECTED="false"
    TOKENS_FREED=0
  fi

elif [[ -n "$INPUT_TOKENS" && "$INPUT_TOKENS" != "null" ]]; then
  # Per-call usage available - accumulate
  CUMULATIVE_INPUT=$((CUMULATIVE_INPUT + INPUT_TOKENS))
  OUTPUT_TOKENS=${OUTPUT_TOKENS:-0}
  CUMULATIVE_OUTPUT=$((CUMULATIVE_OUTPUT + OUTPUT_TOKENS))
  TOTAL_TOKENS=$((CUMULATIVE_INPUT + CUMULATIVE_OUTPUT))
  TOKEN_SOURCE="api_usage"
  COMPACTION_DETECTED="false"
  TOKENS_FREED=0

else
  # Fallback: Estimate from content length (unreliable!)
  CONTENT_LENGTH=${#INPUT}
  ESTIMATED_TOKENS=$((CONTENT_LENGTH / 4))
  CUMULATIVE_INPUT=$((CUMULATIVE_INPUT + ESTIMATED_TOKENS))
  TOTAL_TOKENS=$((CUMULATIVE_INPUT + CUMULATIVE_OUTPUT))
  TOKEN_SOURCE="estimated"
  COMPACTION_DETECTED="false"
  TOKENS_FREED=0
fi

# Calculate context percentage
if [[ -n "$CONTEXT_PERCENT_FROM_API" && "$CONTEXT_PERCENT_FROM_API" != "null" ]]; then
  CONTEXT_PERCENT=$CONTEXT_PERCENT_FROM_API
else
  CONTEXT_PERCENT=$((TOTAL_TOKENS * 100 / CONTEXT_LIMIT))
fi

# Save state
cat > "$STATE_FILE" << EOF
{
  "totalTokens": ${TOTAL_TOKENS},
  "contextPercent": ${CONTEXT_PERCENT},
  "contextLimit": ${CONTEXT_LIMIT},
  "cumulativeInputTokens": ${CUMULATIVE_INPUT},
  "cumulativeOutputTokens": ${CUMULATIVE_OUTPUT},
  "toolCount": ${TOOL_COUNT},
  "tokenSource": "${TOKEN_SOURCE}",
  "compactionDetected": ${COMPACTION_DETECTED},
  "tokensFreed": ${TOKENS_FREED},
  "lastUpdate": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

# Debug log
if [[ "$DEBUG_MODE" == "true" ]]; then
  echo "[$(date -u +%H:%M:%S)] tokens=$TOTAL_TOKENS pct=$CONTEXT_PERCENT% source=$TOKEN_SOURCE" >> "$DEBUG_LOG"
fi

# Export for other hooks to use
echo "CLAUDESURF_TOKENS=${TOTAL_TOKENS}"
echo "CLAUDESURF_CONTEXT_PERCENT=${CONTEXT_PERCENT}"
echo "CLAUDESURF_TOKEN_SOURCE=${TOKEN_SOURCE}"
