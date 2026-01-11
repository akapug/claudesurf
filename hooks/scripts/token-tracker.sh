#!/bin/bash
# ClaudeSurf: Token Tracker Hook
# Fires after each tool use to track token consumption
# Extracts usage data from Claude API responses passed via stdin

PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$(dirname "$(dirname "$(dirname "$0")")")}"
CONFIG_FILE="${PLUGIN_ROOT}/claudesurf.config.json"

# Load agent ID for state file naming
if [[ -f "$CONFIG_FILE" ]]; then
  AGENT_ID=$(jq -r '.agentId // "agent"' "$CONFIG_FILE")
else
  AGENT_ID="${CLAUDESURF_AGENT_ID:-agent}"
fi

SESSION_ID="${CLAUDE_SESSION_ID:-$$}"
STATE_FILE="/tmp/claudesurf-tokens-${AGENT_ID}-${SESSION_ID}.json"

# Read tool input from stdin (Claude passes JSON with tool result)
INPUT=$(cat)

# Try to extract token usage from the response
# Claude API responses include usage.input_tokens and usage.output_tokens
INPUT_TOKENS=$(echo "$INPUT" | jq -r '.usage.input_tokens // .input_tokens // empty' 2>/dev/null)
OUTPUT_TOKENS=$(echo "$INPUT" | jq -r '.usage.output_tokens // .output_tokens // empty' 2>/dev/null)

# Fallback: Estimate from content length if no token data
if [[ -z "$INPUT_TOKENS" ]]; then
  CONTENT_LENGTH=${#INPUT}
  # Rough heuristic: ~4 chars per token
  INPUT_TOKENS=$((CONTENT_LENGTH / 4))
fi
if [[ -z "$OUTPUT_TOKENS" ]]; then
  OUTPUT_TOKENS=0
fi

# Load existing state
if [[ -f "$STATE_FILE" ]]; then
  CUMULATIVE_INPUT=$(jq -r '.cumulativeInputTokens // 0' "$STATE_FILE")
  CUMULATIVE_OUTPUT=$(jq -r '.cumulativeOutputTokens // 0' "$STATE_FILE")
  TOOL_COUNT=$(jq -r '.toolCount // 0' "$STATE_FILE")
else
  CUMULATIVE_INPUT=0
  CUMULATIVE_OUTPUT=0
  TOOL_COUNT=0
fi

# Update cumulative counts
CUMULATIVE_INPUT=$((CUMULATIVE_INPUT + INPUT_TOKENS))
CUMULATIVE_OUTPUT=$((CUMULATIVE_OUTPUT + OUTPUT_TOKENS))
TOOL_COUNT=$((TOOL_COUNT + 1))
TOTAL_TOKENS=$((CUMULATIVE_INPUT + CUMULATIVE_OUTPUT))

# Estimate context percentage (Claude has ~200K context)
# Using 200000 as approximate context limit
CONTEXT_LIMIT=200000
CONTEXT_PERCENT=$((TOTAL_TOKENS * 100 / CONTEXT_LIMIT))

# Save state
cat > "$STATE_FILE" << EOF
{
  "cumulativeInputTokens": ${CUMULATIVE_INPUT},
  "cumulativeOutputTokens": ${CUMULATIVE_OUTPUT},
  "totalTokens": ${TOTAL_TOKENS},
  "toolCount": ${TOOL_COUNT},
  "contextPercent": ${CONTEXT_PERCENT},
  "lastUpdate": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "estimatedFromLength": $([ -z "$(echo "$INPUT" | jq -r '.usage // empty' 2>/dev/null)" ] && echo "true" || echo "false")
}
EOF

# Export for other hooks to use
echo "CLAUDESURF_TOKENS=${TOTAL_TOKENS}"
echo "CLAUDESURF_CONTEXT_PERCENT=${CONTEXT_PERCENT}"
