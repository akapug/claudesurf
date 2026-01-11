# Elide Expert Summary

## What is Elide?

Elide is a **polyglot runtime** built on GraalVM 25.0.0 and the Truffle framework that enables developers to run JavaScript, TypeScript, Python 3.11, Java JDK 24, Kotlin K2 v2.2.21, Ruby, WebAssembly (WASM), and LLVM bitcode within a single unified execution environment. The defining feature is **zero-serialization cross-language interoperability**—objects pass between languages by reference on a shared heap with unified garbage collection, achieving sub-millisecond overhead for inter-language calls.

The runtime delivers exceptional performance: approximately 800,000 requests per second on Linux with cold start times around 20ms (compared to Node.js at ~200ms). The HTTP stack is built on Netty + Micronaut, supporting HTTP/1.1, HTTP/2, HTTP/3, WebSockets, Server-Sent Events (SSE), and TLS via OpenSSL/BoringSSL.

## Key Commands

| Command | Purpose |
|---------|---------|
| `elide run <script>` | Execute a script (JS/TS/Python/etc.) |
| `elide serve [script]` | Start HTTP server with auto-reload |
| `elide repl [language]` | Interactive REPL for any supported language |
| `elide init [template]` | Initialize a new Elide project |
| `elide install` | Install dependencies from package.json |
| `elide add <package>` | Add npm/pip dependencies |
| `elide build` | Build project (native binary optional) |
| `elide test` | Run project tests |
| `elide javac` | Compile Java sources |
| `elide kotlinc` | Compile Kotlin sources |
| `elide native-image` | Build GraalVM native image |
| `elide jib` | Build container image |
| `elide lsp` | Start Language Server Protocol server |
| `elide mcp` | Start Model Context Protocol server |

**Essential flags:**
- `--js`, `--python`, `--jvm`, `--ruby`, `--wasm` — Enable specific language engines
- `--vm=native` or `--vm=jvm` — Select execution mode
- `--http2`, `--http3` — Enable HTTP/2 or HTTP/3
- `--tls` — Enable TLS encryption

## Beta11-rc1 HTTP Patterns

The current stable pattern is the **Fetch Handler** (declarative style):

```typescript
// Default export function named 'fetch'
export default async function fetch(req: Request): Promise<Response> {
  const url = new URL(req.url);

  if (url.pathname === "/api/data") {
    return Response.json({ status: "ok" });
  }

  return new Response("Not Found", { status: 404 });
}

// Or object with fetch method
export default {
  fetch: async (req: Request): Promise<Response> => {
    return new Response("Hello, World!");
  }
};
```

**Alternative patterns:**
- **Node.js http.createServer** (imperative, for migration from Node.js)
- **WSGI** (Python web applications)

## Polyglot Patterns

### TypeScript + Python Integration

```typescript
// Access Python from TypeScript
import python from "elide:python";

const np = python.import("numpy");
const pd = python.import("pandas");

// Python objects work directly - no serialization
const array = np.array([1, 2, 3, 4, 5]);
const mean = np.mean(array);  // Returns Python float, usable in JS

// DataFrames pass by reference
const df = pd.DataFrame({ col1: [1, 2], col2: [3, 4] });
```

### TypeScript + Java Integration

```typescript
// Access JVM classes from TypeScript
import java from "elide:java";

const ArrayList = java.type("java.util.ArrayList");
const list = new ArrayList();
list.add("item1");
list.add("item2");

// Use Java libraries directly
const UUID = java.type("java.util.UUID");
const id = UUID.randomUUID().toString();
```

### Python + Java Integration

```python
# Access Java from Python
import java

HashMap = java.type("java.util.HashMap")
map = HashMap()
map.put("key", "value")

# Java collections work with Python iteration
for entry in map.entrySet():
    print(f"{entry.getKey()}: {entry.getValue()}")
```

## Project Configuration (elide.pkl)

Projects are configured using Apple's Pkl language:

```pkl
amends "elide:project"

name = "my-app"
version = "1.0.0"

runtime {
  languages = new { "js"; "python" }
  vm = "native"
}

server {
  port = 8080
  http2 = true
}

dependencies {
  npm = new {
    "lodash" { version = "^4.17.21" }
  }
  pip = new {
    "numpy" { version = ">=1.24.0" }
  }
}
```

## Common Pitfalls and Solutions

### 1. Missing Language Engine
**Problem:** `Language 'python' is not available`
**Solution:** Enable the engine with `--python` flag or in elide.pkl:
```pkl
runtime { languages = new { "js"; "python" } }
```

### 2. Fetch Handler Not Recognized
**Problem:** Server starts but returns 404 for all routes
**Solution:** Ensure default export is named `fetch` or is an object with `fetch` property:
```typescript
// Correct
export default async function fetch(req: Request) { ... }
// Also correct
export default { fetch: handleRequest };
// WRONG - won't be detected
export function handleRequest(req: Request) { ... }
```

### 3. Module Resolution Errors
**Problem:** `Cannot find module 'elide:python'`
**Solution:** Use correct import syntax for polyglot modules:
```typescript
import python from "elide:python";  // Correct
import { python } from "elide";     // Wrong
```

### 4. Type Mismatches in Polyglot Calls
**Problem:** Java expects specific types but receives JS objects
**Solution:** Use explicit type conversion:
```typescript
const JavaString = java.type("java.lang.String");
const javaStr = new JavaString("text");  // Explicit Java String
```

### 5. Memory Issues with Large Polyglot Data
**Problem:** Out of memory when passing large arrays between languages
**Solution:** Objects share the heap, but watch for:
- Keeping references longer than needed (prevents GC)
- Creating copies instead of passing references
- Use streaming for large datasets

### 6. Cold Start in Production
**Problem:** First request is slow (~200ms+)
**Solution:**
- Use native-image build for 20ms cold starts
- Enable AOT compilation in elide.pkl
- Use `elide build --native` for production

### 7. HTTP/2 or HTTP/3 Not Working
**Problem:** Server falls back to HTTP/1.1
**Solution:** Ensure TLS is enabled (required for HTTP/2+):
```bash
elide serve --http2 --tls --cert=cert.pem --key=key.pem
```

### 8. SQLite/Database Access Errors
**Problem:** `SQLite is not available in native mode`
**Solution:** Use JVM mode for SQLite or use external database:
```bash
elide serve --vm=jvm
```

### 9. File System Access Denied
**Problem:** Cannot read/write files in native mode
**Solution:** File I/O may be restricted; check permissions and use:
```typescript
// Use Elide's built-in filesystem APIs
import fs from "elide:fs";
```

### 10. CORS Issues
**Problem:** Browser blocks requests to Elide server
**Solution:** Add CORS headers in fetch handler:
```typescript
export default async function fetch(req: Request): Promise<Response> {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  return new Response("OK", { headers });
}
```

## Performance Tips

1. **Use native-image for production** — 10x faster cold start
2. **Enable HTTP/2** — Multiplexing improves throughput
3. **Pass objects by reference** — Avoid unnecessary serialization
4. **Use streaming for large responses** — Memory efficient
5. **Leverage JIT compilation** — Long-running servers benefit from warmup
6. **Profile with `--engine.TraceCompilation`** — Identify compilation bottlenecks

## Testing Commands

```bash
# Run all tests
elide test

# Run specific test file
elide test tests/api.test.ts

# Run with coverage
elide test --coverage

# Watch mode for development
elide test --watch
```

## Quick Reference

| Feature | Command/Pattern |
|---------|-----------------|
| Start dev server | `elide serve --watch` |
| Build for production | `elide build --native` |
| Add npm package | `elide add lodash` |
| Add Python package | `elide add --pip numpy` |
| Enable polyglot | `import python from "elide:python"` |
| JSON response | `Response.json({ data })` |
| Static files | Configure in elide.pkl `server.static` |
| Environment vars | `Elide.env.get("VAR_NAME")` |
