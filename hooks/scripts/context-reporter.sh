#!/bin/bash
# ClaudeSurf: Context Reporter for Remote Agents
# Reports context/token usage to Glue MCP for remote agent visibility
#
# Use cases:
# 1. Docker agents reporting context to Glue dashboard
# 2. Fly.io agents tracking context across restarts
# 3. Any agent that needs centralized context monitoring
#
# Can be called:
# - From PostToolUse hook (automatic reporting)
# - Manually via CLI
# - From cron/scheduler for periodic reporting

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/lib/common.sh"

load_config

# Get state directory
STATE_DIR="$(get_state_dir)"

# Collect context data from all available sources
collect_context_data() {
  local total_tokens=0
  local context_percent=0
  local token_source="unknown"
  local context_limit=${MAX_CONTEXT_TOKENS:-200000}

  # Priority 1: Status line data (most accurate post-compaction)
  local status_file="${STATE_DIR}/status-line-${AGENT_ID}.json"
  if [[ -f "$status_file" ]]; then
    local status_age=$(($(date +%s) - $(stat -c %Y "$status_file" 2>/dev/null || stat -f %m "$status_file" 2>/dev/null || echo 0)))
    # Use if less than 60 seconds old
    if [[ $status_age -lt 60 ]]; then
      total_tokens=$(jq -r '.totalTokens // 0' "$status_file")
      context_percent=$(jq -r '.contextPercent // 0' "$status_file")
      context_limit=$(jq -r '.contextWindow // 200000' "$status_file")
      token_source="status_line"
    fi
  fi

  # Priority 2: Token tracker data (cumulative, may not reflect compaction)
  if [[ "$token_source" == "unknown" ]]; then
    local session_id="$(get_session_id)"
    local token_file="${STATE_DIR}/tokens-${AGENT_ID}-${session_id}.json"
    if [[ -f "$token_file" ]]; then
      total_tokens=$(jq -r '.totalTokens // 0' "$token_file")
      context_percent=$(jq -r '.contextPercent // 0' "$token_file")
      token_source=$(jq -r '.tokenSource // "tracker"' "$token_file")
    fi
  fi

  # Priority 3: Zone file (backup)
  if [[ "$token_source" == "unknown" ]]; then
    local zone_file="${STATE_DIR}/zone-${AGENT_ID}.json"
    if [[ -f "$zone_file" ]]; then
      total_tokens=$(jq -r '.totalTokens // 0' "$zone_file")
      context_percent=$(jq -r '.contextPercent // 0' "$zone_file")
      token_source="zone"
    fi
  fi

  # Determine zone
  local zone="hot"
  [[ $context_percent -ge $WARM_THRESHOLD ]] && zone="warm"
  [[ $context_percent -ge $COLD_THRESHOLD ]] && zone="cold"
  [[ $context_percent -ge $CRITICAL_THRESHOLD ]] && zone="critical"

  # Output JSON
  cat << EOF
{
  "agentId": "${AGENT_ID}",
  "teamId": "${TEAM_ID}",
  "totalTokens": ${total_tokens},
  "contextPercent": ${context_percent},
  "contextLimit": ${context_limit},
  "zone": "${zone}",
  "tokenSource": "${token_source}",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
}

# Report to Glue MCP
report_to_glue() {
  local context_data="$1"

  [[ -z "$TEAM_ID" ]] && {
    debug_log "No TEAM_ID configured, skipping Glue report"
    return 0
  }

  local tokens=$(echo "$context_data" | jq -r '.totalTokens')
  local percent=$(echo "$context_data" | jq -r '.contextPercent')
  local zone=$(echo "$context_data" | jq -r '.zone')
  local source=$(echo "$context_data" | jq -r '.tokenSource')

  # Update agent status with context info
  local status_args=$(jq -n \
    --arg agent "$AGENT_ID" \
    --arg team "$TEAM_ID" \
    --arg task "Context: ${percent}% (${tokens} tokens) [${zone}] via ${source}" \
    '{
      action: "update",
      agentId: $agent,
      teamId: $team,
      currentTask: $task,
      status: "active"
    }')

  local response=$(call_glue_mcp "agent-status" "$status_args")
  debug_log "Glue report response: ${response:0:200}"

  # If critical, also post to GroupChat
  if [[ "$zone" == "critical" && "$ENABLE_GROUPCHAT" == "true" ]]; then
    local chat_args=$(jq -n \
      --arg team "$TEAM_ID" \
      --arg from "$AGENT_ID" \
      --arg msg "🔴 **Context Critical**: ${percent}% (${tokens} tokens) - compaction imminent" \
      '{
        action: "send",
        teamId: $team,
        from: $from,
        channel: "dev",
        message: $msg
      }')

    call_glue_mcp "group-chat" "$chat_args" > /dev/null
  fi
}

# Report to stdout (for local monitoring)
report_stdout() {
  local context_data="$1"
  local percent=$(echo "$context_data" | jq -r '.contextPercent')
  local tokens=$(echo "$context_data" | jq -r '.totalTokens')
  local zone=$(echo "$context_data" | jq -r '.zone')

  case "$zone" in
    hot)      ICON="🟢" ;;
    warm)     ICON="🟡" ;;
    cold)     ICON="🟠" ;;
    critical) ICON="🔴" ;;
  esac

  echo "${ICON} ClaudeSurf Context: ${percent}% (${tokens} tokens)"
}

# Main
main() {
  local mode="${1:-both}"  # glue, stdout, both, json

  local context_data=$(collect_context_data)

  case "$mode" in
    glue)
      report_to_glue "$context_data"
      ;;
    stdout)
      report_stdout "$context_data"
      ;;
    json)
      echo "$context_data"
      ;;
    both|*)
      report_stdout "$context_data"
      report_to_glue "$context_data"
      ;;
  esac
}

main "$@"
