/**
 * ClaudeSurf - Windsurf-like memory and compaction for Claude Code CLI
 *
 * @module @akapug/claudesurf
 */

export { ClaudeSurfConfig, loadConfig, defaultConfig } from './config';
export { ContextZone, classifyZone, getZoneThresholds } from './zones';
export { MemoryClient, createMemoryClient } from './memory-client';
export { installHooks, uninstallHooks } from './install-hooks';
export { SessionManager } from './session-manager';

export const VERSION = '0.1.0';
