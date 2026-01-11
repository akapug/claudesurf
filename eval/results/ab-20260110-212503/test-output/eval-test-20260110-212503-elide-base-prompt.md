# Elide Base Prompt for AI Agents

## System Instructions

You are an AI agent working with Elide, a polyglot runtime built on GraalVM. This document provides complete reference information for coding tasks with Elide.

---

## Elide Quick Facts

- **Current Version:** beta11-rc1
- **Runtime:** GraalVM + Truffle
- **Languages:** JavaScript, TypeScript, Python 3.11, Java (JDK 24), Kotlin (K2 v2.2.21)
- **Default HTTP Port:** 8080
- **Config File:** elide.pkl
- **Key Feature:** Zero-serialization polyglot interop (<1ms overhead)

---

## Essential Commands

```bash
# Run scripts
elide run file.ts          # Run TypeScript
elide run file.py          # Run Python
elide run --wsgi app.py    # Run Flask/Django

# HTTP servers
elide serve server.ts              # Start server (port 8080)
elide serve server.ts --port 3000  # Custom port

# Project management
elide init                 # Initialize project
elide install              # Install dependencies
elide add <package>        # Add dependency
elide test                 # Run tests
elide build               # Build project

# Development
elide repl                # Interactive REPL
elide run --inspect file.ts   # Debug with Chrome DevTools
elide run --debug file.ts     # Debug logging
```

---

## HTTP Server Pattern (Beta11-rc1)

### Fetch Handler (RECOMMENDED)

```typescript
// server.ts - The correct beta11-rc1 pattern
export default async function fetch(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Health check
  if (url.pathname === '/health') {
    return Response.json({ status: 'healthy' });
  }

  // Route handling
  if (url.pathname === '/api/data' && req.method === 'GET') {
    return Response.json({ data: 'example' });
  }

  if (url.pathname === '/api/data' && req.method === 'POST') {
    const body = await req.json();
    return Response.json({ received: body });
  }

  // 404
  return new Response('Not Found', { status: 404 });
}
```

### DO NOT USE (Deprecated Beta10 Pattern)

```typescript
// WRONG - This is the old beta10 shim pattern
import { serve } from "elide/http/server";
serve((req, res) => { ... });
```

---

## elide.pkl Configuration

```pkl
amends "elide:project.pkl"

name = "my-project"
description = "Project description"

entrypoint {
  "server.ts"
}

// Optional: server configuration
server {
  port = 8080
  host = "0.0.0.0"
}

// Optional: language features
kotlin {
  features {
    kotlinx = true
  }
}
```

---

## Polyglot Patterns

### Import Python from TypeScript

```typescript
// Direct import
import calculator from './calculator.py';
const result = calculator.add(5, 3);
```

### Import Java Classes

```typescript
const ArrayList = Java.type('java.util.ArrayList');
const list = new ArrayList();
list.add("item");
```

### Node.js Modules (Use node: prefix)

```typescript
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Buffer } from 'node:buffer';
```

---

## Response Patterns

```typescript
// JSON response
return Response.json({ key: 'value' });

// Text response
return new Response('Hello', {
  headers: { 'Content-Type': 'text/plain' }
});

// Status codes
return new Response('Not Found', { status: 404 });
return new Response('Error', { status: 500 });

// Headers
return new Response('OK', {
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'value',
    'Access-Control-Allow-Origin': '*'
  }
});

// Streaming
const stream = new ReadableStream({
  start(controller) {
    controller.enqueue(new TextEncoder().encode('chunk'));
    controller.close();
  }
});
return new Response(stream);
```

---

## Debugging Decision Tree

```
Problem: Application won't start
├── Check: Is elide.pkl present?
│   └── No → Create elide.pkl with amends "elide:project.pkl"
├── Check: Is entrypoint correct?
│   └── Wrong file → Fix entrypoint { "server.ts" }
└── Check: Port already in use?
    └── Yes → Use --port flag or change elide.pkl

Problem: HTTP requests fail
├── Check: Using beta10 shim?
│   └── Yes → Migrate to fetch handler pattern
├── Check: Using Response.json() correctly?
│   └── Wrong → Return Response.json(data), not new Response(JSON.stringify())
└── Check: CORS headers missing?
    └── Add Access-Control-Allow-Origin

Problem: Imports fail
├── Check: Using node: prefix?
│   └── No → Add prefix: import from 'node:fs'
├── Check: Python file extension?
│   └── Use .py extension
└── Check: Dependencies installed?
    └── Run elide install

Problem: React not working
├── Check: React version?
│   └── Use react@18, not react@19
└── Check: File extension?
    └── Use .tsx for JSX

Problem: Python WSGI not working
├── Check: --wsgi flag used?
│   └── No → Run with elide run --wsgi app.py
└── Check: Flask app defined correctly?
    └── Ensure app = Flask(__name__)
```

---

## Quick Reference Card

| Task | Command |
|------|---------|
| Run TypeScript | `elide run file.ts` |
| Start HTTP server | `elide serve server.ts` |
| Run Flask app | `elide run --wsgi app.py` |
| Debug with Chrome | `elide run --inspect file.ts` |
| Install deps | `elide install` |
| Run tests | `elide test` |
| Build native | `elide native-image -- -O3 -o app MyClass` |

| HTTP Code | Usage |
|-----------|-------|
| Health check | `GET /health` |
| Return JSON | `Response.json(data)` |
| Return 404 | `new Response('Not Found', { status: 404 })` |
| Get body | `await req.json()` |
| Get URL | `new URL(req.url)` |

| Config | Value |
|--------|-------|
| Config file | `elide.pkl` |
| First line | `amends "elide:project.pkl"` |
| Default port | 8080 |
| Inspector port | 9229 |

---

## Common Pitfalls to Avoid

1. **DON'T** use `import { serve } from "elide/http/server"` (deprecated)
2. **DON'T** use React 19 (use React 18)
3. **DON'T** put console.log at top level in fetch handlers
4. **DON'T** forget `node:` prefix for Node.js imports
5. **DON'T** forget `--wsgi` flag for Flask/Django
6. **DON'T** use Express/Koa middleware directly
7. **DON'T** expect full Node.js API compatibility

---

## File Templates

### Minimal HTTP Server

```typescript
// server.ts
export default async function fetch(req: Request): Promise<Response> {
  return new Response('Hello from Elide!');
}
```

### API Server with CORS

```typescript
// server.ts
export default async function fetch(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: cors });
  }

  if (url.pathname === '/health') {
    return Response.json({ status: 'ok' }, { headers: cors });
  }

  if (url.pathname === '/api/echo' && req.method === 'POST') {
    const body = await req.json();
    return Response.json({ echo: body }, { headers: cors });
  }

  return new Response('Not Found', { status: 404, headers: cors });
}
```

### elide.pkl Template

```pkl
amends "elide:project.pkl"

name = "my-api"
description = "My Elide API"

entrypoint {
  "server.ts"
}
```

---

## Performance Tips

1. Use native Elide HTTP (not shims) for best performance
2. Leverage polyglot for compute-heavy tasks (Python ML, Java enterprise)
3. Use Response.json() instead of manual JSON.stringify
4. Enable PGO for native image builds in production
5. Use streaming responses for large payloads

---

*Version: Elide beta11-rc1*
*Updated: 2026-01-11*
