#!/bin/bash
# ClaudeSurf: Memory Writer Helper
# Called by agent to write categorized memories before compaction
# Usage: memory-writer.sh <category> "<content>"
# Categories: decisions, preferences, errors, context

PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$(dirname "$(dirname "$(dirname "$0")")")}"
CONFIG_FILE="${PLUGIN_ROOT}/claudesurf.config.json"

if [[ -f "$CONFIG_FILE" ]]; then
  AGENT_ID=$(jq -r '.agentId // "agent"' "$CONFIG_FILE")
else
  AGENT_ID="${CLAUDESURF_AGENT_ID:-agent}"
fi

SESSION_ID="${CLAUDE_SESSION_ID:-$$}"
MEMORY_FILE="/tmp/claudesurf-memory-${AGENT_ID}-${SESSION_ID}.json"

CATEGORY="${1:-context}"
CONTENT="${2:-}"

if [[ -z "$CONTENT" ]]; then
  echo "Usage: memory-writer.sh <category> \"<content>\""
  echo "Categories: decisions, preferences, errors, context"
  exit 1
fi

# Load existing memory or create new
if [[ -f "$MEMORY_FILE" ]]; then
  MEMORY=$(cat "$MEMORY_FILE")
else
  MEMORY='{"decisions":[],"preferences":[],"errors":[],"context":[]}'
fi

# Append to appropriate category
MEMORY=$(echo "$MEMORY" | jq --arg cat "$CATEGORY" --arg val "$CONTENT" '.[$cat] += [$val]')

echo "$MEMORY" > "$MEMORY_FILE"
echo "Memory saved to category: $CATEGORY"
