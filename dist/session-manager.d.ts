/**
 * Session Manager - Orchestrates context monitoring and memory operations
 */
import { type ClaudeSurfConfig } from './config';
import { type ZoneInfo } from './zones';
import { type SaveCheckpointParams } from './memory-client';
export interface SessionState {
    sessionId: string;
    startedAt: number;
    lastCheckpointAt: number;
    checkpointCount: number;
    currentZone: ZoneInfo | null;
}
export declare class SessionManager {
    private config;
    private memoryClient;
    private state;
    private checkInterval;
    constructor(config?: Partial<ClaudeSurfConfig>);
    start(): Promise<void>;
    checkContext(tokensUsed: number, tokensMax?: number): Promise<ZoneInfo>;
    saveCheckpoint(params: SaveCheckpointParams): Promise<boolean>;
    onPreCompact(compactionType: 'auto' | 'manual'): Promise<void>;
    onSessionEnd(): Promise<void>;
    getState(): SessionState;
    private getCurrentTask;
    private notifyGroupChat;
}
//# sourceMappingURL=session-manager.d.ts.map