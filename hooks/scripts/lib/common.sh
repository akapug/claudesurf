#!/bin/bash
# ClaudeSurf: Common functions for all hooks
# Docker-compatible path resolution and config loading

# Resolve CLAUDESURF_ROOT (works in Docker, local, or plugin mode)
resolve_root() {
  if [[ -n "${CLAUDESURF_ROOT:-}" ]]; then
    echo "$CLAUDESURF_ROOT"
  elif [[ -n "${CLAUDE_PLUGIN_ROOT:-}" ]]; then
    echo "$CLAUDE_PLUGIN_ROOT"
  else
    # Fallback: derive from script location
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[1]}")" && pwd)"
    echo "$(dirname "$(dirname "$script_dir")")"
  fi
}

# State directory (persistent in Docker via volume mount)
get_state_dir() {
  local state_dir="${CLAUDESURF_STATE_DIR:-/tmp/claudesurf}"
  mkdir -p "$state_dir" 2>/dev/null || true
  echo "$state_dir"
}

# Load configuration with environment override support
load_config() {
  local root="$(resolve_root)"
  local config_file="${root}/claudesurf.config.json"

  # Environment variables take precedence over config file
  AGENT_ID="${CLAUDESURF_AGENT_ID:-}"
  TEAM_ID="${CLAUDESURF_TEAM_ID:-}"
  API_URL="${CLAUDESURF_API_URL:-}"
  DEBUG_MODE="${CLAUDESURF_DEBUG:-false}"

  # Load from config file if exists and env not set
  if [[ -f "$config_file" ]]; then
    [[ -z "$AGENT_ID" ]] && AGENT_ID=$(jq -r '.agentId // "agent"' "$config_file")
    [[ -z "$TEAM_ID" ]] && TEAM_ID=$(jq -r '.teamId // ""' "$config_file")
    [[ -z "$API_URL" ]] && API_URL=$(jq -r '.apiUrl // "https://glue.elide.work"' "$config_file")
    [[ "$DEBUG_MODE" == "false" ]] && DEBUG_MODE=$(jq -r '.debug // false' "$config_file")

    # Zone thresholds
    WARM_THRESHOLD=$(jq -r '.zones.warm // 50' "$config_file")
    COLD_THRESHOLD=$(jq -r '.zones.cold // 75' "$config_file")
    CRITICAL_THRESHOLD=$(jq -r '.zones.critical // 90' "$config_file")
    MAX_CONTEXT_TOKENS=$(jq -r '.maxContextTokens // 200000' "$config_file")
    ENABLE_GROUPCHAT=$(jq -r '.enableGroupChatNotifications // true' "$config_file")
  else
    # Defaults when no config file
    [[ -z "$AGENT_ID" ]] && AGENT_ID="agent"
    [[ -z "$API_URL" ]] && API_URL="https://glue.elide.work"
    WARM_THRESHOLD=50
    COLD_THRESHOLD=75
    CRITICAL_THRESHOLD=90
    MAX_CONTEXT_TOKENS=200000
    ENABLE_GROUPCHAT=true
  fi

  # Export for child processes
  export AGENT_ID TEAM_ID API_URL DEBUG_MODE
  export WARM_THRESHOLD COLD_THRESHOLD CRITICAL_THRESHOLD MAX_CONTEXT_TOKENS ENABLE_GROUPCHAT
}

# Get session ID (creates if not exists)
get_session_id() {
  local state_dir="$(get_state_dir)"
  local session_file="${state_dir}/session-${AGENT_ID}.id"

  if [[ -f "$session_file" ]]; then
    cat "$session_file"
  else
    local session_id="$(date +%s)-$$"
    echo "$session_id" > "$session_file"
    echo "$session_id"
  fi
}

# Get state file path for current session
get_state_file() {
  local name="$1"
  local state_dir="$(get_state_dir)"
  local session_id="$(get_session_id)"
  echo "${state_dir}/${name}-${AGENT_ID}-${session_id}.json"
}

# Debug logging
debug_log() {
  if [[ "$DEBUG_MODE" == "true" ]]; then
    local state_dir="$(get_state_dir)"
    echo "[$(date -u +%H:%M:%S)] $*" >> "${state_dir}/debug.log"
  fi
}

# Call Glue MCP tool (JSON-RPC 2.0)
call_glue_mcp() {
  local tool="$1"
  local args="$2"

  local payload=$(jq -n \
    --arg tool "$tool" \
    --argjson args "$args" \
    '{
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name: $tool, arguments: $args },
      id: 1
    }')

  curl -s --max-time 10 -X POST "${API_URL}/api/mcp" \
    -H "Content-Type: application/json" \
    -d "$payload" 2>/dev/null || echo '{"error": "API call failed"}'
}

# Report context metrics to Glue
report_context_to_glue() {
  local tokens="$1"
  local percent="$2"
  local source="$3"

  [[ -z "$TEAM_ID" ]] && return 0

  local args=$(jq -n \
    --arg agent "$AGENT_ID" \
    --arg team "$TEAM_ID" \
    --arg task "Context: ${percent}% (${tokens} tokens, source: ${source})" \
    '{
      action: "update",
      agentId: $agent,
      teamId: $team,
      currentTask: $task,
      status: "active"
    }')

  call_glue_mcp "agent-status" "$args" > /dev/null
}
