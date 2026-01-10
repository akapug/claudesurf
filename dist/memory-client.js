/**
 * Memory Client - API integration for checkpoint persistence
 */
export function createMemoryClient(config) {
    const { apiUrl, agentId, teamId } = config;
    async function callMcp(action, args) {
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
        }
        catch (err) {
            console.error(`[claudesurf] MCP call error:`, err);
            return null;
        }
    }
    return {
        async saveCheckpoint(params) {
            const result = await callMcp('save-checkpoint', params);
            return result?.saved === true;
        },
        async getCheckpoint() {
            const result = await callMcp('get-checkpoint', {});
            if (!result)
                return null;
            const r = result;
            return {
                agentId,
                teamId,
                checkpointAt: r.checkpointAt || Date.now(),
                conversationSummary: r.conversationSummary || '',
                workingOn: r.workingOn,
                filesEdited: r.filesEdited,
                pendingWork: r.pendingWork,
                accomplishments: r.accomplishments,
                recentContext: r.recentContext,
            };
        },
        async clearCheckpoint() {
            const result = await callMcp('clear-checkpoint', {});
            return result?.cleared === true;
        },
    };
}
//# sourceMappingURL=memory-client.js.map