#!/bin/bash
# ClaudeSurf A/B Evaluation Runner
# Runs two Docker containers: control (no hooks) and test (with hooks)
# Both perform the same comprehensive code review task

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
GLUE_REPO="${GLUE_REPO:-/home/pug/dev/@akapug/glue}"
DOCKER_IMAGE="${DOCKER_IMAGE:-ghcr.io/akapug/claudecodecli:latest}"
MODEL="${MODEL:-haiku}"
RESULTS_DIR="${SCRIPT_DIR}/results/$(date +%Y%m%d-%H%M%S)"

echo "=========================================="
echo " ClaudeSurf A/B Evaluation"
echo "=========================================="
echo "Docker Image: ${DOCKER_IMAGE}"
echo "Model: ${MODEL}"
echo "Glue Repo: ${GLUE_REPO}"
echo "Results: ${RESULTS_DIR}"
echo ""

# Create results directory
mkdir -p "${RESULTS_DIR}"

# Load test task
TASK=$(cat "${SCRIPT_DIR}/test-task.md")

# Check if Glue repo exists
if [[ ! -d "$GLUE_REPO" ]]; then
  echo "ERROR: Glue repo not found at ${GLUE_REPO}"
  echo "Set GLUE_REPO environment variable to correct path"
  exit 1
fi

# Stop any existing eval containers
echo "Cleaning up old containers..."
docker stop claudesurf-control claudesurf-test 2>/dev/null || true
docker rm claudesurf-control claudesurf-test 2>/dev/null || true

echo ""
echo "Starting CONTROL agent (no hooks)..."
docker run -d \
  --name claudesurf-control \
  -v "${SCRIPT_DIR}:/eval:ro" \
  -v "${GLUE_REPO}:/workspace:ro" \
  -e ANTHROPIC_MODEL="${MODEL}" \
  "${DOCKER_IMAGE}" \
  claude --model "${MODEL}" \
    --settings /eval/baseline-settings.json \
    --cwd /workspace \
    -p "${TASK}" \
  2>&1 | tee "${RESULTS_DIR}/control-start.log"

echo ""
echo "Starting TEST agent (with claudesurf hooks)..."
docker run -d \
  --name claudesurf-test \
  -v "${SCRIPT_DIR}/..:/plugins/claudesurf:ro" \
  -v "${GLUE_REPO}:/workspace:ro" \
  -e ANTHROPIC_MODEL="${MODEL}" \
  -e CLAUDESURF_AGENT_ID="eval-test" \
  -e CLAUDESURF_TEAM_ID="eval" \
  "${DOCKER_IMAGE}" \
  claude --model "${MODEL}" \
    --plugin-dir /plugins/claudesurf \
    --cwd /workspace \
    -p "${TASK}" \
  2>&1 | tee "${RESULTS_DIR}/test-start.log"

echo ""
echo "=========================================="
echo " Containers Started"
echo "=========================================="
echo ""
echo "Monitor logs:"
echo "  docker logs -f claudesurf-control"
echo "  docker logs -f claudesurf-test"
echo ""
echo "Collect results when complete:"
echo "  docker logs claudesurf-control > ${RESULTS_DIR}/control-output.log 2>&1"
echo "  docker logs claudesurf-test > ${RESULTS_DIR}/test-output.log 2>&1"
echo ""
echo "Stop containers:"
echo "  docker stop claudesurf-control claudesurf-test"
echo ""

# Wait function for later use
wait_for_completion() {
  echo "Waiting for containers to complete..."
  while docker ps | grep -q "claudesurf-"; do
    sleep 30
    echo "  Still running... ($(date))"
  done
  echo "All containers completed!"
}

# Collect metrics function
collect_metrics() {
  echo ""
  echo "Collecting metrics..."

  # Control metrics
  echo "CONTROL agent:"
  CONTROL_COMPACTIONS=$(docker logs claudesurf-control 2>&1 | grep -c "compacting" || echo "0")
  echo "  Compaction events: ${CONTROL_COMPACTIONS}"

  # Test metrics
  echo "TEST agent:"
  TEST_COMPACTIONS=$(docker logs claudesurf-test 2>&1 | grep -c "compacting" || echo "0")
  TEST_CHECKPOINTS=$(docker logs claudesurf-test 2>&1 | grep -c "CLAUDESURF" || echo "0")
  echo "  Compaction events: ${TEST_COMPACTIONS}"
  echo "  ClaudeSurf checkpoints: ${TEST_CHECKPOINTS}"

  # Save metrics
  cat > "${RESULTS_DIR}/metrics.json" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "model": "${MODEL}",
  "control": {
    "compactions": ${CONTROL_COMPACTIONS}
  },
  "test": {
    "compactions": ${TEST_COMPACTIONS},
    "checkpoints": ${TEST_CHECKPOINTS}
  }
}
EOF
  echo ""
  echo "Metrics saved to ${RESULTS_DIR}/metrics.json"
}

# Parse command line
case "${1:-run}" in
  run)
    echo "Containers are running in background."
    echo "Use '$0 wait' to wait for completion."
    echo "Use '$0 collect' to collect metrics after completion."
    ;;
  wait)
    wait_for_completion
    ;;
  collect)
    docker logs claudesurf-control > "${RESULTS_DIR}/control-output.log" 2>&1 || true
    docker logs claudesurf-test > "${RESULTS_DIR}/test-output.log" 2>&1 || true
    collect_metrics
    ;;
  stop)
    docker stop claudesurf-control claudesurf-test 2>/dev/null || true
    ;;
  clean)
    docker stop claudesurf-control claudesurf-test 2>/dev/null || true
    docker rm claudesurf-control claudesurf-test 2>/dev/null || true
    ;;
  *)
    echo "Usage: $0 [run|wait|collect|stop|clean]"
    exit 1
    ;;
esac
