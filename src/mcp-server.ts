/**
 * ClaudeSurf MCP Server
 * Provides save_memory and restore_context tools to Claude
 */

import { loadConfig } from './config.js';

const config = loadConfig();

interface McpRequest {
  jsonrpc: '2.0';
  id: number | string;
  method: string;
  params?: Record<string, unknown>;
}

interface McpResponse {
  jsonrpc: '2.0';
  id: number | string;
  result?: unknown;
  error?: { code: number; message: string };
}

const TOOLS = {
  save_checkpoint: {
    name: 'save_checkpoint',
    description: 'Save current session context to persistent memory. Use before compaction or session end.',
    inputSchema: {
      type: 'object',
      properties: {
        summary: {
          type: 'string',
          description: 'Brief summary of current session state',
        },
        pendingWork: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of incomplete tasks',
        },
        accomplishments: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of completed items',
        },
        filesModified: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of modified file paths',
        },
      },
      required: ['summary'],
    },
  },
  get_checkpoint: {
    name: 'get_checkpoint',
    description: 'Retrieve the last saved checkpoint for this agent',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  check_context_zone: {
    name: 'check_context_zone',
    description: 'Check current context zone (Hot/Warm/Cold/Critical) based on tool call count',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
};

async function callGlueApi(tool: string, args: Record<string, unknown>): Promise<unknown> {
  const response = await fetch(`${config.apiUrl}/api/mcp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tool, args }),
  });
  return response.json();
}

async function handleToolCall(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'save_checkpoint': {
      const result = await callGlueApi('agent-status', {
        action: 'save-checkpoint',
        agentId: config.agentId,
        teamId: config.teamId,
        conversationSummary: args.summary,
        pendingWork: args.pendingWork ?? [],
        accomplishments: args.accomplishments ?? [],
        filesEdited: args.filesModified ?? [],
      });
      return { saved: true, result };
    }

    case 'get_checkpoint': {
      const result = await callGlueApi('agent-status', {
        action: 'get-checkpoint',
        agentId: config.agentId,
        teamId: config.teamId,
      });
      return result;
    }

    case 'check_context_zone': {
      // Heuristic based on tool call count
      const stateFile = `/tmp/claudesurf-${config.agentId}-state.json`;
      try {
        const fs = await import('node:fs');
        const state = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
        const count = state.toolCount ?? 0;
        
        let zone = 'hot';
        let percentage = Math.min(count * 2, 100);
        if (percentage >= 90) zone = 'critical';
        else if (percentage >= 75) zone = 'cold';
        else if (percentage >= 50) zone = 'warm';
        
        return {
          zone,
          estimatedPercentage: percentage,
          toolCount: count,
          recommendation: zone === 'hot' ? 'Normal operation' :
                         zone === 'warm' ? 'Consider saving important context' :
                         zone === 'cold' ? 'Proactively save checkpoint' :
                         'Save immediately, compaction imminent',
        };
      } catch {
        return { zone: 'unknown', toolCount: 0, recommendation: 'No state file found' };
      }
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function handleRequest(request: McpRequest): McpResponse {
  const { id, method, params } = request;

  switch (method) {
    case 'initialize':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: { name: 'claudesurf-memory', version: '0.2.0' },
        },
      };

    case 'tools/list':
      return {
        jsonrpc: '2.0',
        id,
        result: { tools: Object.values(TOOLS) },
      };

    case 'tools/call': {
      const { name, arguments: args } = params as { name: string; arguments: Record<string, unknown> };
      // Note: In real implementation, this would be async
      // For stdio MCP, we'd need proper async handling
      return {
        jsonrpc: '2.0',
        id,
        result: { content: [{ type: 'text', text: `Tool ${name} called with args: ${JSON.stringify(args)}` }] },
      };
    }

    default:
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Method not found: ${method}` },
      };
  }
}

// Stdio MCP server main loop
async function main() {
  const readline = await import('node:readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  for await (const line of rl) {
    try {
      const request = JSON.parse(line) as McpRequest;
      const response = handleRequest(request);
      console.log(JSON.stringify(response));
    } catch (err) {
      console.error(JSON.stringify({
        jsonrpc: '2.0',
        id: null,
        error: { code: -32700, message: 'Parse error' },
      }));
    }
  }
}

main().catch(console.error);
