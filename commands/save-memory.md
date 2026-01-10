---
name: save-memory
description: Save current session context to persistent memory before compaction or session end
argument-hint: [optional summary]
allowed-tools:
  - Bash
  - Read
---

# Save Memory Command

Save the current session context to ClaudeSurf's persistent memory.

## Usage

```
/claudesurf:save-memory
/claudesurf:save-memory "Completed auth refactor, pending: add tests"
```

## What to Include

When saving memory, gather and persist:

1. **Current Task** - What you're actively working on
2. **Key Decisions** - Architectural choices made and why
3. **Files Modified** - Exact paths of changed files
4. **Pending Work** - Tasks not yet complete
5. **Accomplishments** - What was completed this session
6. **User Preferences** - Learned behaviors and preferences

## Implementation

Execute the save checkpoint script:

```bash
bash ${CLAUDE_PLUGIN_ROOT}/hooks/scripts/pre-compact-save.sh manual
```

If a summary argument was provided, include it in the checkpoint.

## When to Use

- Before ending a session
- After completing a major milestone
- When context is getting full (Cold zone: 75-90%)
- When user explicitly asks to "remember" something
- Before risky operations that might need rollback

## Output

Confirm the save with:
- Timestamp of checkpoint
- Summary of what was saved
- Any errors encountered
