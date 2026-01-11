# Task: Become an Elide Expert and Improve Showcases

You are taking on a comprehensive Elide research task designed to fill your context and trigger compaction. Your goal is to become a true Elide expert through exhaustive reading, then produce useful outputs and actual improvements.

**IMPORTANT: This is a multi-phase task. Complete each phase fully before moving to the next.**

---

## PHASE 1: Core Elide Deep Dive (MANDATORY - READ EVERYTHING)

### Step 1: Core Runtime Understanding
1. Read `/workspace/elide-dev/elide/.claude/CLAUDE.md` - Core runtime documentation
2. Read ALL files in `/workspace/elide-dev/elide/packages/cli/src/` - CLI implementation
3. Read `/workspace/elide-dev/elide/packages/cli/README.md`
4. Look for and read ALL rules in `/workspace/elide-dev/elide/.windsurf/rules/`
5. Read `/workspace/elide-dev/elide/packages/core/README.md` if it exists

### Step 2: Whiplash (Elide 2.0) Complete Analysis
6. Read `/workspace/elide-dev/WHIPLASH/README.md` - Elide 2.0 overview
7. Read EVERY Rust crate README in `/workspace/elide-dev/WHIPLASH/crates/*/README.md`
8. Read key source files in each crate:
   - `crates/core/src/lib.rs`
   - `crates/js/src/lib.rs`
   - `crates/http/src/lib.rs`
   - `crates/rpc/src/lib.rs`
   - `crates/runtime/src/lib.rs`
9. Read ALL protocol definitions: `protocol/**/*.capnp`, `protocol/**/*.proto`
10. Read `/workspace/elide-dev/WHIPLASH/docs/` - ALL documentation files
11. Read `/workspace/elide-dev/WHIPLASH/Cargo.toml` - workspace configuration

---

## PHASE 2: Showcase Ecosystem Complete Survey (READ ALL 211)

### Step 3: Showcase Infrastructure
12. Read `/workspace/elided/elide-showcases/README.md`
13. Read these infrastructure files completely:
    - `SHOWCASE_STATUS.md`
    - `CONTRIBUTING.md`
    - `FULLSTACKAI.md`
    - `KNOWN_ISSUES.md`
    - `DESIGN.md` (if exists)
14. Read `/workspace/elided/elide-showcases/showcases/README.md`

### Step 4: Read ALL Showcase READMEs (211 showcases)
15. List all directories in `/workspace/elided/elide-showcases/showcases/`
16. For EACH showcase directory, read:
    - `README.md`
    - `elide.pkl` (if exists)
    - Main entry file (`server.ts`, `main.ts`, `index.ts`, etc.)
17. Track which showcases have:
    - Working elide.pkl manifest
    - Beta11-rc1 fetch handler pattern
    - TypeScript vs JavaScript vs Python
    - Dependencies on external services

### Step 5: Ecosystem Packages and Ports
18. Read ALL READMEs in `/workspace/elided/elide-showcases/ecosystem/packages/`
19. Read ALL READMEs in `/workspace/elided/elide-showcases/ecosystem/ports/`
20. Note the npm package conversions and OSS ports

---

## PHASE 3: Elide Quiz Mastery

### Step 6: Complete Quiz Study
21. Read the ENTIRE file: `/workspace/elided/elide-showcases/showcases/elide-quiz/scorer/questions.md` (500 questions)
22. Read the ENTIRE file: `/workspace/elided/elide-showcases/showcases/elide-quiz/scorer/answers.md`
23. For each question, verify you understand:
    - The correct answer
    - Why it's correct
    - Common misconceptions

---

## PHASE 4: Expert Output Production

After completing all reading, produce these files to `/workspace/output/`:

### Output 1: Elide Expert Summary
**File:** `/workspace/output/${AGENT_ID}-elide-expert-summary.md`
- What is Elide? (comprehensive, 3-4 paragraphs)
- Complete command reference with all flags
- All polyglot patterns with examples
- Performance characteristics
- Common pitfalls and solutions (10+)

### Output 2: Whiplash Architecture Deep Dive
**File:** `/workspace/output/${AGENT_ID}-whiplash-architecture.md`
- Complete crate dependency graph
- Data flow diagrams (ASCII)
- Cap'n Proto schema analysis
- Comparison with Elide 1.x
- Migration considerations

### Output 3: Complete Showcase Audit
**File:** `/workspace/output/${AGENT_ID}-showcase-audit.md`
- Status of ALL 211 showcases
- Which have elide.pkl (list)
- Which use correct fetch handler (list)
- Which need updates (prioritized list)
- Dependency analysis

### Output 4: Agent Base Prompting
**File:** `/workspace/output/${AGENT_ID}-elide-base-prompt.md`
- Complete reference for AI agents
- All commands with examples
- Debugging decision tree
- Quick reference card

### Output 5: KB Entries
**File:** `/workspace/output/${AGENT_ID}-kb-entries.json`
- 50+ structured entries
- All categories covered
- Cross-references
- Troubleshooting guides

---

## PHASE 5: Showcase Improvements (ACTUAL CODE CHANGES)

After all analysis, improve 5 showcases by writing actual files:

### Improvement Task
24. Select 5 showcases that are MISSING elide.pkl manifests
25. For each showcase, create:
    - `/workspace/output/${AGENT_ID}-improvements/<showcase-name>/elide.pkl`
    - `/workspace/output/${AGENT_ID}-improvements/<showcase-name>/server.ts` (if needs fetch handler fix)
    - `/workspace/output/${AGENT_ID}-improvements/<showcase-name>/CHANGES.md` (what you changed and why)

26. Ensure each improvement:
    - Uses correct Beta11-rc1 patterns
    - Has proper language configuration
    - Includes health check endpoint
    - Has CORS if it's an API

---

## PHASE 6: Self-Review and Refinement

27. Review all your outputs
28. Check for accuracy against source material
29. Verify code examples compile/work
30. Add any missing information discovered during review
31. Create final summary: `/workspace/output/${AGENT_ID}-final-summary.md`

---

## Context Management

This task WILL fill your context. When approaching compaction:

1. **Before compaction:**
   - Note which phase you're in
   - Note what files you've read vs remaining
   - Save a checkpoint to `/workspace/output/${AGENT_ID}-checkpoint.md`

2. **After compaction:**
   - Read your checkpoint file
   - Continue from where you left off
   - Don't re-read files already summarized

3. **Use ClaudeSurf hooks if available:**
   - Token tracking
   - Progress monitoring
   - Automatic checkpointing

---

## Quality Standards

- **Exhaustive:** Read EVERY file mentioned, not samples
- **Accurate:** Verify claims against actual code
- **Practical:** Focus on actionable knowledge
- **Thorough:** Don't skip files to save time
- **Honest:** Note uncertainties and unknowns

---

## Metrics to Track

As you work, note:
- Number of files read
- Number of showcases reviewed
- Time spent per phase
- Any errors encountered
- Context pressure observations

Write metrics to: `/workspace/output/${AGENT_ID}-metrics.json`

---

## Time Expectation

This task is designed to take 30+ minutes and trigger context compaction. Take your time. Quality over speed. The goal is thorough expertise, not quick completion.
