# PHASE 5: Cross-Reference Analysis

**Agent:** eval-control-20260110-215008
**Generated:** 2026-01-11

---

## Overview

This document provides cross-references between all catalogued components:
- 22 Whiplash Rust crates
- 18 Protocol definitions (.capnp, .proto)
- 17+ Showcases (partial)
- 500 Quiz questions

---

## 1. Crate → Protocol Mapping

| Crate | Cap'n Proto | Protocol Buffers | Purpose |
|-------|-------------|------------------|---------|
| cli | cli.capnp | cli.proto | CLI argument parsing, commands |
| http | http.capnp | http.proto | HTTP request/response handling |
| runtime | engine.capnp, invocation.capnp | engine.proto, invocation.proto | Runtime engine configuration |
| transport | url.capnp | url.proto | URL parsing and networking |
| sys | sys.capnp | sys.proto | System paths, ports, sockets |
| base | base.capnp | base.proto | Base types, app environment |
| bindings | tools.capnp | tools.proto | JNI/native bindings, embedded tools |

---

## 2. Protocol → Showcase Mapping

| Protocol Concept | Related Showcases |
|-----------------|-------------------|
| HTTP Request/Response | api-gateway, analytics-engine, access-control-service |
| Engine Invocation | ai-agent-framework, ml-model-serving |
| CLI Commands | distributed-tracing, event-sourcing |
| Tool Invocation | ai-code-generator, microservices-polyglot |
| System Paths/Ports | edge-computing, real-time-analytics-engine |

---

## 3. Crate → Showcase Feature Mapping

### Core Infrastructure Crates

| Crate | Lines | Key Feature | Showcases Using This |
|-------|-------|-------------|---------------------|
| runtime | 577 | RPC, FFI, polyglot dispatch | All showcases |
| telemetry | 933 | HTTP/3, msgpack, UDP telemetry | analytics-engine, distributed-tracing |
| db | 942 | SQLite JNI bindings | data-pipeline, event-sourcing |
| http | 128 | Request/response handling | api-gateway, ml-model-serving |
| transport | 27 | IPC, URL, DNS | microservices-polyglot |

### Language Binding Crates

| Crate | Lines | Target Language | Showcases Demonstrating |
|-------|-------|-----------------|------------------------|
| bindings | 475 | JVM (JNI) | All polyglot showcases |
| js | 19 | JavaScript/TypeScript | All TypeScript showcases |
| macros | 577 | Rust proc macros | Internal infrastructure |

---

## 4. Quiz → Crate Knowledge Mapping

| Quiz Section | Related Crates | Key Concepts |
|--------------|----------------|--------------|
| Runtime & Core (Q1-100) | runtime, base, core | GraalVM, Truffle, polyglot |
| CLI Commands (Q101-180) | cli | elide run, serve, build |
| Server & HTTP (Q181-260) | http, transport | Fetch API, Request/Response |
| Polyglot Integration (Q261-340) | bindings, js | Python import, JNI |
| Configuration (Q341-420) | builder | elide.pkl |
| Deployment (Q421-500) | sidecar, cache | native-image, containers |

---

## 5. Showcase Pattern Analysis

### Pattern: Polyglot ML/AI
**Showcases:** ml-model-serving, ai-agent-framework, recommendation-engine, real-time-analytics-engine
**Common Code Pattern:**
```typescript
// Import Python ML module directly
import mlModule from "./model.py";
const result = mlModule.predict(data);  // <1ms overhead
```
**Related Crates:** bindings, runtime, js

### Pattern: Microservices Architecture
**Showcases:** api-gateway, microservices-polyglot, distributed-tracing
**Common Code Pattern:**
```typescript
const serviceRegistry: ServiceEndpoint[] = [
  { name: 'user-service', language: 'typescript', ... },
  { name: 'recommendation-service', language: 'python', ... },
];
```
**Related Crates:** http, transport, rpc

### Pattern: Event-Driven Systems
**Showcases:** event-sourcing, circuit-breaker-polyglot, real-time-analytics-engine
**Common Code Pattern:**
```typescript
class EventStore {
  private events: Map<string, Event[]> = new Map();
  async appendEvent(event: Event): Promise<void> { ... }
  async rehydrateAggregate(...): Promise<AggregateRoot> { ... }
}
```
**Related Crates:** db, telemetry, o11y

### Pattern: Edge Computing
**Showcases:** edge-computing, api-gateway
**Common Code Pattern:**
```typescript
export default { fetch: handleRequest };
// ~20ms cold start, 10x faster than Node.js
```
**Related Crates:** runtime, http

---

## 6. Protocol Type Cross-Reference

### Shared Types Across Protocols

| Type | Defined In | Used In |
|------|------------|---------|
| AppEnvironment | base.capnp | engine.capnp, invocation.capnp |
| FilePath | sys.capnp | invocation.capnp |
| Port | sys.capnp | invocation.capnp |
| Socket | sys.capnp | invocation.capnp |
| HttpRequest | http.capnp | invocation.capnp |
| Argument | cli.capnp | tools.capnp, invocation.capnp |
| EnvironmentMap | env.capnp | invocation.capnp |

### Protocol Dependency Graph
```
base.capnp ─────────────────────────────┐
                                        ▼
cli.capnp ──────────────────────► invocation.capnp
                                        ▲
env.capnp ──────────────────────────────┤
                                        │
sys.capnp ──────────────────────────────┤
                                        │
http.capnp ─────────────────────────────┤
                                        │
engine.capnp ───────────────────────────┤
                                        │
tools.capnp ────────────────────────────┘
```

---

## 7. Performance Benchmarks Cross-Reference

### From Showcases
| Showcase | Metric | Value |
|----------|--------|-------|
| real-time-analytics-engine | Throughput | 50K+ events/sec |
| real-time-analytics-engine | Query P95 | 42ms |
| recommendation-engine | Latency | <50ms |
| crypto-trading-bot | Strategy execution | 6.5ms |
| edge-computing | Cold start | ~20ms |

### From Quiz (Expected Answers)
| Question | Metric | Expected Value |
|----------|--------|----------------|
| Q11 | Cold start vs Node | 10x faster (~20ms vs ~200ms) |
| Q17 | Linux RPS | ~800K RPS |
| Q59 | Cross-language call | <1ms overhead |
| Q98 | Java-TypeScript call | <1ms (zero-serialization) |

---

## 8. Language Support Matrix

| Language | Crate Support | Protocol Support | Showcase Coverage |
|----------|---------------|------------------|-------------------|
| TypeScript | js, runtime | All .capnp/.proto | All 17 showcases |
| Python 3.11 | bindings, runtime | Via polyglot | ml-model-serving, recommendation-engine |
| Java JDK 24 | bindings, db | Java annotation | Access via polyglot |
| Kotlin K2 | bindings | Kotlin annotation | kotlinx.* libraries |
| Rust | All crates | Native implementation | WHIPLASH infrastructure |

---

## 9. File Extension Mapping

| Extension | Handler Crate | Protocol | Showcase Example |
|-----------|---------------|----------|------------------|
| .ts | js | - | All showcases |
| .tsx | js | - | ai-art-gallery |
| .py | bindings | - | ml-model-serving |
| .java | bindings | - | Via embedded javac |
| .kt | bindings | - | Via embedded kotlinc |
| .pkl | builder | - | All with elide.pkl |
| .capnp | macros | Cap'n Proto | WHIPLASH protocols |
| .proto | macros | Protocol Buffers | WHIPLASH protocols |

---

## 10. Key Technical Correlations

### Polyglot Interop Chain
```
Quiz Q4 (Zero-serialization)
  ↓ Implemented by
Crate: bindings (NativeCall, NativeBinding)
  ↓ Used in
Protocol: invocation.capnp (EngineInvocation)
  ↓ Demonstrated by
Showcase: ml-model-serving (import from .py)
```

### Server Architecture Chain
```
Quiz Q181 (HTTP server export)
  ↓ Defined in
Crate: http (HttpRequest, HttpResponse)
  ↓ Protocol
http.capnp (HttpRequest, HttpResponse structs)
  ↓ Used in
Showcase: api-gateway, analytics-engine
```

### Performance Chain
```
Quiz Q11, Q17 (Cold start, RPS)
  ↓ Enabled by
Crate: runtime (GraalVM integration)
  ↓ Benchmarked in
Showcase: real-time-analytics-engine (54K events/sec)
```

