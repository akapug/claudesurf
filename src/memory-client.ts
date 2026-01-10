/**
 * Memory Client - API integration for checkpoint persistence
 */

import type { ClaudeSurfConfig } from './config';

export interface Checkpoint {
  agentId: string;
  teamId: string;
  checkpointAt: number;
  conversationSummary: string;
  workingOn?: string;
  filesEdited?: string[];
  pendingWork?: string[];
  accomplishments?: string[];
  recentContext?: string;
}

export interface SaveCheckpointParams {
  conversationSummary: string;
  workingOn?: string;
  filesEdited?: string[];
  pendingWork?: string[];
  accomplishments?: string[];
}

export interface MemoryClient {
  saveCheckpoint(params: SaveCheckpointParams): Promise<boolean>;
  getCheckpoint(): Promise<Checkpoint | null>;
  clearCheckpoint(): Promise<boolean>;
}

export function createMemoryClient(config: ClaudeSurfConfig): MemoryClient {
  const { apiUrl, agentId, teamId } = config;

  async function callMcp(action: string, args: Record<string, unknown>): Promise<unknown> {
    try {
      const response = await fetch(`${apiUrl}/api/mcp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: 'agent-status',
            arguments: { action, agentId, teamId, ...args },
          },
          id: 1,
        }),
      });

      if (!response.ok) {
        console.error(`[claudesurf] MCP call failed: ${response.status}`);
        return null;
      }

      const data = await response.json();
      const text = data?.result?.content?.[0]?.text;
      return text ? JSON.parse(text) : null;
    } catch (err) {
      console.error(`[claudesurf] MCP call error:`, err);
      return null;
    }
  }

  return {
    async saveCheckpoint(params: SaveCheckpointParams): Promise<boolean> {
      const result = await callMcp('save-checkpoint', params as unknown as Record<string, unknown>);
      return (result as { saved?: boolean })?.saved === true;
    },

    async getCheckpoint(): Promise<Checkpoint | null> {
      const result = await callMcp('get-checkpoint', {});
      if (!result) return null;

      const r = result as Record<string, unknown>;
      return {
        agentId,
        teamId,
        checkpointAt: (r.checkpointAt as number) || Date.now(),
        conversationSummary: (r.conversationSummary as string) || '',
        workingOn: r.workingOn as string | undefined,
        filesEdited: r.filesEdited as string[] | undefined,
        pendingWork: r.pendingWork as string[] | undefined,
        accomplishments: r.accomplishments as string[] | undefined,
        recentContext: r.recentContext as string | undefined,
      };
    },

    async clearCheckpoint(): Promise<boolean> {
      const result = await callMcp('clear-checkpoint', {});
      return (result as { cleared?: boolean })?.cleared === true;
    },
  };
}
