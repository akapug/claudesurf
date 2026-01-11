# Elide Expert Summary

## What is Elide?

Elide is a revolutionary polyglot runtime built on GraalVM and the Truffle language implementation framework. It enables developers to run JavaScript, TypeScript, Python 3.11, Java (JDK 24), and Kotlin (K2 v2.2.21) within a single unified runtime, achieving zero-serialization cross-language calls with sub-millisecond overhead. Unlike traditional approaches that require separate processes or JSON-based IPC, Elide allows direct object sharing across language boundaries through Truffle's language interoperability, with all languages sharing a single unified garbage collector.

The runtime delivers exceptional performance characteristics: approximately 10x faster cold starts than Node.js (~20ms vs ~200ms), around 800K requests per second on Linux with native transports (Netty), and significantly lower memory overhead due to eliminating V8 initialization. Elide is independently benchmarked by TechEmpower, validating its production-ready performance claims. The HTTP server stack combines Netty for high-performance non-blocking I/O with Micronaut for routing and server lifecycle management.

Elide's unique value proposition lies in its "best-of-all-worlds" approach: developers can leverage Python's ML/data science ecosystem alongside TypeScript's type safety for web services, call Java enterprise libraries directly, or use Kotlin's modern language features - all within one process, one heap, and one debugger session. This eliminates the architectural complexity and performance overhead of microservices-based polyglot systems while maintaining the benefits of using the best language for each task.

The current stable version is beta11-rc1, which introduced native HTTP server support (eliminating the beta10 shim), WSGI support for Flask/Django apps, and the fetch handler pattern as the recommended HTTP implementation approach. The runtime supports modern JavaScript features (ES2020+), runs TypeScript and TSX/JSX directly without build steps, and includes embedded JDK tools (javac, javadoc, jar) and Kotlin tools (kotlinc, kapt, KSP).

---

## Complete Command Reference

### Core Commands

| Command | Description | Example |
|---------|-------------|---------|
| `elide run <file>` | Execute a script file | `elide run server.ts` |
| `elide serve <file>` | Start HTTP server | `elide serve server.ts --port 8080` |
| `elide repl` | Start interactive REPL | `elide repl` |
| `elide init` | Initialize new project (interactive) | `elide init` |
| `elide install` | Install project dependencies | `elide install` |
| `elide add <package>` | Add new dependency | `elide add lodash` |
| `elide build` | Build the project | `elide build --release` |
| `elide test` | Run tests | `elide test --coverage` |

### JDK/Kotlin Tools

| Command | Description | Example |
|---------|-------------|---------|
| `elide javac` | Compile Java code | `elide javac -- -d out src/*.java` |
| `elide kotlinc` | Compile Kotlin code | `elide kotlinc -- -d out src/*.kt` |
| `elide jar` | Create JAR archives | `elide jar -- cf app.jar -C out .` |
| `elide javadoc` | Generate Javadoc | `elide javadoc -- -d docs src/*.java` |
| `elide native-image` | Build native binary | `elide native-image -- -O3 -o myapp MyClass` |
| `elide jib` | Build container image | `elide jib -- build -t myapp:latest` |

### Development Tools

| Command | Description | Example |
|---------|-------------|---------|
| `elide lsp` | Start Language Server Protocol | `elide lsp --lsp:port=8080` |
| `elide mcp` | Start Model Context Protocol | `elide mcp` |
| `elide which <tool>` | Find tool path | `elide which esbuild` |
| `elide secrets` | Manage secrets | `elide secrets set API_KEY value` |
| `elide info` | Show project information | `elide info` |
| `elide completions` | Generate shell completions | `elide completions bash` |

### Information Commands

| Command | Description |
|---------|-------------|
| `elide --version` / `-v` | Show version |
| `elide --help` / `-h` | Show general help |
| `elide help <topic>` | Show help for specific topic |

### Common Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--port=<port>` | Set server port | `--port=3000` |
| `--inspect` | Enable Chrome DevTools | `elide run --inspect file.ts` |
| `--inspect:wait` | Suspend until debugger attaches | `--inspect:wait` |
| `--inspect:port=<port>` | Custom inspector port | `--inspect:port=9229` |
| `--debug` | Enable debug logging | `elide run --debug file.ts` |
| `--verbose` / `-v` | Verbose output | `elide run -v file.ts` |
| `--quiet` / `-q` | Suppress output | `elide run -q file.ts` |
| `--env <K=V>` | Set environment variable | `--env API_KEY=xyz` |
| `--dotenv` | Load .env file | `elide run --dotenv server.ts` |
| `--wsgi` | Enable WSGI mode (Python) | `elide run --wsgi app.py` |
| `--no-telemetry` | Disable telemetry | `elide run --no-telemetry` |

### I/O Permissions

| Flag | Description |
|------|-------------|
| `--host:allow-io` | Grant broad file I/O |
| `--host:allow-io=/path:ro` | Read-only for path |
| `--host:allow-io=/path:wo` | Write-only for path |
| `--host:allow-env` | Allow environment access |

### Testing Flags

| Flag | Description |
|------|-------------|
| `--coverage` | Enable code coverage |
| `--coverage-format=json` | JSON coverage report |
| `--coverage-format=histogram` | Histogram coverage |
| `--test-report=xml` | XML test report |
| `--threaded --threads=N` | Parallel testing (experimental) |
| `--timeout=<ms>` | Test timeout |
| `--filter="pattern"` | Filter tests by pattern |

### Build/Native Image Flags

| Flag | Description |
|------|-------------|
| `--release` | Release mode build |
| `--dry-run` | Dry run (no actual build) |
| `--frozen` | Use frozen lockfile |
| `--lockfile-format=json` | JSON lockfile format |

---

## Polyglot Patterns with Examples

### 1. TypeScript Importing Python

```typescript
// Import a Python module
import calculator from './calculator.py';

// Call Python functions directly
const result = calculator.add(5, 3);
console.log(`Python calculated: ${result}`); // 8
```

```python
# calculator.py
def add(a, b):
    return a + b

def multiply(a, b):
    return a * b
```

### 2. TypeScript Importing Java

```typescript
// Import Java classes
const HashMap = Java.type('java.util.HashMap');
const ArrayList = Java.type('java.util.ArrayList');

// Use Java collections from TypeScript
const map = new HashMap();
map.put("key", "value");
console.log(map.get("key")); // "value"
```

### 3. Flask + TypeScript Polyglot

```python
# app.py - Flask backend
from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/api/data')
def get_data():
    return jsonify({"status": "ok"})
```

```typescript
// orchestrator.ts - TypeScript orchestration
import flask_app from './app.py';

// Call Flask endpoints directly via polyglot
export default async function fetch(req: Request): Promise<Response> {
  const url = new URL(req.url);

  if (url.pathname.startsWith('/api/')) {
    // Delegate to Flask
    return flask_app.handle_request(req);
  }

  return new Response("TypeScript handled", { status: 200 });
}
```

Run with: `elide run --wsgi orchestrator.ts`

### 4. Using Kotlin from TypeScript

```typescript
// Import Kotlin module
import dataProcessor from './DataProcessor.kt';

// Use Kotlin coroutines and data classes
const result = await dataProcessor.processAsync(data);
console.log(result.summary);
```

### 5. Node.js Module Usage

```typescript
// Recommended: Use node: prefix
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Buffer } from 'node:buffer';

const content = readFileSync(join(__dirname, 'data.json'), 'utf-8');
const parsed = JSON.parse(content);
```

---

## Performance Characteristics

| Metric | Elide | Node.js | Improvement |
|--------|-------|---------|-------------|
| Cold Start | ~20ms | ~200ms | 10x faster |
| RPS (Linux) | ~800K | ~100K | 8x higher |
| Memory Overhead | Low | V8 init overhead | No V8 init |
| Cross-language Call | <1ms | N/A (IPC required) | Zero-serialization |

### Benchmark Notes

- Independently verified by TechEmpower
- Native transports (Netty) on Linux provide best performance
- HTTP/2 supported via ALPN negotiation
- WebSockets supported via Netty/Micronaut
- Profile-Guided Optimization (PGO) available for native images

---

## Common Pitfalls and Solutions (10+)

### 1. Using Old Beta10 HTTP Shim
**Problem:** Code imports from `elide/http/server` which is deprecated.
```typescript
// WRONG (beta10)
import { serve } from "elide/http/server";
serve(handler);
```
**Solution:** Use beta11-rc1 fetch handler pattern.
```typescript
// CORRECT (beta11-rc1)
export default async function fetch(req: Request): Promise<Response> {
  return new Response("OK");
}
```

### 2. Top-Level Console.log in Fetch Handler
**Problem:** Module evaluation issues when console.log is at top level.
**Solution:** Move console.log inside the fetch function.
```typescript
// CORRECT
export default async function fetch(req: Request): Promise<Response> {
  console.log("Request received:", req.url); // Inside function
  return new Response("OK");
}
```

### 3. Missing node: Prefix for Node.js Modules
**Problem:** Imports without `node:` prefix may fail or be ambiguous.
**Solution:** Always use `node:` prefix for Node.js built-ins.
```typescript
import { readFileSync } from 'node:fs'; // CORRECT
import fs from 'fs'; // AVOID
```

### 4. React Version Mismatch
**Problem:** Using React 19 which isn't fully supported.
**Solution:** Use React 18 and react-dom 18.
```bash
elide add react@18 react-dom@18
```

### 5. process.argv Returns Java Array
**Problem:** `process.argv` returns Java array representation, not standard Node array.
**Solution:** Convert to proper array or use alternative detection.
```typescript
// Detect CLI mode
if (import.meta.url.includes("script-name.ts")) {
  // Running as CLI
}
```

### 6. Interactive CLI Prompts
**Problem:** stdin interaction doesn't work as expected.
**Solution:** Use environment variables or flags instead of interactive prompts.

### 7. Expecting Express/Koa Middleware
**Problem:** Express middleware pattern not directly supported.
**Solution:** Use native fetch handler with manual routing.
```typescript
export default async function fetch(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Manual routing
  if (url.pathname === '/api/users') return handleUsers(req);
  if (url.pathname === '/api/posts') return handlePosts(req);

  return new Response("Not Found", { status: 404 });
}
```

### 8. Missing elide.pkl Configuration
**Problem:** Project doesn't have proper Elide configuration.
**Solution:** Create elide.pkl with proper structure.
```pkl
amends "elide:project.pkl"

name = "my-project"
description = "My Elide project"

entrypoint {
  "server.ts"
}
```

### 9. WSGI Not Enabled for Flask/Django
**Problem:** Python web frameworks not working.
**Solution:** Enable WSGI mode.
```bash
elide run --wsgi app.py
```

### 10. Port Conflict Between Patterns
**Problem:** Running Node http and Fetch Handler on same port.
**Solution:** Only one server can bind to a port; use different ports or single server with routing.

### 11. KotlinX Libraries Disabled
**Problem:** kotlinx.serialization or kotlinx.html not available.
**Solution:** Ensure KotlinX is enabled in elide.pkl.
```pkl
kotlin {
  features {
    kotlinx = true
  }
}
```

### 12. Circular Dependencies in Polyglot
**Problem:** Circular imports between languages.
**Solution:** Restructure code to avoid circular dependencies; Truffle handles some cases automatically.

### 13. EventEmitter Not Fully Supported
**Problem:** Node.js EventEmitter behavior may differ.
**Solution:** Use alternative patterns or verify compatibility.

### 14. Package.json exports Field
**Problem:** Not all `exports` configurations are supported.
**Solution:** Use standard import paths or verify with Elide's resolution.

---

## Quick Reference Card

```
# Initialize project
elide init

# Run TypeScript directly
elide run app.ts

# Start HTTP server (default port 8080)
elide serve server.ts

# Start HTTP server on custom port
elide serve server.ts --port 3000

# Run Python WSGI app
elide run --wsgi app.py

# Run with debugging
elide run --inspect file.ts

# Install dependencies
elide install

# Run tests with coverage
elide test --coverage --coverage-format=json

# Build native image
elide native-image -- -O3 -o app MyClass

# Build container
elide jib -- build -t myapp:latest

# View help
elide --help
elide help servers
```

---

*Generated: 2026-01-11*
*Based on Elide beta11-rc1*
