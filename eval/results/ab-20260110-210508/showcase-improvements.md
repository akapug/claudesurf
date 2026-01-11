# Showcase Improvements List

## Executive Summary

Based on comprehensive review of the elide-showcases repository, the following improvements are needed to bring showcases to production-ready status for beta11-rc1 and establish consistency across the ecosystem.

---

## Critical Issues (Must Fix)

### 1. Missing elide.pkl Manifests

**Affected Showcases:**
- `llm-inference-server` — No manifest
- `multi-tenant-saas` — No manifest
- `api-gateway-advanced` — No manifest
- `nlp-processing` — No manifest
- `audio-processing` — No manifest
- `circuit-breaker-polyglot` — No manifest
- `deploy-platform` — No manifest
- `rag-service` — No manifest
- `ml-model-serving` — No manifest
- `graphql-federation` — No manifest

**Impact:** Cannot run with `elide serve` without manifest; users must use workarounds.

**Fix Required:**
```pkl
amends "elide:project"

name = "<showcase-name>"
version = "1.0.0"

runtime {
  languages = new { "js" }
  vm = "native"
}

server {
  entrypoint = "server.ts"
  port = 8080
}
```

### 2. Incorrect HTTP Handler Pattern

**Affected Showcases:**
- Several showcases still use pre-beta11 patterns

**Current (Wrong):**
```typescript
export function handleRequest(req: Request): Response {
  // ...
}
```

**Required (Beta11-rc1):**
```typescript
export default async function fetch(req: Request): Promise<Response> {
  // ...
}
// OR
export default { fetch: handleRequest };
```

### 3. Missing TypeScript Declarations

**Affected Showcases:**
- Most showcases lack proper `@types/elide` declarations
- IDE support is degraded without type definitions

**Fix:** Add to each showcase:
```typescript
/// <reference types="@anthropic/elide-types" />
```

---

## High Priority Improvements

### 4. Inconsistent Port Configuration

**Issue:** Showcases use different default ports without documentation.

| Showcase | Port | Should Be |
|----------|------|-----------|
| hello-world | 8080 | 8080 |
| llm-inference-server | 3000 | 8080 |
| multi-tenant-saas | 3001 | 8080 |
| api-gateway-advanced | 8000 | 8080 |

**Fix:** Standardize on port 8080 with env override:
```typescript
const port = parseInt(Elide.env.get("PORT") ?? "8080");
```

### 5. Missing Error Handling Patterns

**Affected Showcases:**
- `llm-inference-server` — No try/catch around LLM calls
- `rag-service` — No error handling for embedding failures
- `ml-model-serving` — No model load error handling

**Required Pattern:**
```typescript
export default async function fetch(req: Request): Promise<Response> {
  try {
    // ... handler logic
  } catch (error) {
    console.error("Handler error:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
```

### 6. Missing Health Check Endpoints

**Affected:** All showcases except `hello-world`

**Required Addition:**
```typescript
if (url.pathname === "/health" || url.pathname === "/healthz") {
  return Response.json({ status: "healthy", timestamp: Date.now() });
}

if (url.pathname === "/ready") {
  // Check dependencies
  return Response.json({ status: "ready" });
}
```

### 7. CORS Headers Missing

**Affected:** All API-focused showcases

**Required for browser clients:**
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle preflight
if (req.method === "OPTIONS") {
  return new Response(null, { status: 204, headers: corsHeaders });
}
```

---

## Medium Priority Improvements

### 8. Documentation Gaps

**Missing README Sections:**

| Showcase | Missing |
|----------|---------|
| audio-processing | API documentation |
| nlp-processing | Example requests |
| circuit-breaker-polyglot | Configuration options |
| deploy-platform | Deployment instructions |

**Template for README:**
```markdown
## Quick Start
\`\`\`bash
elide serve
\`\`\`

## API Endpoints
- `GET /health` — Health check
- `POST /api/...` — Main endpoint

## Configuration
| Env Var | Default | Description |
|---------|---------|-------------|

## Example Request
\`\`\`bash
curl -X POST http://localhost:8080/api/... \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
\`\`\`
```

### 9. Missing Tests

**Affected:** All showcases lack test files.

**Required:** Each showcase should have:
```
showcase-name/
├── server.ts
├── server.test.ts    # Unit tests
├── integration.test.ts  # Integration tests
└── elide.pkl
```

**Example test:**
```typescript
import { describe, it, expect } from "elide:test";

describe("API", () => {
  it("should return health status", async () => {
    const res = await fetch("http://localhost:8080/health");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("healthy");
  });
});
```

### 10. Polyglot Examples Need Improvement

**circuit-breaker-polyglot:**
- Claims TypeScript + Python but doesn't demonstrate the pattern clearly
- Missing documentation on how cross-language calls work

**Required Enhancement:**
```typescript
// Demonstrate explicit polyglot interop
import python from "elide:python";

const numpy = python.import("numpy");
const sklearn = python.import("sklearn.ensemble");

// Show the actual interop pattern
const model = sklearn.RandomForestClassifier();
model.fit(numpy.array(trainingData), numpy.array(labels));
```

---

## Low Priority / Nice to Have

### 11. Containerization

**Missing Dockerfile for:**
- All showcases

**Template:**
```dockerfile
FROM ghcr.io/elide-dev/elide:beta11-rc1

WORKDIR /app
COPY . .

EXPOSE 8080
CMD ["elide", "serve"]
```

### 12. CI/CD Configuration

**Missing `.github/workflows/` for:**
- All showcases

**Template workflow:**
```yaml
name: Test Showcase
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: elide-dev/setup-elide@v1
      - run: elide test
      - run: elide build
```

### 13. Metrics and Observability

**Enhancement for production showcases:**
```typescript
// Add to server.ts
import { metrics } from "elide:metrics";

const requestCounter = metrics.counter("http_requests_total");
const latencyHistogram = metrics.histogram("http_request_duration_seconds");

export default async function fetch(req: Request): Promise<Response> {
  const start = Date.now();
  requestCounter.inc({ method: req.method, path: url.pathname });

  try {
    const response = await handleRequest(req);
    latencyHistogram.observe(
      { status: response.status },
      (Date.now() - start) / 1000
    );
    return response;
  } catch (error) {
    latencyHistogram.observe({ status: 500 }, (Date.now() - start) / 1000);
    throw error;
  }
}
```

---

## Showcase-Specific Issues

### hello-world
- **Status:** Working
- **Issues:** None critical
- **Improvements:** Add TypeScript strict mode

### llm-inference-server
- **Status:** Needs manifest
- **Issues:**
  - No error handling for LLM API failures
  - Hardcoded API endpoints
  - No rate limiting
- **Improvements:** Add retry logic, configurable endpoints

### multi-tenant-saas
- **Status:** Needs manifest
- **Issues:**
  - Tenant isolation not clearly demonstrated
  - Missing authentication middleware pattern
- **Improvements:** Add JWT validation example

### api-gateway-advanced
- **Status:** Needs manifest
- **Issues:**
  - Route configuration is inline, not external
  - Missing load balancing demonstration
- **Improvements:** Use elide.pkl for route config

### rag-service
- **Status:** Needs manifest
- **Issues:**
  - Vector store is in-memory only
  - No chunking strategy for large documents
  - Missing embedding caching
- **Improvements:** Add persistent storage option, implement chunking

### circuit-breaker-polyglot
- **Status:** Needs manifest
- **Issues:**
  - Circuit breaker logic is basic
  - Python interop not clearly shown
- **Improvements:** Use proper circuit breaker pattern with half-open state

### deploy-platform
- **Status:** Needs manifest
- **Issues:**
  - Deployment logic is placeholder
  - No actual platform integration
- **Improvements:** Add real deployment examples (Kubernetes, Cloud Run)

---

## Priority Matrix

| Priority | Count | Examples |
|----------|-------|----------|
| **P0 - Critical** | 10 | Missing manifests |
| **P1 - High** | 15 | Error handling, health checks |
| **P2 - Medium** | 12 | Documentation, tests |
| **P3 - Low** | 8 | Containers, CI/CD |

## Recommended Order of Work

1. Add `elide.pkl` manifests to all showcases (batch operation)
2. Standardize fetch handler pattern across all showcases
3. Add health check endpoints
4. Implement error handling patterns
5. Add CORS headers to API showcases
6. Write comprehensive README for each
7. Add basic test suites
8. Create Dockerfiles
9. Set up CI workflows
