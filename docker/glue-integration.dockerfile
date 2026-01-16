# ClaudeSurf Docker Integration for Glue Canonical Agents
# Add this snippet to your Dockerfile.canonical to enable
# context tracking and compaction memory preservation

# ============================================================
# CLAUDESURF INSTALLATION
# ============================================================

# Install ClaudeSurf hooks
ARG CLAUDESURF_VERSION=main
RUN git clone --depth 1 --branch ${CLAUDESURF_VERSION} \
    https://github.com/akapug/claudesurf.git /opt/claudesurf && \
    chmod +x /opt/claudesurf/hooks/scripts/*.sh && \
    chmod +x /opt/claudesurf/hooks/scripts/lib/*.sh 2>/dev/null || true

# Create state directory with proper permissions
RUN mkdir -p /var/lib/claudesurf && chmod 777 /var/lib/claudesurf

# Set environment variables for ClaudeSurf
ENV CLAUDESURF_ROOT=/opt/claudesurf
ENV CLAUDESURF_STATE_DIR=/var/lib/claudesurf
# These should be set at runtime:
# ENV CLAUDESURF_AGENT_ID=your-agent-id
# ENV CLAUDESURF_TEAM_ID=your-team-id
ENV CLAUDESURF_API_URL=https://glue.elide.work

# ============================================================
# HOOKS CONFIGURATION
# ============================================================
#
# Option 1: Copy Docker hooks to Claude settings
# Add to your entrypoint script:
#   cp /opt/claudesurf/hooks/docker-hooks.json /root/.claude/hooks.json
#
# Option 2: Merge with existing settings.json
# The hooks are designed to use ${CLAUDESURF_ROOT} env var
#
# Option 3: Use --plugin-dir flag
#   claude --plugin-dir /opt/claudesurf ...
#
# ============================================================

# Example entrypoint snippet for Glue agents:
# #!/bin/bash
# export CLAUDESURF_AGENT_ID="${AGENT_ID:-$(hostname)}"
# export CLAUDESURF_TEAM_ID="${TEAM_ID:-m57596g091akfcdwzqvk5k0dhn7xfm3e}"
#
# # Ensure hooks directory exists
# mkdir -p /root/.claude
#
# # Use Docker-compatible hooks
# if [[ ! -f /root/.claude/settings.json ]]; then
#   echo '{}' > /root/.claude/settings.json
# fi
#
# # Merge ClaudeSurf hooks (requires jq)
# jq -s '.[0] * {hooks: .[1]}' \
#   /root/.claude/settings.json \
#   /opt/claudesurf/hooks/docker-hooks.json \
#   > /tmp/merged-settings.json && \
#   mv /tmp/merged-settings.json /root/.claude/settings.json
#
# exec claude "$@"
