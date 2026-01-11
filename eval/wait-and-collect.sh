#!/bin/bash
# Wait for A/B evaluation to complete and collect comprehensive metrics

set -euo pipefail

RESULTS_DIR="${1:-}"

if [[ -z "$RESULTS_DIR" ]]; then
  echo "Usage: $0 <results-dir>"
  exit 1
fi

if [[ ! -d "$RESULTS_DIR" ]]; then
  echo "ERROR: Results directory not found: $RESULTS_DIR"
  exit 1
fi

echo "============================================"
echo " Waiting for A/B Evaluation to Complete"
echo "============================================"
echo "Results: $RESULTS_DIR"
echo ""

# Wait for both containers to exit
echo "Waiting for containers to complete..."
echo "(This may take 30+ minutes for Opus with full task)"
echo ""

CONTROL_DONE=false
TEST_DONE=false
CHECK_INTERVAL=30

while [[ "$CONTROL_DONE" == "false" ]] || [[ "$TEST_DONE" == "false" ]]; do
  # Check control
  if [[ "$CONTROL_DONE" == "false" ]]; then
    CONTROL_STATUS=$(docker inspect -f '{{.State.Status}}' claudesurf-eval-control 2>/dev/null || echo "not_found")
    if [[ "$CONTROL_STATUS" == "exited" ]] || [[ "$CONTROL_STATUS" == "not_found" ]]; then
      CONTROL_DONE=true
      CONTROL_END=$(date +%s)
      echo "$CONTROL_END" > "$RESULTS_DIR/metrics/control_end_time"
      echo "[$(date +%H:%M:%S)] Control agent completed"
    fi
  fi

  # Check test
  if [[ "$TEST_DONE" == "false" ]]; then
    TEST_STATUS=$(docker inspect -f '{{.State.Status}}' claudesurf-eval-test 2>/dev/null || echo "not_found")
    if [[ "$TEST_STATUS" == "exited" ]] || [[ "$TEST_STATUS" == "not_found" ]]; then
      TEST_DONE=true
      TEST_END=$(date +%s)
      echo "$TEST_END" > "$RESULTS_DIR/metrics/test_end_time"
      echo "[$(date +%H:%M:%S)] Test agent completed"
    fi
  fi

  # Show progress
  if [[ "$CONTROL_DONE" == "false" ]] || [[ "$TEST_DONE" == "false" ]]; then
    echo "[$(date +%H:%M:%S)] Waiting... (Control: ${CONTROL_STATUS:-running}, Test: ${TEST_STATUS:-running})"
    sleep $CHECK_INTERVAL
  fi
done

echo ""
echo "Both agents completed!"
echo ""

# Collect logs
echo "Collecting logs..."
docker logs claudesurf-eval-control > "$RESULTS_DIR/control-output.log" 2>&1 || true
docker logs claudesurf-eval-test > "$RESULTS_DIR/test-output.log" 2>&1 || true

# Get exit codes
CONTROL_EXIT=$(docker inspect -f '{{.State.ExitCode}}' claudesurf-eval-control 2>/dev/null || echo "-1")
TEST_EXIT=$(docker inspect -f '{{.State.ExitCode}}' claudesurf-eval-test 2>/dev/null || echo "-1")
echo "$CONTROL_EXIT" > "$RESULTS_DIR/metrics/control_exit_code"
echo "$TEST_EXIT" > "$RESULTS_DIR/metrics/test_exit_code"

# Calculate durations
START_TIME=$(cat "$RESULTS_DIR/metrics/start_time" 2>/dev/null || echo "0")
CONTROL_END=$(cat "$RESULTS_DIR/metrics/control_end_time" 2>/dev/null || echo "0")
TEST_END=$(cat "$RESULTS_DIR/metrics/test_end_time" 2>/dev/null || echo "0")

if [[ "$START_TIME" != "0" ]] && [[ "$CONTROL_END" != "0" ]]; then
  CONTROL_DURATION=$((CONTROL_END - START_TIME))
  echo "$CONTROL_DURATION" > "$RESULTS_DIR/metrics/control_duration_seconds"
fi

if [[ "$START_TIME" != "0" ]] && [[ "$TEST_END" != "0" ]]; then
  TEST_DURATION=$((TEST_END - START_TIME))
  echo "$TEST_DURATION" > "$RESULTS_DIR/metrics/test_duration_seconds"
fi

# Count output files
CONTROL_FILE_COUNT=$(find "$RESULTS_DIR/control-output" -type f | wc -l)
TEST_FILE_COUNT=$(find "$RESULTS_DIR/test-output" -type f | wc -l)
echo "$CONTROL_FILE_COUNT" > "$RESULTS_DIR/metrics/control_file_count"
echo "$TEST_FILE_COUNT" > "$RESULTS_DIR/metrics/test_file_count"

# Calculate output sizes
CONTROL_SIZE=$(du -sb "$RESULTS_DIR/control-output" | cut -f1)
TEST_SIZE=$(du -sb "$RESULTS_DIR/test-output" | cut -f1)
echo "$CONTROL_SIZE" > "$RESULTS_DIR/metrics/control_output_bytes"
echo "$TEST_SIZE" > "$RESULTS_DIR/metrics/test_output_bytes"

# Count log lines
CONTROL_LOG_LINES=$(wc -l < "$RESULTS_DIR/control-output.log" 2>/dev/null || echo "0")
TEST_LOG_LINES=$(wc -l < "$RESULTS_DIR/test-output.log" 2>/dev/null || echo "0")
echo "$CONTROL_LOG_LINES" > "$RESULTS_DIR/metrics/control_log_lines"
echo "$TEST_LOG_LINES" > "$RESULTS_DIR/metrics/test_log_lines"

# Check for compaction events
CONTROL_COMPACTIONS=$(grep -c "compacting\|compaction" "$RESULTS_DIR/control-output.log" 2>/dev/null || echo "0")
TEST_COMPACTIONS=$(grep -c "compacting\|compaction" "$RESULTS_DIR/test-output.log" 2>/dev/null || echo "0")
echo "$CONTROL_COMPACTIONS" > "$RESULTS_DIR/metrics/control_compactions"
echo "$TEST_COMPACTIONS" > "$RESULTS_DIR/metrics/test_compactions"

# Generate summary
echo ""
echo "============================================"
echo " Evaluation Complete - Summary"
echo "============================================"
echo ""
echo "Control Agent:"
echo "  Exit Code: $CONTROL_EXIT"
echo "  Duration: ${CONTROL_DURATION:-unknown}s"
echo "  Output Files: $CONTROL_FILE_COUNT"
echo "  Output Size: $CONTROL_SIZE bytes"
echo "  Log Lines: $CONTROL_LOG_LINES"
echo "  Compactions: $CONTROL_COMPACTIONS"
echo ""
echo "Test Agent (with hooks):"
echo "  Exit Code: $TEST_EXIT"
echo "  Duration: ${TEST_DURATION:-unknown}s"
echo "  Output Files: $TEST_FILE_COUNT"
echo "  Output Size: $TEST_SIZE bytes"
echo "  Log Lines: $TEST_LOG_LINES"
echo "  Compactions: $TEST_COMPACTIONS"
echo ""

# Generate metrics JSON
cat > "$RESULTS_DIR/metrics/summary.json" << EOF
{
  "control": {
    "exit_code": $CONTROL_EXIT,
    "duration_seconds": ${CONTROL_DURATION:-0},
    "file_count": $CONTROL_FILE_COUNT,
    "output_bytes": $CONTROL_SIZE,
    "log_lines": $CONTROL_LOG_LINES,
    "compactions": $CONTROL_COMPACTIONS
  },
  "test": {
    "exit_code": $TEST_EXIT,
    "duration_seconds": ${TEST_DURATION:-0},
    "file_count": $TEST_FILE_COUNT,
    "output_bytes": $TEST_SIZE,
    "log_lines": $TEST_LOG_LINES,
    "compactions": $TEST_COMPACTIONS
  }
}
EOF

echo "Metrics saved to: $RESULTS_DIR/metrics/summary.json"
echo ""
echo "Output directories:"
echo "  Control: $RESULTS_DIR/control-output/"
echo "  Test: $RESULTS_DIR/test-output/"
echo ""
echo "To clean up containers:"
echo "  docker rm claudesurf-eval-control claudesurf-eval-test"
