# Analytics Engine - Beta11-rc1 Migration

## Changes Made

1. **Fetch Handler Pattern**: Updated to `export default async function fetch()`
2. **Response.json()**: Using native Response.json() method
3. **elide.pkl**: Added description and language/server configuration
4. **Health Endpoint**: Added proper /health for container orchestration
5. **CORS Support**: Proper CORS headers for frontend integration

## API Endpoints

- `GET /health` - Health check
- `GET /api/metrics` - List all metric names
- `POST /api/metrics` - Record a metric point
- `GET /api/metrics/:name` - Query metric time series
- `GET /api/aggregate/:name?fn=avg` - Get aggregated value

## Running

```bash
elide serve server.ts
```

## Testing

```bash
# Record metric
curl -X POST http://localhost:8080/api/metrics \
  -H "Content-Type: application/json" \
  -d '{"name":"requests","value":42}'

# Query metrics
curl http://localhost:8080/api/metrics/page_views

# Aggregate
curl "http://localhost:8080/api/aggregate/api_latency_ms?fn=avg"
```
