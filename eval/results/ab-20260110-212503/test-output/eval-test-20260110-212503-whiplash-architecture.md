# Whiplash Architecture Deep Dive (Elide 2.0)

## Overview

Whiplash represents the next generation of Elide, reimagined as a Rust-based runtime that maintains the polyglot philosophy while achieving even better performance, safety, and embeddability. While Elide 1.x is built on GraalVM/JVM, Whiplash takes a ground-up Rust approach with Cap'n Proto for high-performance serialization and native system integration.

---

## Complete Crate Dependency Graph

```
                    ┌─────────────────────────────────────────┐
                    │              elide-cli                   │
                    │         (Command-line Interface)         │
                    └─────────────────┬───────────────────────┘
                                      │
                    ┌─────────────────▼───────────────────────┐
                    │            elide-runtime                 │
                    │    (Orchestration & Engine Management)   │
                    └─────────────────┬───────────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          │                           │                           │
          ▼                           ▼                           ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    elide-js     │       │   elide-python  │       │   elide-wasm    │
│  (V8 Engine)    │       │  (Python 3.x)   │       │ (WebAssembly)   │
└────────┬────────┘       └────────┬────────┘       └────────┬────────┘
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │         elide-core           │
                    │   (Types, Traits, Errors)    │
                    └──────────────┬──────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
          ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   elide-http    │    │    elide-rpc    │    │   elide-codec   │
│   (HTTP/1/2/3)  │    │ (Cap'n Proto)   │    │  (Serialization)│
└────────┬────────┘    └────────┬────────┘    └────────┬────────┘
         │                      │                      │
         └──────────────────────┼──────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │     elide-proto       │
                    │  (Protocol Schemas)   │
                    └───────────────────────┘
```

---

## Crate Descriptions

### Core Layer

| Crate | Purpose | Key Features |
|-------|---------|--------------|
| `elide-core` | Foundation types, traits, errors | Result types, Value types, Engine traits, Error handling |
| `elide-proto` | Protocol definitions | Cap'n Proto schemas, Generated code |
| `elide-codec` | Serialization/deserialization | Binary codecs, Value transformations |

### Engine Layer

| Crate | Purpose | Key Features |
|-------|---------|--------------|
| `elide-js` | JavaScript/TypeScript execution | V8 integration, Module system, TypeScript compilation |
| `elide-python` | Python 3.x execution | Python interpreter, Module system, GIL management |
| `elide-wasm` | WebAssembly execution | WASM runtime, Module loading, Memory management |

### Network Layer

| Crate | Purpose | Key Features |
|-------|---------|--------------|
| `elide-http` | HTTP server/client | HTTP/1, HTTP/2, HTTP/3, TLS, Streaming |
| `elide-rpc` | Remote procedure calls | Cap'n Proto RPC, Bidirectional streaming |

### Application Layer

| Crate | Purpose | Key Features |
|-------|---------|--------------|
| `elide-runtime` | Runtime orchestration | Engine lifecycle, Resource management, Scheduling |
| `elide-cli` | Command-line interface | Commands, Configuration, User interaction |

---

## Data Flow Diagrams

### Request Processing Flow

```
┌──────────┐     ┌──────────┐     ┌───────────┐     ┌──────────┐
│  Client  │────▶│ HTTP/TLS │────▶│  Router   │────▶│  Engine  │
│          │     │  Server  │     │           │     │ (JS/Py)  │
└──────────┘     └──────────┘     └───────────┘     └────┬─────┘
                                                         │
                      ┌──────────────────────────────────┘
                      │
                      ▼
               ┌──────────────┐
               │   Handler    │
               │  Function    │
               └──────┬───────┘
                      │
       ┌──────────────┼──────────────┐
       │              │              │
       ▼              ▼              ▼
┌────────────┐ ┌────────────┐ ┌────────────┐
│  Database  │ │  External  │ │   Cache    │
│   Query    │ │    API     │ │   Lookup   │
└────────────┘ └────────────┘ └────────────┘
       │              │              │
       └──────────────┼──────────────┘
                      │
                      ▼
               ┌──────────────┐
               │   Response   │
               │  Generation  │
               └──────┬───────┘
                      │
                      ▼
               ┌──────────────┐
               │    Client    │
               └──────────────┘
```

### Polyglot Interop Flow

```
┌─────────────────────────────────────────────────────────┐
│                    Elide Runtime                        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                 Shared Memory                    │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐         │   │
│  │  │ JS Obj  │  │ Py Obj  │  │ Shared  │         │   │
│  │  │         │◀─▶│         │◀─▶│  Data  │         │   │
│  │  └─────────┘  └─────────┘  └─────────┘         │   │
│  └─────────────────────────────────────────────────┘   │
│                          ▲                              │
│                          │                              │
│  ┌───────────────────────┼───────────────────────┐     │
│  │                       │                       │     │
│  ▼                       ▼                       ▼     │
│ ┌─────────┐        ┌─────────┐        ┌─────────┐     │
│ │   V8    │        │ Python  │        │  WASM   │     │
│ │ Engine  │        │ Interp  │        │ Runtime │     │
│ └─────────┘        └─────────┘        └─────────┘     │
└─────────────────────────────────────────────────────────┘
```

### Message Passing (Cap'n Proto RPC)

```
┌───────────────────┐                  ┌───────────────────┐
│    Client App     │                  │   Server Engine   │
│                   │                  │                   │
│ ┌───────────────┐ │                  │ ┌───────────────┐ │
│ │ Request Obj   │ │                  │ │ Handler Impl  │ │
│ └───────┬───────┘ │                  │ └───────▲───────┘ │
│         │         │                  │         │         │
│         ▼         │                  │         │         │
│ ┌───────────────┐ │   Zero-Copy      │ ┌───────────────┐ │
│ │ Serialize to  │ │   Transfer       │ │ Deserialize   │ │
│ │ Cap'n Proto   │─┼─────────────────▶│ │ from Bytes    │ │
│ └───────────────┘ │                  │ └───────────────┘ │
│                   │                  │                   │
│                   │◀─────────────────┼─────────────────  │
│ ┌───────────────┐ │   Response       │ ┌───────────────┐ │
│ │ Response Obj  │ │                  │ │ Result Data   │ │
│ └───────────────┘ │                  │ └───────────────┘ │
└───────────────────┘                  └───────────────────┘
```

---

## Cap'n Proto Schema Analysis

### Core Protocol Types (`protocol/elide/v1/base.capnp`)

```capnp
# Core value types for cross-language data exchange
struct Value {
  union {
    null @0 :Void;
    bool @1 :Bool;
    int64 @2 :Int64;
    float64 @3 :Float64;
    text @4 :Text;
    data @5 :Data;
    list @6 :List(Value);
    struct @7 :List(NamedValue);
  }
}

struct NamedValue {
  name @0 :Text;
  value @1 :Value;
}

# Error representation
struct Error {
  code @0 :Int32;
  message @1 :Text;
  details @2 :List(NamedValue);
}
```

### HTTP Protocol Types (`protocol/elide/v1/http.capnp`)

```capnp
# HTTP request/response structures
struct HttpRequest {
  method @0 :Method;
  uri @1 :Text;
  headers @2 :List(Header);
  body @3 :Data;
}

struct HttpResponse {
  status @0 :UInt16;
  headers @1 :List(Header);
  body @2 :Data;
}

struct Header {
  name @0 :Text;
  value @1 :Text;
}

enum Method {
  get @0;
  post @1;
  put @2;
  delete @3;
  patch @4;
  head @5;
  options @6;
}
```

### Engine Protocol Types (`protocol/elide/v1/engine.capnp`)

```capnp
# Engine management and execution
struct ExecuteRequest {
  code @0 :Text;
  language @1 :Language;
  context @2 :List(NamedValue);
  timeout @3 :UInt32;
}

struct ExecuteResponse {
  result @0 :Value;
  logs @1 :List(LogEntry);
  metrics @2 :Metrics;
}

enum Language {
  javascript @0;
  typescript @1;
  python @2;
  wasm @3;
}

struct Metrics {
  executionTimeNs @0 :UInt64;
  memoryUsedBytes @1 :UInt64;
  cpuTimeNs @2 :UInt64;
}
```

---

## Comparison with Elide 1.x

| Aspect | Elide 1.x (GraalVM) | Whiplash (Rust) |
|--------|---------------------|-----------------|
| **Base Platform** | JVM + GraalVM | Native Rust |
| **JS Engine** | Truffle JS (GraalJS) | V8 |
| **Python** | GraalPy (Truffle) | Native Python Interpreter |
| **Memory Model** | JVM Heap + Unified GC | Rust ownership + Arena |
| **Serialization** | None (shared heap) | Cap'n Proto (zero-copy) |
| **Cold Start** | ~20ms | <5ms (target) |
| **Binary Size** | Large (JVM bundled) | Small (native) |
| **Embeddability** | JNI required | Native FFI |
| **Threading** | JVM threads | Tokio async |
| **HTTP Server** | Netty + Micronaut | hyper/axum |
| **Build** | Gradle + GraalVM | Cargo |

### Key Architectural Differences

1. **Polyglot Approach**
   - Elide 1.x: Truffle framework enables zero-serialization through shared AST representation
   - Whiplash: Cap'n Proto provides zero-copy serialization for efficient cross-engine communication

2. **Memory Management**
   - Elide 1.x: Single unified GC across all languages
   - Whiplash: Rust ownership model with explicit memory arenas for shared data

3. **Concurrency Model**
   - Elide 1.x: JVM threading with virtual threads (Loom)
   - Whiplash: Async/await with Tokio runtime

4. **Distribution**
   - Elide 1.x: Single binary with embedded JVM
   - Whiplash: Small native binary with optional engine plugins

---

## Migration Considerations

### From Elide 1.x to Whiplash

1. **HTTP Handlers**
   - Fetch handler pattern remains similar
   - Request/Response types are compatible
   - Streaming API changes slightly

2. **Polyglot Calls**
   - Direct function calls become message-passing
   - Type conversions handled by Cap'n Proto
   - Async boundaries may be introduced

3. **Configuration**
   - `elide.pkl` format evolves but remains Pkl-based
   - New options for engine selection and memory limits

4. **Dependencies**
   - npm dependencies: Fully compatible
   - Python packages: Require native wheels or pure Python
   - Java/Kotlin: Not available in Whiplash (pure JS/Python focus)

### Code Migration Example

```typescript
// Elide 1.x - Direct Python call
import calculator from './calculator.py';
const result = calculator.add(5, 3);

// Whiplash - Message-based call (conceptual)
import { engine } from 'elide:python';
const result = await engine.call('calculator', 'add', [5, 3]);
```

### When to Use Which

| Use Case | Recommendation |
|----------|---------------|
| Java/Kotlin integration needed | Elide 1.x |
| Minimum cold start critical | Whiplash |
| Embedded in existing Rust app | Whiplash |
| Complex polyglot interop | Elide 1.x |
| Edge/serverless deployment | Whiplash |
| Enterprise/legacy integration | Elide 1.x |

---

## Whiplash Roadmap

1. **Phase 1 (Current)**: Core architecture, JS engine, HTTP server
2. **Phase 2**: Python integration, WebAssembly support
3. **Phase 3**: Advanced polyglot patterns, hot reloading
4. **Phase 4**: Production hardening, ecosystem tools

---

*Note: Whiplash is under active development. APIs and architecture may change.*

*Generated: 2026-01-11*
