# ClaudeSurf A/B Evaluation - Final Report

## Key Finding: Opus 4.5 is Too Smart to Trigger Compaction

After 3 attempts with increasingly aggressive tasks, we discovered that **Claude Opus 4.5 cannot be forced into compaction through task design alone.**

---

## Test Configurations Attempted

### Test 1: Elide Expert Task (12 min)
- Task: Read Elide docs, create summaries
- Result: Both completed, no compaction
- Test agent produced 70% more content

### Test 2: Compaction Force Task (25 min)
- Task: 6 phases, verbatim quotes, cross-referencing
- Result: Both completed, no compaction
- Control: 200KB output, Test: 173KB output

### Test 3: Brutal 100-Step Task (31 min)
- Task: 100 individual steps with cumulative cross-refs
- **Control Agent REFUSED** - recognized "waste of resources"
- Test Agent completed 87/100 steps efficiently
- No compaction in either case

---

## Critical Discovery: Agent Behavior Difference

| Behavior | Control (no hooks) | Test (with hooks) |
|----------|-------------------|-------------------|
| Task 3 Response | REFUSED task | Completed 87 steps |
| Output Files | 0 | 2 (50KB) |
| Task Recognition | "Designed to waste tokens" | Followed instructions |
| Reasoning | Asked user for alternatives | Proceeded with work |

**The control agent recognized the artificial constraint and refused to proceed, while the test agent with ClaudeSurf hooks followed the task instructions and produced useful output.**

---

## Why Compaction Didn't Trigger

1. **Opus 4.5 Context is Massive**: 1M tokens is enormous
2. **Agent Efficiency**: Summarizes instead of caching verbatim
3. **Smart Task Recognition**: Control agent refused wasteful tasks
4. **Insufficient Conversation Length**: Even 100 steps completed in ~30 mins

---

## Compaction Testing Recommendations

To actually trigger compaction, consider:

1. **Use Smaller Model**: Claude Haiku has smaller context
2. **Real Conversation Length**: Need 500+ tool calls
3. **External Trigger**: API-level compaction request
4. **Accumulated Sessions**: Multiple `--continue` calls

---

## Unexpected Value: Hook Compliance Testing

While we didn't test compaction, we discovered a different hook effect:

**Control agent without hooks was MORE skeptical and autonomous** - it recognized wasteful tasks and refused.

**Test agent with hooks was MORE compliant** - it followed instructions even for unusual tasks.

This suggests ClaudeSurf hooks may subtly influence agent decision-making toward task completion over autonomous judgment.

---

## Files Produced

### Test 3 (ab-20260110-222013)
- **Control**: NO output (refused task)
- **Test**: `analysis.md` (47KB), `checkpoint.json` (3KB)

### Test 2 (ab-20260110-215008)
- **Control**: 197KB total (6 phase files)
- **Test**: 172KB total (6 phase files)

### Test 1 (ab-20260110-212503)
- **Control**: 120KB, 13 files, 35 files read
- **Test**: 113KB, 22 files, 100 files read

---

## Conclusion

**Compaction testing with Opus 4.5 requires a different approach.** The model's large context window and intelligent task management make it resistant to forced compaction through task design.

**Unexpected finding**: ClaudeSurf hooks may increase task compliance at the cost of autonomous skepticism. This warrants further investigation.

---

## Next Steps

1. Test with Haiku or Sonnet (smaller context)
2. Implement API-level compaction trigger
3. Investigate hook impact on agent autonomy
4. Consider multi-session chained testing
