/**
 * ClaudeSurf Configuration
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
export const defaultConfig = {
    agentId: process.env.AGENT_ID || 'claudesurf-agent',
    teamId: process.env.TEAM_ID || 'default',
    apiUrl: process.env.CLAUDESURF_API_URL || process.env.GLUE_API_URL || 'https://glue.elide.work',
    zones: {
        hot: 50,
        warm: 75,
        cold: 90,
    },
    checkIntervalMs: 120_000,
    maxContextTokens: 200_000,
    summarizationModel: 'haiku',
    enableGroupChatNotifications: true,
    enableSubagentHandoff: true,
    hooksDir: '.claude/hooks',
};
export function loadConfig(projectDir) {
    const dir = projectDir || process.cwd();
    const configPath = join(dir, 'claudesurf.config.json');
    if (existsSync(configPath)) {
        try {
            const content = readFileSync(configPath, 'utf-8');
            const userConfig = JSON.parse(content);
            return { ...defaultConfig, ...userConfig };
        }
        catch {
            console.warn(`[claudesurf] Failed to parse config at ${configPath}, using defaults`);
        }
    }
    return defaultConfig;
}
export function validateConfig(config) {
    const errors = [];
    if (!config.agentId)
        errors.push('agentId is required');
    if (!config.teamId)
        errors.push('teamId is required');
    if (!config.apiUrl)
        errors.push('apiUrl is required');
    if (config.zones.hot >= config.zones.warm)
        errors.push('zones.hot must be less than zones.warm');
    if (config.zones.warm >= config.zones.cold)
        errors.push('zones.warm must be less than zones.cold');
    return errors;
}
//# sourceMappingURL=config.js.map