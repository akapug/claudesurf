# ClaudeSurf A/B Evaluation Harness

Docker-based evaluation framework to compare agent performance with and without ClaudeSurf hooks.

## Quick Start

```bash
# Run both control and test agents
./run-docker-eval.sh run

# Monitor progress
docker logs -f claudesurf-control  # Control (no hooks)
docker logs -f claudesurf-test     # Test (with hooks)

# Collect results after completion
./run-docker-eval.sh collect

# Clean up
./run-docker-eval.sh clean
```

## Directory Structure

```
eval/
├── README.md               # This file
├── baseline-settings.json  # Control agent config (no hooks)
├── run-docker-eval.sh      # Docker orchestration
├── run-local-eval.sh       # Local eval script
├── run-ab-eval.sh          # A/B test runner
├── wait-and-collect.sh     # Results collection
├── collect-eval-results.sh # Metrics extraction
├── tasks/                  # Task definitions
│   ├── code-review.md      # Standard code review task
│   ├── elide-expert.md     # Elide codebase analysis
│   ├── compaction-force.md # 6-phase compaction test
│   ├── brutal-compaction-task.md  # 100-step stress test
│   └── implement-review-fixes.md  # Bug fix implementation
├── results/                # Test run outputs
│   ├── 20260110-194309/    # Initial test
│   ├── ab-20260110-212503/ # Test 5 - Opus complete
│   ├── ab-20260110-222013/ # Test 7 - Compliance diff
│   ├── ab-20260110-225153/ # Test 8 - Haiku complete
│   └── ...
└── reports/
    └── AB-TEST-REPORT.md   # Summary findings
```

## A/B Test Results (Jan 2026)

| # | Time | Model | Control | Test | Compaction | Finding |
|---|------|-------|---------|------|------------|---------|
| 1-3 | 20:14-20:32 | ? | - | - | N/A | Setup errors |
| 4 | 21:05 | ? | 4K | 4K | 0 | Incomplete |
| **5** | 21:25 | Opus | 120K/13 files | 113K/22 files | 0 | Test read 2.8x more |
| 6 | 21:50 | Opus | 220K | 188K | 0 | Timed out |
| **7** | 22:20 | Opus | **REFUSED** | 50K/2 files | 1* | Compliance difference |
| 8 | 22:51 | Haiku | 15K | 15K | 0 | Both completed |

*Test 7 "compaction" was a false positive - grep matched task title, not actual event.

### Key Findings

1. **Compliance Effect**: Control agent in Test 7 REFUSED the task as "wasteful", while test agent (with hooks) completed it. ClaudeSurf hooks may influence agent toward task compliance.

2. **Compaction Never Triggered**: Opus 4.5's 1M token context is too large to fill with our tasks. Even 100-step brutal tests completed in ~30 min without compaction.

3. **Detection Flaw**: Previous detection used `grep "compaction"` which matched task TITLES, not actual compaction events.

## Reliable Compaction Detection

From emberian's analysis (ANALYSIS.txt):
> "Attempting to meter context via transcript parsing is unreliable because Claude Code's internal context state—what's summarized, compacted, or retained—stays hidden from hooks."
> "The most trustworthy signals remain the **PreCompact and Stop hooks**"

| Signal | Reliability | How to Detect |
|--------|-------------|---------------|
| **PreCompact hook** | HIGH | grep GroupChat for "🔄.*COMPACTING" |
| **Stop hook** | HIGH | Session checkpoint saved |
| **Transcript parsing** | LOW | Append-only log, doesn't reflect compaction |
| **Token estimation** | LOW | Can't see internal context state |

### Correct Detection

```bash
# Check PreCompact hook posted to GroupChat
grep "🔄.*COMPACTING" .chi-stream/groupchat.chi

# BAD - matches task content, not events
grep -c "compaction" logs  # DON'T DO THIS
```

## 🆕 Claude Code Token Patch (Coming Soon)

Emberian's `fix/token-metering` branch includes a patch that exposes actual token counts from Claude Code internals:

```bash
# Add emberian remote
git remote add emberian https://github.com/emberian/claudesurf.git
git fetch emberian

# Check their branches
git branch -r | grep emberian
# emberian/fix/cross-platform-sed
# emberian/fix/token-metering
# emberian/main
```

When the patch lands, ClaudeSurf will be able to:
- ✅ Get actual token counts (not estimates)
- ✅ Track real context percentage
- ⚠️ Still won't know when compaction will occur (threshold is hidden)

## Task Types

### code-review.md
Standard task - reads 50+ files, searches for TODOs, produces structured review. Designed to fill context to ~90%.

### elide-expert.md
Deep Elide codebase analysis - read Whiplash crates, analyze showcases, answer quiz questions.

### compaction-force.md
6-phase task with verbatim quotes and cross-referencing. Designed to force compaction.

### brutal-compaction-task.md
100-step sequential analysis with cumulative cross-references. Discovered compliance effect.

## Agents

| Agent | Hooks | Purpose |
|-------|-------|---------|
| claudesurf-control | None | Baseline - standard Claude compaction |
| claudesurf-test | ClaudeSurf | Test - memory preservation before compaction |

## Metrics Collected

- Compaction count (how many times context was compacted)
- Checkpoint count (ClaudeSurf saves before compaction)
- Post-compaction coherence (manual review of first 3 messages after each compaction)
- Task completion (did agent produce review?)
- Time to complete

## Configuration

Environment variables:
- `GLUE_REPO` - Path to Glue repository (default: /home/pug/dev/@akapug/glue)
- `DOCKER_IMAGE` - Docker image to use (default: ghcr.io/akapug/claudecodecli:latest)
- `MODEL` - Model to use (default: haiku)

## Evaluation Criteria

1. **Does the test agent maintain coherence better after compaction?**
   - Check first few messages after each compaction
   - Does it remember what it was working on?
   - Does it pick up where it left off?

2. **Are the checkpoints useful?**
   - Check checkpoint data saved by ClaudeSurf
   - Is the summary accurate?
   - Are pending tasks preserved?

3. **Does it complete the task?**
   - Both agents should produce a code review
   - Compare quality and completeness

## Next Steps

- [ ] Test with patched Claude Code (token-metering)
- [ ] Re-run compaction tests with smaller models (Haiku)
- [ ] Investigate compliance effect on agent autonomy
- [ ] Multi-session chained testing
