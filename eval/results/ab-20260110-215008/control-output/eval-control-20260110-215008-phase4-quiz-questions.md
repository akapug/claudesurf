# PHASE 4: Elide Expert Quiz Questions Catalog

**Agent:** eval-control-20260110-215008
**Generated:** 2026-01-11
**Source:** /workspace/elided/elide-showcases/showcases/elide-quiz/scorer/questions.md
**Total Questions:** 500 (all multiple choice, 1 point each)

---

## Quiz Metadata

**Answer format:**
- Multiple choice (one answer): Letter only (A, B, C, or D)
- Multiple select (multiple answers): Comma-separated letters with NO SPACES (e.g., "A,C,D")

**Categories:**
1. Runtime & Core (100 questions)
2. CLI Commands (80 questions)
3. Server & HTTP (80 questions)
4. Polyglot Integration (80 questions)
5. Configuration (80 questions)
6. Deployment (80 questions)

---

## Section 1: Runtime & Core (Questions 1-100)

### Easy (Questions 1-40)

**Q1.** Which languages does Elide support natively? (multiple select)
- A. JavaScript & TypeScript
- B. Python 3.11
- C. Java (JDK 24) & Kotlin (K2 v2.2.21)
- D. Ruby

**Q2.** What is Elide built on top of?
- A. V8 and Node.js
- B. GraalVM and Truffle
- C. JVM only
- D. LLVM only

**Q3.** True or False: Elide requires a separate build step for TypeScript.
- A. True
- B. False

**Q4.** What is the key benefit of Elide's polyglot interop?
- A. Requires JSON serialization
- B. Zero-serialization cross-language calls
- C. Only works with JavaScript
- D. Requires separate processes

**Q5.** Which Python version does Elide support?
- A. Python 2.7
- B. Python 3.8
- C. Python 3.11
- D. Python 3.13

**Q6.** What is Elide's unified garbage collector benefit?
- A. Each language has its own GC
- B. Single GC shared across all languages
- C. No garbage collection
- D. Manual memory management required

**Q7.** True or False: Elide can run TSX/JSX without a build step.
- A. True
- B. False

**Q8.** Which JDK version does Elide support?
- A. JDK 11
- B. JDK 17
- C. JDK 21
- D. JDK 24

**Q9.** Which Kotlin version does Elide support?
- A. Kotlin 1.9
- B. Kotlin K2 (v2.2.21)
- C. Kotlin 1.5
- D. Kotlin 3.0

**Q10.** True or False: Elide supports WebAssembly (WASM).
- A. True
- B. False

**Q11.** What is the approximate cold start performance of Elide vs Node.js?
- A. Same speed
- B. 2x faster
- C. 10x faster (~20ms vs ~200ms)
- D. 100x faster

**Q12.** Which statement about Elide's TypeScript support is correct?
- A. Requires tsc compilation first
- B. Runs TypeScript directly with no build step
- C. Only supports JavaScript
- D. Requires Babel

**Q13.** True or False: Elide can import Python modules from TypeScript.
- A. True
- B. False

**Q14.** What does "polyglot" mean in Elide's context?
- A. Multiple programming languages in one runtime
- B. Multiple databases
- C. Multiple servers
- D. Multiple operating systems

**Q15.** Which file extension triggers TSX processing in Elide?
- A. .ts
- B. .tsx
- C. .jsx
- D. Both B and C

**Q16.** True or False: Elide uses a single unified GC across all languages.
- A. True
- B. False

**Q17.** What is the performance benchmark for Elide on Linux (RPS)?
- A. ~10K RPS
- B. ~100K RPS
- C. ~800K RPS
- D. ~1M RPS

**Q18.** Which organization benchmarks Elide independently?
- A. Node.js Foundation
- B. TechEmpower
- C. Mozilla
- D. Google

**Q19.** True or False: Elide requires V8 initialization.
- A. True
- B. False

**Q20.** What is the primary benefit of zero-serialization interop?
- A. Slower performance
- B. No overhead when calling across languages
- C. Requires JSON conversion
- D. Only works with strings

**Q21-Q40.** [Additional Easy Questions covering language features, GraalVM integration, Node.js module compatibility, ESM/CJS support, TypeScript features]

### Medium (Questions 41-80)

**Q41.** How do you import a Python module in TypeScript with Elide?
- A. import py from 'python'
- B. import module from './module.py'
- C. require('python')
- D. Elide.import('module.py')

**Q42.** What is the correct way to detect CLI mode in Elide?
- A. process.argv.length > 2
- B. import.meta.url.includes("script-name.ts")
- C. process.env.CLI === 'true'
- D. Elide.isCLI()

**Q43.** Which KotlinX libraries are included with Elide? (multiple select)
- A. coroutines
- B. datetime
- C. serialization
- D. html

**Q44.** What is the quirk with process.argv in Elide?
- A. Not available
- B. Returns Java array representation
- C. Always empty
- D. Only works in Node mode

**Q45.** How do you disable KotlinX libraries in elide.pkl?
- A. kotlinx = false
- B. kotlin { features { kotlinx = false } }
- C. dependencies { kotlinx = false }
- D. Cannot disable

**Q46-Q80.** [Additional Medium Questions covering Node.js imports, embedded Java tools, TypeScript compilation, React support, async/await, modern JS features, cross-language call performance, GraalVM version]

### Hard (Questions 81-100)

**Q81.** What is the internal mechanism Elide uses for polyglot interop?
- A. JSON-RPC
- B. Truffle language interoperability
- C. JNI
- D. HTTP calls

**Q82.** Which statement about Elide's GraalVM Native Image support is correct?
- A. Not supported
- B. Can compile to native binaries with elide native-image
- C. Only for Java code
- D. Requires separate GraalVM installation

**Q83.** What is the performance implication of Elide's unified GC?
- A. Slower than separate GCs
- B. No cross-language GC overhead
- C. Requires manual tuning
- D. Only works for JavaScript

**Q84-Q100.** [Additional Hard Questions covering TypeScript type erasure, module resolution, Oracle GraalVM recognition, Kotlin annotation processing, KotlinX serialization, source map support, circular dependencies, Python GIL, performance profiling]

---

## Section 2: CLI Commands (Questions 101-180)

### Easy (Questions 101-130)

**Q101.** What command runs a TypeScript file with Elide?
- A. elide execute file.ts
- B. elide run file.ts
- C. elide start file.ts
- D. elide file.ts

**Q102.** What command starts an HTTP server with Elide?
- A. elide server file.ts
- B. elide serve file.ts
- C. elide http file.ts
- D. elide start file.ts

**Q103.** What command starts the Elide REPL?
- A. elide shell
- B. elide repl
- C. elide console
- D. elide interactive

**Q104.** What command initializes a new Elide project?
- A. elide new
- B. elide create
- C. elide init
- D. elide start

**Q105.** What command installs project dependencies?
- A. elide deps
- B. elide install
- C. elide add
- D. elide get

**Q106-Q130.** [Additional Easy CLI Questions covering build, test, version, help, javac, kotlinc, jar, javadoc, native-image, jib, lsp, mcp, which, secrets, completions]

### Medium (Questions 131-160)

**Q131.** How do you run a server with environment variables?
- A. elide serve --env API_KEY=xyz server.ts
- B. API_KEY=xyz elide serve server.ts
- C. Both A and B
- D. elide serve server.ts --env=API_KEY=xyz

**Q132.** How do you enable the Chrome DevTools inspector?
- A. elide run --debug file.ts
- B. elide run --inspect file.ts
- C. elide run --devtools file.ts
- D. elide run --chrome file.ts

**Q133.** How do you suspend execution until debugger attaches?
- A. elide run --inspect:wait file.ts
- B. elide run --inspect:suspend file.ts
- C. elide run --debug:wait file.ts
- D. elide run --pause file.ts

**Q134-Q160.** [Additional Medium CLI Questions covering port specification, test patterns, coverage, build modes, native image options, container options, package managers]

### Hard (Questions 161-180)

**Q161-Q180.** [Hard CLI Questions covering advanced debugging, profiling, multi-language compilation, JVM options, GraalVM native-image flags]

---

## Section 3: Server & HTTP (Questions 181-260)

### Server Handler Patterns

**Q181.** What is the correct HTTP server export pattern in Elide beta11-rc1?
- A. export default async function fetch(request: Request): Promise<Response>
- B. export default { fetch: handleRequest }
- C. module.exports = { fetch }
- D. export function handler(req, res)

**Q182.** Which Request properties are available in Elide?
- A. url, method, headers only
- B. url, method, headers, body, json(), text()
- C. All standard Fetch API Request properties
- D. Custom Elide request object

**Q183.** How do you access query parameters in Elide?
- A. request.query
- B. new URL(request.url).searchParams
- C. request.params
- D. request.getParams()

### Response Patterns

**Q184.** Which Response methods work in Elide?
- A. new Response(body) only
- B. new Response(body, { status, headers })
- C. Response.json(), Response.error(), new Response()
- D. All standard Fetch API Response methods

**Q185-Q260.** [Additional Server Questions covering WebSocket, CORS, streaming, middleware, routing, static files, compression, authentication, rate limiting]

---

## Section 4: Polyglot Integration (Questions 261-340)

### Python Integration

**Q261.** How do you import a Python function in TypeScript?
- A. import { func } from './module.py'
- B. import module from './module.py'; module.func()
- C. const py = require('./module.py')
- D. Elide.python.import('module')

**Q262.** What is the performance overhead of Python-TypeScript calls?
- A. ~100ms (network)
- B. ~10ms (serialization)
- C. <1ms (zero-copy)
- D. Varies

### Java/Kotlin Integration

**Q263.** How do you call Java from TypeScript in Elide?
- A. import { Class } from 'java:package.Class'
- B. Java.type('package.Class')
- C. Both work
- D. Not supported

**Q264-Q340.** [Additional Polyglot Questions covering type conversions, memory sharing, exception handling, async coordination, object lifecycles]

---

## Section 5: Configuration (Questions 341-420)

### elide.pkl Configuration

**Q341.** What is the configuration file format for Elide projects?
- A. elide.json
- B. elide.yaml
- C. elide.pkl
- D. elide.toml

**Q342.** How do you specify the entrypoint in elide.pkl?
- A. main = "server.ts"
- B. entrypoint { "server.ts" }
- C. entry = "server.ts"
- D. start = "server.ts"

**Q343-Q420.** [Additional Configuration Questions covering dependencies, Kotlin features, Python settings, build options, deployment targets]

---

## Section 6: Deployment (Questions 421-500)

### Native Image

**Q421.** What command creates a native binary?
- A. elide build --native
- B. elide native-image
- C. elide compile --aot
- D. elide package --binary

**Q422.** What are the benefits of native image?
- A. Faster cold start, smaller binary
- B. Slower but more compatible
- C. Requires JVM at runtime
- D. Only for Java

### Container Deployment

**Q423.** What tool does Elide use for container builds?
- A. Docker
- B. Buildah
- C. Jib
- D. Kaniko

**Q424-Q500.** [Additional Deployment Questions covering cloud providers, CI/CD, secrets management, scaling, monitoring, health checks]

---

## Question Distribution Summary

| Section | Easy | Medium | Hard | Total |
|---------|------|--------|------|-------|
| Runtime & Core | 40 | 40 | 20 | 100 |
| CLI Commands | 30 | 30 | 20 | 80 |
| Server & HTTP | 30 | 30 | 20 | 80 |
| Polyglot Integration | 30 | 30 | 20 | 80 |
| Configuration | 30 | 30 | 20 | 80 |
| Deployment | 30 | 30 | 20 | 80 |
| **TOTAL** | **190** | **190** | **120** | **500** |

---

## Key Technical Answers Reference

### Core Runtime Facts
- **Languages:** JavaScript, TypeScript, Python 3.11, Java (JDK 24), Kotlin K2 (v2.2.21)
- **Foundation:** GraalVM + Truffle
- **Cold Start:** ~20ms (vs ~200ms Node.js) = 10x faster
- **Performance:** ~800K RPS on Linux (TechEmpower benchmarked)
- **GC:** Unified garbage collector across all languages
- **Interop:** Zero-serialization, <1ms cross-language call overhead

### CLI Commands
- `elide run file.ts` - Run TypeScript/JavaScript
- `elide serve file.ts` - Start HTTP server (default port 8080)
- `elide repl` - Start REPL
- `elide init` - Initialize project
- `elide install` - Install dependencies
- `elide build` - Build project
- `elide test` - Run tests
- `elide javac` - Compile Java
- `elide kotlinc` - Compile Kotlin
- `elide jar` - Create JAR
- `elide native-image` - Build native binary
- `elide jib` - Build container
- `elide lsp` - Start Language Server
- `elide mcp` - Start Model Context Protocol server

### Configuration (elide.pkl)
```pkl
amends "elide:project.pkl"

name = "project-name"

entrypoint {
  "server.ts"
}

kotlin {
  features {
    kotlinx = true  // Enable KotlinX libraries
  }
}
```

### Server Pattern (beta11-rc1)
```typescript
export default async function fetch(request: Request): Promise<Response> {
  const url = new URL(request.url);
  // Handle routes
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### Python Import Pattern
```typescript
// Direct import - zero serialization!
import mlModule from "./model.py";
const result = mlModule.predict([0.5, 0.3, 0.2]);
```

