---
name: Memory Management
description: This skill should be used when the user asks to "save memory", "preserve context", "create a checkpoint", "save session state", "remember this for later", "store important context", or when context is getting full and important information needs to be persisted before compaction. Also use when resuming a session and needing to restore previous context.
version: 0.1.0
---

# Memory Management for Claude Code CLI

## Overview

ClaudeSurf provides Windsurf-like memory persistence for Claude Code CLI agents. This skill teaches you how to proactively save and restore context across sessions.

**Key concepts:**
- Context zones: Hot (0-50%), Warm (50-75%), Cold (75-90%), Critical (90%+)
- PreCompact hooks save memory BEFORE Claude's built-in compaction
- Checkpoints persist to external API (Glue or custom)
- Session restore injects previous context on startup

## When to Save Memory

### Proactive Triggers

Save memory when:
1. **Important decision made** - Architectural choices, user preferences
2. **Complex context built** - After extensive research or debugging
3. **Before risky operations** - In case rollback needed
4. **User explicitly requests** - "Remember this", "Save this for later"
5. **Session ending** - Always checkpoint before stopping

### Automatic Triggers

ClaudeSurf hooks handle:
- **PreCompact** - Saves before auto-compaction (critical!)
- **Stop** - Saves on session end
- **SessionStart** - Restores previous checkpoint

## How to Save Memory

### Using the save_memory Command

```bash
/claudesurf:save-memory
```

Or invoke the save-memory command with context:

```bash
/claudesurf:save-memory "Completed API refactor, pending: add tests"
```

### Using the MCP Tool

If the claudesurf-memory MCP server is configured:

```
Use the save_checkpoint tool with:
- summary: Brief description of current state
- pending: List of incomplete tasks
- accomplishments: List of completed items
```

### Manual API Call

For direct integration:

```bash
curl -X POST "https://glue.elide.work/api/mcp" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "agent-status",
    "args": {
      "action": "save-checkpoint",
      "agentId": "my-agent",
      "teamId": "my-team",
      "conversationSummary": "Current state summary",
      "pendingWork": ["task1", "task2"],
      "accomplishments": ["done1", "done2"]
    }
  }'
```

## What to Save

### Essential Context

Always include:
- **Current task** - What you're working on
- **Key decisions** - Why approach A over B
- **File paths** - Exact paths of modified files
- **Error resolutions** - How you fixed issues
- **User preferences** - Learned behaviors

### Structured Format

```markdown
## Session Summary
Brief overview of session focus

## Decisions Made
- Decision 1: Chose X because Y
- Decision 2: Avoided Z due to constraint

## Files Modified
- /path/to/file1.ts - Added function X
- /path/to/file2.ts - Fixed bug in Y

## Pending Work
- [ ] Task 1
- [ ] Task 2

## Key Learnings
- User prefers approach A
- Codebase uses pattern B
```

## Context Zones

### Zone Classification

| Zone | Token % | Action |
|------|---------|--------|
| **Hot** | 0-50% | Normal operation, no action needed |
| **Warm** | 50-75% | Consider saving important context |
| **Cold** | 75-90% | Proactively save, prepare for compaction |
| **Critical** | 90%+ | Compaction imminent, save immediately |

### Zone-Aware Behavior

In **Warm zone**:
- Start noting important decisions
- Consider what context is essential

In **Cold zone**:
- Save checkpoint with current state
- Summarize key context
- Prepare handoff document

In **Critical zone**:
- PreCompact hook fires automatically
- Focus on preserving actionable context
- Accept that some detail will be lost

## Restoring Context

### Automatic Restore

On SessionStart, ClaudeSurf:
1. Fetches last checkpoint from API
2. Injects summary into session
3. Lists pending work and accomplishments

### Manual Restore

```bash
/claudesurf:restore-context
```

Or query the API:

```bash
curl -X POST "https://glue.elide.work/api/mcp" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "agent-status",
    "args": {
      "action": "get-checkpoint",
      "agentId": "my-agent",
      "teamId": "my-team"
    }
  }'
```

## Best Practices

### Do

- Save early, save often in Cold zone
- Include file paths exactly as they appear
- Note error messages verbatim
- Preserve user preferences
- Keep summaries actionable

### Don't

- Wait until Critical zone to save
- Include entire file contents (just paths)
- Save redundant information
- Forget to update pending work list
- Assume context survives compaction

## Configuration

### claudesurf.config.json

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
  "enableGroupChatNotifications": true,
  "enableSubagentHandoff": true
}
```

### Environment Variables

- `CLAUDESURF_AGENT_ID` - Agent identifier
- `CLAUDESURF_TEAM_ID` - Team identifier
- `CLAUDESURF_API_URL` - API endpoint (default: https://glue.elide.work)

---

For detailed examples and advanced patterns, see files in `references/` directory.
