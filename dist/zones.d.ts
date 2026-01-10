/**
 * Context Zone Classification
 *
 * Implements the Hot/Warm/Cold/Critical zone model for proactive context management.
 */
import type { ZoneThresholds } from './config';
export type ContextZone = 'hot' | 'warm' | 'cold' | 'critical';
export interface ZoneInfo {
    zone: ContextZone;
    percentage: number;
    tokensUsed: number;
    tokensMax: number;
    action: 'none' | 'monitor' | 'checkpoint' | 'emergency';
    message: string;
}
export declare function getZoneThresholds(thresholds: ZoneThresholds): {
    hotMax: number;
    warmMax: number;
    coldMax: number;
};
export declare function classifyZone(tokensUsed: number, tokensMax: number, thresholds: ZoneThresholds): ZoneInfo;
export declare function shouldTriggerCheckpoint(zoneInfo: ZoneInfo): boolean;
export declare function shouldTriggerEmergency(zoneInfo: ZoneInfo): boolean;
//# sourceMappingURL=zones.d.ts.map