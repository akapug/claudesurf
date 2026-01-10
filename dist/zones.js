/**
 * Context Zone Classification
 *
 * Implements the Hot/Warm/Cold/Critical zone model for proactive context management.
 */
export function getZoneThresholds(thresholds) {
    return {
        hotMax: thresholds.hot,
        warmMax: thresholds.warm,
        coldMax: thresholds.cold,
    };
}
export function classifyZone(tokensUsed, tokensMax, thresholds) {
    const percentage = (tokensUsed / tokensMax) * 100;
    if (percentage >= thresholds.cold) {
        return {
            zone: 'critical',
            percentage,
            tokensUsed,
            tokensMax,
            action: 'emergency',
            message: `🚨 CRITICAL: ${percentage.toFixed(1)}% - Emergency save required`,
        };
    }
    if (percentage >= thresholds.warm) {
        return {
            zone: 'cold',
            percentage,
            tokensUsed,
            tokensMax,
            action: 'checkpoint',
            message: `⚠️ Cold zone: ${percentage.toFixed(1)}% - Saving checkpoint`,
        };
    }
    if (percentage >= thresholds.hot) {
        return {
            zone: 'warm',
            percentage,
            tokensUsed,
            tokensMax,
            action: 'monitor',
            message: `📊 Warm zone: ${percentage.toFixed(1)}% - Monitoring`,
        };
    }
    return {
        zone: 'hot',
        percentage,
        tokensUsed,
        tokensMax,
        action: 'none',
        message: `✅ Hot zone: ${percentage.toFixed(1)}% - Full fidelity`,
    };
}
export function shouldTriggerCheckpoint(zoneInfo) {
    return zoneInfo.action === 'checkpoint' || zoneInfo.action === 'emergency';
}
export function shouldTriggerEmergency(zoneInfo) {
    return zoneInfo.action === 'emergency';
}
//# sourceMappingURL=zones.js.map