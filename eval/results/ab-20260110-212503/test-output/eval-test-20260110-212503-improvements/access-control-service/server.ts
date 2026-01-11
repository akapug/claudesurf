/**
 * Access Control Service - Beta11-rc1 Fetch Handler Pattern
 *
 * Enterprise RBAC (Role-Based Access Control) and ABAC (Attribute-Based Access Control)
 * service with role management, permission evaluation, policy engine, and audit logging.
 *
 * UPDATED: Uses beta11-rc1 native fetch handler pattern (no shim required)
 */

// Native Elide beta11-rc1 HTTP - No imports needed for fetch handler

// Elide compatibility helpers
function parseQuery(s: string): Map<string, string> {
  const p = new Map<string, string>();
  const q = s.startsWith("?") ? s.slice(1) : s;
  for (const pair of q.split("&")) {
    const [k, v] = pair.split("=");
    if (k) p.set(decodeURIComponent(k), decodeURIComponent(v || ""));
  }
  return p;
}

// CORS headers for frontend access
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Simplified types for demonstration
type ActionType = "read" | "write" | "delete" | "execute" | "admin";
type AccessDecision = "allow" | "deny" | "not_applicable";

interface User {
  id: string;
  username: string;
  roles: string[];
  attributes: Record<string, unknown>;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

// Simple in-memory policy engine
class PolicyEngine {
  private users: Map<string, User> = new Map();
  private roles: Map<string, Role> = new Map();
  private auditLogs: Array<{id: string; timestamp: Date; userId: string; action: string; decision: AccessDecision}> = [];

  constructor() {
    // Initialize with test data
    this.users.set("user1", { id: "user1", username: "alice", roles: ["admin"], attributes: {} });
    this.users.set("user2", { id: "user2", username: "bob", roles: ["developer"], attributes: {} });
    this.roles.set("admin", { id: "admin", name: "Administrator", permissions: ["*"] });
    this.roles.set("developer", { id: "developer", name: "Developer", permissions: ["read", "write"] });
  }

  evaluateAccess(userId: string, resource: string, action: ActionType): { decision: AccessDecision; reason: string } {
    const user = this.users.get(userId);
    if (!user) {
      return { decision: "deny", reason: "User not found" };
    }

    for (const roleName of user.roles) {
      const role = this.roles.get(roleName);
      if (role?.permissions.includes("*") || role?.permissions.includes(action)) {
        this.log(userId, action, "allow");
        return { decision: "allow", reason: `Granted by role: ${roleName}` };
      }
    }

    this.log(userId, action, "deny");
    return { decision: "deny", reason: "No matching permissions" };
  }

  private log(userId: string, action: string, decision: AccessDecision): void {
    this.auditLogs.push({
      id: crypto.randomUUID(),
      timestamp: new Date(),
      userId,
      action,
      decision
    });
  }

  getUsers(): User[] { return Array.from(this.users.values()); }
  getRoles(): Role[] { return Array.from(this.roles.values()); }
  getAuditLogs(): typeof this.auditLogs { return this.auditLogs.slice(-100); }
}

const engine = new PolicyEngine();

/**
 * Native Elide beta11-rc1 HTTP Server - Fetch Handler Pattern
 *
 * Export a default fetch function that handles HTTP requests.
 * Configure port in elide.pkl or run with: elide serve --port 8080
 */
export default async function fetch(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const params = parseQuery(url.search);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Health check endpoint
  if (path === "/health" || path === "/") {
    return Response.json({
      status: "healthy",
      service: "Access Control Service",
      version: "2.0.0",
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders });
  }

  // Evaluate access
  if (path === "/api/access/evaluate" && req.method === "POST") {
    const body = await req.json();
    const { userId, resource, action } = body;
    const result = engine.evaluateAccess(userId, resource, action);
    return Response.json(result, { headers: corsHeaders });
  }

  // Get users
  if (path === "/api/users" && req.method === "GET") {
    const users = engine.getUsers();
    return Response.json({ users, count: users.length }, { headers: corsHeaders });
  }

  // Get roles
  if (path === "/api/roles" && req.method === "GET") {
    const roles = engine.getRoles();
    return Response.json({ roles, count: roles.length }, { headers: corsHeaders });
  }

  // Get audit logs
  if (path === "/api/audit" && req.method === "GET") {
    const logs = engine.getAuditLogs();
    return Response.json({ logs, count: logs.length }, { headers: corsHeaders });
  }

  // 404 for unknown routes
  return Response.json({ error: "Not Found" }, { status: 404, headers: corsHeaders });
}
