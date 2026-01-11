/**
 * Elide Compatibility Service
 *
 * A service that validates application compatibility with different Elide versions.
 * Useful for migration planning and dependency analysis.
 */

interface VersionInfo {
  version: string;
  codename: string;
  releaseDate: string;
  status: "current" | "supported" | "deprecated" | "eol";
  features: string[];
}

interface CompatCheck {
  id: string;
  targetVersion: string;
  status: "pending" | "running" | "completed" | "failed";
  issues: CompatIssue[];
  score: number;
  checkedAt?: number;
}

interface CompatIssue {
  severity: "error" | "warning" | "info";
  code: string;
  message: string;
  suggestion?: string;
}

const versions: VersionInfo[] = [
  {
    version: "beta11-rc1",
    codename: "Fetch",
    releaseDate: "2025-12-01",
    status: "current",
    features: ["fetch-handler", "native-http", "pkl-config", "polyglot-v2"]
  },
  {
    version: "beta10",
    codename: "Stream",
    releaseDate: "2025-09-01",
    status: "supported",
    features: ["http-handler", "native-http", "pkl-config", "polyglot-v1"]
  },
  {
    version: "beta9",
    codename: "Bridge",
    releaseDate: "2025-06-01",
    status: "deprecated",
    features: ["http-handler", "express-compat", "json-config", "polyglot-v1"]
  },
  {
    version: "beta8",
    codename: "Core",
    releaseDate: "2025-03-01",
    status: "eol",
    features: ["http-handler", "express-compat", "json-config"]
  }
];

const checks: Map<string, CompatCheck> = new Map();
let checkCounter = 0;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

function analyzeCompatibility(targetVersion: string): CompatIssue[] {
  const issues: CompatIssue[] = [];
  const target = versions.find(v => v.version === targetVersion);

  if (!target) {
    issues.push({
      severity: "error",
      code: "UNKNOWN_VERSION",
      message: `Unknown target version: ${targetVersion}`,
      suggestion: "Use one of: " + versions.map(v => v.version).join(", ")
    });
    return issues;
  }

  if (target.status === "eol") {
    issues.push({
      severity: "error",
      code: "EOL_VERSION",
      message: `Version ${targetVersion} has reached end of life`,
      suggestion: "Migrate to beta11-rc1 for continued support"
    });
  }

  if (target.status === "deprecated") {
    issues.push({
      severity: "warning",
      code: "DEPRECATED_VERSION",
      message: `Version ${targetVersion} is deprecated`,
      suggestion: "Plan migration to beta11-rc1"
    });
  }

  if (!target.features.includes("fetch-handler")) {
    issues.push({
      severity: "warning",
      code: "NO_FETCH_HANDLER",
      message: "Fetch Handler pattern not supported",
      suggestion: "Use http-handler pattern or upgrade to beta11-rc1"
    });
  }

  if (!target.features.includes("pkl-config")) {
    issues.push({
      severity: "info",
      code: "NO_PKL_CONFIG",
      message: "Pkl configuration not supported",
      suggestion: "Use JSON configuration or upgrade to beta10+"
    });
  }

  if (!target.features.includes("polyglot-v2")) {
    issues.push({
      severity: "info",
      code: "POLYGLOT_V1",
      message: "Using older polyglot interop version",
      suggestion: "Upgrade to beta11-rc1 for improved cross-language performance"
    });
  }

  return issues;
}

function calculateScore(issues: CompatIssue[]): number {
  let score = 100;
  for (const issue of issues) {
    if (issue.severity === "error") score -= 30;
    else if (issue.severity === "warning") score -= 15;
    else if (issue.severity === "info") score -= 5;
  }
  return Math.max(0, score);
}

export default async function fetch(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const headers = { "Content-Type": "application/json", ...corsHeaders };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Root endpoint - API documentation
  if (url.pathname === "/" && req.method === "GET") {
    return new Response(JSON.stringify({
      name: "Elide Compatibility Service",
      description: "Validate application compatibility with Elide versions",
      version: "1.0.0",
      endpoints: {
        "GET /versions": "List all Elide versions",
        "GET /versions/:version": "Get version details",
        "GET /versions/current": "Get current recommended version",
        "POST /check": "Run compatibility check (body: { targetVersion })",
        "GET /checks/:id": "Get check results",
        "GET /migrate/:from/:to": "Get migration guide"
      }
    }, null, 2), { headers });
  }

  // List all versions
  if (url.pathname === "/versions" && req.method === "GET") {
    return new Response(JSON.stringify({
      versions,
      current: versions.find(v => v.status === "current")?.version
    }), { headers });
  }

  // Get current version
  if (url.pathname === "/versions/current" && req.method === "GET") {
    const current = versions.find(v => v.status === "current");
    return new Response(JSON.stringify({ version: current }), { headers });
  }

  // Get specific version
  const versionMatch = url.pathname.match(/^\/versions\/([^/]+)$/);
  if (versionMatch && req.method === "GET") {
    const version = versions.find(v => v.version === versionMatch[1]);
    if (!version) {
      return new Response(JSON.stringify({ error: "Version not found" }), {
        status: 404,
        headers
      });
    }
    return new Response(JSON.stringify({ version }), { headers });
  }

  // Run compatibility check
  if (url.pathname === "/check" && req.method === "POST") {
    const body = await req.json();
    const targetVersion = body.targetVersion || "beta11-rc1";

    const issues = analyzeCompatibility(targetVersion);
    const score = calculateScore(issues);

    const check: CompatCheck = {
      id: `check_${++checkCounter}`,
      targetVersion,
      status: "completed",
      issues,
      score,
      checkedAt: Date.now()
    };

    checks.set(check.id, check);

    return new Response(JSON.stringify({
      check,
      summary: {
        compatible: score >= 70,
        errorCount: issues.filter(i => i.severity === "error").length,
        warningCount: issues.filter(i => i.severity === "warning").length,
        infoCount: issues.filter(i => i.severity === "info").length
      }
    }), { headers, status: 201 });
  }

  // Get check results
  const checkMatch = url.pathname.match(/^\/checks\/([^/]+)$/);
  if (checkMatch && req.method === "GET") {
    const check = checks.get(checkMatch[1]);
    if (!check) {
      return new Response(JSON.stringify({ error: "Check not found" }), {
        status: 404,
        headers
      });
    }
    return new Response(JSON.stringify({ check }), { headers });
  }

  // Migration guide
  const migrateMatch = url.pathname.match(/^\/migrate\/([^/]+)\/([^/]+)$/);
  if (migrateMatch && req.method === "GET") {
    const fromVersion = migrateMatch[1];
    const toVersion = migrateMatch[2];

    const from = versions.find(v => v.version === fromVersion);
    const to = versions.find(v => v.version === toVersion);

    if (!from || !to) {
      return new Response(JSON.stringify({ error: "Invalid version(s)" }), {
        status: 400,
        headers
      });
    }

    const steps: string[] = [];

    // Generate migration steps based on feature differences
    if (!from.features.includes("pkl-config") && to.features.includes("pkl-config")) {
      steps.push("Convert JSON config to elide.pkl format");
    }
    if (!from.features.includes("fetch-handler") && to.features.includes("fetch-handler")) {
      steps.push("Migrate HTTP handlers to Fetch Handler pattern");
    }
    if (from.features.includes("express-compat") && !to.features.includes("express-compat")) {
      steps.push("Remove Express compatibility layer, use native HTTP");
    }
    if (!from.features.includes("polyglot-v2") && to.features.includes("polyglot-v2")) {
      steps.push("Update polyglot imports to v2 syntax");
    }

    return new Response(JSON.stringify({
      migration: {
        from: fromVersion,
        to: toVersion,
        steps,
        estimated_effort: steps.length <= 1 ? "low" : steps.length <= 3 ? "medium" : "high",
        documentation: `https://elide.dev/docs/migration/${fromVersion}-to-${toVersion}`
      }
    }), { headers });
  }

  // Health check
  if (url.pathname === "/health" && req.method === "GET") {
    return new Response(JSON.stringify({
      status: "healthy",
      service: "elide-compat-service",
      versionsLoaded: versions.length
    }), { headers });
  }

  return new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers
  });
}

console.log("Elide Compatibility Service ready on http://localhost:8080");
console.log("Endpoints: /versions, /check, /migrate/:from/:to");
