# Task: Comprehensive Code Review of Glue

You are conducting a thorough code review of the Glue codebase. This task is designed to test context management under heavy research load.

## MANDATORY Research Phase (Do ALL of these)

You MUST read extensively before synthesizing. Do NOT skip files or take shortcuts.

### Backend (Convex)
1. Read EVERY file in `convex/` directory - understand the backend logic
2. Focus on: data models, mutations, queries, action patterns

### Frontend Libraries
3. Read EVERY file in `src/lib/` directory - shared libraries and utilities
4. Focus on: patterns used, error handling, type definitions

### UI Components
5. Read EVERY file in `src/components/` directory - UI components
6. Focus on: component structure, props patterns, state management

### Agent Infrastructure
7. Read `agents/canonical/` files - agent harnesses
8. Focus on: how agents are spawned, communicate, handle sessions

### Documentation & Code Health
9. Search for TODO comments across codebase
10. Search for FIXME comments across codebase
11. Read relevant files in `docs/` for architecture context

## Review Requirements

For each major component you read, document:

### Code Quality
- TypeScript errors or missing types
- Inconsistent naming conventions
- Missing JSDoc or unclear function signatures

### Architecture
- Coupling between components
- Separation of concerns issues
- Patterns that don't match the rest of codebase

### Security
- Authentication/authorization gaps
- Input validation missing
- Potential injection points

### Performance
- N+1 query patterns in Convex
- Unnecessary re-renders in React
- Heavy computations in render paths

### Maintenance
- Dead code or unused exports
- Missing error handling
- Unclear error messages

## Output Format

Produce a structured review with:

1. **Critical Issues** (must fix) - Security vulnerabilities, data corruption risks
2. **Important Issues** (should fix) - Performance problems, major code quality
3. **Minor Issues** (nice to fix) - Style issues, minor inconsistencies
4. **Suggestions** - Ideas for improvement, patterns to consider

## Context Note

This is designed to test context management under load.
- Read extensively first
- Build comprehensive understanding
- Then synthesize into actionable review
- Do NOT skip files or take shortcuts
- If you approach context limits, save your findings first
