# Sequential File Analysis - eval-test-20260110-225153

**Started:** 2026-01-11
**Total Steps:** 100

---

## Step 1: core/lib.rs

**File:** `/workspace/elide-dev/WHIPLASH/crates/core/src/lib.rs`

### Public Items (with line numbers):

| Line | Item | Type | Description |
|------|------|------|-------------|
| 22 | `allocator` | Module | Mimalloc allocator (conditional: linux+musl, mimalloc features) |
| 27 | `MiMallocExtern` | Re-export | External Mimalloc allocator type |
| 30 | `prelude` | Module | Extended prelude module |
| 35-43 | `initialize_runtime_with_call` | Function | Init runtime with NativeCall, handles JNI context |
| 46-49 | `initialize_runtime_simple` | Function | Simple runtime initialization |

### Dependencies:
- Uses `elidebase::prelude::*` (line 32)
- Uses proc macro `#[on_init]` for initialization functions

### Key Types Used:
- `NativeCall` - from elidebase
- `InitResult` - from elidebase
- `InitStatus::SUCCESS` - from elidebase

### Summary:
Core crate provides fundamental runtime initialization and memory allocation. Conditional compilation for Mimalloc on Linux/musl targets.

---

## Step 2: js/lib.rs

**File:** `/workspace/elide-dev/WHIPLASH/crates/js/src/lib.rs`

### Public Items (with line numbers):

| Line | Item | Type | Description |
|------|------|------|-------------|
| 31 | `codegen` | Module (private) | Code generation tools for JavaScript |
| 34 | `precompiler` | Module (private) | Pre-compiler implementation |
| 37 | `idgen` | Module (private) | WhatWG UUID, ULIDs, ID generation |
| 40-43 | `jsapi_generate_uuid_v4_string` | Function | Generate UUIDv4 (JNI bound) |
| 46-54 | `jsapi_free_uuid_v4_string` | Function | Free UUIDv4 memory (JNI bound) |
| 57-120 | `precompile` | Function | Precompile JS/TS/JSX code (JNI) |

### Dependencies:
- `elidebase::jni::*` - JNI bindings
- `elidecore::prelude::*` - **Core prelude from Step 1**
- `elidediag` - Diagnostic reporting
- `oxc::span::SourceType` - Oxidation compiler

### Cross-Reference with Step 1 (core):
| Type from Core | Usage in JS |
|----------------|-------------|
| `NativeCall` | Used in UUID functions (lines 41, 47) |
| `prelude::*` | Imported at line 25 |

### Key Features:
- JNI integration for Java/Kotlin interop
- JavaScript/TypeScript precompilation via Oxidation (oxc)
- UUID generation (v4)
- Source type detection: TSX, TS, JSX, MJS, CJS

### Summary:
JS crate provides JavaScript/TypeScript tooling with JNI bindings. Depends on core's prelude and NativeCall type.

---

## Step 3: http/lib.rs

**File:** `/workspace/elide-dev/WHIPLASH/crates/http/src/lib.rs`

### Public Items (with line numbers):

| Line | Item | Type | Description |
|------|------|------|-------------|
| 14 | `handler` | Module | HTTP handler abstraction |
| 15 | `request` | Module | Request parsing and types |
| 16 | `response` | Module | Response types and writers |
| 17 | `server` | Module | Server implementation |
| 19 | `backend_std` | Module | Standard backend implementation |
| 22 | `Handler` | Re-export | Handler trait |
| 23 | `Method`, `Request` | Re-export | HTTP method and request types |
| 24 | `Response`, `ResponseWriter`, `StatusCode` | Re-export | Response types |
| 25 | `Server`, `ServerConfig` | Re-export | Server and config types |
| 28 | `Result<T>` | Type alias | HTTP result using elidecore::prelude::Result |
| 31-45 | `Error` | Enum | HTTP error types (BindFailed, HandlerError, etc.) |
| 47-58 | `Display for Error` | Impl | Error display formatting |
| 60 | `std::error::Error for Error` | Impl | Error trait impl |

### Dependencies:
- `elidecore::prelude::Result` (line 28) - **Uses core from Step 1**
- `core::fmt` - Formatting
- `std::error::Error` - Standard error trait

### Cross-Reference with Steps 1-2:
| Source | Type Used | Usage in HTTP |
|--------|-----------|---------------|
| Step 1 (core) | `prelude::Result` | Line 28 - Result type alias |

### Design Principles (from doc comments):
1. Zero-copy where possible
2. Build-time backend selection (no runtime dispatch)
3. Callback-oriented (single handler per server)
4. Buffer-based responses

### Error Types:
- `BindFailed`, `HandlerError`, `BufferOverflow`, `InvalidRequest`, `IoError`, `Shutdown`

### Summary:
HTTP crate provides a minimal, high-performance HTTP server abstraction. Uses core's Result type. Primary backend is `faf` (Linux-only) with std fallback.

---

## Step 4: rpc/lib.rs

**File:** `/workspace/elide-dev/WHIPLASH/crates/rpc/src/lib.rs`

### Public Items (with line numbers):

| Line | Item | Type | Description |
|------|------|------|-------------|
| 14 | `base_capnp` | Module | Cap'n Proto base types |
| 15 | `cli_capnp` | Module | Cap'n Proto CLI types |
| 16 | `env_capnp` | Module | Cap'n Proto environment types |
| 17 | `url_capnp` | Module | Cap'n Proto URL types |
| 18 | `http_capnp` | Module | Cap'n Proto HTTP types |
| 19 | `sys_capnp` | Module | Cap'n Proto system types |
| 20 | `tools_capnp` | Module | Cap'n Proto tools types |
| 21 | `engine_capnp` | Module | Cap'n Proto engine types |
| 22 | `invocation_capnp` | Module | Cap'n Proto invocation types |
| 23 | `envelope_capnp` | Module | Cap'n Proto envelope types |
| 25 | `dispatcher` | Module | RPC dispatcher implementation |
| 26 | `error` | Module | RPC error handling |
| 27 | `queue` | Module | RPC queue implementation |
| 28 | `runtime` | Module | RPC runtime implementation |
| 30 | `RpcDispatcher`, `RpcFrame`, `RpcService` | Re-export | Dispatcher types |
| 31 | `RpcError`, `RpcErrorCode`, `RpcResult` | Re-export | Error types |
| 32 | `RpcRuntime` | Re-export | Runtime type |

### Cap'n Proto Modules (Protocol Buffers):
1. `base_capnp` - Base types
2. `cli_capnp` - CLI communication
3. `env_capnp` - Environment variables
4. `url_capnp` - URL handling
5. `http_capnp` - HTTP protocol types
6. `sys_capnp` - System operations
7. `tools_capnp` - Development tools
8. `engine_capnp` - Runtime engine
9. `invocation_capnp` - Function invocations
10. `envelope_capnp` - Message envelopes

### Cross-Reference with Steps 1-3:
| Source | Relationship | Notes |
|--------|-------------|-------|
| Step 1 (core) | Likely uses prelude | Runtime foundation |
| Step 3 (http) | `http_capnp` relates to HTTP crate | HTTP protocol definitions |

### Key Types:
- `RpcDispatcher` - Dispatches RPC calls
- `RpcFrame` - RPC message frame
- `RpcService` - RPC service abstraction
- `RpcRuntime` - RPC runtime management

### Summary:
RPC crate provides Cap'n Proto-based RPC communication. Generates 10 protocol modules from .capnp files. These protocols will be analyzed in Steps 11-30.

---

## Step 5: runtime/lib.rs

**File:** `/workspace/elide-dev/WHIPLASH/crates/runtime/src/lib.rs`

### Public Items (with line numbers):

| Line | Item | Type | Description |
|------|------|------|-------------|
| 48 | `RUNTIME` | Static | AtomicPtr to Tokio Runtime (single-tenant) |
| 52-63 | `create_runtime` | Function (private) | Creates Tokio multi-thread runtime |
| 67-68 | `RUNTIMES` | Static | Multi-tenant runtime registry (conditional) |
| 71-86 | `get_or_create_tenant` | Function | Get/create tenant runtime (multitenant) |
| 89-118 | `initialize_async_runtime` | Function | Initialize async runtime for tenant |
| 125-129 | `obtain_single_tenant_runtime` | Function (unsafe) | Get single-tenant runtime handle |
| 136-141 | `obtain_runtime_handle_for_tenant` | Function (unsafe) | Get runtime by tenant ID |
| 144-151 | `obtain_single_tenant_runtime_handle_safe` | Function | Safe variant of above |
| 154-159 | `obtain_runtime_handle_for_tenant_safe` | Function | Safe variant for tenant |
| 166-175 | `obtain_runtime_owned` | Function (unsafe) | Pop runtime from map |
| 178-190 | `obtain_runtime_owned_safe` | Function | Safe variant |
| 192-195 | `initialize_elide_natives` | Function | Initialize native libs (JNI) |
| 198-351 | `telemetry_integration` | Module | IPC communication with sidecar |
| 219 | `is_sidecar_enabled` | Function | Check if sidecar is enabled |
| 232-292 | `send_to_sidecar_if_available` | Function | Send telemetry to sidecar |
| 353 | `RPC_RUNTIME` | Static | AtomicPtr to RpcRuntime |
| 355-367 | `create_rpc_runtime` | Function | Create RPC runtime |
| 369-382 | `RpcRuntimeHandle` | Struct | RPC runtime handle with queues |
| 384-396 | `create_rpc_runtime_ffi` | Function | FFI wrapper for RPC runtime creation |
| 398-407 | `destroy_rpc_runtime_ffi` | Function | Destroy RPC runtime (FFI) |
| 409-413 | `next_request_id` | Function | Get next RPC request ID |
| 415-441 | `enqueue_request` | Function | Enqueue RPC request |
| 443-455 | `dequeue_request` | Function | Dequeue RPC request |
| 457-483 | `enqueue_response` | Function | Enqueue RPC response |
| 485-497 | `dequeue_response` | Function | Dequeue RPC response |
| 499-503 | `pending_requests` | Function | Count pending requests |
| 505-509 | `pending_responses` | Function | Count pending responses |
| 511-516 | `wait_for_responses` | Function | Wait for RPC responses |
| 518-539 | `poll_response` | Function | Poll for RPC response |
| 541-570 | `drain_responses` | Function | Drain all RPC responses |
| 572-576 | `shutdown_rpc` | Function | Shutdown RPC runtime |

### Dependencies (imports at lines 19-45):
- `elidebase` - Base utilities
- `elidecache` - Caching
- `elidecore::prelude::*` - **Core prelude (Step 1)**
- `elidedb` - Database
- `elidediag` - Diagnostics
- `elidedns::DnsService` - DNS resolution
- `elidejs` - **JavaScript (Step 2)**
- `elidelicensing` - License management
- `elideo11y` - Observability
- `eliderpc::RpcRuntime` - **RPC (Step 4)**
- `elideterminal` - Terminal
- `elidetransport` - Transport layer
- `elideweb` - Web

### Cross-Reference with Steps 1-4:
| Source | Type Used | Usage in Runtime |
|--------|-----------|------------------|
| Step 1 (core) | `prelude::*`, `NativeCall` | Lines 25, 193, 417, etc. |
| Step 2 (js) | `elidejs` | Line 29 - linked dependency |
| Step 4 (rpc) | `RpcRuntime`, `RpcQueues` | Lines 32, 353-576 |

### Key Features:
1. **Tokio Runtime Management**: Multi-thread, 2 workers, max 1 blocker
2. **Multi-tenant Support**: Optional via `multitenant` feature
3. **Telemetry Integration**: IPC to sidecar via Unix/Windows sockets
4. **RPC Runtime**: Full FFI bindings for RPC queue operations
5. **DNS Integration**: `DnsService` registered with RPC dispatcher

### JNI Bindings:
- `dev.elide.runtime.substrate.NativeLibs::initializeNative`
- `dev.elide.internal.rpc.NativeRpc::*` (12 methods)

### Summary:
Runtime crate is the top-most crate, linking all others. Manages Tokio async runtime, RPC queues, and telemetry sidecar IPC. This is the Native Image binary's entry point.

---

## Step 6: telemetry/lib.rs

**File:** `/workspace/elide-dev/WHIPLASH/crates/telemetry/src/lib.rs`

### Public Items (with line numbers):

| Line | Item | Type | Description |
|------|------|------|-------------|
| 19 | `emit` | Module (private) | Telemetry emission |
| 21 | `model` | Module | Telemetry data models |
| 22 | `udp` | Module | UDP telemetry transport |
| 24 | `EmitResult`, `emit_telemetry` | Re-export | Emission types |
| 26 | `model::*` | Re-export | All model types |
| 54 | `TELEMETRY_PROTOCOL_VERSION` | Const | Protocol version (2) |
| 61 | `GLOBAL_EVENT_OFFSET` | Const | 2026 baseline timestamp |
| 67 | `EVENT_COUNTER` | Static | Atomic event counter |
| 70 | `TELEMETRY_CLIENT` | Static | OnceCell HTTP client |
| 73-77 | `BatchContext` | Struct | Tenant batch context |
| 80 | `SINGLE_TENANT_BATCH_CONTEXT` | Static | Single-tenant context |
| 84-85 | `TENANT_BATCH_CONTEXTS` | Static | Multi-tenant registry |
| 88-101 | `TELEMETRY_METADATA` | Static | Baked-in metadata |
| 104-105 | `PLATFORM_HEADER` | Const | Platform header string |
| 108 | `USER_AGENT_HEADER` | Const | User-agent header |
| 113-137 | `reset_telemetry_context` | Function | Reset tenant context |
| 140-162 | `queue_event_to_context` | Function | Queue event to context |
| 165-183 | `take_batch_context` | Function | Take batch for tenant |
| 190-217 | `queue_event` | Function | Queue telemetry event |
| 224-253 | `build_client_tls_config` | Function | Build TLS config |
| 256-329 | `create_client` | Function | Create HTTP client |
| 331-335 | `get_client` | Function (async) | Get/create client |
| 337-348 | `warm_telemetry_client` | Function (async) | Warm connection |
| 350-405 | Encoding functions | Functions | JSON/msgpack encoding |
| 408-415 | `prepare_request` | Function | Prepare HTTP request |
| 417-464 | `send_batch` | Function (async) | Send event batch |
| 467-526 | `send_batch_fire_and_forget` | Function (async) | Fire-and-forget send |
| 529-554 | `impl TelemetryEvent` | Impl | TelemetryEventData impl |
| 556-558 | `obtain_event_id` | Function (async) | Get random event ID |
| 560-597 | `send_single_event` | Function (async) | Send single event |
| 599-670 | `impl Serialize/Deserialize for Event` | Impl | Event serde |
| 675-733 | `init_telemetry` | Function | Initialize subsystem |
| 736-744 | `create_telemetry_event_data` | Function | Create event data |
| 749-786 | `telemetry_event` | Function | Record telemetry event |
| 789-802 | `pending_telemetry_event_count` | Function | Count pending events |
| 807-828 | `flush_telemetry_for_tenant` | Function | Flush tenant events |
| 831-833 | `flush_telemetry` | Function | Flush tenant 0 events |
| 836-847 | `flush_and_wait_for_tenant` | Function (async) | Flush and wait |
| 850-852 | `flush_and_wait` | Function (async) | Flush and wait (tenant 0) |
| 855-932 | `tests` | Module | Unit tests |

### Dependencies:
- `elidebase::cfg::*` - Configuration constants
- `elidecore::prelude::*` - **Core prelude (Step 1)**
- `elideo11y::boot_time` - Boot time tracking
- `elideruntime::obtain_runtime_handle_for_tenant_safe` - **Runtime (Step 5)**
- `elidetransport::dns` - DNS resolver
- `reqwest` - HTTP client
- `rustls` - TLS client
- `rmp_serde` - MessagePack serialization

### Cross-Reference with Steps 1-5:
| Source | Type Used | Usage in Telemetry |
|--------|-----------|-------------------|
| Step 1 (core) | `prelude::*` | Line 31 |
| Step 5 (runtime) | `obtain_runtime_handle_for_tenant_safe` | Line 33, 764 |

### Key Features:
1. **Dual Transport**: Sidecar IPC (preferred) + UDP fallback
2. **HTTP/3 Support**: QUIC-based telemetry with BBR congestion
3. **Multi-tenant**: Optional batch contexts per tenant
4. **Panic Safety**: All public functions catch panics
5. **Encoding**: MessagePack (preferred) or JSON

### Event Types:
- `ProgramBoot` - Program start event
- `ProgramExit` - Program exit event (duration, code, reason)

### TLS Configuration:
- TLS 1.2/1.3
- aws-lc-rs cipher suites
- Session resumption (12 sessions)
- Early data (0-RTT)

### Summary:
Telemetry crate provides comprehensive telemetry collection with panic-safe APIs, multi-tenant support, and dual HTTP/UDP transport. Uses runtime handles from Step 5.

---

