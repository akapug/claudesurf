/**
 * API Gateway - Beta11-rc1 Fetch Handler Pattern
 *
 * High-performance API gateway with:
 * - Request routing
 * - Rate limiting
 * - Request/response transformation
 * - Circuit breaker pattern
 */

// Native Elide beta11-rc1 HTTP

interface Route {
  path: string;
  method: string;
  target: string;
  rateLimit?: number; // requests per minute
}

interface CircuitBreaker {
  target: string;
  failures: number;
  lastFailure: number;
  state: "closed" | "open" | "half-open";
}

// Gateway configuration
class Gateway {
  private routes: Route[] = [];
  private rateLimits: Map<string, { count: number; reset: number }> = new Map();
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();
  private requestCount = 0;

  constructor() {
    // Register default routes
    this.routes = [
      { path: "/api/users", method: "GET", target: "http://users-service:3001", rateLimit: 100 },
      { path: "/api/products", method: "GET", target: "http://products-service:3002", rateLimit: 200 },
      { path: "/api/orders", method: "*", target: "http://orders-service:3003", rateLimit: 50 },
    ];
  }

  findRoute(path: string, method: string): Route | null {
    return this.routes.find(r =>
      path.startsWith(r.path) && (r.method === "*" || r.method === method)
    ) || null;
  }

  checkRateLimit(clientId: string, limit: number): boolean {
    const now = Date.now();
    const key = clientId;
    let state = this.rateLimits.get(key);

    if (!state || now > state.reset) {
      state = { count: 0, reset: now + 60000 };
      this.rateLimits.set(key, state);
    }

    if (state.count >= limit) {
      return false;
    }

    state.count++;
    return true;
  }

  checkCircuitBreaker(target: string): boolean {
    const breaker = this.circuitBreakers.get(target);
    if (!breaker) return true;

    const now = Date.now();
    if (breaker.state === "open") {
      // Check if we should try half-open
      if (now - breaker.lastFailure > 30000) {
        breaker.state = "half-open";
        return true;
      }
      return false;
    }
    return true;
  }

  recordFailure(target: string): void {
    let breaker = this.circuitBreakers.get(target);
    if (!breaker) {
      breaker = { target, failures: 0, lastFailure: 0, state: "closed" };
      this.circuitBreakers.set(target, breaker);
    }

    breaker.failures++;
    breaker.lastFailure = Date.now();

    if (breaker.failures >= 5) {
      breaker.state = "open";
    }
  }

  recordSuccess(target: string): void {
    const breaker = this.circuitBreakers.get(target);
    if (breaker) {
      breaker.failures = 0;
      breaker.state = "closed";
    }
  }

  getStats() {
    return {
      totalRequests: this.requestCount,
      routes: this.routes.length,
      circuitBreakers: Array.from(this.circuitBreakers.entries()).map(([k, v]) => ({
        target: k,
        state: v.state,
        failures: v.failures
      }))
    };
  }

  incrementRequests() {
    this.requestCount++;
  }
}

const gateway = new Gateway();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-ID",
};

/**
 * Beta11-rc1 Fetch Handler
 */
export default async function fetch(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  gateway.incrementRequests();

  if (method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Health check
  if (path === "/health" || path === "/") {
    return Response.json({
      status: "healthy",
      service: "API Gateway",
      ...gateway.getStats()
    }, { headers: corsHeaders });
  }

  // Gateway stats
  if (path === "/gateway/stats") {
    return Response.json(gateway.getStats(), { headers: corsHeaders });
  }

  // Find matching route
  const route = gateway.findRoute(path, method);
  if (!route) {
    return Response.json({ error: "No route found" }, { status: 404, headers: corsHeaders });
  }

  // Rate limiting
  const clientId = req.headers.get("X-Client-ID") || "anonymous";
  if (route.rateLimit && !gateway.checkRateLimit(clientId, route.rateLimit)) {
    return Response.json(
      { error: "Rate limit exceeded", retryAfter: 60 },
      { status: 429, headers: { ...corsHeaders, "Retry-After": "60" } }
    );
  }

  // Circuit breaker
  if (!gateway.checkCircuitBreaker(route.target)) {
    return Response.json(
      { error: "Service temporarily unavailable", target: route.target },
      { status: 503, headers: corsHeaders }
    );
  }

  // In a real gateway, we would proxy to the target service
  // For demonstration, return mock response
  try {
    gateway.recordSuccess(route.target);
    return Response.json({
      message: "Request would be proxied to target",
      route: route.path,
      target: route.target,
      method,
      clientId
    }, { headers: corsHeaders });
  } catch (error) {
    gateway.recordFailure(route.target);
    return Response.json(
      { error: "Upstream service error" },
      { status: 502, headers: corsHeaders }
    );
  }
}
