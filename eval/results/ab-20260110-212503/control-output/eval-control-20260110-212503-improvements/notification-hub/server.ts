/**
 * Notification Hub
 *
 * A comprehensive notification service supporting:
 * - Multiple channels (email, push, SMS, webhook)
 * - Templates and personalization
 * - Delivery tracking and retries
 * - Rate limiting and batching
 * - Preference management
 */

interface Notification {
  id: string;
  channel: NotificationChannel;
  recipient: Recipient;
  template: string;
  data: Record<string, unknown>;
  status: NotificationStatus;
  priority: "high" | "normal" | "low";
  scheduledAt?: number;
  sentAt?: number;
  deliveredAt?: number;
  failedAt?: number;
  retryCount: number;
  error?: string;
  createdAt: number;
}

type NotificationChannel = "email" | "push" | "sms" | "webhook" | "in_app";
type NotificationStatus = "pending" | "scheduled" | "sending" | "sent" | "delivered" | "failed" | "cancelled";

interface Recipient {
  id: string;
  email?: string;
  phone?: string;
  deviceToken?: string;
  webhookUrl?: string;
}

interface Template {
  id: string;
  name: string;
  channel: NotificationChannel;
  subject?: string;
  body: string;
  variables: string[];
  createdAt: number;
}

interface ChannelConfig {
  name: NotificationChannel;
  enabled: boolean;
  rateLimit: number; // per minute
  retryAttempts: number;
  retryDelayMs: number;
  stats: ChannelStats;
}

interface ChannelStats {
  totalSent: number;
  delivered: number;
  failed: number;
  pending: number;
}

interface UserPreferences {
  userId: string;
  channels: {
    [key in NotificationChannel]?: {
      enabled: boolean;
      quietHoursStart?: number; // hour 0-23
      quietHoursEnd?: number;
    };
  };
  unsubscribedFrom: string[]; // template IDs
}

const notifications: Map<string, Notification> = new Map();
const templates: Map<string, Template> = new Map();
const preferences: Map<string, UserPreferences> = new Map();
let notificationCounter = 0;

const channels: Map<NotificationChannel, ChannelConfig> = new Map([
  ["email", {
    name: "email",
    enabled: true,
    rateLimit: 100,
    retryAttempts: 3,
    retryDelayMs: 60000,
    stats: { totalSent: 15420, delivered: 15200, failed: 220, pending: 5 }
  }],
  ["push", {
    name: "push",
    enabled: true,
    rateLimit: 500,
    retryAttempts: 2,
    retryDelayMs: 30000,
    stats: { totalSent: 89000, delivered: 87500, failed: 1500, pending: 12 }
  }],
  ["sms", {
    name: "sms",
    enabled: true,
    rateLimit: 50,
    retryAttempts: 2,
    retryDelayMs: 120000,
    stats: { totalSent: 2340, delivered: 2300, failed: 40, pending: 3 }
  }],
  ["webhook", {
    name: "webhook",
    enabled: true,
    rateLimit: 200,
    retryAttempts: 5,
    retryDelayMs: 10000,
    stats: { totalSent: 45000, delivered: 44800, failed: 200, pending: 8 }
  }],
  ["in_app", {
    name: "in_app",
    enabled: true,
    rateLimit: 1000,
    retryAttempts: 1,
    retryDelayMs: 5000,
    stats: { totalSent: 120000, delivered: 120000, failed: 0, pending: 0 }
  }]
]);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

// Initialize sample templates
function initializeTemplates(): void {
  const welcomeEmail: Template = {
    id: "tmpl_welcome",
    name: "welcome_email",
    channel: "email",
    subject: "Welcome to {{appName}}!",
    body: "Hi {{userName}}, welcome to {{appName}}. Get started at {{dashboardUrl}}.",
    variables: ["appName", "userName", "dashboardUrl"],
    createdAt: Date.now() - 86400000 * 30
  };

  const orderConfirm: Template = {
    id: "tmpl_order",
    name: "order_confirmation",
    channel: "email",
    subject: "Order #{{orderId}} Confirmed",
    body: "Your order #{{orderId}} for ${{total}} has been confirmed. Track at {{trackingUrl}}.",
    variables: ["orderId", "total", "trackingUrl"],
    createdAt: Date.now() - 86400000 * 20
  };

  const alertPush: Template = {
    id: "tmpl_alert",
    name: "security_alert",
    channel: "push",
    body: "Security alert: {{alertMessage}}. Action required: {{actionUrl}}",
    variables: ["alertMessage", "actionUrl"],
    createdAt: Date.now() - 86400000 * 15
  };

  templates.set(welcomeEmail.name, welcomeEmail);
  templates.set(orderConfirm.name, orderConfirm);
  templates.set(alertPush.name, alertPush);
}

initializeTemplates();

function renderTemplate(template: Template, data: Record<string, unknown>): { subject?: string; body: string } {
  let body = template.body;
  let subject = template.subject;

  for (const variable of template.variables) {
    const value = String(data[variable] || "");
    body = body.replace(new RegExp(`{{${variable}}}`, "g"), value);
    if (subject) {
      subject = subject.replace(new RegExp(`{{${variable}}}`, "g"), value);
    }
  }

  return { subject, body };
}

function checkQuietHours(prefs: UserPreferences, channel: NotificationChannel): boolean {
  const channelPrefs = prefs.channels[channel];
  if (!channelPrefs?.quietHoursStart || !channelPrefs?.quietHoursEnd) return true;

  const hour = new Date().getUTCHours();
  const start = channelPrefs.quietHoursStart;
  const end = channelPrefs.quietHoursEnd;

  if (start <= end) {
    return hour < start || hour >= end;
  }
  return hour >= end && hour < start;
}

function simulateSend(notification: Notification): void {
  // Simulate async delivery
  setTimeout(() => {
    const success = Math.random() > 0.05; // 95% success rate
    if (success) {
      notification.status = "delivered";
      notification.deliveredAt = Date.now();
      const channel = channels.get(notification.channel);
      if (channel) channel.stats.delivered++;
    } else if (notification.retryCount < (channels.get(notification.channel)?.retryAttempts || 0)) {
      notification.retryCount++;
      notification.status = "pending";
    } else {
      notification.status = "failed";
      notification.failedAt = Date.now();
      notification.error = "Max retries exceeded";
      const channel = channels.get(notification.channel);
      if (channel) channel.stats.failed++;
    }
  }, Math.random() * 2000 + 500);
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
      name: "Notification Hub",
      description: "Multi-channel notification service with templates and tracking",
      version: "1.0.0",
      endpoints: {
        "POST /send": "Send notification",
        "POST /send/batch": "Send batch notifications",
        "GET /notifications": "List notifications",
        "GET /notifications/:id": "Get notification status",
        "GET /templates": "List templates",
        "POST /templates": "Create template",
        "GET /channels": "List channel configurations",
        "PUT /channels/:name": "Update channel config",
        "GET /preferences/:userId": "Get user preferences",
        "PUT /preferences/:userId": "Update user preferences",
        "GET /stats": "Get delivery statistics"
      }
    }, null, 2), { headers });
  }

  // Send notification
  if (url.pathname === "/send" && req.method === "POST") {
    const body = await req.json();

    if (!body.channel || !body.recipient) {
      return new Response(JSON.stringify({ error: "channel and recipient required" }), {
        status: 400,
        headers
      });
    }

    const channel = channels.get(body.channel);
    if (!channel?.enabled) {
      return new Response(JSON.stringify({ error: "Channel not available" }), {
        status: 400,
        headers
      });
    }

    // Check user preferences
    if (body.recipient.id) {
      const prefs = preferences.get(body.recipient.id);
      if (prefs) {
        if (prefs.channels[body.channel]?.enabled === false) {
          return new Response(JSON.stringify({
            error: "User has disabled this channel",
            skipped: true
          }), { status: 200, headers });
        }
        if (!checkQuietHours(prefs, body.channel)) {
          // Schedule for later
          body.scheduledAt = Date.now() + 3600000; // 1 hour
        }
      }
    }

    let rendered = { subject: body.subject, body: body.body };
    if (body.template) {
      const template = templates.get(body.template);
      if (!template) {
        return new Response(JSON.stringify({ error: "Template not found" }), {
          status: 404,
          headers
        });
      }
      rendered = renderTemplate(template, body.data || {});
    }

    const notification: Notification = {
      id: `notif_${++notificationCounter}`,
      channel: body.channel,
      recipient: body.recipient,
      template: body.template || "custom",
      data: { ...body.data, rendered },
      status: body.scheduledAt ? "scheduled" : "sending",
      priority: body.priority || "normal",
      scheduledAt: body.scheduledAt,
      retryCount: 0,
      createdAt: Date.now()
    };

    notifications.set(notification.id, notification);
    channel.stats.totalSent++;
    channel.stats.pending++;

    if (!body.scheduledAt) {
      notification.sentAt = Date.now();
      simulateSend(notification);
    }

    return new Response(JSON.stringify({
      notification: {
        id: notification.id,
        status: notification.status,
        channel: notification.channel,
        scheduledAt: notification.scheduledAt
      }
    }), { headers, status: 201 });
  }

  // Batch send
  if (url.pathname === "/send/batch" && req.method === "POST") {
    const body = await req.json();

    if (!Array.isArray(body.notifications)) {
      return new Response(JSON.stringify({ error: "notifications array required" }), {
        status: 400,
        headers
      });
    }

    const results: { id: string; status: string }[] = [];

    for (const item of body.notifications) {
      const channel = channels.get(item.channel);
      if (!channel?.enabled) continue;

      const notification: Notification = {
        id: `notif_${++notificationCounter}`,
        channel: item.channel,
        recipient: item.recipient,
        template: item.template || "custom",
        data: item.data || {},
        status: "sending",
        priority: item.priority || "normal",
        retryCount: 0,
        createdAt: Date.now(),
        sentAt: Date.now()
      };

      notifications.set(notification.id, notification);
      channel.stats.totalSent++;
      simulateSend(notification);
      results.push({ id: notification.id, status: notification.status });
    }

    return new Response(JSON.stringify({
      batch: {
        total: body.notifications.length,
        queued: results.length,
        results
      }
    }), { headers, status: 201 });
  }

  // List notifications
  if (url.pathname === "/notifications" && req.method === "GET") {
    const channel = url.searchParams.get("channel") as NotificationChannel | null;
    const status = url.searchParams.get("status") as NotificationStatus | null;
    const limit = parseInt(url.searchParams.get("limit") || "50");

    let list = Array.from(notifications.values());
    if (channel) list = list.filter(n => n.channel === channel);
    if (status) list = list.filter(n => n.status === status);

    list.sort((a, b) => b.createdAt - a.createdAt);
    list = list.slice(0, limit);

    return new Response(JSON.stringify({ notifications: list }), { headers });
  }

  // Get notification
  const notifMatch = url.pathname.match(/^\/notifications\/([^/]+)$/);
  if (notifMatch && req.method === "GET") {
    const notification = notifications.get(notifMatch[1]);
    if (!notification) {
      return new Response(JSON.stringify({ error: "Notification not found" }), {
        status: 404,
        headers
      });
    }
    return new Response(JSON.stringify({ notification }), { headers });
  }

  // List templates
  if (url.pathname === "/templates" && req.method === "GET") {
    return new Response(JSON.stringify({
      templates: Array.from(templates.values())
    }), { headers });
  }

  // Create template
  if (url.pathname === "/templates" && req.method === "POST") {
    const body = await req.json();

    if (!body.name || !body.channel || !body.body) {
      return new Response(JSON.stringify({ error: "name, channel, and body required" }), {
        status: 400,
        headers
      });
    }

    const template: Template = {
      id: `tmpl_${Date.now()}`,
      name: body.name,
      channel: body.channel,
      subject: body.subject,
      body: body.body,
      variables: body.variables || [],
      createdAt: Date.now()
    };

    templates.set(template.name, template);

    return new Response(JSON.stringify({ template }), { headers, status: 201 });
  }

  // List channels
  if (url.pathname === "/channels" && req.method === "GET") {
    return new Response(JSON.stringify({
      channels: Array.from(channels.values())
    }), { headers });
  }

  // Update channel
  const channelMatch = url.pathname.match(/^\/channels\/([^/]+)$/);
  if (channelMatch && req.method === "PUT") {
    const channelName = channelMatch[1] as NotificationChannel;
    const channel = channels.get(channelName);

    if (!channel) {
      return new Response(JSON.stringify({ error: "Channel not found" }), {
        status: 404,
        headers
      });
    }

    const body = await req.json();
    if (body.enabled !== undefined) channel.enabled = body.enabled;
    if (body.rateLimit) channel.rateLimit = body.rateLimit;
    if (body.retryAttempts) channel.retryAttempts = body.retryAttempts;

    return new Response(JSON.stringify({ channel }), { headers });
  }

  // Get/update preferences
  const prefsMatch = url.pathname.match(/^\/preferences\/([^/]+)$/);
  if (prefsMatch) {
    const userId = prefsMatch[1];

    if (req.method === "GET") {
      const prefs = preferences.get(userId) || {
        userId,
        channels: {},
        unsubscribedFrom: []
      };
      return new Response(JSON.stringify({ preferences: prefs }), { headers });
    }

    if (req.method === "PUT") {
      const body = await req.json();
      const prefs: UserPreferences = {
        userId,
        channels: body.channels || {},
        unsubscribedFrom: body.unsubscribedFrom || []
      };
      preferences.set(userId, prefs);
      return new Response(JSON.stringify({ preferences: prefs }), { headers });
    }
  }

  // Statistics
  if (url.pathname === "/stats" && req.method === "GET") {
    const channelStats: Record<string, ChannelStats> = {};
    let totals = { sent: 0, delivered: 0, failed: 0, pending: 0 };

    for (const [name, channel] of channels) {
      channelStats[name] = channel.stats;
      totals.sent += channel.stats.totalSent;
      totals.delivered += channel.stats.delivered;
      totals.failed += channel.stats.failed;
      totals.pending += channel.stats.pending;
    }

    return new Response(JSON.stringify({
      totals,
      byChannel: channelStats,
      deliveryRate: totals.sent > 0 ? ((totals.delivered / totals.sent) * 100).toFixed(2) + "%" : "N/A"
    }), { headers });
  }

  // Health check
  if (url.pathname === "/health" && req.method === "GET") {
    return new Response(JSON.stringify({
      status: "healthy",
      channels: Array.from(channels.entries()).map(([name, c]) => ({
        name,
        enabled: c.enabled
      }))
    }), { headers });
  }

  return new Response(JSON.stringify({ error: "Not found" }), {
    status: 404,
    headers
  });
}

console.log("Notification Hub ready on http://localhost:8080");
console.log("Channels: email, push, sms, webhook, in_app");
