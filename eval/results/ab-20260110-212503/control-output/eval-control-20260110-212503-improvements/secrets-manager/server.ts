/**
 * Secrets Manager
 *
 * A secure secrets management service with:
 * - Secret versioning and rotation
 * - Access control and audit logging
 * - Encryption at rest simulation
 * - TTL and expiration handling
 */

interface Secret {
  id: string;
  name: string;
  versions: SecretVersion[];
  metadata: SecretMetadata;
  createdAt: number;
  updatedAt: number;
}

interface SecretVersion {
  version: number;
  encryptedValue: string;
  createdAt: number;
  createdBy: string;
  expiresAt?: number;
  status: "active" | "deprecated" | "destroyed";
}

interface SecretMetadata {
  description?: string;
  tags: string[];
  rotationPolicy?: RotationPolicy;
  accessPolicy: AccessPolicy;
}

interface RotationPolicy {
  enabled: boolean;
  intervalDays: number;
  lastRotation?: number;
  nextRotation?: number;
}

interface AccessPolicy {
  allowedServices: string[];
  requireMfa: boolean;
  maxAccessesPerHour: number;
}

interface AuditLog {
  id: string;
  secretId: string;
  action: "create" | "read" | "update" | "rotate" | "delete" | "access_denied";
  actor: string;
  timestamp: number;
  details?: string;
}

const secrets: Map<string, Secret> = new Map();
const auditLogs: AuditLog[] = [];
let secretCounter = 0;
let auditCounter = 0;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Service-Id"
};

// Simulated encryption (in production, use real encryption)
function encrypt(value: string): string {
  return Buffer.from(value).toString("base64");
}

function decrypt(encrypted: string): string {
  return Buffer.from(encrypted, "base64").toString("utf-8");
}

function logAudit(
  secretId: string,
  action: AuditLog["action"],
  actor: string,
  details?: string
): void {
  auditLogs.push({
    id: `audit_${++auditCounter}`,
    secretId,
    action,
    actor,
    timestamp: Date.now(),
    details
  });
  // Keep last 1000 logs
  if (auditLogs.length > 1000) auditLogs.shift();
}

function getServiceId(req: Request): string {
  return req.headers.get("X-Service-Id") || "anonymous";
}

function checkAccess(secret: Secret, serviceId: string): boolean {
  if (secret.metadata.accessPolicy.allowedServices.includes("*")) return true;
  return secret.metadata.accessPolicy.allowedServices.includes(serviceId);
}

// Initialize with sample secrets
function initializeSampleData(): void {
  const dbSecret: Secret = {
    id: "secret_1",
    name: "database/password",
    versions: [
      {
        version: 1,
        encryptedValue: encrypt("old_password_123"),
        createdAt: Date.now() - 86400000 * 30,
        createdBy: "system",
        status: "deprecated"
      },
      {
        version: 2,
        encryptedValue: encrypt("current_password_456"),
        createdAt: Date.now() - 86400000,
        createdBy: "admin",
        status: "active"
      }
    ],
    metadata: {
      description: "Database connection password",
      tags: ["database", "production"],
      rotationPolicy: {
        enabled: true,
        intervalDays: 30,
        lastRotation: Date.now() - 86400000,
        nextRotation: Date.now() + 86400000 * 29
      },
      accessPolicy: {
        allowedServices: ["api-service", "worker-service"],
        requireMfa: true,
        maxAccessesPerHour: 100
      }
    },
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000
  };

  const apiKey: Secret = {
    id: "secret_2",
    name: "external/api-key",
    versions: [
      {
        version: 1,
        encryptedValue: encrypt("sk_live_abc123xyz"),
        createdAt: Date.now() - 86400000 * 60,
        createdBy: "system",
        status: "active"
      }
    ],
    metadata: {
      description: "External API key",
      tags: ["api", "external"],
      accessPolicy: {
        allowedServices: ["*"],
        requireMfa: false,
        maxAccessesPerHour: 1000
      }
    },
    createdAt: Date.now() - 86400000 * 60,
    updatedAt: Date.now() - 86400000 * 60
  };

  secrets.set(dbSecret.name, dbSecret);
  secrets.set(apiKey.name, apiKey);
  secretCounter = 2;
}

initializeSampleData();

export default async function fetch(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const headers = { "Content-Type": "application/json", ...corsHeaders };
  const serviceId = getServiceId(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Root endpoint
  if (url.pathname === "/" && req.method === "GET") {
    return new Response(JSON.stringify({
      name: "Secrets Manager",
      description: "Secure secrets management with versioning and access control",
      version: "1.0.0",
      endpoints: {
        "GET /secrets": "List all secrets (metadata only)",
        "GET /secrets/:name": "Get secret value (latest version)",
        "GET /secrets/:name/versions": "List all versions",
        "GET /secrets/:name/versions/:v": "Get specific version",
        "POST /secrets": "Create new secret",
        "POST /secrets/:name/rotate": "Rotate secret",
        "DELETE /secrets/:name": "Soft delete secret",
        "GET /audit": "View audit logs",
        "GET /audit/:secretId": "View audit logs for secret"
      }
    }, null, 2), { headers });
  }

  // List all secrets (metadata only)
  if (url.pathname === "/secrets" && req.method === "GET") {
    const secretList = Array.from(secrets.values()).map(s => ({
      id: s.id,
      name: s.name,
      currentVersion: s.versions.find(v => v.status === "active")?.version,
      tags: s.metadata.tags,
      rotationEnabled: s.metadata.rotationPolicy?.enabled,
      updatedAt: s.updatedAt
    }));
    return new Response(JSON.stringify({ secrets: secretList }), { headers });
  }

  // Create new secret
  if (url.pathname === "/secrets" && req.method === "POST") {
    const body = await req.json();

    if (!body.name || !body.value) {
      return new Response(JSON.stringify({ error: "name and value required" }), {
        status: 400,
        headers
      });
    }

    if (secrets.has(body.name)) {
      return new Response(JSON.stringify({ error: "Secret already exists" }), {
        status: 409,
        headers
      });
    }

    const secret: Secret = {
      id: `secret_${++secretCounter}`,
      name: body.name,
      versions: [{
        version: 1,
        encryptedValue: encrypt(body.value),
        createdAt: Date.now(),
        createdBy: serviceId,
        status: "active",
        expiresAt: body.expiresAt
      }],
      metadata: {
        description: body.description,
        tags: body.tags || [],
        rotationPolicy: body.rotationPolicy,
        accessPolicy: body.accessPolicy || {
          allowedServices: ["*"],
          requireMfa: false,
          maxAccessesPerHour: 1000
        }
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    secrets.set(secret.name, secret);
    logAudit(secret.id, "create", serviceId, `Created secret ${secret.name}`);

    return new Response(JSON.stringify({
      created: {
        id: secret.id,
        name: secret.name,
        version: 1
      }
    }), { headers, status: 201 });
  }

  // Get secret value
  const secretMatch = url.pathname.match(/^\/secrets\/([^/]+)$/);
  if (secretMatch && req.method === "GET") {
    const name = decodeURIComponent(secretMatch[1]);
    const secret = secrets.get(name);

    if (!secret) {
      logAudit("unknown", "access_denied", serviceId, `Secret not found: ${name}`);
      return new Response(JSON.stringify({ error: "Secret not found" }), {
        status: 404,
        headers
      });
    }

    if (!checkAccess(secret, serviceId)) {
      logAudit(secret.id, "access_denied", serviceId, "Insufficient permissions");
      return new Response(JSON.stringify({ error: "Access denied" }), {
        status: 403,
        headers
      });
    }

    const activeVersion = secret.versions.find(v => v.status === "active");
    if (!activeVersion) {
      return new Response(JSON.stringify({ error: "No active version" }), {
        status: 404,
        headers
      });
    }

    // Check expiration
    if (activeVersion.expiresAt && activeVersion.expiresAt < Date.now()) {
      return new Response(JSON.stringify({ error: "Secret has expired" }), {
        status: 410,
        headers
      });
    }

    logAudit(secret.id, "read", serviceId, `Read version ${activeVersion.version}`);

    return new Response(JSON.stringify({
      name: secret.name,
      value: decrypt(activeVersion.encryptedValue),
      version: activeVersion.version,
      expiresAt: activeVersion.expiresAt
    }), { headers });
  }

  // List versions
  const versionsMatch = url.pathname.match(/^\/secrets\/([^/]+)\/versions$/);
  if (versionsMatch && req.method === "GET") {
    const name = decodeURIComponent(versionsMatch[1]);
    const secret = secrets.get(name);

    if (!secret) {
      return new Response(JSON.stringify({ error: "Secret not found" }), {
        status: 404,
        headers
      });
    }

    const versions = secret.versions.map(v => ({
      version: v.version,
      status: v.status,
      createdAt: v.createdAt,
      createdBy: v.createdBy,
      expiresAt: v.expiresAt
    }));

    return new Response(JSON.stringify({ name, versions }), { headers });
  }

  // Get specific version
  const versionMatch = url.pathname.match(/^\/secrets\/([^/]+)\/versions\/(\d+)$/);
  if (versionMatch && req.method === "GET") {
    const name = decodeURIComponent(versionMatch[1]);
    const versionNum = parseInt(versionMatch[2]);
    const secret = secrets.get(name);

    if (!secret) {
      return new Response(JSON.stringify({ error: "Secret not found" }), {
        status: 404,
        headers
      });
    }

    if (!checkAccess(secret, serviceId)) {
      logAudit(secret.id, "access_denied", serviceId);
      return new Response(JSON.stringify({ error: "Access denied" }), {
        status: 403,
        headers
      });
    }

    const version = secret.versions.find(v => v.version === versionNum);
    if (!version) {
      return new Response(JSON.stringify({ error: "Version not found" }), {
        status: 404,
        headers
      });
    }

    if (version.status === "destroyed") {
      return new Response(JSON.stringify({ error: "Version has been destroyed" }), {
        status: 410,
        headers
      });
    }

    logAudit(secret.id, "read", serviceId, `Read version ${versionNum}`);

    return new Response(JSON.stringify({
      name: secret.name,
      value: decrypt(version.encryptedValue),
      version: version.version,
      status: version.status
    }), { headers });
  }

  // Rotate secret
  const rotateMatch = url.pathname.match(/^\/secrets\/([^/]+)\/rotate$/);
  if (rotateMatch && req.method === "POST") {
    const name = decodeURIComponent(rotateMatch[1]);
    const secret = secrets.get(name);

    if (!secret) {
      return new Response(JSON.stringify({ error: "Secret not found" }), {
        status: 404,
        headers
      });
    }

    const body = await req.json();
    if (!body.value) {
      return new Response(JSON.stringify({ error: "New value required" }), {
        status: 400,
        headers
      });
    }

    // Deprecate current active version
    const currentActive = secret.versions.find(v => v.status === "active");
    if (currentActive) {
      currentActive.status = "deprecated";
    }

    // Add new version
    const newVersion: SecretVersion = {
      version: secret.versions.length + 1,
      encryptedValue: encrypt(body.value),
      createdAt: Date.now(),
      createdBy: serviceId,
      status: "active",
      expiresAt: body.expiresAt
    };

    secret.versions.push(newVersion);
    secret.updatedAt = Date.now();

    if (secret.metadata.rotationPolicy) {
      secret.metadata.rotationPolicy.lastRotation = Date.now();
      secret.metadata.rotationPolicy.nextRotation =
        Date.now() + secret.metadata.rotationPolicy.intervalDays * 86400000;
    }

    logAudit(secret.id, "rotate", serviceId, `Rotated to version ${newVersion.version}`);

    return new Response(JSON.stringify({
      rotated: {
        name: secret.name,
        newVersion: newVersion.version,
        previousVersion: currentActive?.version
      }
    }), { headers });
  }

  // Audit logs
  if (url.pathname === "/audit" && req.method === "GET") {
    const limit = parseInt(url.searchParams.get("limit") || "100");
    return new Response(JSON.stringify({
      logs: auditLogs.slice(-limit).reverse()
    }), { headers });
  }

  const auditMatch = url.pathname.match(/^\/audit\/([^/]+)$/);
  if (auditMatch && req.method === "GET") {
    const secretId = auditMatch[1];
    const logs = auditLogs.filter(l => l.secretId === secretId);
    return new Response(JSON.stringify({ logs: logs.reverse() }), { headers });
  }

  // Health check
  if (url.pathname === "/health" && req.method === "GET") {
    return new Response(JSON.stringify({
      status: "healthy",
      secretCount: secrets.size,
      auditLogCount: auditLogs.length
    }), { headers });
  }

  return new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers
  });
}

console.log("Secrets Manager ready on http://localhost:8080");
console.log("Use X-Service-Id header for access control");
