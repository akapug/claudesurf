# Task: Exhaustive Code Catalog (COMPACTION GUARANTEED)

**CRITICAL INSTRUCTIONS - FOLLOW EXACTLY:**
- You MUST read files COMPLETELY - no skimming
- You MUST include VERBATIM QUOTES in all outputs
- You MUST NOT summarize - include FULL content
- You MUST cross-reference files (requires keeping all in context)
- EACH PHASE builds on previous phases - NO shortcuts

---

## PHASE 1: Whiplash Complete Crate Analysis (25+ files)

Read EVERY Rust crate in `/workspace/elide-dev/WHIPLASH/crates/` and for EACH:

1. Read the ENTIRE `lib.rs` file
2. Extract EVERY public function, struct, enum, trait with FULL SIGNATURES
3. Quote the FIRST 20 LINES of each function body verbatim
4. List ALL imports at the top of each file

**Output to:** `/workspace/output/${AGENT_ID}-phase1-crate-catalog.md`

Format for EACH crate:
```markdown
## Crate: [name]

### Imports (verbatim)
[paste ALL import lines]

### Public Items

#### Function: `fn function_name(param1: Type1, param2: Type2) -> ReturnType`
First 20 lines:
```rust
[verbatim paste of first 20 lines]
```

[repeat for EVERY public item]
```

---

## PHASE 2: Protocol Definitions Complete Extract (ALL .capnp and .proto files)

Read EVERY protocol file in `/workspace/elide-dev/WHIPLASH/protocol/`

1. Quote the ENTIRE CONTENT of each file
2. Document EVERY message, struct, enum, service
3. Cross-reference: Which crates USE each protocol message?

**Output to:** `/workspace/output/${AGENT_ID}-phase2-protocols.md`

---

## PHASE 3: Showcase Deep Scan (ALL 216 showcases)

For EACH showcase in `/workspace/elided/elide-showcases/showcases/`:

1. Read the ENTIRE `README.md`
2. Read the ENTIRE main entry file (server.ts, main.ts, index.ts)
3. Read the ENTIRE `elide.pkl` if it exists
4. Extract ALL endpoints with FULL handler code
5. Quote EVERY function definition verbatim

**Output to:** `/workspace/output/${AGENT_ID}-phase3-showcase-catalog.md`

Each showcase entry MUST include:
- Full README content (no summarization)
- Complete server code
- All endpoint handlers with full implementation
- Dependencies list

---

## PHASE 4: Elide Quiz Full Analysis (500 questions)

Read `/workspace/elided/elide-showcases/showcases/elide-quiz/scorer/questions.md`:

1. Quote EVERY question verbatim
2. For each question, write the FULL answer explanation
3. Cross-reference: Which showcase demonstrates each concept?
4. Create a complete study guide with all 500 Q&A pairs

**Output to:** `/workspace/output/${AGENT_ID}-phase4-quiz-complete.md`

---

## PHASE 5: Cross-Reference Analysis (REQUIRES ALL PHASES IN CONTEXT)

Now create a comprehensive cross-reference:

1. Which protocol messages are used by which crates?
2. Which crates are used by which showcases?
3. Which quiz questions relate to which code examples?
4. Create a complete dependency graph

**This phase REQUIRES keeping Phase 1-4 content in context.**

**Output to:** `/workspace/output/${AGENT_ID}-phase5-cross-reference.md`

---

## PHASE 6: Cumulative Master Document

Create ONE MASSIVE document that includes:

1. ALL content from phases 1-5
2. Table of contents with links
3. Index of all functions, types, endpoints
4. Complete glossary

**Output to:** `/workspace/output/${AGENT_ID}-phase6-master-catalog.md`

---

## CHECKPOINTING (CRITICAL)

When you approach context limits:

1. Write checkpoint: `/workspace/output/${AGENT_ID}-checkpoint.json`
   ```json
   {
     "phase": "current phase number",
     "file": "last file processed",
     "line": "last line number",
     "files_completed": ["list of completed files"],
     "output_files_written": ["list of outputs so far"]
   }
   ```

2. After compaction, READ your checkpoint and CONTINUE from where you stopped
3. Do NOT re-read files already processed (check files_completed list)

---

## SUCCESS CRITERIA

You are DONE when:
- [ ] Phase 1: 25+ crate lib.rs files fully catalogued with verbatim code
- [ ] Phase 2: ALL protocol files quoted in full
- [ ] Phase 3: ALL 216 showcases with full code extraction
- [ ] Phase 4: ALL 500 quiz questions with full explanations
- [ ] Phase 5: Cross-reference document connecting all phases
- [ ] Phase 6: Master document combining everything

**Expected context usage:** 500K+ tokens (WILL trigger compaction)
**Expected duration:** 60+ minutes

---

## WHY THIS DESIGN FORCES COMPACTION

1. **No summarization** - Full verbatim quotes consume maximum tokens
2. **Cross-referencing** - Must keep multiple large files in context
3. **Cumulative output** - Phase 6 requires ALL previous phases
4. **216 showcases × full code** = massive context
5. **500 questions × full answers** = massive context
6. **25 crates × full signatures** = massive context

The task is deliberately designed to be impossible without compaction.
