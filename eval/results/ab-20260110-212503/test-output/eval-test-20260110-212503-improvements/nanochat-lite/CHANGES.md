# NanoChat Lite - Beta11-rc1 Migration

## Changes Made

1. **Fetch Handler**: Updated to beta11-rc1 pattern
2. **elide.pkl**: Added full configuration
3. **Long-polling**: Supports `?since=timestamp` for polling
4. **User tracking**: Via X-User header

## API Endpoints

- `GET /health` - Service health
- `GET /api/rooms` - List all rooms
- `POST /api/rooms` - Create a room
- `POST /api/rooms/:id/join` - Join a room
- `POST /api/rooms/:id/leave` - Leave a room
- `POST /api/rooms/:id/messages` - Send a message
- `GET /api/rooms/:id/messages?since=ts` - Get messages

## Running

```bash
elide serve server.ts
```

## Testing

```bash
# List rooms
curl http://localhost:8080/api/rooms

# Join a room
curl -X POST -H "X-User: alice" http://localhost:8080/api/rooms/general/join

# Send message
curl -X POST -H "X-User: alice" -H "Content-Type: application/json" \
  -d '{"content":"Hello!"}' http://localhost:8080/api/rooms/general/messages

# Get messages
curl http://localhost:8080/api/rooms/general/messages
```
