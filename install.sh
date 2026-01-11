#!/bin/bash
# ClaudeSurf Installer
# Installs claudesurf hooks into Claude Code CLI
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/akapug/claudesurf/main/install.sh | bash
#   OR
#   ./install.sh [options]
#
# Options:
#   --uninstall    Remove claudesurf from settings
#   --dry-run      Show what would be done without making changes
#   --force        Overwrite existing hooks without prompting

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PLUGIN_NAME="claudesurf"
CLAUDE_DIR="${HOME}/.claude"
PLUGINS_DIR="${CLAUDE_DIR}/plugins"
PLUGIN_DIR="${PLUGINS_DIR}/${PLUGIN_NAME}"
SETTINGS_FILE="${CLAUDE_DIR}/settings.json"
HOOKS_DIR="${CLAUDE_DIR}/hooks"
REPO_URL="https://github.com/akapug/claudesurf"

# Cross-platform sed -i wrapper (macOS BSD sed vs GNU sed)
sed_inplace() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "$@"
  else
    sed -i "$@"
  fi
}

# Parse arguments
DRY_RUN=false
UNINSTALL=false
FORCE=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run) DRY_RUN=true; shift ;;
    --uninstall) UNINSTALL=true; shift ;;
    --force) FORCE=true; shift ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

log() { echo -e "${GREEN}[claudesurf]${NC} $1"; }
warn() { echo -e "${YELLOW}[claudesurf]${NC} $1"; }
error() { echo -e "${RED}[claudesurf]${NC} $1"; }
info() { echo -e "${BLUE}[claudesurf]${NC} $1"; }

# Check dependencies
check_deps() {
  local missing=()
  command -v jq &>/dev/null || missing+=("jq")
  command -v git &>/dev/null || missing+=("git")
  command -v curl &>/dev/null || missing+=("curl")

  if [[ ${#missing[@]} -gt 0 ]]; then
    error "Missing dependencies: ${missing[*]}"
    if [[ "$OSTYPE" == "darwin"* ]]; then
      error "Install them first: brew install ${missing[*]}"
    else
      error "Install them first using your package manager (e.g., apt, dnf, pacman)"
    fi
    exit 1
  fi
}

# Ensure directories exist
ensure_dirs() {
  mkdir -p "$PLUGINS_DIR" "$HOOKS_DIR"
}

# Clone or update plugin
install_plugin() {
  if [[ -d "$PLUGIN_DIR" ]]; then
    if [[ -d "$PLUGIN_DIR/.git" ]]; then
      log "Updating existing installation..."
      if [[ "$DRY_RUN" == "true" ]]; then
        info "[dry-run] Would git pull in $PLUGIN_DIR"
      else
        cd "$PLUGIN_DIR" && git pull --ff-only
      fi
    else
      warn "Plugin directory exists but is not a git repo"
      if [[ "$FORCE" == "true" ]]; then
        warn "Removing and re-cloning..."
        rm -rf "$PLUGIN_DIR"
        git clone "$REPO_URL" "$PLUGIN_DIR"
      else
        error "Use --force to overwrite, or remove $PLUGIN_DIR manually"
        exit 1
      fi
    fi
  else
    log "Cloning claudesurf..."
    if [[ "$DRY_RUN" == "true" ]]; then
      info "[dry-run] Would clone $REPO_URL to $PLUGIN_DIR"
    else
      git clone "$REPO_URL" "$PLUGIN_DIR"
    fi
  fi
}

# Fix paths in hooks.json to use absolute paths
fix_hook_paths() {
  local hooks_json="$PLUGIN_DIR/hooks/hooks.json"
  if [[ -f "$hooks_json" ]]; then
    log "Fixing hook paths..."
    if [[ "$DRY_RUN" == "true" ]]; then
      info "[dry-run] Would replace \${CLAUDE_PLUGIN_ROOT} with $PLUGIN_DIR in hooks.json"
    else
      sed_inplace "s|\${CLAUDE_PLUGIN_ROOT}|$PLUGIN_DIR|g" "$hooks_json"
    fi
  fi

  local mcp_json="$PLUGIN_DIR/.mcp.json"
  if [[ -f "$mcp_json" ]]; then
    if [[ "$DRY_RUN" == "true" ]]; then
      info "[dry-run] Would replace \${CLAUDE_PLUGIN_ROOT} with $PLUGIN_DIR in .mcp.json"
    else
      sed_inplace "s|\${CLAUDE_PLUGIN_ROOT}|$PLUGIN_DIR|g" "$mcp_json"
    fi
  fi
}

# Create default config if not exists
create_config() {
  local config_file="$PLUGIN_DIR/claudesurf.config.json"
  if [[ ! -f "$config_file" ]]; then
    log "Creating default config..."
    if [[ "$DRY_RUN" == "true" ]]; then
      info "[dry-run] Would create $config_file"
    else
      cat > "$config_file" << 'EOF'
{
  "agentId": "my-agent",
  "teamId": "my-team",
  "apiUrl": "https://glue.elide.work",
  "zones": {
    "hot": 50,
    "warm": 75,
    "cold": 90
  },
  "enableGroupChatNotifications": true
}
EOF
      warn "Edit $config_file to set your agentId and teamId"
    fi
  fi
}

# Patch settings.json to add hooks
patch_settings() {
  log "Patching Claude Code settings..."

  # Create settings.json if it doesn't exist
  if [[ ! -f "$SETTINGS_FILE" ]]; then
    if [[ "$DRY_RUN" == "true" ]]; then
      info "[dry-run] Would create $SETTINGS_FILE"
    else
      echo '{"hooks":{}}' > "$SETTINGS_FILE"
    fi
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    info "[dry-run] Would add claudesurf hooks to settings.json"
    return
  fi

  # Backup settings
  cp "$SETTINGS_FILE" "${SETTINGS_FILE}.backup.$(date +%s)"

  # Use jq to add hooks
  local tmp_file=$(mktemp)

  # Add SessionStart hook
  jq --arg cmd "bash $PLUGIN_DIR/hooks/scripts/session-restore.sh" '
    .hooks.SessionStart //= [{"hooks":[]}] |
    .hooks.SessionStart[0].hooks += [{"type":"command","command":$cmd,"timeout":30}] |
    .hooks.SessionStart[0].hooks |= unique_by(.command)
  ' "$SETTINGS_FILE" > "$tmp_file" && mv "$tmp_file" "$SETTINGS_FILE"

  # Add PostToolUse hook for context monitoring
  jq --arg cmd "bash $PLUGIN_DIR/hooks/scripts/context-monitor.sh" '
    .hooks.PostToolUse //= [] |
    if any(.hooks.PostToolUse[]; .matcher == "*" and any(.hooks[]; .command | contains("context-monitor"))) then .
    else .hooks.PostToolUse += [{"matcher":"*","hooks":[{"type":"command","command":$cmd,"timeout":10}]}]
    end
  ' "$SETTINGS_FILE" > "$tmp_file" && mv "$tmp_file" "$SETTINGS_FILE"

  # Add PreCompact hooks
  jq --arg cmd_auto "bash $PLUGIN_DIR/hooks/scripts/pre-compact-save.sh auto" \
     --arg cmd_manual "bash $PLUGIN_DIR/hooks/scripts/pre-compact-save.sh manual" '
    .hooks.PreCompact //= [] |
    if any(.hooks.PreCompact[]; .matcher == "auto") then .
    else .hooks.PreCompact += [{"matcher":"auto","hooks":[{"type":"command","command":$cmd_auto,"timeout":60}]}]
    end |
    if any(.hooks.PreCompact[]; .matcher == "manual") then .
    else .hooks.PreCompact += [{"matcher":"manual","hooks":[{"type":"command","command":$cmd_manual,"timeout":60}]}]
    end
  ' "$SETTINGS_FILE" > "$tmp_file" && mv "$tmp_file" "$SETTINGS_FILE"

  # Add Stop hook
  jq --arg cmd "bash $PLUGIN_DIR/hooks/scripts/session-checkpoint.sh" '
    .hooks.Stop //= [{"hooks":[]}] |
    .hooks.Stop[0].hooks += [{"type":"command","command":$cmd,"timeout":30}] |
    .hooks.Stop[0].hooks |= unique_by(.command)
  ' "$SETTINGS_FILE" > "$tmp_file" && mv "$tmp_file" "$SETTINGS_FILE"

  log "Settings patched successfully"
}

# Remove claudesurf from settings
uninstall_hooks() {
  log "Removing claudesurf hooks from settings..."

  if [[ ! -f "$SETTINGS_FILE" ]]; then
    warn "No settings.json found"
    return
  fi

  if [[ "$DRY_RUN" == "true" ]]; then
    info "[dry-run] Would remove claudesurf hooks from settings.json"
    return
  fi

  # Backup
  cp "$SETTINGS_FILE" "${SETTINGS_FILE}.backup.$(date +%s)"

  local tmp_file=$(mktemp)

  # Remove hooks containing "claudesurf"
  jq '
    walk(if type == "array" then map(select(. | tostring | contains("claudesurf") | not)) else . end)
  ' "$SETTINGS_FILE" > "$tmp_file" && mv "$tmp_file" "$SETTINGS_FILE"

  log "Hooks removed"
}

# Main
main() {
  echo ""
  echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║  🏄 ClaudeSurf Installer                                          ║${NC}"
  echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════╝${NC}"
  echo ""

  if [[ "$UNINSTALL" == "true" ]]; then
    log "Uninstalling claudesurf..."
    uninstall_hooks
    warn "Plugin directory left at $PLUGIN_DIR (remove manually if desired)"
    log "Uninstall complete!"
    exit 0
  fi

  check_deps
  ensure_dirs
  install_plugin
  fix_hook_paths
  create_config
  patch_settings

  echo ""
  log "Installation complete!"
  echo ""
  info "Next steps:"
  info "1. Edit $PLUGIN_DIR/claudesurf.config.json with your agentId and teamId"
  info "2. Restart Claude Code to load the new hooks"
  info "3. Your sessions will now auto-save before compaction!"
  echo ""
}

main "$@"
