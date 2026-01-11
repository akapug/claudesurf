/**
 * Analytics Engine - Beta11-rc1 Fetch Handler Pattern
 *
 * Real-time analytics processing with metrics aggregation,
 * time-series data, and visualization APIs.
 */

// Native Elide beta11-rc1 HTTP - No imports needed

interface MetricPoint {
  timestamp: number;
  value: number;
  tags: Record<string, string>;
}

interface MetricSeries {
  name: string;
  points: MetricPoint[];
}

// In-memory metrics store
class MetricsStore {
  private series: Map<string, MetricSeries> = new Map();

  record(name: string, value: number, tags: Record<string, string> = {}): void {
    if (!this.series.has(name)) {
      this.series.set(name, { name, points: [] });
    }
    const s = this.series.get(name)!;
    s.points.push({ timestamp: Date.now(), value, tags });
    // Keep last 1000 points
    if (s.points.length > 1000) s.points.shift();
  }

  query(name: string, from?: number, to?: number): MetricPoint[] {
    const s = this.series.get(name);
    if (!s) return [];
    let points = s.points;
    if (from) points = points.filter(p => p.timestamp >= from);
    if (to) points = points.filter(p => p.timestamp <= to);
    return points;
  }

  aggregate(name: string, fn: "sum" | "avg" | "max" | "min" | "count"): number {
    const points = this.query(name);
    if (points.length === 0) return 0;
    const values = points.map(p => p.value);
    switch (fn) {
      case "sum": return values.reduce((a, b) => a + b, 0);
      case "avg": return values.reduce((a, b) => a + b, 0) / values.length;
      case "max": return Math.max(...values);
      case "min": return Math.min(...values);
      case "count": return values.length;
    }
  }

  list(): string[] {
    return Array.from(this.series.keys());
  }
}

const store = new MetricsStore();

// Seed with sample data
for (let i = 0; i < 100; i++) {
  store.record("page_views", Math.floor(Math.random() * 100));
  store.record("api_latency_ms", Math.floor(Math.random() * 200));
  store.record("error_rate", Math.random() * 0.05);
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * Beta11-rc1 Fetch Handler
 */
export default async function fetch(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Health check
  if (path === "/health" || path === "/") {
    return Response.json({
      status: "healthy",
      service: "Analytics Engine",
      metrics: store.list().length
    }, { headers: corsHeaders });
  }

  // List metrics
  if (path === "/api/metrics" && req.method === "GET") {
    return Response.json({ metrics: store.list() }, { headers: corsHeaders });
  }

  // Record metric
  if (path === "/api/metrics" && req.method === "POST") {
    const { name, value, tags } = await req.json();
    store.record(name, value, tags || {});
    return Response.json({ success: true }, { headers: corsHeaders });
  }

  // Query metric
  if (path.startsWith("/api/metrics/") && req.method === "GET") {
    const name = path.split("/")[3];
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const points = store.query(name, from ? parseInt(from) : undefined, to ? parseInt(to) : undefined);
    return Response.json({ name, points, count: points.length }, { headers: corsHeaders });
  }

  // Aggregate metric
  if (path.startsWith("/api/aggregate/") && req.method === "GET") {
    const name = path.split("/")[3];
    const fn = url.searchParams.get("fn") as "sum" | "avg" | "max" | "min" | "count" || "avg";
    const result = store.aggregate(name, fn);
    return Response.json({ name, function: fn, result }, { headers: corsHeaders });
  }

  return Response.json({ error: "Not Found" }, { status: 404, headers: corsHeaders });
}
