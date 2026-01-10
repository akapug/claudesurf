/**
 * ClaudeSurf Configuration
 */
export interface ZoneThresholds {
    hot: number;
    warm: number;
    cold: number;
}
export interface ClaudeSurfConfig {
    agentId: string;
    teamId: string;
    apiUrl: string;
    zones: ZoneThresholds;
    checkIntervalMs: number;
    maxContextTokens: number;
    summarizationModel: 'haiku' | 'gpt-4o-mini' | 'mistral-nemo';
    enableGroupChatNotifications: boolean;
    enableSubagentHandoff: boolean;
    hooksDir: string;
}
export declare const defaultConfig: ClaudeSurfConfig;
export declare function loadConfig(projectDir?: string): ClaudeSurfConfig;
export declare function validateConfig(config: ClaudeSurfConfig): string[];
//# sourceMappingURL=config.d.ts.map