#!/bin/bash
# ClaudeSurf Local Evaluation
# Runs a quick test of the hooks using local Claude CLI

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLUGIN_DIR="$(dirname "$SCRIPT_DIR")"
GLUE_REPO="${GLUE_REPO:-/home/pug/dev/@akapug/glue}"
MODEL="${MODEL:-haiku}"
RESULTS_DIR="${SCRIPT_DIR}/results/local-$(date +%Y%m%d-%H%M%S)"

echo "=========================================="
echo " ClaudeSurf Local Evaluation"
echo "=========================================="
echo "Plugin Dir: ${PLUGIN_DIR}"
echo "Model: ${MODEL}"
echo "Results: ${RESULTS_DIR}"
echo ""

mkdir -p "${RESULTS_DIR}"

# Smaller test task for local evaluation
TEST_TASK="Read the first 5 files in convex/ directory and summarize what each file does. Then read 3 files from src/lib/ and describe their purpose. List any TODOs you find."

echo "Running TEST agent (with hooks)..."
echo ""

# Run with claudesurf hooks
cd "$GLUE_REPO"
claude --model "$MODEL" \
  --print \
  -p "$TEST_TASK" \
  2>&1 | tee "${RESULTS_DIR}/test-output.log"

echo ""
echo "=========================================="
echo " Evaluation Complete"
echo "=========================================="
echo "Results saved to: ${RESULTS_DIR}"
echo ""
echo "Check for ClaudeSurf activity:"
echo "  grep -i 'claudesurf\\|checkpoint\\|context' ${RESULTS_DIR}/test-output.log"
echo ""
echo "Token state (if created):"
ls -la /tmp/claudesurf-*.json 2>/dev/null || echo "  No state files found"
