---
name: check-context
description: Check current context zone and memory status
allowed-tools:
  - Bash
  - Read
---

# Check Context Command

Display current context zone status and memory health.

## Usage

```
/claudesurf:check-context
```

## What It Shows

1. **Current Zone** - Hot, Warm, Cold, or Critical
2. **Tool Call Count** - Proxy for context growth
3. **Last Checkpoint** - When memory was last saved
4. **Recommendations** - Actions based on current zone

## Zone Thresholds

| Zone | Token % | Recommendation |
|------|---------|----------------|
| Hot | 0-50% | Normal operation |
| Warm | 50-75% | Consider saving important context |
| Cold | 75-90% | Proactively save checkpoint |
| Critical | 90%+ | Save immediately, compaction imminent |

## Implementation

Check the state file and display status:

```bash
STATE_FILE="/tmp/claudesurf-${CLAUDESURF_AGENT_ID:-agent}-state.json"
if [[ -f "$STATE_FILE" ]]; then
  cat "$STATE_FILE" | jq .
else
  echo "No state file found - this may be a fresh session"
fi
```

## Output

```
╔══════════════════════════════════════════════════════════════════╗
║  📊 ClaudeSurf Context Status                                    ║
╚══════════════════════════════════════════════════════════════════╝

Zone: WARM (estimated 60-70%)
Tool Calls: 35
Last Checkpoint: 2026-01-10T15:30:00Z

Recommendation: Consider saving important decisions and file paths.
```
