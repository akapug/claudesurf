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

## What It Tests

Both agents receive the same comprehensive code review task that:
- Reads 50+ files across convex/, src/lib/, src/components/, agents/
- Searches for TODOs and FIXMEs
- Produces structured review output

This is designed to fill context to ~90%, triggering compaction.

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

## Files

| File | Purpose |
|------|---------|
| `baseline-settings.json` | Settings for control agent (no hooks) |
| `test-task.md` | Standardized code review task prompt |
| `run-docker-eval.sh` | Docker orchestration script |
| `results/` | Output directory for each run |

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
