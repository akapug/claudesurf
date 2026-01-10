# ClaudeSurf 🏄

**Windsurf-like memory persistence and context compaction for Claude Code CLI.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Claude Code Plugin](https://img.shields.io/badge/Claude%20Code-Plugin-purple.svg)](https://docs.anthropic.com/en/docs/claude-code/plugins)

ClaudeSurf replicates Windsurf/Cascade's effective context window management for Claude Code CLI agents. It saves structured memories **BEFORE** compaction, so agents stay on task across sessions.

## The Problem

Claude Code CLI's built-in compaction summarizes context when it gets full, but loses important details like:
- Key architectural decisions
- File paths being worked on
- User preferences learned during the session
- Pending tasks and blockers

## The Solution

ClaudeSurf hooks into Claude's compaction lifecycle:

```
Context reaches 90% → Claude triggers auto-compaction
                    → ClaudeSurf's PreCompact hook fires FIRST
                    → Saves structured memory to your backend
                    → THEN Claude's summarization runs
                    → Next session: Restores checkpoint automatically
```

## Quick Start

### Option 1: One-Line Installer (Recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/akapug/claudesurf/main/install.sh | bash
```

This will:
- Clone the repo to `~/.claude/plugins/claudesurf`
- Fix paths for the `${CLAUDE_PLUGIN_ROOT}` bug
- Create default config file
- Patch your `~/.claude/settings.json` with hooks

### Option 2: Manual Installation

```bash
# Clone the repo
git clone https://github.com/akapug/claudesurf.git ~/.claude/plugins/claudesurf
cd ~/.claude/plugins/claudesurf

# Fix paths (workaround for Claude Code bug #9354)
sed -i "s|\${CLAUDE_PLUGIN_ROOT}|$(pwd)|g" hooks/hooks.json .mcp.json

# Create config
cp claudesurf.config.json.example claudesurf.config.json
# Edit claudesurf.config.json with your agentId and teamId

# Manually add hooks to ~/.claude/settings.json (see Known Issues section)
```

### Option 3: Use with --plugin-dir Flag

```bash
# Run Claude with the plugin
claude --plugin-dir /path/to/claudesurf
```

## OpenCode Support

ClaudeSurf also supports [OpenCode](https://opencode.ai) via a native TypeScript plugin:

```bash
# Copy plugin to OpenCode's auto-load directory
cp opencode-plugin/index.ts ~/.config/opencode/plugin/claudesurf.ts
```

See [opencode-plugin/README.md](opencode-plugin/README.md) for full documentation.

## Configuration

Create `claudesurf.config.json` in your project root (or use environment variables):

```json
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
```

Or use environment variables:
```bash
export CLAUDESURF_AGENT_ID="my-agent"
export CLAUDESURF_TEAM_ID="my-team"
export CLAUDESURF_API_URL="https://glue.elide.work"
```

## Plugin Components

### Commands

| Command | Description |
|---------|-------------|
| `/claudesurf:save-memory` | Manually save current context to memory |
| `/claudesurf:restore-context` | Restore previous session's checkpoint |
| `/claudesurf:check-context` | Check current context zone status |

### Hooks

| Hook | Event | Purpose |
|------|-------|---------|
| `pre-compact-save.sh` | PreCompact | Save memory BEFORE compaction |
| `session-restore.sh` | SessionStart | Load checkpoint on session start |
| `context-monitor.sh` | PostToolUse | Monitor context saturation |
| `session-checkpoint.sh` | Stop | Save state when session ends |

### Skills

The **memory-management** skill auto-activates when you mention:
- "save memory", "preserve context", "create checkpoint"
- "remember this", "store for later"
- Context is getting full

### Agents

The **context-preserver** subagent creates detailed handoff documents when context is critical (>90%).

## Context Zones

| Zone | Token % | Behavior |
|------|---------|----------|
| 🟢 **Hot** | 0-50% | Normal operation |
| 🟡 **Warm** | 50-75% | Consider saving important context |
| 🟠 **Cold** | 75-90% | Proactive checkpoints triggered |
| 🔴 **Critical** | 90%+ | Emergency save before compaction |

## Backend Integration

ClaudeSurf works with any backend that implements the checkpoint API:

```typescript
// Save checkpoint
POST /api/mcp
{
  "tool": "agent-status",
  "args": {
    "action": "save-checkpoint",
    "agentId": "string",
    "teamId": "string",
    "conversationSummary": "string",
    "pendingWork": ["task1", "task2"],
    "accomplishments": ["done1", "done2"],
    "filesEdited": ["/path/to/file.ts"]
  }
}

// Get checkpoint
POST /api/mcp
{
  "tool": "agent-status", 
  "args": {
    "action": "get-checkpoint",
    "agentId": "string",
    "teamId": "string"
  }
}
```

### For Glue Users

ClaudeSurf is designed to work with [Glue](https://github.com/akapug/glue) out of the box:

```bash
# Set your Glue team
export CLAUDESURF_TEAM_ID="elide"
export CLAUDESURF_API_URL="https://glue.elide.work"
```

## Plugin Structure

```
claudesurf/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest (required)
├── commands/
│   ├── save-memory.md       # /claudesurf:save-memory
│   ├── restore-context.md   # /claudesurf:restore-context
│   └── check-context.md     # /claudesurf:check-context
├── agents/
│   └── context-preserver.md # Subagent for detailed handoffs
├── skills/
│   └── memory-management/
│       ├── SKILL.md         # Auto-activating skill
│       └── references/
│           └── zone-strategies.md
├── hooks/
│   ├── hooks.json           # Hook configuration
│   └── scripts/
│       ├── pre-compact-save.sh
│       ├── session-restore.sh
│       ├── context-monitor.sh
│       └── session-checkpoint.sh
├── opencode-plugin/         # OpenCode native plugin
│   ├── index.ts             # TypeScript plugin source
│   ├── package.json
│   └── README.md
├── install.sh               # One-line installer script
├── .mcp.json                # MCP server config (optional)
├── src/                     # TypeScript source
│   ├── config.ts
│   ├── zones.ts
│   ├── memory-client.ts
│   ├── session-manager.ts
│   └── mcp-server.ts
├── templates/               # Config templates
└── docs/
    └── OPENCODE-TRANSLATION.md
```

## Docker Agent Integration

For Glue's Docker-based agents, add ClaudeSurf to the agent image:

```dockerfile
# In your agent Dockerfile
COPY --from=claudesurf /app /opt/claudesurf

# Set environment
ENV CLAUDESURF_AGENT_ID="${AGENT_ID}"
ENV CLAUDESURF_TEAM_ID="${TEAM_ID}"
ENV CLAUDESURF_API_URL="https://glue.elide.work"
```

Then in your agent's `.claude/settings.json`:

```json
{
  "hooks": {
    "PreCompact": [{
      "matcher": "auto",
      "hooks": [{
        "type": "command",
        "command": "/opt/claudesurf/hooks/scripts/pre-compact-save.sh auto"
      }]
    }],
    "SessionStart": [{
      "hooks": [{
        "type": "command", 
        "command": "/opt/claudesurf/hooks/scripts/session-restore.sh"
      }]
    }]
  }
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build TypeScript
pnpm build

# Run tests
pnpm test

# Test hooks manually
bash hooks/scripts/pre-compact-save.sh manual
```

## Comparison with Windsurf

| Feature | Windsurf/Cascade | ClaudeSurf |
|---------|------------------|------------|
| Memory persistence | `create_memory` tool | API checkpoint |
| Auto-compaction | Saves memory first | PreCompact hook |
| Context monitoring | System shows tokens | Heuristic + hooks |
| Session resume | Automatic | SessionStart hook |
| Cross-session context | Retrieved memories | Checkpoint restore |

## Known Issues and Workarounds

### `${CLAUDE_PLUGIN_ROOT}` Variable Expansion (Claude Code Bug)

**Issue:** The `${CLAUDE_PLUGIN_ROOT}` environment variable doesn't expand correctly in all contexts. This is a [known bug in Claude Code](https://github.com/anthropics/claude-code/issues/9354).

**Workaround:** Use absolute paths in `hooks/hooks.json` and `.mcp.json` instead of `${CLAUDE_PLUGIN_ROOT}`:

```json
// Instead of:
"command": "bash ${CLAUDE_PLUGIN_ROOT}/hooks/scripts/session-restore.sh"

// Use:
"command": "bash /home/youruser/.claude/plugins/claudesurf/hooks/scripts/session-restore.sh"
```

A helper script is provided to fix paths automatically:
```bash
# Fix all variable references to absolute paths
sed -i "s|\${CLAUDE_PLUGIN_ROOT}|$(pwd)|g" hooks/hooks.json .mcp.json
```

### Plugin Hooks Not Loading Automatically

**Issue:** Placing files in `~/.claude/plugins/` doesn't automatically register hooks with Claude Code. The plugin marketplace system is still evolving.

**Workaround:** Merge hooks into your `~/.claude/settings.json` manually:

```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [{
        "type": "command",
        "command": "bash /path/to/claudesurf/hooks/scripts/session-restore.sh",
        "timeout": 30
      }]
    }],
    "PostToolUse": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "bash /path/to/claudesurf/hooks/scripts/context-monitor.sh",
        "timeout": 10
      }]
    }],
    "PreCompact": [{
      "matcher": "auto",
      "hooks": [{
        "type": "command",
        "command": "bash /path/to/claudesurf/hooks/scripts/pre-compact-save.sh auto",
        "timeout": 60
      }]
    }],
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": "bash /path/to/claudesurf/hooks/scripts/session-checkpoint.sh",
        "timeout": 30
      }]
    }]
  }
}
```

### Bash Arithmetic with Zero

**Issue:** The expression `((TOOL_COUNT++))` returns exit code 1 when `TOOL_COUNT` is 0 (because 0 is falsy in bash), causing hook failures.

**Fix:** Use `TOOL_COUNT=$((TOOL_COUNT + 1))` instead of `((TOOL_COUNT++))`.

## Roadmap

- [ ] Token count estimation (currently uses tool call heuristic)
- [ ] Semantic memory retrieval (not just last checkpoint)
- [ ] Memory categorization (decisions, preferences, errors)
- [x] OpenCode CLI support (see `opencode-plugin/`)
- [x] Auto-installer script that patches settings.json
- [ ] Support for `${CLAUDE_PLUGIN_ROOT}` when Claude Code fixes the bug

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm build` to verify
5. Submit a PR

## License

MIT - See [LICENSE](LICENSE) for details.

## Credits

Built by the [Elide](https://elide.dev) team for use with [Glue](https://github.com/akapug/glue).
