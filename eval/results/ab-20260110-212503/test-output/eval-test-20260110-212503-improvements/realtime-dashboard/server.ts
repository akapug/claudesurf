/**
 * Realtime Dashboard - Beta11-rc1 Fetch Handler Pattern
 *
 * Real-time metrics dashboard with:
 * - Server-Sent Events (SSE) for live updates
 * - Historical data API
 * - Multiple metric types
 */

// Native Elide beta11-rc1 HTTP

interface DashboardMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  trend: "up" | "down" | "stable";
}

class Dashboard {
  private metrics: Map<string, DashboardMetric[]> = new Map();
  private subscribers: Set<ReadableStreamDefaultController> = new Set();

  constructor() {
    // Initialize with sample metrics
    this.initializeMetrics();
    // Simulate real-time updates
    this.startSimulation();
  }

  private initializeMetrics(): void {
    const metricNames = ["cpu_usage", "memory_usage", "requests_per_second", "error_rate", "latency_ms"];
    for (const name of metricNames) {
      this.metrics.set(name, []);
    }
  }

  private startSimulation(): void {
    setInterval(() => {
      const updates: DashboardMetric[] = [
        this.generateMetric("cpu_usage", Math.random() * 100, "%"),
        this.generateMetric("memory_usage", 40 + Math.random() * 40, "%"),
        this.generateMetric("requests_per_second", 500 + Math.random() * 500, "req/s"),
        this.generateMetric("error_rate", Math.random() * 5, "%"),
        this.generateMetric("latency_ms", 10 + Math.random() * 90, "ms"),
      ];

      for (const metric of updates) {
        this.recordMetric(metric);
      }

      // Broadcast to SSE subscribers
      this.broadcast(updates);
    }, 1000);
  }

  private generateMetric(name: string, value: number, unit: string): DashboardMetric {
    const history = this.metrics.get(name) || [];
    const lastValue = history.length > 0 ? history[history.length - 1].value : value;
    let trend: "up" | "down" | "stable" = "stable";
    if (value > lastValue * 1.05) trend = "up";
    else if (value < lastValue * 0.95) trend = "down";

    return {
      name,
      value: Math.round(value * 100) / 100,
      unit,
      timestamp: Date.now(),
      trend
    };
  }

  private recordMetric(metric: DashboardMetric): void {
    const history = this.metrics.get(metric.name) || [];
    history.push(metric);
    // Keep last 1000 points
    if (history.length > 1000) history.shift();
    this.metrics.set(metric.name, history);
  }

  private broadcast(updates: DashboardMetric[]): void {
    const data = `data: ${JSON.stringify(updates)}\n\n`;
    const encoder = new TextEncoder();
    const bytes = encoder.encode(data);

    for (const controller of this.subscribers) {
      try {
        controller.enqueue(bytes);
      } catch {
        this.subscribers.delete(controller);
      }
    }
  }

  subscribe(controller: ReadableStreamDefaultController): void {
    this.subscribers.add(controller);
  }

  unsubscribe(controller: ReadableStreamDefaultController): void {
    this.subscribers.delete(controller);
  }

  getCurrentMetrics(): DashboardMetric[] {
    const current: DashboardMetric[] = [];
    for (const history of this.metrics.values()) {
      if (history.length > 0) {
        current.push(history[history.length - 1]);
      }
    }
    return current;
  }

  getHistory(name: string, limit = 100): DashboardMetric[] {
    const history = this.metrics.get(name) || [];
    return history.slice(-limit);
  }

  getMetricNames(): string[] {
    return Array.from(this.metrics.keys());
  }
}

const dashboard = new Dashboard();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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
      service: "Realtime Dashboard",
      metrics: dashboard.getMetricNames()
    }, { headers: corsHeaders });
  }

  // SSE stream for real-time updates
  if (path === "/api/stream") {
    const stream = new ReadableStream({
      start(controller) {
        dashboard.subscribe(controller);
        // Send initial data
        const initial = dashboard.getCurrentMetrics();
        const data = `data: ${JSON.stringify(initial)}\n\n`;
        controller.enqueue(new TextEncoder().encode(data));
      },
      cancel(controller) {
        dashboard.unsubscribe(controller);
      }
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });
  }

  // Current metrics snapshot
  if (path === "/api/metrics" && req.method === "GET") {
    return Response.json({
      metrics: dashboard.getCurrentMetrics(),
      timestamp: Date.now()
    }, { headers: corsHeaders });
  }

  // Historical data for specific metric
  if (path.startsWith("/api/metrics/") && req.method === "GET") {
    const name = path.split("/")[3];
    const limit = parseInt(url.searchParams.get("limit") || "100");
    const history = dashboard.getHistory(name, limit);
    return Response.json({
      name,
      history,
      count: history.length
    }, { headers: corsHeaders });
  }

  // List available metrics
  if (path === "/api/metrics/list") {
    return Response.json({
      metrics: dashboard.getMetricNames()
    }, { headers: corsHeaders });
  }

  return Response.json({ error: "Not Found" }, { status: 404, headers: corsHeaders });
}
