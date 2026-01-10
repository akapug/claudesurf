/**
 * ClaudeSurf for OpenCode
 * Windsurf-like memory persistence - auto-saves context before compaction
 *
 * Installation:
 *   1. Copy this file to ~/.config/opencode/plugin/claudesurf.ts
 *   2. Or add "file:///path/to/claudesurf/opencode-plugin" to opencode.json plugins array
 *
 * Configuration:
 *   Set environment variables or edit CLAUDESURF_* constants below
 */

import type { Plugin } from "@opencode-ai/plugin"

// Configuration - override via environment or edit here
const AGENT_ID = process.env.CLAUDESURF_AGENT_ID || "opencode-agent"
const TEAM_ID = process.env.CLAUDESURF_TEAM_ID || "m57596g091akfcdwzqvk5k0dhn7xfm3e"
const API_URL = process.env.CLAUDESURF_API_URL || "https://glue.elide.work"

// Track session state
const sessionState = {
  filesEdited: new Set<string>(),
  toolCalls: 0,
  startTime: Date.now(),
}

// Helper: Call Glue MCP API (JSON-RPC format)
async function callGlueAPI(method: string, args: Record<string, unknown>) {
  const response = await fetch(`${API_URL}/api/mcp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "tools/call",
      params: { name: method, arguments: args },
      id: Date.now(),
    }),
  })
  const json = await response.json()
  if (json.result?.content?.[0]?.text) {
    return JSON.parse(json.result.content[0].text)
  }
  return json
}

// Save checkpoint to Glue
async function saveCheckpoint(summary: string, pending: string[], accomplishments: string[]) {
  return callGlueAPI("agent-status", {
    action: "save-checkpoint",
    agentId: AGENT_ID,
    teamId: TEAM_ID,
    conversationSummary: summary,
    pendingWork: pending,
    accomplishments,
    filesEdited: Array.from(sessionState.filesEdited),
    workingOn: pending[0] || "General development",
  })
}

// Get checkpoint from Glue
async function getCheckpoint() {
  return callGlueAPI("agent-status", {
    action: "get-checkpoint",
    agentId: AGENT_ID,
    teamId: TEAM_ID,
  })
}

export const ClaudeSurfPlugin: Plugin = async (ctx) => {
  // Log startup
  await ctx.client.app.log({
    body: {
      service: "claudesurf",
      level: "info",
      message: `ClaudeSurf initialized for agent ${AGENT_ID}`,
    },
  })

  return {
    // Track file edits for checkpoint
    event: async ({ event }) => {
      if (event.type === "file.edited" && "path" in event) {
        sessionState.filesEdited.add(event.path as string)
      }
    },

    // Track tool usage
    "tool.execute.after": async ({ tool }) => {
      sessionState.toolCalls++

      // Log high tool usage as warning
      if (sessionState.toolCalls > 100 && sessionState.toolCalls % 50 === 0) {
        await ctx.client.app.log({
          body: {
            service: "claudesurf",
            level: "warn",
            message: `High tool usage: ${sessionState.toolCalls} calls this session`,
          },
        })
      }
    },

    // CRITICAL: Inject context before compaction
    "experimental.session.compacting": async (input, output) => {
      const checkpoint = await getCheckpoint()

      if (checkpoint?.found && checkpoint.checkpoint) {
        const cp = checkpoint.checkpoint

        // Inject previous session context into compaction
        output.context.push(`
## ClaudeSurf: Previous Session Context

### Last Working On
${cp.workingOn || "Not specified"}

### Conversation Summary
${cp.conversationSummary || "No summary available"}

### Pending Work
${(cp.pendingWork || []).map((w: string) => `- ${w}`).join("\n") || "None"}

### Accomplishments
${(cp.accomplishments || []).map((a: string) => `- ${a}`).join("\n") || "None"}

### Files Modified
${(cp.filesEdited || []).map((f: string) => `- ${f}`).join("\n") || "None"}
`)
      }

      // Also save current session state before compaction
      const currentFiles = Array.from(sessionState.filesEdited)
      if (currentFiles.length > 0) {
        output.context.push(`
## Current Session State (pre-compaction)
- Tool calls: ${sessionState.toolCalls}
- Files touched: ${currentFiles.join(", ")}
- Session duration: ${Math.round((Date.now() - sessionState.startTime) / 60000)} minutes
`)
      }

      await ctx.client.app.log({
        body: {
          service: "claudesurf",
          level: "info",
          message: `Compaction hook fired - injected ${checkpoint?.found ? "restored" : "current"} context`,
        },
      })
    },

    // Custom tool for explicit checkpoint save
    tool: {
      claudesurf_save: {
        description: "Save current session state as a checkpoint for recovery after compaction",
        args: {
          summary: { type: "string", description: "Brief summary of current work" },
          pending: { type: "string", description: "Comma-separated list of pending tasks" },
          accomplishments: { type: "string", description: "Comma-separated list of completed tasks" },
        },
        async execute({ summary, pending, accomplishments }) {
          const pendingList = pending ? pending.split(",").map((s: string) => s.trim()) : []
          const accomplishmentsList = accomplishments ? accomplishments.split(",").map((s: string) => s.trim()) : []

          await saveCheckpoint(summary || "Manual checkpoint", pendingList, accomplishmentsList)

          return `✅ Checkpoint saved for agent ${AGENT_ID}
- Summary: ${summary || "Manual checkpoint"}
- Pending: ${pendingList.length} items
- Accomplishments: ${accomplishmentsList.length} items
- Files tracked: ${sessionState.filesEdited.size}`
        },
      },

      claudesurf_restore: {
        description: "Restore the last saved checkpoint context",
        args: {},
        async execute() {
          const checkpoint = await getCheckpoint()

          if (!checkpoint?.found) {
            return "No checkpoint found for this agent"
          }

          const cp = checkpoint.checkpoint
          return `📦 Restored checkpoint:
**Working on:** ${cp.workingOn || "Not specified"}
**Summary:** ${cp.conversationSummary || "No summary"}
**Pending:**
${(cp.pendingWork || []).map((w: string) => `- ${w}`).join("\n") || "None"}
**Done:**
${(cp.accomplishments || []).map((a: string) => `- ${a}`).join("\n") || "None"}`
        },
      },

      claudesurf_status: {
        description: "Show current claudesurf session status",
        args: {},
        async execute() {
          return `🏄 ClaudeSurf Status
- Agent: ${AGENT_ID}
- Team: ${TEAM_ID}
- Session duration: ${Math.round((Date.now() - sessionState.startTime) / 60000)} minutes
- Tool calls: ${sessionState.toolCalls}
- Files tracked: ${Array.from(sessionState.filesEdited).join(", ") || "None"}`
        },
      },
    },
  }
}

// Default export for auto-loading
export default ClaudeSurfPlugin
