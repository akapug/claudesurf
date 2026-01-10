# ClaudeSurf 🏄

**Windsurf-like memory and compaction system for Claude Code CLI agents**

ClaudeSurf replicates Windsurf/Cascade's effective context window management (40-90% saturation with automatic memory-based compaction) for headless Claude Code CLI agents running in remote containers.

## The Problem

Claude Code CLI's built-in compaction summarizes context when it gets full, but loses important details. Windsurf solves this by saving structured memories BEFORE compaction, then retrieving relevant ones on session start.

## The Solution

ClaudeSurf provides:

1. **PreCompact Hook** - Saves memory to your backend BEFORE Claude's built-in compaction
2. **Context Zone Monitoring** - Proactive checkpoints at 75%, emergency saves at 90%
3. **Session Restore** - Retrieves relevant memories on session start
4. **Context Preserver Subagent** - Detailed handoff documents for complex sessions

## Quick Start

```bash
# Install
npm install @akapug/claudesurf

# Setup hooks in your project
npx claudesurf setup

# Or manually copy hooks
npx claudesurf install-hooks --target .claude/hooks
```

## Configuration

Create a `claudesurf.config.json` in your project root:

```json
{
  "agentId": "my-agent",
  "teamId": "my-team",
  "apiUrl": "https://your-api.com",
  "zones": {
    "hot": 50,
    "warm": 75,
    "cold": 90
  },
  "checkIntervalMs": 120000
}
```

## How It Works

```
Context reaches 90% → CCCLI triggers auto-compaction
                    → PreCompact hook fires FIRST
                    → Saves structured memory to API
                    → Spawns context-preserver subagent
                    → Posts to team chat for visibility
                    → THEN Claude's summarization runs
                    → Next session: Restores checkpoint
```

## Hooks Provided

| Hook | Event | Purpose |
|------|-------|---------|
| `pre-compact-save.sh` | PreCompact | Save memory before compaction |
| `session-restore.sh` | SessionStart | Load checkpoint and memories |
| `rolling-compaction-check.sh` | PostToolUse | Monitor context zones |
| `session-checkpoint.sh` | SessionEnd | Save final state |

## Context Zones

| Zone | Range | Action |
|------|-------|--------|
| Hot | 0-50% | No action, full fidelity |
| Warm | 50-75% | Light monitoring |
| Cold | 75-90% | Proactive checkpoints |
| Critical | 90%+ | Emergency save + handoff |

## API Integration

ClaudeSurf expects your backend to implement:

```typescript
// Save checkpoint
POST /api/agent-status
{
  action: "save-checkpoint",
  agentId: string,
  teamId: string,
  conversationSummary: string,
  workingOn?: string,
  filesEdited?: string[],
  pendingWork?: string[]
}

// Get checkpoint
POST /api/agent-status
{
  action: "get-checkpoint",
  agentId: string,
  teamId: string
}
```

## For Glue Users

ClaudeSurf is designed to work with Glue's MCP server out of the box:

```bash
npx claudesurf setup --glue
```

This configures hooks to use Glue's `agent-status` MCP tool.

## Architecture

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the full design document.

## License

MIT
