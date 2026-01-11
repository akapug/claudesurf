#!/bin/bash
# ClaudeSurf A/B Evaluation Script
# Runs Control (no hooks) and Test (claudesurf hooks) agents in parallel
# Supports model selection and comprehensive metrics collection

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
GLUE_REPO="/home/pug/dev/@akapug/glue"
ELIDE_DEV="/home/pug/dev/@elide-dev"
ELIDED="/home/pug/dev/@akapug/@elided"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
RESULTS_DIR="${SCRIPT_DIR}/results/ab-${TIMESTAMP}"

# Model selection - default to haiku, can override with MODEL=opus
MODEL="${MODEL:-haiku}"
CREDS_FILE="${HOME}/.claude/.credentials.json"

# Images
CONTROL_IMAGE="glue/soul-clone:latest"
TEST_IMAGE="glue/soul-clone:claudesurf-test"

# Task file - can override with TASK_FILE env var
TASK_FILE="${TASK_FILE:-${SCRIPT_DIR}/elide-expert-task.md}"

# Agent IDs
CONTROL_AGENT_ID="eval-control-${TIMESTAMP}"
TEST_AGENT_ID="eval-test-${TIMESTAMP}"

echo "============================================"
echo " ClaudeSurf A/B Evaluation"
echo "============================================"
echo "Timestamp: $TIMESTAMP"
echo "Model: $MODEL"
echo "Control: $CONTROL_IMAGE (Agent: $CONTROL_AGENT_ID)"
echo "Test: $TEST_IMAGE (Agent: $TEST_AGENT_ID)"
echo "Results: $RESULTS_DIR"
echo ""

# Create results directory structure
mkdir -p "$RESULTS_DIR"
mkdir -p "$RESULTS_DIR/control-output"
mkdir -p "$RESULTS_DIR/test-output"
mkdir -p "$RESULTS_DIR/metrics"

# Save test configuration
cat > "$RESULTS_DIR/config.json" << EOF
{
  "timestamp": "$TIMESTAMP",
  "model": "$MODEL",
  "control_image": "$CONTROL_IMAGE",
  "test_image": "$TEST_IMAGE",
  "control_agent_id": "$CONTROL_AGENT_ID",
  "test_agent_id": "$TEST_AGENT_ID",
  "task_file": "$TASK_FILE"
}
EOF

# Check credentials
if [[ ! -f "$CREDS_FILE" ]]; then
  echo "ERROR: Claude credentials not found at $CREDS_FILE"
  echo "Run 'claude setup-token' on the host first"
  exit 1
fi

# Check if images exist
if ! docker image inspect "$CONTROL_IMAGE" >/dev/null 2>&1; then
  echo "ERROR: Control image not found: $CONTROL_IMAGE"
  echo "Build with: cd agents && ./docker/build-canonical.sh"
  exit 1
fi

if ! docker image inspect "$TEST_IMAGE" >/dev/null 2>&1; then
  echo "ERROR: Test image not found: $TEST_IMAGE"
  echo "Build with: cd agents && ./docker/build-claudesurf-test.sh"
  exit 1
fi

# Read task and substitute agent ID placeholder
TASK_TEMPLATE=$(cat "$TASK_FILE")

# Clean up previous containers with same names
docker rm -f claudesurf-eval-control claudesurf-eval-test 2>/dev/null || true

# Record start time
START_TIME=$(date +%s)
echo "$START_TIME" > "$RESULTS_DIR/metrics/start_time"

echo "Starting CONTROL agent (no hooks)..."
echo "  Agent ID: $CONTROL_AGENT_ID"
echo "  Output: $RESULTS_DIR/control-output/"

# Substitute AGENT_ID in task for control
CONTROL_TASK="${TASK_TEMPLATE//\$\{AGENT_ID\}/$CONTROL_AGENT_ID}"

docker run -d \
  --name claudesurf-eval-control \
  -v "$ELIDE_DEV:/workspace/elide-dev:ro" \
  -v "$ELIDED:/workspace/elided:ro" \
  -v "$GLUE_REPO:/workspace/glue" \
  -v "$RESULTS_DIR/control-output:/workspace/output" \
  -v "$CREDS_FILE:/home/node/.claude/.credentials.json:ro" \
  -w /workspace \
  -e CLI=claude \
  -e MODEL="$MODEL" \
  -e TEAM_ID="m57596g091akfcdwzqvk5k0dhn7xfm3e" \
  -e GLUE_API_URL="https://glue.elide.work" \
  -e TASK="$CONTROL_TASK" \
  -e AGENT_ID="$CONTROL_AGENT_ID" \
  "$CONTROL_IMAGE" \
  2>&1 | tee "$RESULTS_DIR/control-start.log"

echo ""
echo "Starting TEST agent (claudesurf hooks)..."
echo "  Agent ID: $TEST_AGENT_ID"
echo "  Output: $RESULTS_DIR/test-output/"

# Substitute AGENT_ID in task for test
TEST_TASK="${TASK_TEMPLATE//\$\{AGENT_ID\}/$TEST_AGENT_ID}"

docker run -d \
  --name claudesurf-eval-test \
  -v "$ELIDE_DEV:/workspace/elide-dev:ro" \
  -v "$ELIDED:/workspace/elided:ro" \
  -v "$GLUE_REPO:/workspace/glue" \
  -v "$RESULTS_DIR/test-output:/workspace/output" \
  -v "$CREDS_FILE:/home/node/.claude/.credentials.json:ro" \
  -w /workspace \
  -e CLI=claude \
  -e MODEL="$MODEL" \
  -e TEAM_ID="m57596g091akfcdwzqvk5k0dhn7xfm3e" \
  -e GLUE_API_URL="https://glue.elide.work" \
  -e TASK="$TEST_TASK" \
  -e AGENT_ID="$TEST_AGENT_ID" \
  -e CLAUDESURF_ENABLED=true \
  "$TEST_IMAGE" \
  2>&1 | tee "$RESULTS_DIR/test-start.log"

echo ""
echo "============================================"
echo " Agents Running"
echo "============================================"
echo ""
echo "Monitor with:"
echo "  docker logs -f claudesurf-eval-control"
echo "  docker logs -f claudesurf-eval-test"
echo ""
echo "Check status:"
echo "  docker ps --filter 'name=claudesurf-eval'"
echo ""
echo "Wait for completion:"
echo "  $SCRIPT_DIR/wait-and-collect.sh $RESULTS_DIR"
echo ""
echo "Manual collection:"
echo "  $SCRIPT_DIR/collect-eval-results.sh $RESULTS_DIR"
echo ""
echo "Clean up:"
echo "  docker stop claudesurf-eval-control claudesurf-eval-test"
echo "  docker rm claudesurf-eval-control claudesurf-eval-test"
echo ""
echo "Results will be in: $RESULTS_DIR"
