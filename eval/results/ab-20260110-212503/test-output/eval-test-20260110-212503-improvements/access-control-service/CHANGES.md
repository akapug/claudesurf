# Access Control Service - Beta11-rc1 Migration

## Changes Made

### 1. Fetch Handler Pattern Update

**Before (beta10-style):**
```typescript
async function handleRequest(req: Request): Promise<Response> { ... }
export default { fetch: handleRequest };
```

**After (beta11-rc1):**
```typescript
export default async function fetch(req: Request): Promise<Response> { ... }
```

### 2. elide.pkl Enhancement

Added:
- `description` field
- `languages.typescript.enabled` and `strict` configuration
- `server.port` and `server.host` configuration

### 3. Response Pattern Update

**Before:**
```typescript
function jsonResponse(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), { ... });
}
```

**After:**
```typescript
return Response.json(data, { headers: corsHeaders });
```

### 4. Console.log Placement

Removed top-level console.log statements that could cause module evaluation issues in fetch handlers.

### 5. Simplified for Demonstration

The improved version uses a simplified policy engine suitable for demonstration. The full enterprise implementation remains available in the original file.

## Benefits

1. **Better Performance**: Native HTTP handling without shim overhead
2. **Cleaner Code**: Uses built-in Response.json() method
3. **Beta11 Compatibility**: Follows recommended patterns
4. **Health Endpoint**: Proper /health endpoint for container orchestration

## Running

```bash
elide serve server.ts
# or
elide serve server.ts --port 3000
```

## Testing

```bash
# Health check
curl http://localhost:8080/health

# Evaluate access
curl -X POST http://localhost:8080/api/access/evaluate \
  -H "Content-Type: application/json" \
  -d '{"userId":"user1","resource":"api/data","action":"read"}'

# Get users
curl http://localhost:8080/api/users

# Get roles
curl http://localhost:8080/api/roles
```
