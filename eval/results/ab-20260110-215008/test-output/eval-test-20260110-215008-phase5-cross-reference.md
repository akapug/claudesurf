# Phase 5: Cross-Reference Analysis

Generated: 2026-01-11

This document connects all components from Phases 1-4:
- 22 Whiplash Rust crates
- 18 Protocol definitions (9 .proto + 9 .capnp pairs)
- 216 Elide showcases
- 500 Quiz questions

---

## 1. Crate → Protocol Mapping

| Crate | Primary Protocols | Description |
|-------|-------------------|-------------|
| **whiplash-rpc** | All .capnp files | Cap'n Proto RPC codegen |
| **whiplash-http** | http.proto, http.capnp | HTTP request/response handling |
| **whiplash-cli** | cli.proto, cli.capnp | CLI argument/command structures |
| **whiplash-runtime** | invocation.proto, invocation.capnp | Engine invocation |
| **whiplash-sys** | sys.proto, sys.capnp | System call info |
| **whiplash-base** | base.proto, base.capnp | Protocol version, app environment |
| **whiplash-web** | http.proto, url.proto | URL/HTTP handling |
| **whiplash-bindings** | engine.capnp, tools.capnp | Native bindings & tool definitions |

### Detailed Protocol Usage

#### base.proto / base.capnp
```
Used by: whiplash-base, whiplash-core
Messages: ProtocolVersion, AppEnvironment
Purpose: Fundamental protocol definitions
```

#### cli.proto / cli.capnp
```
Used by: whiplash-cli
Messages: Argument, CliCommand
Purpose: Command-line parsing structures
```

#### http.proto / http.capnp
```
Used by: whiplash-http, whiplash-web
Messages: HttpRequest, HttpResponse, Headers
Purpose: HTTP request/response serialization
```

#### invocation.proto / invocation.capnp
```
Used by: whiplash-runtime, whiplash-core
Messages: EngineInvocation, ExecutionContext
Purpose: Runtime invocation handling
```

---

## 2. Crate → Showcase Mapping

| Crate | Related Showcases | How Connected |
|-------|-------------------|---------------|
| **whiplash-http** | api-gateway, realtime-dashboard, ml-api | HTTP server functionality |
| **whiplash-runtime** | All showcases | Core execution runtime |
| **whiplash-bindings** | java-spring-bridge, python-* showcases | Native language bindings |
| **whiplash-rpc** | grpc-polyglot, grpc-service-mesh | RPC communication |
| **whiplash-db** | database-orm, elide-db | Database operations |
| **whiplash-cache** | ml-api (LRU cache), analytics-engine | Caching layer |
| **whiplash-telemetry** | distributed-tracing, metrics-aggregation-service | Observability |
| **whiplash-dns** | edge-cdn, edge-api-proxy | DNS resolution |
| **whiplash-transport** | websocket-scaling, real-time-collaboration | Transport protocols |

### Showcase Categories by Crate Dependency

#### HTTP-Heavy Showcases (whiplash-http)
- api-gateway
- api-gateway-advanced
- graphql-federation
- grpc-polyglot
- rate-limiting-polyglot
- circuit-breaker-polyglot

#### Runtime-Heavy Showcases (whiplash-runtime)
- ai-agent-framework
- llm-inference-server
- polyglot-ml-pipeline
- wasm-polyglot-bridge

#### Bindings-Heavy Showcases (whiplash-bindings)
- java-spring-bridge
- java-spring-integration
- python-django-integration
- kotlin-analytics-platform
- ruby-rails-patterns

---

## 3. Protocol → Showcase Mapping

| Protocol | Showcases Using It | Use Case |
|----------|-------------------|----------|
| **http.proto** | All HTTP showcases (100+) | Request/response handling |
| **invocation.proto** | polyglot showcases | Cross-language calls |
| **engine.capnp** | ai-agent-framework, llm-* | Engine tool registration |
| **tools.capnp** | cline-llm-gateway, continue-code-assist | Tool definitions |
| **cli.proto** | devops-tools, testing-framework | CLI command structures |

---

## 4. Quiz Question → Crate Mapping

| Quiz Section | Related Crates | Question Count |
|--------------|----------------|----------------|
| Runtime & Core | whiplash-runtime, whiplash-core, whiplash-base | 100 |
| CLI Commands | whiplash-cli | 80 |
| HTTP & Servers | whiplash-http, whiplash-web, whiplash-transport | 80 |
| Projects & Dependencies | N/A (Elide layer) | 60 |
| Polyglot | whiplash-bindings, whiplash-js | 50 |
| Testing & Build | whiplash-builder | 40 |
| Beta11 Features | whiplash-http (native HTTP) | 50 |
| Advanced Topics | whiplash-telemetry, whiplash-o11y | 40 |

### Key Quiz Topics by Crate

#### whiplash-runtime (100+ questions)
- Q1-Q40: Language support, GraalVM, Truffle
- Q81-Q100: Polyglot internals, GC, memory model
- Q321-Q370: Cross-language calls, type sharing

#### whiplash-http (80+ questions)
- Q181-Q260: HTTP servers, patterns, performance
- Q411-Q460: Beta11 native HTTP features

#### whiplash-cli (80 questions)
- Q101-Q180: All CLI commands and flags

#### whiplash-bindings (50+ questions)
- Q321-Q370: Polyglot interop
- Q356-Q370: Advanced polyglot topics

---

## 5. Quiz Question → Showcase Mapping

| Quiz Question Range | Related Showcases |
|--------------------|-------------------|
| Q1-Q20 (Languages) | api-gateway, polyglot-examples |
| Q41-Q60 (Python Import) | ml-api, flask-typescript-polyglot |
| Q101-Q130 (Basic CLI) | All showcases |
| Q181-Q210 (HTTP Basics) | api-gateway, realtime-dashboard |
| Q211-Q240 (HTTP Patterns) | node-http-basic, flask-typescript-polyglot |
| Q261-Q320 (Dependencies) | All showcases with elide.pkl |
| Q321-Q370 (Polyglot) | polyglot-ml-pipeline, java-spring-bridge |
| Q371-Q410 (Testing) | testing-framework, polyglot-testing-framework |
| Q411-Q460 (Beta11) | 22 converted showcases |
| Q461-Q500 (Advanced) | realtime-dashboard, distributed-tracing |

### Specific Question → Showcase Cross-References

| Question | Showcase | Connection |
|----------|----------|------------|
| Q4 (Zero-serialization) | flask-typescript-polyglot | Demonstrates <1ms cross-language calls |
| Q17 (800K RPS) | api-gateway | High-performance HTTP |
| Q41 (Python import) | ml-api | `import module from './module.py'` |
| Q181 (Default port 8080) | All HTTP showcases | Standard port |
| Q196 (Fetch Handler) | realtime-dashboard | Recommended pattern |
| Q220 (Flask + WSGI) | flask-typescript-polyglot | Python web framework |
| Q228 (22 converted showcases) | BETA11_MIGRATION_GUIDE | Migration count |
| Q324 (<1ms overhead) | ml-api | Performance benchmark |

---

## 6. Showcase → Protocol + Crate Matrix

| Showcase | Protocols Used | Crates Involved |
|----------|---------------|-----------------|
| **api-gateway** | http.proto, base.proto | whiplash-http, whiplash-runtime |
| **ml-api** | http.proto, invocation.proto | whiplash-http, whiplash-runtime, whiplash-bindings |
| **realtime-dashboard** | http.proto, sys.proto | whiplash-http, whiplash-sys, whiplash-telemetry |
| **grpc-polyglot** | All protos | whiplash-rpc, whiplash-http |
| **blockchain-indexer** | http.proto, base.proto | whiplash-http, whiplash-db |
| **ai-agent-framework** | engine.capnp, tools.capnp | whiplash-runtime, whiplash-bindings |

---

## 7. Technology Stack Cross-Reference

### By Language Support

| Language | Crate | Protocols | Showcases | Quiz Qs |
|----------|-------|-----------|-----------|---------|
| TypeScript | whiplash-js | http.proto | 200+ | 100+ |
| Python | whiplash-bindings | invocation.proto | 35 | 50+ |
| Java | whiplash-bindings | engine.capnp | 15 | 30+ |
| Kotlin | whiplash-bindings | engine.capnp | 5 | 20+ |
| Ruby | whiplash-bindings | - | 10 | 5+ |
| WASM | whiplash-runtime | - | 2 | 5+ |

### By Feature Area

| Feature | Crates | Showcases | Quiz Qs |
|---------|--------|-----------|---------|
| HTTP Serving | whiplash-http, whiplash-web | 100+ | 80 |
| Polyglot | whiplash-bindings, whiplash-runtime | 50+ | 50 |
| Caching | whiplash-cache | 20+ | 10 |
| Telemetry | whiplash-telemetry, whiplash-o11y | 10+ | 15 |
| Database | whiplash-db | 15+ | 10 |
| Transport | whiplash-transport | 15+ | 10 |

---

## 8. Architecture Dependency Graph

```
                    ┌─────────────────┐
                    │  whiplash-core  │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐        ┌─────▼────┐        ┌─────▼────┐
    │  base   │        │ runtime  │        │ bindings │
    └────┬────┘        └────┬─────┘        └────┬─────┘
         │                  │                   │
    ┌────▼────┐        ┌────▼─────┐        ┌────▼─────┐
    │  http   │        │   rpc    │        │    js    │
    └────┬────┘        └────┬─────┘        └──────────┘
         │                  │
    ┌────▼────┐        ┌────▼─────┐
    │   web   │        │transport │
    └─────────┘        └──────────┘
```

### Protocol Flow

```
.proto/.capnp files
        │
        ▼
whiplash-rpc (codegen)
        │
        ▼
Generated Rust types
        │
        ▼
whiplash-* crates (consumers)
        │
        ▼
Elide Runtime (JNI bindings)
        │
        ▼
Showcases (TypeScript/Python/Java)
```

---

## 9. Knowledge Graph Summary

### Core Concepts → All Layers

| Concept | Crate(s) | Protocol(s) | Showcase(s) | Quiz Q# |
|---------|----------|-------------|-------------|---------|
| GraalVM Runtime | whiplash-runtime | invocation.capnp | All | Q2, Q78 |
| Zero-serialization | whiplash-bindings | - | ml-api | Q4, Q98 |
| Fetch Handler | whiplash-http | http.proto | realtime-dashboard | Q196 |
| WSGI | whiplash-bindings | - | flask-typescript-polyglot | Q199 |
| Native HTTP | whiplash-http | http.proto | All HTTP | Q191 |
| ~800K RPS | whiplash-http | - | api-gateway | Q17, Q189 |
| Cold Start | whiplash-runtime | - | All | Q11, Q26 |

---

## 10. Implementation Patterns Across Layers

### Pattern: HTTP Server

**Crate:** whiplash-http
**Protocol:** http.proto (HttpRequest, HttpResponse)
**Showcases:** api-gateway, realtime-dashboard
**Quiz:** Q181-Q260

```
Fetch Handler Pattern (Beta11+):
export default async function fetch(req: Request): Promise<Response> {
  return new Response("OK");
}
```

### Pattern: Polyglot Import

**Crate:** whiplash-bindings
**Protocol:** invocation.capnp
**Showcases:** ml-api, flask-typescript-polyglot
**Quiz:** Q41, Q321-Q335

```
import analyzer from './analyzer.py';
const result = analyzer.analyze(text);
```

### Pattern: CLI Command

**Crate:** whiplash-cli
**Protocol:** cli.proto (Argument, CliCommand)
**Showcases:** devops-tools
**Quiz:** Q101-Q180

```
elide serve --port=8080 server.ts
```

### Pattern: Native Bindings

**Crate:** whiplash-bindings
**Protocol:** engine.capnp (NativeBinding)
**Showcases:** java-spring-bridge
**Quiz:** Q86-Q91

```rust
#[bind]
pub fn process_request(data: &[u8]) -> Vec<u8> { ... }
```

---

## 11. Completeness Metrics

| Component | Total Items | Documented | Coverage |
|-----------|-------------|------------|----------|
| Rust Crates | 22 | 22 | 100% |
| Protocol Files | 18 | 18 | 100% |
| Showcases | 216 | 216 (categorized), 6 (detailed) | 100% |
| Quiz Questions | 500 | 500 | 100% |
| Cross-References | - | 50+ mappings | Extensive |

---

## 12. Navigation Index

### By Entry Point

**If you're exploring:**
- **Rust internals** → Start with Phase 1 (Crate Catalog)
- **Protocol definitions** → Start with Phase 2 (Protocols)
- **Application patterns** → Start with Phase 3 (Showcases)
- **Knowledge testing** → Start with Phase 4 (Quiz)
- **System understanding** → Use this Phase 5 document

### Quick Lookups

**Find crate for feature:**
- HTTP → whiplash-http
- Polyglot → whiplash-bindings
- CLI → whiplash-cli
- Database → whiplash-db

**Find showcase for pattern:**
- API Gateway → api-gateway
- ML API → ml-api
- Real-time → realtime-dashboard
- Polyglot Flask → flask-typescript-polyglot

**Find quiz questions for topic:**
- Runtime basics → Q1-Q40
- CLI commands → Q101-Q180
- HTTP patterns → Q181-Q260
- Beta11 features → Q411-Q460

---

**End of Phase 5 Cross-Reference Analysis**
