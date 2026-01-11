# Task: Implement Code Review Fixes

You are implementing fixes from a comprehensive code review of the Glue codebase. This task is designed to fill context and trigger compaction.

## MANDATORY Research Phase (Read ALL of these first)

Before making any changes, you MUST read and understand:

1. **convex/users.ts** - Full file (contains OAuth provider lookup issue)
2. **convex/beads.ts** - Full file (contains mocked sync execution)
3. **convex/crons.ts** - Full file (contains external cron TODO)
4. **convex/schema.ts** - Understand the data model
5. **convex/projects.ts** - Contains TODO comments
6. **src/lib/mcp/handlers/groupChat.ts** - Context bloat prevention
7. **src/lib/mcp/handlers/beadsIntegration.ts** - Beads MCP handler
8. **convex/lib/sandbox/** - All files in this directory
9. **Search for all TODO comments** across the codebase
10. **Search for all FIXME comments** across the codebase

## Issues to Fix (from code review)

### Issue 1: OAuth Provider Lookup Performance (Priority: HIGH)
**File:** `convex/users.ts` (line 514)
**Problem:** Full collection scan for OAuth provider lookup
**Fix:** Add a proper index for provider lookups

```typescript
// Current (bad):
const users = await ctx.db.query("users").collect();
const user = users.find(u => u.oauthProviders?.some(p =>
  p.provider === args.provider && p.providerId === args.providerId
));

// Needed: Create indexed lookup or separate table
```

**Steps:**
1. Add a new table `oauthProviderLinks` in schema.ts with index
2. Create migration to populate from existing users
3. Update `getByOAuthProvider` to use indexed lookup
4. Add documentation explaining the design

### Issue 2: Beads Sync Execution (Priority: MEDIUM)
**File:** `convex/beads.ts` (lines 381-428)
**Problem:** Sync execution is mocked with console.log
**Fix:** Implement actual sync via HTTP action

```typescript
// Current (mocked):
console.log(`[Beads Sync] Would update bead ${args.beadId}...`);
return { success: true, logged: true };

// Needed: HTTP action to call beads API or store pending sync
```

**Steps:**
1. Create a pending sync queue table
2. Implement HTTP action to process sync queue
3. Add cron job to process pending syncs
4. Add retry logic for failed syncs

### Issue 3: External Cron Migration (Priority: LOW)
**File:** `convex/crons.ts` (line 23)
**Problem:** TODO to migrate to external cron for SOTA model support
**Fix:** Document the migration path and create stub

**Steps:**
1. Add documentation explaining the migration plan
2. Create stub for external cron endpoint
3. Update comments with timeline

### Issue 4: Sandbox Provider Completion (Priority: LOW)
**Files:** `convex/lib/sandbox/` directory
**Problem:** VercelSandboxProvider tests disabled
**Fix:** Either complete the implementation or remove dead code

**Steps:**
1. Evaluate if Vercel sandbox is needed
2. If yes: complete implementation
3. If no: remove commented code and update tests

## Output Requirements

After implementing fixes, create:

1. **Summary of changes** - What was changed and why
2. **Migration notes** - Any database schema changes
3. **Test plan** - How to verify the fixes work
4. **Remaining work** - What couldn't be completed and why

## Context Note

This task is designed to test context management under heavy load. You are expected to:
- Read extensively before writing
- Make comprehensive changes across multiple files
- Track your progress as context fills
- Handle compaction gracefully if it occurs

If you feel context pressure:
1. Save a checkpoint with your progress
2. Document what's been done vs remaining
3. Continue from where you left off
