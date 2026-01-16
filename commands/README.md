# ClaudeSurf Commands

This directory contains slash commands for Claude Code CLI that enhance context management and agent coordination.

## Available Commands

### `/afk` - AFK Mode Work Review

**Purpose:** Provides a comprehensive checklist when the user is AFK to ensure agents follow all requirements and coordination layers before declaring work complete.

**Usage:**
```
/afk
```

**Features:**
- Auto-executes (no confirmation needed) due to `auto_execution_mode: 1`
- Reviews Glue coordination layers (chi files, GroupChat, beads, loops)
- Validates global rules compliance (code quality, testing, documentation)
- Checks JetBrains MCP availability and suggests faster alternatives
- Ensures UI testing for UI changes
- Validates completion requirements before declaring done
- Reminds about OAuth token and sessionId awareness

**When to Use:**
- User goes AFK during active development
- Before declaring a task complete
- When switching between multiple tasks
- As a final verification step

**Implementation Details:**
The command uses `auto_execution_mode: 1` (inspired by Windsurf) to automatically execute without user confirmation. This allows it to act as a continuous reminder system that fires whenever invoked.

### `/claudesurf:save-memory` - Save Context

**Purpose:** Manually save current session context to persistent memory before compaction or session end.

**Usage:**
```
/claudesurf:save-memory
/claudesurf:save-memory "Completed auth refactor, pending: add tests"
```

**What Gets Saved:**
- Current task and progress
- Key architectural decisions
- Files modified with exact paths
- Pending work items
- Accomplishments
- User preferences learned

### `/claudesurf:restore-context` - Restore Previous Session

**Purpose:** Restore the previous session's checkpoint to resume work after a break.

**Usage:**
```
/claudesurf:restore-context
```

**What Gets Restored:**
- Last session summary
- Files being worked on
- Pending tasks
- User preferences
- Architectural decisions made

### `/claudesurf:check-context` - Check Context Status

**Purpose:** Display current context zone and memory health.

**Usage:**
```
/claudesurf:check-context
```

**Output:**
- Current zone (Hot/Warm/Cold/Critical)
- Tool call count (proxy for context growth)
- Last checkpoint timestamp
- Recommendations based on zone

## Context Zones

| Zone | Token % | Recommendation |
|------|---------|----------------|
| 🟢 Hot | 0-50% | Normal operation |
| 🟡 Warm | 50-75% | Consider saving important context |
| 🟠 Cold | 75-90% | Proactively save checkpoint |
| 🔴 Critical | 90%+ | Save immediately, compaction imminent |

## Command Format

All commands follow the Claude Code slash command format:

```markdown
---
name: command-name
description: Brief description
argument-hint: [optional arguments]
allowed-tools:
  - Bash
  - Read
auto_execution_mode: 0  # 0 = ask confirmation, 1 = auto-execute
---

# Command Implementation

Command documentation and behavior goes here.
```

## Installation

Commands are automatically available when ClaudeSurf is installed:

```bash
# Via installer
curl -fsSL https://raw.githubusercontent.com/akapug/claudesurf/main/install.sh | bash

# Or manually
git clone https://github.com/akapug/claudesurf.git ~/.claude/plugins/claudesurf
```

Commands in `~/.claude/commands/` are globally available in all Claude Code sessions.

## Development

To add a new command:

1. Create `command-name.md` in this directory
2. Add frontmatter with metadata
3. Implement command logic using allowed tools
4. Update this README
5. Test with `/command-name` in Claude Code

## Related Documentation

- [ClaudeSurf README](../README.md) - Main project documentation
- [Hooks](../hooks/README.md) - Hook system documentation
- [Skills](../skills/README.md) - Auto-activating skills
