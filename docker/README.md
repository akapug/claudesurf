# ClaudeSurf Docker Integration

This directory contains Docker-specific configurations for running ClaudeSurf hooks in containerized environments.

## Quick Start

### 1. Add to your Dockerfile

```dockerfile
# Include the integration snippet
COPY --from=claudesurf /opt/claudesurf /opt/claudesurf

# Or clone directly
ARG CLAUDESURF_VERSION=main
RUN git clone --depth 1 --branch ${CLAUDESURF_VERSION} \
    https://github.com/akapug/claudesurf.git /opt/claudesurf && \
    chmod +x /opt/claudesurf/hooks/scripts/*.sh

# Set environment
ENV CLAUDESURF_ROOT=/opt/claudesurf
ENV CLAUDESURF_STATE_DIR=/var/lib/claudesurf
ENV CLAUDESURF_API_URL=https://glue.elide.work
```

### 2. Set Agent Identity at Runtime

```bash
docker run -e CLAUDESURF_AGENT_ID=my-agent \
           -e CLAUDESURF_TEAM_ID=m57596g091akfcdwzqvk5k0dhn7xfm3e \
           your-image
```

### 3. Configure Hooks

Copy the Docker hooks configuration:

```bash
cp /opt/claudesurf/hooks/docker-hooks.json /root/.claude/hooks.json
```

Or merge with existing settings:

```bash
jq -s '.[0] * {hooks: .[1]}' \
  /root/.claude/settings.json \
  /opt/claudesurf/hooks/docker-hooks.json \
  > /tmp/settings.json && mv /tmp/settings.json /root/.claude/settings.json
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CLAUDESURF_AGENT_ID` | Yes | `agent` | Unique agent identifier |
| `CLAUDESURF_TEAM_ID` | Yes | - | Glue team ID for MCP calls |
| `CLAUDESURF_API_URL` | No | `https://glue.elide.work` | Glue API endpoint |
| `CLAUDESURF_STATE_DIR` | No | `/tmp/claudesurf` | State file directory |
| `CLAUDESURF_DEBUG` | No | `false` | Enable debug logging |

## Fly.io Deployment

For Fly.io agents, set environment in `fly.toml`:

```toml
[env]
  CLAUDESURF_ROOT = "/opt/claudesurf"
  CLAUDESURF_STATE_DIR = "/var/lib/claudesurf"
  CLAUDESURF_API_URL = "https://glue.elide.work"
  # CLAUDESURF_AGENT_ID and TEAM_ID should be secrets
```

Set secrets:
```bash
fly secrets set CLAUDESURF_AGENT_ID=fly-agent-1
fly secrets set CLAUDESURF_TEAM_ID=your-team-id
```

## State Persistence

By default, state is stored in `/var/lib/claudesurf`. For persistence across restarts:

### Docker Compose
```yaml
volumes:
  - claudesurf-state:/var/lib/claudesurf
```

### Fly.io
```toml
[mounts]
  source = "claudesurf_state"
  destination = "/var/lib/claudesurf"
```

## Features

### Context Tracking
- Token usage tracked via `token-tracker.sh`
- Zone warnings (hot/warm/cold/critical)
- Compaction detection

### Remote Reporting
- Context metrics reported to Glue via MCP
- GroupChat notifications on compaction
- Checkpoint save/restore across sessions

### Status Line Integration
- `status-line-parser.sh` for real-time context display
- Works with Claude Code v2.1.6+ status line JSON

## Troubleshooting

### Hooks not firing
1. Check hooks are configured: `cat /root/.claude/settings.json`
2. Verify scripts are executable: `ls -la /opt/claudesurf/hooks/scripts/`
3. Check debug log: `cat /var/lib/claudesurf/debug.log`

### API calls failing
1. Verify network access to Glue API
2. Check `CLAUDESURF_API_URL` is reachable from container
3. Enable debug: `CLAUDESURF_DEBUG=true`

### State not persisting
1. Check `CLAUDESURF_STATE_DIR` is writable
2. Verify volume is mounted correctly
3. Check state files: `ls -la /var/lib/claudesurf/`
