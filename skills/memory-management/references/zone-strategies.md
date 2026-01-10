# Zone-Based Memory Strategies

Detailed strategies for each context zone.

## Hot Zone (0-50%)

**Status**: Normal operation

**Actions**:
- Work normally
- No memory pressure
- Build context freely

**Memory Strategy**:
- Save only on explicit request
- Focus on task completion
- No proactive checkpoints needed

## Warm Zone (50-75%)

**Status**: Approaching capacity

**Actions**:
- Start noting key decisions
- Identify essential vs. nice-to-have context
- Consider what must survive compaction

**Memory Strategy**:
- Save after major milestones
- Document architectural decisions
- Note user preferences as discovered

**Example Checkpoint**:
```markdown
## Warm Zone Checkpoint

### Key Decisions
- Using React Query for data fetching (user preference)
- API follows REST conventions

### Essential Context
- Working on /src/components/Dashboard.tsx
- User wants dark mode support

### Can Be Reconstructed
- Exact import statements
- Formatting preferences
```

## Cold Zone (75-90%)

**Status**: Compaction likely soon

**Actions**:
- Proactively save checkpoint
- Summarize current state
- Prepare handoff document
- Consider spawning subagent for detailed work

**Memory Strategy**:
- Save comprehensive checkpoint
- Include all pending work
- Document blockers and dependencies
- Note files that need attention

**Example Checkpoint**:
```markdown
## Cold Zone Checkpoint - Comprehensive

### Current Task
Implementing user authentication flow

### Progress
- [x] Login form UI
- [x] API integration
- [ ] Error handling
- [ ] Session persistence

### Files Modified
- /src/components/auth/LoginForm.tsx - Form UI complete
- /src/lib/auth/api.ts - Login/logout functions
- /src/hooks/useAuth.ts - Auth state hook (in progress)

### Blockers
- Need CORS configuration for API
- Waiting on design for error states

### Key Decisions
- Using httpOnly cookies for session (security)
- JWT tokens with 1h expiry
- Refresh token rotation enabled

### User Preferences Learned
- Prefers explicit error messages
- Wants loading states on all buttons
- Uses TypeScript strict mode
```

## Critical Zone (90%+)

**Status**: Compaction imminent

**Actions**:
- PreCompact hook fires automatically
- Focus on actionable context only
- Accept detail loss, preserve essentials
- Consider delegating to subagent

**Memory Strategy**:
- Save minimal but complete checkpoint
- Prioritize: current task, blockers, next steps
- Drop: exploration history, failed attempts
- Keep: working solutions, user preferences

**Example Checkpoint**:
```markdown
## Critical Zone Checkpoint - Essentials Only

### Immediate Task
Fix auth token refresh bug in /src/lib/auth/api.ts:45

### Next Steps
1. Add try/catch around refresh call
2. Handle 401 by redirecting to login
3. Test with expired token

### Must Remember
- User: David, prefers verbose logging
- API base: https://api.example.com
- Auth header format: Bearer {token}

### Files to Check
- /src/lib/auth/api.ts (bug location)
- /src/hooks/useAuth.ts (state management)
```

## Zone Transitions

### Warm → Cold

When entering Cold zone:
1. Save current checkpoint
2. Notify via GroupChat (if enabled)
3. Consider task prioritization
4. Prepare for potential compaction

### Cold → Critical

When entering Critical zone:
1. PreCompact hook handles automatically
2. Focus on completing current subtask
3. Avoid starting new complex work
4. Prepare for context loss

### After Compaction

When session resumes post-compaction:
1. SessionStart hook loads checkpoint
2. Review restored context
3. Verify understanding of task
4. Continue from last known state
