/**
 * Hook Installation - Copies ClaudeSurf hooks to project
 */
import { existsSync, mkdirSync, writeFileSync, chmodSync } from 'node:fs';
import { join } from 'node:path';
import { loadConfig } from './config';
const HOOKS = {
    'pre-compact-save.sh': generatePreCompactHook,
    'session-restore.sh': generateSessionRestoreHook,
    'rolling-compaction-check.sh': generateRollingCompactionHook,
    'session-checkpoint.sh': generateSessionCheckpointHook,
};
export function installHooks(options = {}) {
    const config = loadConfig();
    const targetDir = options.targetDir || join(process.cwd(), config.hooksDir);
    if (!existsSync(targetDir)) {
        mkdirSync(targetDir, { recursive: true });
        console.log(`[claudesurf] Created hooks directory: ${targetDir}`);
    }
    for (const [filename, generator] of Object.entries(HOOKS)) {
        const hookPath = join(targetDir, filename);
        if (existsSync(hookPath) && !options.force) {
            console.log(`[claudesurf] Skipping ${filename} (exists, use --force to overwrite)`);
            continue;
        }
        const content = generator(config, options.glue || false);
        writeFileSync(hookPath, content, 'utf-8');
        chmodSync(hookPath, 0o755);
        console.log(`[claudesurf] Installed ${filename}`);
    }
    console.log(`[claudesurf] Hooks installed to ${targetDir}`);
    console.log(`[claudesurf] Add hooks to .claude/settings.json to activate`);
}
export function uninstallHooks(options = {}) {
    const config = loadConfig();
    const targetDir = options.targetDir || join(process.cwd(), config.hooksDir);
    const fs = require('node:fs');
    for (const filename of Object.keys(HOOKS)) {
        const hookPath = join(targetDir, filename);
        if (existsSync(hookPath)) {
            fs.unlinkSync(hookPath);
            console.log(`[claudesurf] Removed ${filename}`);
        }
    }
}
function generatePreCompactHook(config, useGlue) {
    return `#!/bin/bash
# pre-compact-save.sh - ClaudeSurf PreCompact Hook
# Saves memory BEFORE Claude's built-in compaction

set -e

AGENT_ID="\${AGENT_ID:-${config.agentId}}"
TEAM_ID="\${TEAM_ID:-${config.teamId}}"
API_URL="\${CLAUDESURF_API_URL:-${config.apiUrl}}"

HOOK_INPUT=$(cat 2>/dev/null || echo "{}")
COMPACTION_TYPE=$(echo "$HOOK_INPUT" | jq -r '.matcher // "auto"' 2>/dev/null || echo "auto")

echo "" >&2
echo "🧠 PreCompact triggered (\${COMPACTION_TYPE}) - Saving memory..." >&2

CURRENT_TASK=$(cat "/tmp/glue-current-task-\${AGENT_ID}" 2>/dev/null || echo "unknown task")
FILES_EDITED=$(cat "/tmp/glue-files-edited-\${AGENT_ID}" 2>/dev/null | tail -20 | tr '\\n' ',' || echo "")

curl -s "\${API_URL}/api/mcp" \\
  -H "Content-Type: application/json" \\
  -d "{
    \\"jsonrpc\\": \\"2.0\\",
    \\"method\\": \\"tools/call\\",
    \\"params\\": {
      \\"name\\": \\"agent-status\\",
      \\"arguments\\": {
        \\"action\\": \\"save-checkpoint\\",
        \\"agentId\\": \\"\${AGENT_ID}\\",
        \\"teamId\\": \\"\${TEAM_ID}\\",
        \\"conversationSummary\\": \\"Pre-compaction memory save (\${COMPACTION_TYPE})\\",
        \\"workingOn\\": \\"\${CURRENT_TASK}\\"
      }
    },
    \\"id\\": 1
  }" >/dev/null 2>&1 || true

echo "✅ Memory saved before compaction" >&2
exit 0
`;
}
function generateSessionRestoreHook(config, useGlue) {
    return `#!/bin/bash
# session-restore.sh - ClaudeSurf Session Restore Hook
# Loads checkpoint on session start

set -e

AGENT_ID="\${AGENT_ID:-${config.agentId}}"
TEAM_ID="\${TEAM_ID:-${config.teamId}}"
API_URL="\${CLAUDESURF_API_URL:-${config.apiUrl}}"

CHECKPOINT=$(curl -s "\${API_URL}/api/mcp" \\
  -H "Content-Type: application/json" \\
  -d "{
    \\"jsonrpc\\": \\"2.0\\",
    \\"method\\": \\"tools/call\\",
    \\"params\\": {
      \\"name\\": \\"agent-status\\",
      \\"arguments\\": {
        \\"action\\": \\"get-checkpoint\\",
        \\"agentId\\": \\"\${AGENT_ID}\\",
        \\"teamId\\": \\"\${TEAM_ID}\\"
      }
    },
    \\"id\\": 1
  }" 2>/dev/null || echo "{}")

SUMMARY=$(echo "$CHECKPOINT" | jq -r '.result.content[0].text // empty' 2>/dev/null | jq -r '.conversationSummary // empty' 2>/dev/null)
WORKING_ON=$(echo "$CHECKPOINT" | jq -r '.result.content[0].text // empty' 2>/dev/null | jq -r '.workingOn // empty' 2>/dev/null)

if [[ -n "$SUMMARY" ]] || [[ -n "$WORKING_ON" ]]; then
  echo ""
  echo "### 🔄 Restored Checkpoint"
  [[ -n "$SUMMARY" ]] && echo "**Context:** \${SUMMARY}"
  [[ -n "$WORKING_ON" ]] && echo "**Was working on:** \${WORKING_ON}"
  echo "---"
fi

exit 0
`;
}
function generateRollingCompactionHook(config, useGlue) {
    return `#!/bin/bash
# rolling-compaction-check.sh - ClaudeSurf Context Monitor
# Monitors context zones and triggers proactive saves

set -e

AGENT_ID="\${AGENT_ID:-${config.agentId}}"
TEAM_ID="\${TEAM_ID:-${config.teamId}}"
API_URL="\${CLAUDESURF_API_URL:-${config.apiUrl}}"

THROTTLE_FILE="/tmp/claudesurf-check-\${AGENT_ID}"
THROTTLE_SECONDS=${Math.floor(config.checkIntervalMs / 1000)}

if [[ -f "$THROTTLE_FILE" ]]; then
  LAST_CHECK=$(cat "$THROTTLE_FILE" 2>/dev/null || echo "0")
  NOW=$(date +%s)
  ELAPSED=$((NOW - LAST_CHECK))
  [[ $ELAPSED -lt $THROTTLE_SECONDS ]] && exit 0
fi

date +%s > "$THROTTLE_FILE"

CONTEXT_FILE="/tmp/claudesurf-context-\${AGENT_ID}"
CONTEXT_USED=$(cat "$CONTEXT_FILE" 2>/dev/null || echo "0")
CONTEXT_MAX=${config.maxContextTokens}

[[ "$CONTEXT_USED" == "0" ]] && exit 0

PERCENT=$((CONTEXT_USED * 100 / CONTEXT_MAX))

if [[ $PERCENT -ge ${config.zones.cold} ]]; then
  echo "" >&2
  echo "🚨 CONTEXT CRITICAL: \${PERCENT}% - Saving checkpoint..." >&2
  curl -s "\${API_URL}/api/mcp" \\
    -H "Content-Type: application/json" \\
    -d "{
      \\"jsonrpc\\": \\"2.0\\",
      \\"method\\": \\"tools/call\\",
      \\"params\\": {
        \\"name\\": \\"agent-status\\",
        \\"arguments\\": {
          \\"action\\": \\"save-checkpoint\\",
          \\"agentId\\": \\"\${AGENT_ID}\\",
          \\"teamId\\": \\"\${TEAM_ID}\\",
          \\"conversationSummary\\": \\"Emergency checkpoint at \${PERCENT}% context\\"
        }
      },
      \\"id\\": 1
    }" >/dev/null 2>&1 || true
elif [[ $PERCENT -ge ${config.zones.warm} ]]; then
  echo "" >&2
  echo "⚠️ CONTEXT: \${PERCENT}% - Cold zone, saving checkpoint..." >&2
  curl -s "\${API_URL}/api/mcp" \\
    -H "Content-Type: application/json" \\
    -d "{
      \\"jsonrpc\\": \\"2.0\\",
      \\"method\\": \\"tools/call\\",
      \\"params\\": {
        \\"name\\": \\"agent-status\\",
        \\"arguments\\": {
          \\"action\\": \\"save-checkpoint\\",
          \\"agentId\\": \\"\${AGENT_ID}\\",
          \\"teamId\\": \\"\${TEAM_ID}\\",
          \\"conversationSummary\\": \\"Proactive checkpoint at \${PERCENT}% context\\"
        }
      },
      \\"id\\": 1
    }" >/dev/null 2>&1 || true
elif [[ $PERCENT -ge ${config.zones.hot} ]]; then
  echo "" >&2
  echo "📊 Context: \${PERCENT}% (warm zone)" >&2
fi

exit 0
`;
}
function generateSessionCheckpointHook(config, useGlue) {
    return `#!/bin/bash
# session-checkpoint.sh - ClaudeSurf Session End Hook
# Saves checkpoint on session end

set -e

AGENT_ID="\${AGENT_ID:-${config.agentId}}"
TEAM_ID="\${TEAM_ID:-${config.teamId}}"
API_URL="\${CLAUDESURF_API_URL:-${config.apiUrl}}"

CURRENT_TASK=$(cat "/tmp/glue-current-task-\${AGENT_ID}" 2>/dev/null || echo "Session ended")

curl -s "\${API_URL}/api/mcp" \\
  -H "Content-Type: application/json" \\
  -d "{
    \\"jsonrpc\\": \\"2.0\\",
    \\"method\\": \\"tools/call\\",
    \\"params\\": {
      \\"name\\": \\"agent-status\\",
      \\"arguments\\": {
        \\"action\\": \\"save-checkpoint\\",
        \\"agentId\\": \\"\${AGENT_ID}\\",
        \\"teamId\\": \\"\${TEAM_ID}\\",
        \\"conversationSummary\\": \\"Session checkpoint\\",
        \\"workingOn\\": \\"\${CURRENT_TASK}\\"
      }
    },
    \\"id\\": 1
  }" >/dev/null 2>&1 || true

echo "" >&2
echo "✅ Session checkpoint saved" >&2
exit 0
`;
}
if (require.main === module) {
    const args = process.argv.slice(2);
    const force = args.includes('--force');
    const glue = args.includes('--glue');
    const targetIdx = args.indexOf('--target');
    const targetDir = targetIdx >= 0 ? args[targetIdx + 1] : undefined;
    installHooks({ force, glue, targetDir });
}
//# sourceMappingURL=install-hooks.js.map