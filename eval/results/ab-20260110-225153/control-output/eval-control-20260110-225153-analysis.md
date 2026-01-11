# Sequential File Analysis Report
**Agent:** eval-control-20260110-225153
**Started:** 2026-01-11

---

## Step 1: core/lib.rs

**File:** `/workspace/elide-dev/WHIPLASH/crates/core/src/lib.rs`
**Lines:** 50

### Public Items with Line Numbers

| Line | Item | Type | Description |
|------|------|------|-------------|
| 22 | `allocator` | Module | Conditional: Linux musl + mimalloc features |
| 27 | `MiMallocExtern` | Re-export | External allocator type (conditional) |
| 30 | `prelude` | Module | Extended prelude module |
| 35 | `initialize_runtime_with_call` | Function | Initializes runtime with NativeCall, handles JNI context |
| 46 | `initialize_runtime_simple` | Function | Simple initialization without NativeCall |

### Dependencies

- Uses `elidebase::prelude::*` (line 32)
- Uses `#[on_init]` attribute macro (lines 34, 45)

### Key Types Referenced

- `NativeCall` - from elidebase
- `InitResult` - return type for init functions
- `InitStatus::SUCCESS` - initialization status enum

### Notes

- Core crate provides fundamental runtime initialization
- Conditional compilation for allocator on Linux musl targets
- Two initialization paths: with/without JNI context
- Minimal public API surface - this is a foundational crate

---

## Step 2: js/lib.rs

**File:** `/workspace/elide-dev/WHIPLASH/crates/js/src/lib.rs`
**Lines:** 121

### Public Items with Line Numbers

| Line | Item | Type | Description |
|------|------|------|-------------|
| 41 | `jsapi_generate_uuid_v4_string` | Function | JNI binding to generate UUIDv4 strings |
| 47 | `jsapi_free_uuid_v4_string` | Function | JNI binding to free UUIDv4 strings |
| 58 | `precompile` | Function | JNI function to precompile JavaScript/TypeScript |

### Private Modules

| Line | Module | Description |
|------|--------|-------------|
| 31 | `codegen` | Code generation tools for JavaScript |
| 34 | `precompiler` | Pre-compiler implementation |
| 37 | `idgen` | UUID/ULID generation schemes |

### Dependencies

- `elidebase::jni::*` (lines 22-24) - JNI types
- `elidecore::prelude::*` (line 25) - Core prelude
- `elidediag` (line 26) - Diagnostic reporting
- `oxc::span::SourceType` (line 27) - Oxidation compiler source types

### Cross-Reference with Step 1 (core)

| From core | Used in js | How |
|-----------|-----------|-----|
| `prelude` | `elidecore::prelude::*` | Line 25 imports core's prelude |
| `NativeCall` | Line 41, 47 | Used in UUID function signatures |

### Key Types

- `NativeCall` - from elidecore (via prelude)
- `JNIEnv`, `JClass`, `JString` - JNI interop types
- `SourceType` - JavaScript source type (ts, tsx, jsx, mjs, cjs)
- `GeneratorOptions` - code generation configuration
- `CodegenError` - error types (SyntaxErrors, UnrecognizedExtension)

### Notes

- Provides JavaScript/TypeScript tooling via JNI bindings
- Uses Oxidation (oxc) for source parsing
- Supports: TypeScript, TSX, JSX, ESM (mjs), CommonJS (cjs)
- Diagnostic errors reported back to Java through `elidediag`
- `#[bind]` macro binds native functions to Java classes
- `#[jni]` macro creates JNI callable functions

---

## Step 3: http/lib.rs

**File:** `/workspace/elide-dev/WHIPLASH/crates/http/src/lib.rs`
**Lines:** 61

### Public Items with Line Numbers

| Line | Item | Type | Description |
|------|------|------|-------------|
| 14 | `handler` | Module | HTTP request handler abstractions |
| 15 | `request` | Module | HTTP request types |
| 16 | `response` | Module | HTTP response types |
| 17 | `server` | Module | HTTP server implementation |
| 19 | `backend_std` | Module | Standard library backend |
| 22 | `Handler` | Re-export | Handler trait from handler module |
| 23 | `Method`, `Request` | Re-export | HTTP method enum and request type |
| 24 | `Response`, `ResponseWriter`, `StatusCode` | Re-export | Response types |
| 25 | `Server`, `ServerConfig` | Re-export | Server and config types |
| 28 | `Result<T>` | Type alias | HTTP server result type |
| 32 | `Error` | Enum | HTTP server error types |

### Error Variants (lines 34-44)

| Variant | Description |
|---------|-------------|
| `BindFailed` | Failed to bind to specified port |
| `HandlerError` | Handler returned an error |
| `BufferOverflow` | Response buffer overflow |
| `InvalidRequest` | Invalid HTTP request |
| `IoError` | I/O error |
| `Shutdown` | Server shutdown |

### Dependencies

- `elidecore::prelude::Result` (line 28) - Core result type

### Cross-Reference with Steps 1-2

| From crate | Used in http | How |
|------------|-------------|-----|
| core | `elidecore::prelude::Result` | Line 28 - Result type alias |
| js | None | No direct dependency |

### Design Principles (from docs)

1. Zero-copy where possible - Request data borrowed
2. Build-time decisions - Backend selection via cfg/features
3. Callback-oriented - Single handler per server
4. Buffer-based responses - Direct writes to pre-allocated buffers

### Notes

- Minimal, high-performance HTTP server interface
- Primary backend: `faf` (Linux-only)
- Fallback: `backend_std` for other platforms
- Clean public API with re-exports for convenience

---

## Step 4: rpc/lib.rs

**File:** `/workspace/elide-dev/WHIPLASH/crates/rpc/src/lib.rs`
**Lines:** 33

### Public Items with Line Numbers

| Line | Item | Type | Description |
|------|------|------|-------------|
| 14 | `base_capnp` | Module | Generated Cap'n Proto: base types |
| 15 | `cli_capnp` | Module | Generated Cap'n Proto: CLI protocol |
| 16 | `env_capnp` | Module | Generated Cap'n Proto: environment |
| 17 | `url_capnp` | Module | Generated Cap'n Proto: URL types |
| 18 | `http_capnp` | Module | Generated Cap'n Proto: HTTP protocol |
| 19 | `sys_capnp` | Module | Generated Cap'n Proto: system types |
| 20 | `tools_capnp` | Module | Generated Cap'n Proto: tools protocol |
| 21 | `engine_capnp` | Module | Generated Cap'n Proto: engine protocol |
| 22 | `invocation_capnp` | Module | Generated Cap'n Proto: invocation types |
| 23 | `envelope_capnp` | Module | Generated Cap'n Proto: message envelope |
| 25 | `dispatcher` | Module | RPC dispatching logic |
| 26 | `error` | Module | RPC error types |
| 27 | `queue` | Module | RPC message queue |
| 28 | `runtime` | Module | RPC runtime implementation |
| 30 | `RpcDispatcher`, `RpcFrame`, `RpcService` | Re-exports | Dispatcher types |
| 31 | `RpcError`, `RpcErrorCode`, `RpcResult` | Re-exports | Error types |
| 32 | `RpcRuntime` | Re-export | Runtime type |

### Cap'n Proto Protocol Mapping (Protocol Files → Generated Modules)

| Generated Module | Source Protocol File |
|------------------|---------------------|
| `base_capnp` | `protocol/elide/v1/base.capnp` |
| `cli_capnp` | `protocol/elide/v1/cli.capnp` |
| `env_capnp` | `protocol/elide/v1/env.capnp` |
| `url_capnp` | `protocol/elide/v1/url.capnp` |
| `http_capnp` | `protocol/elide/v1/http.capnp` |
| `sys_capnp` | `protocol/elide/v1/sys.capnp` |
| `tools_capnp` | `protocol/elide/v1/tools.capnp` |
| `engine_capnp` | `protocol/elide/v1/engine.capnp` |
| `invocation_capnp` | `protocol/elide/v1/invocation.capnp` |
| `envelope_capnp` | `crates/rpc/schema/envelope.capnp` |

### Cross-Reference with Steps 1-3

| From crate | Used in rpc | How |
|------------|-------------|-----|
| core | Indirect via runtime | RPC runtime likely uses core types |
| js | None | No direct dependency |
| http | `http_capnp` | HTTP protocol definitions for RPC |

### Notes

- Central RPC implementation using Cap'n Proto serialization
- Imports ALL protocol definitions from `protocol/elide/v1/`
- Provides dispatching, error handling, and runtime
- `envelope_capnp` is RPC-specific (in crates/rpc/schema/)
- This crate bridges protocol definitions to runtime usage

---

## Step 5: runtime/lib.rs

**File:** `/workspace/elide-dev/WHIPLASH/crates/runtime/src/lib.rs`
**Lines:** 577

### Public Items with Line Numbers

| Line | Item | Type | Description |
|------|------|------|-------------|
| 89 | `initialize_async_runtime` | Function | Initialize Tokio async runtime for tenant |
| 125 | `obtain_single_tenant_runtime` | Function (unsafe) | Get active single-tenant runtime |
| 136 | `obtain_runtime_handle_for_tenant` | Function (unsafe) | Get runtime by tenant ID |
| 144 | `obtain_single_tenant_runtime_handle_safe` | Function | Safe single-tenant runtime handle |
| 154 | `obtain_runtime_handle_for_tenant_safe` | Function | Safe tenant runtime handle |
| 166 | `obtain_runtime_owned` | Function (unsafe) | Take ownership of runtime |
| 178 | `obtain_runtime_owned_safe` | Function | Safe owned runtime retrieval |
| 193 | `initialize_elide_natives` | Function (JNI bound) | Initialize native libraries |
| 198 | `telemetry_integration` | Module | Telemetry IPC module |
| 219 | `is_sidecar_enabled` | Function | Check if sidecar IPC enabled |
| 232 | `send_to_sidecar_if_available` | Function | Send telemetry via IPC |
| 355 | `create_rpc_runtime` | Function | Create RPC runtime with capacity |
| 369 | `RpcRuntimeHandle` | Struct | RPC runtime wrapper |
| 385 | `create_rpc_runtime_ffi` | Function (JNI bound) | FFI for RPC runtime creation |
| 398 | `destroy_rpc_runtime_ffi` | Function (JNI bound) | FFI for RPC runtime destruction |
| 409 | `next_request_id` | Function (JNI bound) | Get next RPC request ID |
| 415 | `enqueue_request` | Function (JNI bound) | Enqueue RPC request |
| 443 | `dequeue_request` | Function (JNI bound) | Dequeue RPC request |
| 457 | `enqueue_response` | Function (JNI bound) | Enqueue RPC response |
| 485 | `dequeue_response` | Function (JNI bound) | Dequeue RPC response |
| 499 | `pending_requests` | Function (JNI bound) | Get pending request count |
| 505 | `pending_responses` | Function (JNI bound) | Get pending response count |
| 511 | `wait_for_responses` | Function (JNI bound) | Wait for responses with timeout |
| 518 | `poll_response` | Function (JNI bound) | Poll single response |
| 541 | `drain_responses` | Function (JNI bound) | Drain all responses |
| 572 | `shutdown_rpc` | Function (JNI bound) | Shutdown RPC runtime |

### Dependencies (Comprehensive)

| Line | Crate | Alias | Purpose |
|------|-------|-------|---------|
| 20 | `bindings` | - | Native init invocation |
| 21 | `bumpalo` | - | Bump allocator |
| 22 | `elidebase` | _ | Base types |
| 23 | `elidecache` | _ | Caching |
| 24 | `elidecore` | _ | Core types |
| 26 | `elidedb` | _ | Database |
| 27 | `elidediag` | _ | Diagnostics |
| 28 | `elidedns` | DnsService | DNS resolution |
| 29 | `elidejs` | _ | JavaScript |
| 30 | `elidelicensing` | _ | Licensing |
| 31 | `elideo11y` | _ | Observability |
| 32 | `eliderpc` | RpcRuntime | RPC system |
| 33 | `elideterminal` | _ | Terminal |
| 34 | `elidetransport` | _ | Transport layer |
| 35 | `elideweb` | _ | Web server |

### Cross-Reference with ALL Previous Steps

| From crate | Used in runtime | How |
|------------|----------------|-----|
| **core** | `elidecore::prelude::*` (line 25) | Core prelude, NativeCall type |
| **js** | `elidejs` (line 29) | JavaScript integration (used as _) |
| **http** | Indirect via `elideweb` | Web server includes HTTP |
| **rpc** | `eliderpc::RpcRuntime`, `RpcQueues` (lines 32, 371) | RPC dispatch and queue system |

### Key Features

1. **Multi-tenant runtime** (feature-gated lines 44-46, 66-86)
   - Per-tenant Tokio runtimes
   - HashMap-based registry

2. **Telemetry integration** (module lines 198-351)
   - IPC to sidecar via Unix sockets (Linux) or named pipes (Windows)
   - Abstract socket support on Linux
   - MessagePack-encoded events

3. **RPC JNI bindings** (lines 384-576)
   - Complete FFI for Java/JVM integration
   - Request/response queue management
   - Callback-based response handling

### Notes

- **Top-most crate** - links into Native Image engine binary
- Imports ALL other Elide crates (comprehensive integration point)
- Single-tenant vs multi-tenant runtime modes
- Heavy JNI integration via `#[bind]` macro
- Uses `bumpalo` for arena allocation
- Telemetry auto-disables on non-Linux platforms

---

## Step 6: telemetry/lib.rs

**File:** `/workspace/elide-dev/WHIPLASH/crates/telemetry/src/lib.rs`
**Lines:** 933

### Public Items with Line Numbers

| Line | Item | Type | Description |
|------|------|------|-------------|
| 21 | `model` | Module | Telemetry data model |
| 22 | `udp` | Module | UDP telemetry transport |
| 24 | `EmitResult`, `emit_telemetry` | Re-exports | Telemetry emission types |
| 26 | `model::*` | Re-export | All model types |
| 54 | `TELEMETRY_PROTOCOL_VERSION` | Const | Protocol version (= 2) |
| 61 | `GLOBAL_EVENT_OFFSET` | Const | Timestamp baseline (Jan 2026) |
| 88 | `TELEMETRY_METADATA` | Static | Compile-time event metadata |
| 113 | `reset_telemetry_context` | Function | Reset batch context for tenant |
| 190 | `queue_event` | Function | Queue telemetry event (non-blocking) |
| 256 | `create_client` | Function | Create HTTP client for telemetry |
| 331 | `get_client` | Function (async) | Get/create static client |
| 529 | `TelemetryEvent for TelemetryEventData` | Impl | TelemetryEvent trait impl |
| 556 | `obtain_event_id` | Function (async) | Generate event ID |
| 675 | `init_telemetry` | Function | Initialize telemetry subsystem |
| 736 | `create_telemetry_event_data` | Function | Create event data without sending |
| 749 | `telemetry_event` | Function | Record telemetry event |
| 789 | `pending_telemetry_event_count` | Function | Count buffered events |
| 807 | `flush_telemetry_for_tenant` | Function | Flush queued events |
| 831 | `flush_telemetry` | Function | Flush for tenant 0 |
| 836 | `flush_and_wait_for_tenant` | Function (async) | Flush and wait for response |
| 850 | `flush_and_wait` | Function (async) | Flush and wait (tenant 0) |

### Dependencies

| Line | Crate | Purpose |
|------|-------|---------|
| 27-30 | `elidebase::cfg::*` | Build config constants |
| 31 | `elidecore::prelude::*` | Core prelude |
| 32 | `elideo11y::boot_time` | Observability boot time |
| 33 | `elideruntime::obtain_runtime_handle_for_tenant_safe` | Runtime access |
| 34 | `elidetransport::dns::obtain_reqwest_internal_resolver` | DNS resolution |
| 36-37 | `reqwest` | HTTP client |
| 38-43 | `rustls` | TLS configuration |

### Cross-Reference with ALL Previous Steps

| From crate | Used in telemetry | How |
|------------|------------------|-----|
| **core** | `elidecore::prelude::*` (line 31) | Core types |
| **js** | None | No direct dependency |
| **http** | None | Uses reqwest, not elide http |
| **rpc** | None | No direct dependency |
| **runtime** | `obtain_runtime_handle_for_tenant_safe` (line 33) | Tokio runtime access |

### Key Features

1. **Protocol Version** (line 54): Version 2
2. **Multi-transport support**:
   - Sidecar IPC (primary, when available)
   - Encrypted UDP (fallback)
   - HTTP batch (feature-gated)
3. **Multi-tenant support** (feature-gated)
4. **Encoding formats**:
   - MessagePack (`telemetry-msgpack` feature)
   - JSON (`telemetry-json` feature)
5. **HTTP/3 with QUIC** (lines 309-311)
6. **TLS 1.3 with 0-RTT early data** (lines 245-246)
7. **Panic-safe** - All public functions catch panics

### Event Types (from impl)

- `Event::ProgramBoot` - Program startup event
- `Event::ProgramExit` - Program exit event

### Notes

- Extensive panic-catching for fault tolerance
- Uses `fastrand` for event ID generation
- Uses `webpki_roots` for TLS certificates
- Supports both fire-and-forget and wait-for-response delivery
- Compression: brotli, gzip, zstd (long-running mode)

---

