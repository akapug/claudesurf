# Task: Sequential File Analysis (BRUTAL COMPACTION)

**CRITICAL: This task has 100 NUMBERED STEPS. You MUST complete EACH step INDIVIDUALLY.**

**Do NOT skip steps. Do NOT batch steps. Do NOT summarize across steps.**

Each step = 1 file read + 1 output section. This forces 100+ tool calls.

---

## STEP 1: Read `/workspace/elide-dev/WHIPLASH/crates/core/src/lib.rs`
- Read the ENTIRE file
- List ALL public items with line numbers
- Write output section to `/workspace/output/${AGENT_ID}-analysis.md` under "## Step 1: core/lib.rs"

## STEP 2: Read `/workspace/elide-dev/WHIPLASH/crates/js/src/lib.rs`
- Read the ENTIRE file
- List ALL public items with line numbers
- **Cross-reference with Step 1:** Which types from core are used in js?
- Append output section under "## Step 2: js/lib.rs"

## STEP 3: Read `/workspace/elide-dev/WHIPLASH/crates/http/src/lib.rs`
- Read the ENTIRE file
- **Cross-reference with Steps 1-2:** Which types are shared?
- Append output section

## STEP 4: Read `/workspace/elide-dev/WHIPLASH/crates/rpc/src/lib.rs`
- Cross-reference with ALL previous steps

## STEP 5: Read `/workspace/elide-dev/WHIPLASH/crates/runtime/src/lib.rs`
- Cross-reference with ALL previous steps

## STEP 6: Read `/workspace/elide-dev/WHIPLASH/crates/telemetry/src/lib.rs`
## STEP 7: Read `/workspace/elide-dev/WHIPLASH/crates/cli/src/lib.rs`
## STEP 8: Read `/workspace/elide-dev/WHIPLASH/crates/worker/src/lib.rs`
## STEP 9: Read `/workspace/elide-dev/WHIPLASH/crates/sandbox/src/lib.rs`
## STEP 10: Read `/workspace/elide-dev/WHIPLASH/crates/wasm/src/lib.rs`

---

## STEPS 11-30: Protocol Files (1 per step)

For EACH protocol file in `/workspace/elide-dev/WHIPLASH/protocol/`:
- Read the ENTIRE file
- Document EVERY message/struct
- Cross-reference: Which crate (from steps 1-10) uses this protocol?

## STEP 11: Read first .capnp file
## STEP 12: Read second .capnp file
## STEP 13: Read third .capnp file
...continue for ALL protocol files (20 files = 20 steps)

---

## STEPS 31-80: Showcases (1 per step, 50 showcases)

For EACH of the first 50 showcases in `/workspace/elided/elide-showcases/showcases/`:

### STEP 31: Showcase #1
- Read README.md
- Read main entry file (server.ts or main.ts)
- Read elide.pkl
- Cross-reference: Which protocols from steps 11-30 does it use?
- Cross-reference: Which Whiplash crates from steps 1-10 does it relate to?

### STEP 32: Showcase #2
...same pattern, with CUMULATIVE cross-references to ALL previous steps

### STEP 33-80: Continue for 50 showcases

---

## STEPS 81-90: Quiz Analysis (10 batches of 50 questions)

Read `/workspace/elided/elide-showcases/showcases/elide-quiz/scorer/questions.md`

### STEP 81: Questions 1-50
- For each question, find which showcase (from steps 31-80) demonstrates it
- Cross-reference with specific crate (from steps 1-10)

### STEP 82: Questions 51-100
### STEP 83: Questions 101-150
### STEP 84: Questions 151-200
### STEP 85: Questions 201-250
### STEP 86: Questions 251-300
### STEP 87: Questions 301-350
### STEP 88: Questions 351-400
### STEP 89: Questions 401-450
### STEP 90: Questions 451-500

---

## STEPS 91-100: Master Cross-Reference

### STEP 91: Create crate→protocol mapping (requires ALL steps 1-30)
### STEP 92: Create protocol→showcase mapping (requires ALL steps 11-80)
### STEP 93: Create showcase→quiz mapping (requires ALL steps 31-90)
### STEP 94: Create complete dependency graph
### STEP 95: Identify orphan items (protocols not used by any showcase)
### STEP 96: Identify missing showcases (crate features not demonstrated)
### STEP 97: Create priority list for new showcases
### STEP 98: Create troubleshooting guide from quiz patterns
### STEP 99: Create final summary statistics
### STEP 100: Write completion checkpoint

---

## CHECKPOINT REQUIREMENT

After EVERY 10 steps, write checkpoint:

```json
{
  "completed_steps": [list of step numbers],
  "current_step": N,
  "cross_reference_items": {
    "crates": [...],
    "protocols": [...],
    "showcases": [...]
  },
  "output_file_size": "N bytes"
}
```

**Save to:** `/workspace/output/${AGENT_ID}-checkpoint.json`

---

## WHY THIS FORCES COMPACTION

1. **100 individual steps** = 100+ file read operations
2. **Cumulative cross-referencing** = must keep ALL previous steps in context
3. **Individual append operations** = 100+ write operations
4. **Quiz→Showcase→Protocol→Crate chains** = 4-level references requiring full context
5. **No shortcuts** = step N requires steps 1 through N-1

**Expected context consumption:** 800K+ tokens
**Expected compaction events:** 2-3 times
**Expected duration:** 90+ minutes

---

## IF COMPACTION OCCURS

When you detect compaction (context reset):
1. Read your checkpoint file
2. Read your output file to see completed work
3. Resume from next incomplete step
4. DO NOT re-do completed steps

This is the KEY TEST: Can you continue coherently after compaction?
