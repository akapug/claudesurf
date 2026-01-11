/**
 * Testing Framework Service
 *
 * A comprehensive test management and execution service with:
 * - Test suite organization and discovery
 * - Parallel test execution
 * - Coverage reporting
 * - Test history and trends
 * - Flaky test detection
 */

interface TestSuite {
  id: string;
  name: string;
  path: string;
  tests: Test[];
  setup?: string;
  teardown?: string;
  timeout: number;
  tags: string[];
  createdAt: number;
}

interface Test {
  id: string;
  name: string;
  description?: string;
  status: TestStatus;
  duration?: number;
  error?: TestError;
  retries: number;
  flakyScore: number;
}

type TestStatus = "pending" | "running" | "passed" | "failed" | "skipped" | "flaky";

interface TestError {
  message: string;
  stack?: string;
  expected?: unknown;
  actual?: unknown;
}

interface TestRun {
  id: string;
  status: "queued" | "running" | "completed" | "cancelled";
  suites: string[];
  config: RunConfig;
  results: RunResults;
  startedAt?: number;
  completedAt?: number;
  triggeredBy: string;
}

interface RunConfig {
  parallel: boolean;
  maxWorkers: number;
  retryFailed: boolean;
  maxRetries: number;
  timeout: number;
  tags?: string[];
  pattern?: string;
}

interface RunResults {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  duration: number;
  coverage?: CoverageReport;
}

interface CoverageReport {
  lines: number;
  branches: number;
  functions: number;
  statements: number;
  uncoveredFiles: string[];
}

interface TestHistory {
  testId: string;
  runs: {
    runId: string;
    status: TestStatus;
    duration: number;
    timestamp: number;
  }[];
}

const suites: Map<string, TestSuite> = new Map();
const runs: Map<string, TestRun> = new Map();
const history: Map<string, TestHistory> = new Map();
let runCounter = 0;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

// Initialize sample data
function initializeSampleData(): void {
  const authSuite: TestSuite = {
    id: "suite_auth",
    name: "Authentication",
    path: "tests/unit/auth",
    tests: [
      { id: "test_login", name: "should login with valid credentials", status: "passed", duration: 45, retries: 0, flakyScore: 0 },
      { id: "test_logout", name: "should logout and invalidate session", status: "passed", duration: 32, retries: 0, flakyScore: 0 },
      { id: "test_refresh", name: "should refresh expired tokens", status: "passed", duration: 67, retries: 0, flakyScore: 0.1 },
      { id: "test_mfa", name: "should require MFA when enabled", status: "failed", duration: 120, retries: 2, flakyScore: 0.3, error: { message: "Timeout waiting for MFA code", expected: "valid_code", actual: "timeout" } },
      { id: "test_rate_limit", name: "should rate limit login attempts", status: "passed", duration: 890, retries: 0, flakyScore: 0 }
    ],
    timeout: 5000,
    tags: ["unit", "auth", "security"],
    createdAt: Date.now() - 86400000 * 30
  };

  const apiSuite: TestSuite = {
    id: "suite_api",
    name: "API Endpoints",
    path: "tests/unit/api",
    tests: [
      { id: "test_get_users", name: "GET /users should return list", status: "passed", duration: 23, retries: 0, flakyScore: 0 },
      { id: "test_create_user", name: "POST /users should create user", status: "passed", duration: 45, retries: 0, flakyScore: 0 },
      { id: "test_update_user", name: "PUT /users/:id should update", status: "passed", duration: 38, retries: 0, flakyScore: 0 },
      { id: "test_delete_user", name: "DELETE /users/:id should delete", status: "passed", duration: 29, retries: 0, flakyScore: 0 },
      { id: "test_pagination", name: "should paginate large results", status: "passed", duration: 156, retries: 0, flakyScore: 0.05 }
    ],
    timeout: 3000,
    tags: ["unit", "api"],
    createdAt: Date.now() - 86400000 * 25
  };

  const e2eSuite: TestSuite = {
    id: "suite_e2e",
    name: "End-to-End",
    path: "tests/e2e",
    tests: [
      { id: "test_signup_flow", name: "complete signup flow", status: "passed", duration: 4500, retries: 0, flakyScore: 0.2 },
      { id: "test_checkout", name: "complete checkout process", status: "passed", duration: 6200, retries: 1, flakyScore: 0.4 },
      { id: "test_search", name: "search and filter products", status: "failed", duration: 3800, retries: 2, flakyScore: 0.6, error: { message: "Element not found: .search-results", stack: "at SearchPage.waitForResults" } }
    ],
    timeout: 30000,
    tags: ["e2e", "integration"],
    createdAt: Date.now() - 86400000 * 20
  };

  suites.set(authSuite.id, authSuite);
  suites.set(apiSuite.id, apiSuite);
  suites.set(e2eSuite.id, e2eSuite);

  // Create a completed run
  const completedRun: TestRun = {
    id: "run_1",
    status: "completed",
    suites: ["suite_auth", "suite_api", "suite_e2e"],
    config: {
      parallel: true,
      maxWorkers: 4,
      retryFailed: true,
      maxRetries: 2,
      timeout: 30000
    },
    results: {
      total: 13,
      passed: 11,
      failed: 2,
      skipped: 0,
      flaky: 2,
      duration: 12500,
      coverage: {
        lines: 87.5,
        branches: 82.3,
        functions: 91.2,
        statements: 88.1,
        uncoveredFiles: ["src/legacy/deprecated.ts", "src/utils/debug.ts"]
      }
    },
    startedAt: Date.now() - 3600000,
    completedAt: Date.now() - 3600000 + 12500,
    triggeredBy: "ci-pipeline"
  };

  runs.set(completedRun.id, completedRun);
  runCounter = 1;
}

initializeSampleData();

function calculateFlakyScore(testId: string): number {
  const testHistory = history.get(testId);
  if (!testHistory || testHistory.runs.length < 5) return 0;

  const recent = testHistory.runs.slice(-10);
  const statusChanges = recent.reduce((acc, run, i) => {
    if (i > 0 && run.status !== recent[i - 1].status) acc++;
    return acc;
  }, 0);

  return Math.min(statusChanges / recent.length, 1);
}

function simulateTestExecution(run: TestRun): void {
  run.status = "running";
  run.startedAt = Date.now();

  let totalDuration = 0;
  let passed = 0;
  let failed = 0;
  let flaky = 0;

  for (const suiteId of run.suites) {
    const suite = suites.get(suiteId);
    if (!suite) continue;

    for (const test of suite.tests) {
      // Simulate test execution
      const duration = Math.floor(Math.random() * 500) + 50;
      totalDuration += duration;

      const random = Math.random();
      if (test.flakyScore > 0.3 && random < test.flakyScore) {
        // Flaky behavior
        if (random < 0.5) {
          passed++;
          flaky++;
        } else {
          failed++;
          flaky++;
        }
      } else if (test.status === "failed" && random < 0.8) {
        failed++;
      } else {
        passed++;
      }
    }
  }

  run.results = {
    total: passed + failed,
    passed,
    failed,
    skipped: 0,
    flaky,
    duration: totalDuration,
    coverage: {
      lines: 85 + Math.random() * 10,
      branches: 80 + Math.random() * 10,
      functions: 88 + Math.random() * 10,
      statements: 84 + Math.random() * 10,
      uncoveredFiles: []
    }
  };

  run.status = "completed";
  run.completedAt = Date.now();
}

export default async function fetch(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const headers = { "Content-Type": "application/json", ...corsHeaders };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Root endpoint
  if (url.pathname === "/" && req.method === "GET") {
    return new Response(JSON.stringify({
      name: "Testing Framework",
      description: "Test management, execution, and reporting service",
      version: "1.0.0",
      endpoints: {
        "GET /suites": "List all test suites",
        "GET /suites/:id": "Get suite details with tests",
        "POST /suites": "Create test suite",
        "POST /runs": "Start new test run",
        "GET /runs": "List test runs",
        "GET /runs/:id": "Get run details",
        "POST /runs/:id/cancel": "Cancel running test",
        "GET /coverage": "Get latest coverage report",
        "GET /coverage/history": "Coverage trends over time",
        "GET /flaky": "List flaky tests",
        "GET /history/:testId": "Get test history"
      }
    }, null, 2), { headers });
  }

  // List suites
  if (url.pathname === "/suites" && req.method === "GET") {
    const tag = url.searchParams.get("tag");
    let suiteList = Array.from(suites.values());

    if (tag) {
      suiteList = suiteList.filter(s => s.tags.includes(tag));
    }

    return new Response(JSON.stringify({
      suites: suiteList.map(s => ({
        id: s.id,
        name: s.name,
        path: s.path,
        testCount: s.tests.length,
        tags: s.tags,
        passRate: (s.tests.filter(t => t.status === "passed").length / s.tests.length * 100).toFixed(1) + "%"
      }))
    }), { headers });
  }

  // Get suite
  const suiteMatch = url.pathname.match(/^\/suites\/([^/]+)$/);
  if (suiteMatch && req.method === "GET") {
    const suite = suites.get(suiteMatch[1]);
    if (!suite) {
      return new Response(JSON.stringify({ error: "Suite not found" }), {
        status: 404,
        headers
      });
    }
    return new Response(JSON.stringify({ suite }), { headers });
  }

  // Create suite
  if (url.pathname === "/suites" && req.method === "POST") {
    const body = await req.json();

    if (!body.name || !body.path) {
      return new Response(JSON.stringify({ error: "name and path required" }), {
        status: 400,
        headers
      });
    }

    const suite: TestSuite = {
      id: `suite_${Date.now()}`,
      name: body.name,
      path: body.path,
      tests: body.tests || [],
      setup: body.setup,
      teardown: body.teardown,
      timeout: body.timeout || 5000,
      tags: body.tags || [],
      createdAt: Date.now()
    };

    suites.set(suite.id, suite);
    return new Response(JSON.stringify({ suite }), { headers, status: 201 });
  }

  // Start run
  if (url.pathname === "/runs" && req.method === "POST") {
    const body = await req.json();

    const run: TestRun = {
      id: `run_${++runCounter}`,
      status: "queued",
      suites: body.suites || Array.from(suites.keys()),
      config: {
        parallel: body.parallel ?? true,
        maxWorkers: body.maxWorkers || 4,
        retryFailed: body.retryFailed ?? true,
        maxRetries: body.maxRetries || 2,
        timeout: body.timeout || 30000,
        tags: body.tags,
        pattern: body.pattern
      },
      results: {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        flaky: 0,
        duration: 0
      },
      triggeredBy: body.triggeredBy || "manual"
    };

    runs.set(run.id, run);

    // Simulate async execution
    setTimeout(() => simulateTestExecution(run), 100);

    return new Response(JSON.stringify({
      run: {
        id: run.id,
        status: run.status,
        suites: run.suites
      }
    }), { headers, status: 201 });
  }

  // List runs
  if (url.pathname === "/runs" && req.method === "GET") {
    const status = url.searchParams.get("status");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    let runList = Array.from(runs.values());
    if (status) {
      runList = runList.filter(r => r.status === status);
    }

    runList.sort((a, b) => (b.startedAt || b.completedAt || 0) - (a.startedAt || a.completedAt || 0));
    runList = runList.slice(0, limit);

    return new Response(JSON.stringify({
      runs: runList.map(r => ({
        id: r.id,
        status: r.status,
        results: r.results,
        startedAt: r.startedAt,
        completedAt: r.completedAt,
        triggeredBy: r.triggeredBy
      }))
    }), { headers });
  }

  // Get run
  const runMatch = url.pathname.match(/^\/runs\/([^/]+)$/);
  if (runMatch && req.method === "GET") {
    const run = runs.get(runMatch[1]);
    if (!run) {
      return new Response(JSON.stringify({ error: "Run not found" }), {
        status: 404,
        headers
      });
    }
    return new Response(JSON.stringify({ run }), { headers });
  }

  // Cancel run
  const cancelMatch = url.pathname.match(/^\/runs\/([^/]+)\/cancel$/);
  if (cancelMatch && req.method === "POST") {
    const run = runs.get(cancelMatch[1]);
    if (!run) {
      return new Response(JSON.stringify({ error: "Run not found" }), {
        status: 404,
        headers
      });
    }

    if (run.status === "completed" || run.status === "cancelled") {
      return new Response(JSON.stringify({ error: "Run already finished" }), {
        status: 400,
        headers
      });
    }

    run.status = "cancelled";
    run.completedAt = Date.now();

    return new Response(JSON.stringify({ run }), { headers });
  }

  // Coverage
  if (url.pathname === "/coverage" && req.method === "GET") {
    const latestRun = Array.from(runs.values())
      .filter(r => r.status === "completed" && r.results.coverage)
      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))[0];

    if (!latestRun?.results.coverage) {
      return new Response(JSON.stringify({ error: "No coverage data" }), {
        status: 404,
        headers
      });
    }

    return new Response(JSON.stringify({
      coverage: latestRun.results.coverage,
      runId: latestRun.id,
      timestamp: latestRun.completedAt
    }), { headers });
  }

  // Coverage history
  if (url.pathname === "/coverage/history" && req.method === "GET") {
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const coverageHistory = Array.from(runs.values())
      .filter(r => r.status === "completed" && r.results.coverage)
      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
      .slice(0, limit)
      .map(r => ({
        runId: r.id,
        timestamp: r.completedAt,
        lines: r.results.coverage!.lines,
        branches: r.results.coverage!.branches,
        functions: r.results.coverage!.functions
      }));

    return new Response(JSON.stringify({ history: coverageHistory }), { headers });
  }

  // Flaky tests
  if (url.pathname === "/flaky" && req.method === "GET") {
    const threshold = parseFloat(url.searchParams.get("threshold") || "0.2");

    const flakyTests: { suite: string; test: Test }[] = [];
    for (const suite of suites.values()) {
      for (const test of suite.tests) {
        if (test.flakyScore >= threshold) {
          flakyTests.push({ suite: suite.name, test });
        }
      }
    }

    flakyTests.sort((a, b) => b.test.flakyScore - a.test.flakyScore);

    return new Response(JSON.stringify({
      flakyTests,
      threshold,
      count: flakyTests.length
    }), { headers });
  }

  // Test history
  const historyMatch = url.pathname.match(/^\/history\/([^/]+)$/);
  if (historyMatch && req.method === "GET") {
    const testId = historyMatch[1];
    const testHistory = history.get(testId);

    if (!testHistory) {
      // Generate mock history
      const mockHistory: TestHistory = {
        testId,
        runs: Array.from({ length: 10 }, (_, i) => ({
          runId: `run_${i + 1}`,
          status: Math.random() > 0.1 ? "passed" : "failed" as TestStatus,
          duration: Math.floor(Math.random() * 500) + 50,
          timestamp: Date.now() - (10 - i) * 86400000
        }))
      };
      return new Response(JSON.stringify({ history: mockHistory }), { headers });
    }

    return new Response(JSON.stringify({ history: testHistory }), { headers });
  }

  // Health check
  if (url.pathname === "/health" && req.method === "GET") {
    const activeRuns = Array.from(runs.values()).filter(r => r.status === "running").length;
    return new Response(JSON.stringify({
      status: "healthy",
      suiteCount: suites.size,
      activeRuns
    }), { headers });
  }

  return new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers
  });
}

console.log("Testing Framework ready on http://localhost:8080");
console.log("Endpoints: /suites, /runs, /coverage, /flaky");
