# OpenCode Plugin Translation Guide

How to adapt ClaudeSurf for OpenCode CLI.

## Architecture Comparison

| Concept | Claude Code | OpenCode |
|---------|-------------|----------|
| **Plugin manifest** | `.claude-plugin/plugin.json` | `.opencode/opencode.jsonc` |
| **Hooks** | `hooks/hooks.json` | `hooks/` directory with JS/TS |
| **Skills** | `skills/*/SKILL.md` | `skill/` directory |
| **Commands** | `commands/*.md` | `command/` directory |
| **Agents** | `agents/*.md` | `agent/` directory |
| **MCP servers** | `.mcp.json` | Configured in `opencode.jsonc` |

## Key Differences

### 1. Hook System

**Claude Code** uses JSON configuration:
```json
{
  "PreCompact": [{
    "matcher": "auto",
    "hooks": [{
      "type": "command",
      "command": "bash ${CLAUDE_PLUGIN_ROOT}/hooks/scripts/pre-compact-save.sh"
    }]
  }]
}
```

**OpenCode** uses TypeScript/JavaScript:
```typescript
// hooks/pre-compact.ts
export default {
  event: 'pre-compact',
  handler: async (ctx) => {
    // Save memory before compaction
    await saveCheckpoint(ctx);
  }
};
```

### 2. Skills Format

**Claude Code** uses Markdown with YAML frontmatter:
```markdown
---
name: Memory Management
description: When to use this skill...
---

# Memory Management
...
```

**OpenCode** uses similar structure but in `skill/` directory.

### 3. MCP Configuration

**Claude Code** uses `.mcp.json`:
```json
{
  "mcpServers": {
    "claudesurf-memory": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/dist/mcp-server.js"]
    }
  }
}
```

**OpenCode** configures in `opencode.jsonc`:
```jsonc
{
  "mcp": {
    "servers": {
      "claudesurf-memory": {
        "command": "node",
        "args": ["./dist/mcp-server.js"]
      }
    }
  }
}
```

## Translation Steps

### Step 1: Create OpenCode Structure

```bash
mkdir -p .opencode/{agent,command,skill,hooks}
```

### Step 2: Convert Plugin Manifest

From `.claude-plugin/plugin.json`:
```json
{
  "name": "claudesurf",
  "version": "0.2.0"
}
```

To `.opencode/opencode.jsonc`:
```jsonc
{
  "$schema": "https://opencode.ai/schema/config.json",
  "name": "claudesurf",
  "version": "0.2.0",
  "mcp": {
    "servers": {
      "claudesurf-memory": {
        "command": "node",
        "args": ["./dist/mcp-server.js"]
      }
    }
  }
}
```

### Step 3: Convert Hooks

From `hooks/hooks.json` to TypeScript handlers:

```typescript
// .opencode/hooks/session-start.ts
import { loadCheckpoint } from '../lib/memory';

export default {
  event: 'session:start',
  handler: async (ctx) => {
    const checkpoint = await loadCheckpoint(ctx.agentId, ctx.teamId);
    if (checkpoint) {
      ctx.inject(`Previous session context:\n${checkpoint.summary}`);
    }
  }
};
```

```typescript
// .opencode/hooks/pre-compact.ts
import { saveCheckpoint } from '../lib/memory';

export default {
  event: 'pre-compact',
  handler: async (ctx) => {
    await saveCheckpoint({
      agentId: ctx.agentId,
      teamId: ctx.teamId,
      summary: 'Context saved before compaction',
      pendingWork: ctx.pendingTasks || [],
    });
    console.log('💾 ClaudeSurf: Memory saved before compaction');
  }
};
```

### Step 4: Convert Commands

From `commands/save-memory.md` to:

```typescript
// .opencode/command/save-memory.ts
export default {
  name: 'save-memory',
  description: 'Save current session context to persistent memory',
  handler: async (ctx, args) => {
    const summary = args.join(' ') || 'Manual checkpoint';
    await saveCheckpoint({ summary });
    return '✅ Memory saved';
  }
};
```

### Step 5: Convert Skills

Skills are similar - copy SKILL.md to `.opencode/skill/memory-management/SKILL.md`

## Shared Code

The TypeScript source (`src/`) can be shared between both:

```typescript
// src/memory-client.ts - Works for both
export async function saveCheckpoint(params: CheckpointParams) {
  const response = await fetch(`${API_URL}/api/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tool: 'agent-status',
      args: { action: 'save-checkpoint', ...params }
    })
  });
  return response.json();
}
```

## Dual-Target Build

```json
{
  "scripts": {
    "build": "tsc",
    "build:claude": "npm run build && npm run copy:claude",
    "build:opencode": "npm run build && npm run copy:opencode",
    "copy:claude": "cp -r dist hooks commands agents skills .claude-plugin",
    "copy:opencode": "node scripts/convert-to-opencode.js"
  }
}
```

## Testing

### Claude Code
```bash
claude --plugin-dir ./claudesurf
```

### OpenCode
```bash
opencode --config .opencode/opencode.jsonc
```

## Future: Unified Plugin Format

Both Claude Code and OpenCode are evolving. A future unified format might look like:

```yaml
# plugin.yaml
name: claudesurf
version: 0.2.0
runtime: node

hooks:
  pre-compact: ./hooks/pre-compact.ts
  session-start: ./hooks/session-start.ts

commands:
  save-memory: ./commands/save-memory.ts

skills:
  - ./skills/memory-management

mcp:
  servers:
    memory:
      command: node
      args: [./dist/mcp-server.js]
```

Until then, maintain parallel structures or use a build script to generate both.
