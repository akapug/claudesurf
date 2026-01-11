/**
 * NanoChat Lite - Beta11-rc1 Fetch Handler Pattern
 *
 * Lightweight chat service with:
 * - Room-based messaging
 * - Long-polling for real-time updates
 * - Message history
 */

// Native Elide beta11-rc1 HTTP

interface Message {
  id: string;
  room: string;
  user: string;
  content: string;
  timestamp: number;
}

interface Room {
  id: string;
  name: string;
  messages: Message[];
  users: Set<string>;
}

class ChatService {
  private rooms: Map<string, Room> = new Map();
  private messageIdCounter = 0;

  constructor() {
    // Create default room
    this.createRoom("general", "General");
    this.createRoom("random", "Random");
  }

  createRoom(id: string, name: string): Room {
    const room: Room = { id, name, messages: [], users: new Set() };
    this.rooms.set(id, room);
    return room;
  }

  getRoom(id: string): Room | undefined {
    return this.rooms.get(id);
  }

  listRooms(): Array<{ id: string; name: string; userCount: number; messageCount: number }> {
    return Array.from(this.rooms.values()).map(r => ({
      id: r.id,
      name: r.name,
      userCount: r.users.size,
      messageCount: r.messages.length
    }));
  }

  joinRoom(roomId: string, user: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    room.users.add(user);
    this.sendMessage(roomId, "system", `${user} joined the room`);
    return true;
  }

  leaveRoom(roomId: string, user: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    room.users.delete(user);
    this.sendMessage(roomId, "system", `${user} left the room`);
    return true;
  }

  sendMessage(roomId: string, user: string, content: string): Message | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const message: Message = {
      id: `msg_${++this.messageIdCounter}`,
      room: roomId,
      user,
      content,
      timestamp: Date.now()
    };

    room.messages.push(message);
    // Keep last 100 messages per room
    if (room.messages.length > 100) room.messages.shift();

    return message;
  }

  getMessages(roomId: string, since?: number): Message[] {
    const room = this.rooms.get(roomId);
    if (!room) return [];
    if (since) {
      return room.messages.filter(m => m.timestamp > since);
    }
    return room.messages.slice(-50);
  }
}

const chat = new ChatService();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-User",
};

/**
 * Beta11-rc1 Fetch Handler
 */
export default async function fetch(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const user = req.headers.get("X-User") || "anonymous";

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Health check
  if (path === "/health" || path === "/") {
    const rooms = chat.listRooms();
    return Response.json({
      status: "healthy",
      service: "NanoChat Lite",
      rooms: rooms.length,
      totalMessages: rooms.reduce((a, r) => a + r.messageCount, 0)
    }, { headers: corsHeaders });
  }

  // List rooms
  if (path === "/api/rooms" && req.method === "GET") {
    return Response.json({ rooms: chat.listRooms() }, { headers: corsHeaders });
  }

  // Create room
  if (path === "/api/rooms" && req.method === "POST") {
    const { id, name } = await req.json();
    const room = chat.createRoom(id, name);
    return Response.json({ room: { id: room.id, name: room.name } }, { headers: corsHeaders });
  }

  // Join room
  if (path.match(/^\/api\/rooms\/[\w-]+\/join$/) && req.method === "POST") {
    const roomId = path.split("/")[3];
    const success = chat.joinRoom(roomId, user);
    return Response.json({ success, room: roomId, user }, { headers: corsHeaders });
  }

  // Leave room
  if (path.match(/^\/api\/rooms\/[\w-]+\/leave$/) && req.method === "POST") {
    const roomId = path.split("/")[3];
    const success = chat.leaveRoom(roomId, user);
    return Response.json({ success, room: roomId, user }, { headers: corsHeaders });
  }

  // Send message
  if (path.match(/^\/api\/rooms\/[\w-]+\/messages$/) && req.method === "POST") {
    const roomId = path.split("/")[3];
    const { content } = await req.json();
    const message = chat.sendMessage(roomId, user, content);
    if (!message) {
      return Response.json({ error: "Room not found" }, { status: 404, headers: corsHeaders });
    }
    return Response.json({ message }, { headers: corsHeaders });
  }

  // Get messages (long-polling style)
  if (path.match(/^\/api\/rooms\/[\w-]+\/messages$/) && req.method === "GET") {
    const roomId = path.split("/")[3];
    const since = url.searchParams.get("since");
    const messages = chat.getMessages(roomId, since ? parseInt(since) : undefined);
    return Response.json({ messages, count: messages.length }, { headers: corsHeaders });
  }

  return Response.json({ error: "Not Found" }, { status: 404, headers: corsHeaders });
}
