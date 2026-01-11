# Realtime Dashboard - Beta11-rc1 Migration

## Changes Made

1. **Fetch Handler**: Updated to beta11-rc1 pattern
2. **SSE Streaming**: Proper Server-Sent Events implementation
3. **elide.pkl**: Full configuration
4. **Trend Detection**: Metrics include trend direction

## API Endpoints

- `GET /health` - Service health
- `GET /api/stream` - SSE stream for real-time updates
- `GET /api/metrics` - Current metrics snapshot
- `GET /api/metrics/:name?limit=100` - Historical data
- `GET /api/metrics/list` - List metric names

## SSE Stream

Connect to `/api/stream` for real-time updates:

```javascript
const source = new EventSource('http://localhost:8080/api/stream');
source.onmessage = (event) => {
  const metrics = JSON.parse(event.data);
  console.log('Update:', metrics);
};
```

## Running

```bash
elide serve server.ts
```

## Testing

```bash
# Current metrics
curl http://localhost:8080/api/metrics

# Stream (will receive updates every second)
curl http://localhost:8080/api/stream

# Historical data
curl "http://localhost:8080/api/metrics/cpu_usage?limit=50"
```
