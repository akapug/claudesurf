# Whiplash Architecture Overview

## What is Whiplash?

Whiplash is **Elide 2.0** — a complete rewrite of the Elide polyglot runtime in Rust. While Elide 1.x is built on GraalVM/Truffle with Kotlin, Whiplash reimagines the architecture using Rust for improved performance, memory safety, and a more modular design.

## Whiplash vs Elide 1.x

| Aspect | Elide 1.x | Whiplash (Elide 2.0) |
|--------|-----------|----------------------|
| **Core Language** | Kotlin/Java | Rust |
| **Runtime Foundation** | GraalVM 25.0.0 + Truffle | Custom Rust runtime |
| **JS Engine** | GraalJS (Truffle) | V8 via rusty_v8 |
| **Memory Model** | JVM GC + Truffle shared heap | Rust ownership + manual management |
| **Build System** | Gradle + Maven | Cargo workspace |
| **Protocol** | Protobuf (gRPC) | Cap'n Proto (zero-copy) |
| **Binary Size** | ~100MB+ (native-image) | Smaller Rust binaries |
| **Startup Time** | ~20ms (native) / ~200ms (JVM) | Target: sub-10ms |
| **Primary Target** | Server-side polyglot | Server + edge + embedded |

## Rust Crate Architecture

The Whiplash workspace is organized into focused, single-responsibility crates:

```
WHIPLASH/
├── Cargo.toml           # Workspace manifest
├── crates/
│   ├── core/            # Foundation types and traits
│   ├── js/              # JavaScript/V8 integration
│   ├── http/            # HTTP server (hyper + tokio)
│   ├── rpc/             # Cap'n Proto RPC layer
│   └── runtime/         # Orchestration and lifecycle
└── protocol/
    └── elide/v1/        # Cap'n Proto schema definitions
```

### Core Crate (`elide-core`)

**Purpose:** Foundation layer with shared types, traits, and utilities.

**Key dependencies:**
- `thiserror` — Error handling
- `tracing` — Structured logging and diagnostics
- `serde` — Serialization framework

**Responsibilities:**
- Common error types (`ElideError`, `RuntimeError`)
- Configuration structures
- Shared traits for language engines
- Utility functions

### JavaScript Crate (`elide-js`)

**Purpose:** JavaScript/TypeScript execution via V8.

**Key dependencies:**
- `rusty_v8` — V8 JavaScript engine bindings
- `deno_core` — Deno's V8 integration utilities
- `swc` — TypeScript transpilation

**Architecture:**
```
┌─────────────────────────────────────────┐
│            TypeScript Source            │
└───────────────────┬─────────────────────┘
                    │ SWC transpile
                    ▼
┌─────────────────────────────────────────┐
│            JavaScript (ES2022)          │
└───────────────────┬─────────────────────┘
                    │ rusty_v8
                    ▼
┌─────────────────────────────────────────┐
│                V8 Engine                │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐  │
│  │Isolates │ │ Contexts │ │ Handles  │  │
│  └─────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────┘
```

**Key components:**
- `JsRuntime` — V8 isolate wrapper
- `JsContext` — Execution context with globals
- Module loader — ES modules and CommonJS support
- TypeScript compiler — On-the-fly transpilation

### HTTP Crate (`elide-http`)

**Purpose:** High-performance HTTP server implementation.

**Key dependencies:**
- `hyper` — HTTP/1.1 and HTTP/2 implementation
- `tokio` — Async runtime
- `tower` — Service composition
- `h3` — HTTP/3 support (optional)
- `rustls` — TLS (alternative to OpenSSL)

**Architecture:**
```
┌────────────────────────────────────────────────────┐
│                   HTTP Server                      │
│  ┌──────────────────────────────────────────────┐  │
│  │              Tower Service Layer             │  │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────────┐  │  │
│  │  │ Routing │ │Middleware│ │Error Handling │  │  │
│  │  └─────────┘ └──────────┘ └───────────────┘  │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │                Hyper Server                   │  │
│  │  ┌────────┐  ┌────────┐  ┌────────────────┐  │  │
│  │  │HTTP/1.1│  │ HTTP/2 │  │ HTTP/3 (h3)    │  │  │
│  │  └────────┘  └────────┘  └────────────────┘  │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │           Tokio Async Runtime                 │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

**Features:**
- Request/Response types compatible with Web Fetch API
- WebSocket support via `tokio-tungstenite`
- Server-Sent Events (SSE)
- TLS with ALPN negotiation
- Connection pooling and keep-alive

### RPC Crate (`elide-rpc`)

**Purpose:** Inter-process and network communication.

**Key dependencies:**
- `capnp` — Cap'n Proto serialization
- `capnp-rpc` — Cap'n Proto RPC runtime
- `tokio` — Async transport

**Why Cap'n Proto over Protobuf:**
- **Zero-copy reads** — No deserialization step
- **In-place access** — Read directly from wire format
- **Time-travel RPC** — Promises and pipelining
- **Smaller messages** — No field tags for fixed schemas

### Runtime Crate (`elide-runtime`)

**Purpose:** Orchestration layer that ties everything together.

**Key dependencies:**
- All internal crates (`elide-core`, `elide-js`, `elide-http`, `elide-rpc`)
- `tokio` — Main async executor
- `tracing-subscriber` — Log output

**Responsibilities:**
- Lifecycle management (init, run, shutdown)
- Language engine coordination
- Resource management
- Signal handling (SIGTERM, SIGINT)
- Metrics and telemetry

## Cap'n Proto Protocol Definitions

Located in `/protocol/elide/v1/`:

### base.capnp — Foundation Types

```capnp
struct Timestamp {
  seconds @0 :Int64;
  nanos @1 :Int32;
}

struct Duration {
  seconds @0 :Int64;
  nanos @1 :Int32;
}

struct Uuid {
  high @0 :UInt64;
  low @1 :UInt64;
}

enum ErrorCode {
  unknown @0;
  internal @1;
  invalidArgument @2;
  notFound @3;
  permissionDenied @4;
  resourceExhausted @5;
  timeout @6;
  cancelled @7;
}

struct Error {
  code @0 :ErrorCode;
  message @1 :Text;
  details @2 :List(KeyValue);
}

struct KeyValue {
  key @0 :Text;
  value @1 :Text;
}
```

### engine.capnp — Language Engine Interface

```capnp
interface Engine {
  # Initialize the engine with configuration
  initialize @0 (config :EngineConfig) -> (result :InitResult);

  # Execute code and return result
  execute @1 (request :ExecuteRequest) -> (response :ExecuteResponse);

  # Evaluate expression and return value
  eval @2 (expression :Text) -> (value :Value);

  # Shutdown the engine gracefully
  shutdown @3 () -> ();
}

struct EngineConfig {
  language @0 :Language;
  memoryLimit @1 :UInt64;
  timeoutMs @2 :UInt32;
  options @3 :List(KeyValue);
}

enum Language {
  javascript @0;
  typescript @1;
  python @2;
  ruby @3;
  wasm @4;
}

struct ExecuteRequest {
  source @0 :Text;
  filename @1 :Text;
  args @2 :List(Value);
}

struct ExecuteResponse {
  union {
    success @0 :Value;
    error @1 :Error;
  }
}
```

### http.capnp — HTTP Types

```capnp
struct HttpRequest {
  method @0 :HttpMethod;
  url @1 :Text;
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

enum HttpMethod {
  get @0;
  post @1;
  put @2;
  delete @3;
  patch @4;
  head @5;
  options @6;
}

interface HttpHandler {
  handle @0 (request :HttpRequest) -> (response :HttpResponse);
}

interface HttpServer {
  start @0 (config :ServerConfig) -> (info :ServerInfo);
  stop @1 () -> ();
  addHandler @2 (path :Text, handler :HttpHandler) -> ();
}

struct ServerConfig {
  host @0 :Text = "127.0.0.1";
  port @1 :UInt16 = 8080;
  tls @2 :TlsConfig;
  http2 @3 :Bool = false;
  http3 @4 :Bool = false;
}
```

## Build System

### Cargo Workspace Structure

```toml
# Root Cargo.toml
[workspace]
resolver = "2"
members = [
    "crates/core",
    "crates/js",
    "crates/http",
    "crates/rpc",
    "crates/runtime",
]

[workspace.package]
version = "2.0.0-alpha"
edition = "2021"
rust-version = "1.75"
license = "MIT OR Apache-2.0"

[workspace.dependencies]
tokio = { version = "1.35", features = ["full"] }
tracing = "0.1"
thiserror = "1.0"
serde = { version = "1.0", features = ["derive"] }
capnp = "0.18"
capnp-rpc = "0.18"
hyper = { version = "1.0", features = ["full"] }
```

### Build Commands

```bash
# Build all crates
cargo build --workspace

# Build release binaries
cargo build --workspace --release

# Run tests
cargo test --workspace

# Build specific crate
cargo build -p elide-runtime

# Generate Cap'n Proto code
capnp compile -o rust protocol/elide/v1/*.capnp

# Build with specific features
cargo build --features "http3,python"

# Cross-compile for Linux
cargo build --target x86_64-unknown-linux-musl

# Profile-guided optimization
RUSTFLAGS="-Cprofile-generate=/tmp/pgo" cargo build --release
# ... run benchmarks ...
RUSTFLAGS="-Cprofile-use=/tmp/pgo" cargo build --release
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       elide-runtime                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   Request Handler                        │    │
│  └───────────────────────┬─────────────────────────────────┘    │
│                          │                                       │
│  ┌───────────────────────▼─────────────────────────────────┐    │
│  │                    elide-http                            │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │              HTTP Request Parsing               │    │    │
│  │  └─────────────────────┬───────────────────────────┘    │    │
│  └────────────────────────┼────────────────────────────────┘    │
│                           │                                      │
│  ┌────────────────────────▼────────────────────────────────┐    │
│  │                     elide-js                             │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │           JavaScript Fetch Handler              │    │    │
│  │  │  export default async function fetch(req) {}    │    │    │
│  │  └─────────────────────┬───────────────────────────┘    │    │
│  └────────────────────────┼────────────────────────────────┘    │
│                           │                                      │
│  ┌────────────────────────▼────────────────────────────────┐    │
│  │                    elide-rpc                             │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │         Cap'n Proto Serialization               │    │    │
│  │  │         (for inter-process calls)               │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    elide-core                            │    │
│  │        Shared types, traits, error handling              │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Migration Path from Elide 1.x

1. **API Compatibility Layer** — Whiplash provides a compatibility shim for Elide 1.x APIs
2. **Fetch Handler Remains** — The `export default function fetch(req)` pattern works in both
3. **elide.pkl Support** — Same project configuration format
4. **CLI Compatibility** — `elide run`, `elide serve` commands remain consistent

## Future Roadmap

- **Edge Deployment** — WASM compilation target for Cloudflare Workers, Deno Deploy
- **Embedded Use** — Library mode for embedding in larger applications
- **Additional Languages** — Python (RustPython), Ruby (Artichoke)
- **Distributed Runtime** — Multi-node execution with Cap'n Proto RPC
- **Plugin System** — Dynamic loading of language engines
