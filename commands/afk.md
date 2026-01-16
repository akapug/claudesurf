---
description: User is AFK - Review work against all requirements and coordination layers
auto_execution_mode: 1
allowed-tools:
  - Bash
  - Read
  - Grep
  - TodoWrite
---

# AFK Mode - Comprehensive Work Review

The user is still AFK! Before proceeding or declaring done, review your work against ALL requirements and coordination layers.

## 🔍 CRITICAL CHECKLIST

### 1. Glue Coordination Layers (if in Glue project)

**Chi Files (Zero-Cost Polling):**
```bash
# Check for @mentions in GroupChat
tail -20 .chi-stream/groupchat.chi

# Check DM channels
tail -20 .chi-stream/dm-*.chi
```

**GroupChat Communication:**
- Have you posted status updates to GroupChat?
- Did you tag @David_Anderson when blocked or complete?
- Are there any @mentions directed at you that need response?

**Beads Task Tracking:**
```bash
# Check active beads
bd list

# Check beads ready for work
bd ready
```

**Loop Awareness:**
- Check `.claude/ralph-loop.local.md` for active Ralph loops
- Are you in a delegated loop that needs reporting back?

### 2. Global Rules Compliance

**Code Quality Standards:**
- ❌ NO unnecessary destructuring
- ❌ NO `else` statements unless necessary
- ❌ AVOID `try`/`catch` where possible
- ❌ AVOID `any` type
- ❌ AVOID `let` statements
- ✅ PREFER single word variable names
- ✅ Keep things in one function unless composable/reusable

**Testing Requirements:**
- Have you written tests for everything?
- Did you build against tests?
- Did you USE the tests to verify?

**Documentation:**
- Did you update existing READMEs (not create temp files)?
- Did you avoid creating session status files?

### 3. JetBrains MCP (If Available)

**Quick Check:**
```bash
# Test if JetBrains IDE is connected
mcp__jetbrains-IDE__get_run_configurations 2>/dev/null
```

**If Connected, Use Instead Of:**
- ❌ `pnpm build` → ✅ `get_file_problems` (100ms vs 30s)
- ❌ Text search → ✅ `search_in_files_by_text`
- ❌ Edit tool for renames → ✅ `rename_refactoring`

### 4. UI Testing (For UI Changes)

**Playwright/Puppeteer Testing:**
- Did you test the live UI end-to-end?
- Did you verify data flows?
- Did you check the actual rendered output?

### 5. Completion Requirements

**Before Declaring Done:**
- [ ] ✅ Checked live UI (if applicable)
- [ ] ✅ Tested end-to-end
- [ ] ✅ Verified data flows
- [ ] ✅ Confirmed no other agent needed to finish
- [ ] ✅ Posted completion to GroupChat with @David_Anderson tag
- [ ] ✅ Created beads for any follow-up work
- [ ] ✅ Verified all tests pass

### 6. Plan Verification

**If You Created a Todo List:**
- Does your plan include a VERIFY step?
- Does your plan include a FINAL review step?
- Did you review the user's FULL original prompt?

### 7. OAuth Token Awareness (For Auth Issues)

**NEVER FORGET:**
- The existing token IS a 1-year token from `claude setup-token`
- Token refresh extends THE SAME TOKEN (doesn't create new ones)
- The system WORKS - don't try to "fix" it
- NEVER USE ANTHROPIC_API_KEY (expensive per-token billing)

### 8. SessionId Awareness (For Glue Work)

**SessionId Links Everything:**
- DM Channels: `dm-{agentId}-{platform}-{sessionPrefix}`
- Beads Tasks: `spawn-bead-{taskId}`
- GitHub Issues/PRs: `spawn-github-{type}-{owner}-{repo}-{number}`
- If sessionId is empty/mismatched: DM channels won't work

---

## 🎯 ACTION ITEMS

Now that you've reviewed the checklist:

1. **Identify gaps** - What requirements did you miss?
2. **Fix issues** - Address any gaps before proceeding
3. **Verify completion** - Run tests, check UI, validate data
4. **Communicate status** - Post to GroupChat if in Glue project
5. **Document learnings** - Update existing docs, not temp files

## 📋 SPECIAL CASES

### If You're Blocked:
1. Post to GroupChat with @David_Anderson tag
2. Create a bead for the blocking issue
3. Document what you tried and why it failed

### If You're in a Subagent Role:
1. Check for handoff instructions
2. Report results to designated location
3. Don't assume - verify completion criteria

### If Context is Getting Full (>75%):
1. Use `/claudesurf:save-memory` to checkpoint
2. Focus on completing current task before starting new work
3. Consider if subtasks should be delegated

---

## 🚫 ANTI-PATTERNS TO AVOID

1. **Claiming complete without verification**
2. **Creating temporary status files** (SESSION-*.md, WELCOME-*.md, etc.)
3. **Silently working around failures** (always inform user of hook/MCP failures)
4. **Using time estimates** (use LoC instead)
5. **Making unnecessary destructuring/else statements**

---

Remember: The user is AFK and trusting you to be thorough. Take the time to verify everything before moving forward.
