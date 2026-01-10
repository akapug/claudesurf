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
export declare function createMemoryClient(config: ClaudeSurfConfig): MemoryClient;
//# sourceMappingURL=memory-client.d.ts.map