# ClaudeSurf for OpenCode

Windsurf-like memory persistence plugin for OpenCode. Automatically saves session context before compaction and restores it in new sessions.

## Installation

### Option 1: Direct File Copy (Recommended)

```bash
# Copy plugin to OpenCode's auto-load directory
cp index.ts ~/.config/opencode/plugin/claudesurf.ts
```

### Option 2: Reference in opencode.json

```json
{
  "plugin": [
    "file:///path/to/claudesurf/opencode-plugin/dist/index.js"
  ]
}
```

### Option 3: Build and Install as Package

```bash
cd opencode-plugin
bun install
bun run build
# Then reference dist/index.js in your config
```

## Configuration

Set environment variables before starting OpenCode:

```bash
export CLAUDESURF_AGENT_ID="my-agent"
export CLAUDESURF_TEAM_ID="my-team-id"
export CLAUDESURF_API_URL="https://glue.elide.work"
```

Or edit the constants at the top of `index.ts`.

## Features

### Automatic Context Preservation

The plugin hooks into OpenCode's `experimental.session.compacting` event. Before the LLM generates a continuation summary, ClaudeSurf:

1. Fetches the last saved checkpoint from Glue MCP
2. Injects previous session context (tasks, accomplishments, files)
3. Saves current session state for future recovery

### Custom Tools

The plugin provides three tools for explicit checkpoint management:

- **claudesurf_save** - Save current session state
  - `summary`: Brief description of current work
  - `pending`: Comma-separated pending tasks
  - `accomplishments`: Comma-separated completed tasks

- **claudesurf_restore** - Load the last saved checkpoint

- **claudesurf_status** - Show current session statistics

### File Tracking

The plugin automatically tracks all files you edit during a session. This list is included in checkpoints so you know what files were touched even after compaction.

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                     OpenCode Session                         │
├─────────────────────────────────────────────────────────────┤
│  1. Session Start                                            │
│     └─ Plugin loads, initializes tracking                    │
│                                                              │
│  2. During Work                                              │
│     ├─ file.edited events → track files                      │
│     └─ tool.execute.after → count tool usage                 │
│                                                              │
│  3. Before Compaction (CRITICAL)                             │
│     ├─ experimental.session.compacting hook fires            │
│     ├─ Fetch previous checkpoint from Glue API               │
│     ├─ Inject context into compaction prompt                 │
│     └─ Save current state for future sessions                │
│                                                              │
│  4. After Compaction                                         │
│     └─ New session starts with injected context              │
└─────────────────────────────────────────────────────────────┘
```

## Differences from Claude Code Version

| Feature | Claude Code | OpenCode |
|---------|-------------|----------|
| Hook System | Bash scripts + JSON | TypeScript Plugin API |
| Session Events | SessionStart/Stop hooks | event handler + hooks |
| Compaction | PreCompact hook | experimental.session.compacting |
| Custom Tools | Not supported | Full tool API |
| Logging | stdout to hook output | client.app.log() |

## Troubleshooting

### Plugin Not Loading

Check that the file is in one of:
- `~/.config/opencode/plugin/`
- `.opencode/plugin/` in your project
- Referenced in `opencode.json` plugins array

### API Errors

Verify your Glue API is accessible:

```bash
curl -X POST https://glue.elide.work/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"agent-status","arguments":{"action":"get-checkpoint","agentId":"test","teamId":"test"}},"id":1}'
```

### No Context After Compaction

The `experimental.session.compacting` hook is experimental. Ensure you're running a recent OpenCode version with this feature enabled.

## License

MIT - See [LICENSE](../LICENSE) in parent directory.
