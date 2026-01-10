/**
 * ClaudeSurf - Windsurf-like memory and compaction for Claude Code CLI
 *
 * @module @akapug/claudesurf
 */
export { loadConfig, defaultConfig } from './config';
export { classifyZone, getZoneThresholds } from './zones';
export { createMemoryClient } from './memory-client';
export { installHooks, uninstallHooks } from './install-hooks';
export { SessionManager } from './session-manager';
export const VERSION = '0.1.0';
//# sourceMappingURL=index.js.map