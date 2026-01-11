# WHIPLASH Architecture (Elide 2.0)

## Overview

WHIPLASH is the Rust-based rewrite of the Elide runtime, designed for maximum performance, safety, and extensibility. It represents the next generation of polyglot runtime technology.

## Project Structure

```
WHIPLASH/
├── Cargo.toml              # Workspace configuration
├── crates/
│   ├── core/               # Core runtime functionality
│   ├── js/                 # JavaScript engine integration
│   ├── http/               # HTTP server implementation
│   ├── rpc/                # RPC protocol support
│   └── runtime/            # Unified runtime orchestration
├── protocol/               # Cap'n Proto schema definitions
│   └── elide/v1/
│       ├── base.capnp      # Base types and utilities
│       └── http.capnp      # HTTP protocol definitions
└── docs/
    └── telemetry-protocol.md  # Telemetry specification
```

## Crate Architecture

### elide-core
**Purpose**: Foundational types, utilities, and shared functionality

**Key Components**:
- Memory management abstractions
- Error handling infrastructure
- Configuration system
- Logging and diagnostics
- Plugin architecture foundation

```rust
// Core provides fundamental building blocks
pub mod config;
pub mod error;
pub mod memory;
pub mod plugin;
```

### elide-js
**Purpose**: JavaScript/TypeScript execution engine

**Capabilities**:
- V8 or alternative JS engine integration
- TypeScript transpilation support
- Module loading and resolution
- JavaScript standard library

**Integration Points**:
- Foreign function interface (FFI)
- Cross-language value marshaling
- Async runtime integration

### elide-http
**Purpose**: High-performance HTTP server implementation

**Features**:
- Async I/O with tokio
- HTTP/1.1 and HTTP/2 support
- WebSocket capabilities
- Request/Response streaming
- TLS termination

**Architecture**:
```rust
// HTTP layer architecture
pub struct HttpServer {
    listener: TcpListener,
    router: Router,
    middleware: MiddlewareStack,
}

// Fetch handler pattern support
pub trait FetchHandler: Send + Sync {
    async fn fetch(&self, request: Request) -> Response;
}
```

### elide-rpc
**Purpose**: Remote procedure call support

**Protocols**:
- Cap'n Proto RPC
- gRPC compatibility layer
- Custom binary protocols

**Features**:
- Bi-directional streaming
- Service discovery
- Load balancing hooks

### elide-runtime
**Purpose**: Orchestration layer unifying all components

**Responsibilities**:
- Language runtime lifecycle management
- Resource pooling and scheduling
- Cross-language call coordination
- Telemetry collection

```rust
// Runtime orchestration
pub struct ElideRuntime {
    js_engine: JsEngine,
    http_server: HttpServer,
    rpc_server: Option<RpcServer>,
    config: RuntimeConfig,
}
```

## Protocol Definitions

### base.capnp
Defines fundamental types used across the system:

```capnp
@0x...; # Unique file ID

struct Timestamp {
  seconds @0 :Int64;
  nanos @1 :Int32;
}

struct Duration {
  seconds @0 :Int64;
  nanos @1 :Int32;
}

struct Error {
  code @0 :Int32;
  message @1 :Text;
  details @2 :Data;
}

struct Metadata {
  entries @0 :List(Entry);
  struct Entry {
    key @0 :Text;
    value @1 :Text;
  }
}
```

### http.capnp
HTTP protocol definitions:

```capnp
@0x...; # Unique file ID

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
```

## Telemetry System

### Collection Points
1. **Request metrics**: Latency, status codes, bytes transferred
2. **Runtime metrics**: Memory usage, GC events, thread counts
3. **Language metrics**: Per-language execution time, call counts

### Protocol Format
```json
{
  "timestamp": "2026-01-10T12:00:00Z",
  "event_type": "http_request",
  "trace_id": "abc123",
  "span_id": "def456",
  "metrics": {
    "duration_ms": 15,
    "status_code": 200,
    "bytes_in": 1024,
    "bytes_out": 4096
  }
}
```

### Export Destinations
- OpenTelemetry collectors
- Prometheus endpoints
- Custom telemetry sinks

## Build System

### Cargo Workspace
```toml
[workspace]
members = [
    "crates/core",
    "crates/js",
    "crates/http",
    "crates/rpc",
    "crates/runtime",
]

[workspace.dependencies]
tokio = { version = "1.35", features = ["full"] }
capnp = "0.18"
tracing = "0.1"
```

### Build Commands
```bash
# Development build
cargo build

# Release build with optimizations
cargo build --release

# Run tests
cargo test --workspace

# Run specific crate
cargo run -p elide-runtime
```

## Migration Path from GraalVM Elide

### Compatibility Layer
WHIPLASH maintains API compatibility with current Elide:
- Same Fetch Handler pattern
- Same `elide.pkl` configuration
- Same CLI commands (wrapped)

### Gradual Migration
1. Phase 1: HTTP layer migration
2. Phase 2: JavaScript engine replacement
3. Phase 3: Polyglot bridge implementation
4. Phase 4: Full runtime replacement

## Performance Targets

| Metric | GraalVM Elide | WHIPLASH Target |
|--------|---------------|-----------------|
| Cold Start | ~20ms | <10ms |
| RPS (Linux) | ~800K | >1M |
| Memory Baseline | ~50MB | <30MB |
| Binary Size | ~100MB | <20MB |

## Security Model

### Sandboxing
- Process isolation for untrusted code
- Capability-based permissions
- Resource limits enforcement

### Memory Safety
- Rust's ownership model prevents memory bugs
- No undefined behavior in core code
- Safe FFI boundaries

## Extensibility

### Plugin System
```rust
pub trait ElidePlugin: Send + Sync {
    fn name(&self) -> &str;
    fn on_load(&mut self, runtime: &ElideRuntime) -> Result<()>;
    fn on_request(&self, req: &Request) -> Option<Response>;
    fn on_unload(&mut self) -> Result<()>;
}
```

### Language Adapters
New language support through adapters:
```rust
pub trait LanguageAdapter: Send + Sync {
    fn language_id(&self) -> &str;
    fn execute(&self, code: &str) -> Result<Value>;
    fn call_function(&self, name: &str, args: &[Value]) -> Result<Value>;
}
```

## Development Status

- **elide-core**: Foundational work complete
- **elide-http**: Basic implementation in progress
- **elide-js**: Engine integration underway
- **elide-rpc**: Protocol definitions complete
- **elide-runtime**: Architecture defined

---

*Generated by Elide Expert Analysis - eval-control-20260110-212503*
