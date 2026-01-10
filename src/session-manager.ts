/**
 * Session Manager - Orchestrates context monitoring and memory operations
 */

import { loadConfig, type ClaudeSurfConfig } from './config';
import { classifyZone, shouldTriggerCheckpoint, shouldTriggerEmergency, type ZoneInfo } from './zones';
import { createMemoryClient, type MemoryClient, type SaveCheckpointParams } from './memory-client';

export interface SessionState {
  sessionId: string;
  startedAt: number;
  lastCheckpointAt: number;
  checkpointCount: number;
  currentZone: ZoneInfo | null;
}

export class SessionManager {
  private config: ClaudeSurfConfig;
  private memoryClient: MemoryClient;
  private state: SessionState;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor(config?: Partial<ClaudeSurfConfig>) {
    this.config = { ...loadConfig(), ...config };
    this.memoryClient = createMemoryClient(this.config);
    this.state = {
      sessionId: `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      startedAt: Date.now(),
      lastCheckpointAt: 0,
      checkpointCount: 0,
      currentZone: null,
    };
  }

  async start(): Promise<void> {
    console.log(`[claudesurf] Session ${this.state.sessionId} started`);

    const checkpoint = await this.memoryClient.getCheckpoint();
    if (checkpoint) {
      console.log(`[claudesurf] Restored checkpoint from ${new Date(checkpoint.checkpointAt).toISOString()}`);
      console.log(`[claudesurf] Was working on: ${checkpoint.workingOn || 'unknown'}`);
    }
  }

  async checkContext(tokensUsed: number, tokensMax?: number): Promise<ZoneInfo> {
    const max = tokensMax || this.config.maxContextTokens;
    const zoneInfo = classifyZone(tokensUsed, max, this.config.zones);

    this.state.currentZone = zoneInfo;

    if (shouldTriggerEmergency(zoneInfo)) {
      console.error(zoneInfo.message);
      await this.saveCheckpoint({
        conversationSummary: `Emergency checkpoint at ${zoneInfo.percentage.toFixed(1)}% context`,
        workingOn: 'Emergency save before compaction',
      });
    } else if (shouldTriggerCheckpoint(zoneInfo)) {
      console.warn(zoneInfo.message);
      await this.saveCheckpoint({
        conversationSummary: `Proactive checkpoint at ${zoneInfo.percentage.toFixed(1)}% context`,
      });
    } else {
      console.log(zoneInfo.message);
    }

    return zoneInfo;
  }

  async saveCheckpoint(params: SaveCheckpointParams): Promise<boolean> {
    const saved = await this.memoryClient.saveCheckpoint(params);

    if (saved) {
      this.state.lastCheckpointAt = Date.now();
      this.state.checkpointCount++;
      console.log(`[claudesurf] Checkpoint saved (total: ${this.state.checkpointCount})`);
    } else {
      console.error(`[claudesurf] Failed to save checkpoint`);
    }

    return saved;
  }

  async onPreCompact(compactionType: 'auto' | 'manual'): Promise<void> {
    console.log(`[claudesurf] PreCompact triggered (${compactionType})`);

    await this.saveCheckpoint({
      conversationSummary: `Pre-compaction memory save (${compactionType})`,
      workingOn: this.getCurrentTask(),
    });

    if (this.config.enableGroupChatNotifications) {
      await this.notifyGroupChat(`🧠 Context compaction triggered. Memory saved.`);
    }
  }

  async onSessionEnd(): Promise<void> {
    console.log(`[claudesurf] Session ending, saving final checkpoint`);

    await this.saveCheckpoint({
      conversationSummary: 'Session ended',
      workingOn: this.getCurrentTask(),
    });
  }

  getState(): SessionState {
    return { ...this.state };
  }

  private getCurrentTask(): string {
    try {
      const fs = require('node:fs');
      const taskFile = `/tmp/glue-current-task-${this.config.agentId}`;
      if (fs.existsSync(taskFile)) {
        return fs.readFileSync(taskFile, 'utf-8').trim();
      }
    } catch {
      // Ignore
    }
    return 'unknown task';
  }

  private async notifyGroupChat(message: string): Promise<void> {
    try {
      await fetch(`${this.config.apiUrl}/api/groupchat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: this.config.teamId,
          author: this.config.agentId,
          authorType: 'agent',
          message,
          channel: 'dev',
        }),
      });
    } catch {
      // Ignore notification failures
    }
  }
}
