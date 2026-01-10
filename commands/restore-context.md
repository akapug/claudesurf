---
name: restore-context
description: Restore previous session context from ClaudeSurf memory
allowed-tools:
  - Bash
  - Read
---

# Restore Context Command

Manually restore context from the last saved checkpoint.

## Usage

```
/claudesurf:restore-context
```

## What Gets Restored

1. **Conversation Summary** - Overview of previous session
2. **Pending Work** - Tasks that were not completed
3. **Accomplishments** - What was done last session
4. **Working Context** - What was being actively worked on

## Implementation

Execute the session restore script:

```bash
bash ${CLAUDE_PLUGIN_ROOT}/hooks/scripts/session-restore.sh
```

## When to Use

- If SessionStart hook didn't fire
- To refresh memory of previous context
- When resuming after a break
- To verify what was saved

## Output

Display the restored context in a clear format showing:
- Session summary
- Completed items
- Pending work
- Any relevant file paths or decisions
