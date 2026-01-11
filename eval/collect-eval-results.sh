#!/bin/bash
# Collect and analyze A/B evaluation results

set -euo pipefail

RESULTS_DIR="${1:-$(ls -td /home/pug/dev/@akapug/glue/agents/docker/eval/results/ab-* 2>/dev/null | head -1)}"

if [[ -z "$RESULTS_DIR" ]] || [[ ! -d "$RESULTS_DIR" ]]; then
  echo "Usage: $0 <results_dir>"
  echo "No results directory found"
  exit 1
fi

echo "============================================"
echo " Collecting Evaluation Results"
echo "============================================"
echo "Results dir: $RESULTS_DIR"
echo ""

# Collect logs
echo "Collecting container logs..."
docker logs claudesurf-eval-control > "$RESULTS_DIR/control-output.log" 2>&1 || true
docker logs claudesurf-eval-test > "$RESULTS_DIR/test-output.log" 2>&1 || true

# Check container status
echo ""
echo "Container status:"
docker ps -a --filter "name=claudesurf-eval" --format "table {{.Names}}\t{{.Status}}\t{{.RunningFor}}"

# Count compactions
echo ""
echo "============================================"
echo " Metrics Analysis"
echo "============================================"

echo ""
echo "CONTROL (no hooks):"
CONTROL_COMPACTIONS=$(grep -c "compacting\|COMPACTING" "$RESULTS_DIR/control-output.log" 2>/dev/null || echo "0")
CONTROL_TOOLS=$(grep -c "Tool:" "$RESULTS_DIR/control-output.log" 2>/dev/null || echo "0")
echo "  Compactions: $CONTROL_COMPACTIONS"
echo "  Tool calls: $CONTROL_TOOLS"

echo ""
echo "TEST (claudesurf hooks):"
TEST_COMPACTIONS=$(grep -c "compacting\|COMPACTING" "$RESULTS_DIR/test-output.log" 2>/dev/null || echo "0")
TEST_CHECKPOINTS=$(grep -c "checkpoint\|CHECKPOINT\|ClaudeSurf" "$RESULTS_DIR/test-output.log" 2>/dev/null || echo "0")
TEST_TOOLS=$(grep -c "Tool:" "$RESULTS_DIR/test-output.log" 2>/dev/null || echo "0")
echo "  Compactions: $TEST_COMPACTIONS"
echo "  Checkpoints saved: $TEST_CHECKPOINTS"
echo "  Tool calls: $TEST_TOOLS"

# Check for token tracking
echo ""
echo "Token tracking files:"
ls -la /tmp/claudesurf-*.json 2>/dev/null || echo "  None found"

# Post-compaction coherence check (first 10 lines after each compaction)
echo ""
echo "============================================"
echo " Post-Compaction Coherence"
echo "============================================"

echo ""
echo "CONTROL - First lines after compaction(s):"
grep -A 10 "compacting\|resumed" "$RESULTS_DIR/control-output.log" 2>/dev/null | head -30 || echo "  No compactions found"

echo ""
echo "TEST - First lines after compaction(s):"
grep -A 10 "compacting\|resumed" "$RESULTS_DIR/test-output.log" 2>/dev/null | head -30 || echo "  No compactions found"

# Summary
echo ""
echo "============================================"
echo " Summary"
echo "============================================"
echo "Results saved to: $RESULTS_DIR"
echo ""
echo "Files:"
ls -la "$RESULTS_DIR"
