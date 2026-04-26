import type { WSContext } from 'hono/ws';

interface ConnectedClient {
  ws: WSContext;
  userId: string;
}

// userId → Set of WebSocket connections (multi-device support)
const connections = new Map<string, Set<ConnectedClient>>();

export function addConnection(userId: string, ws: WSContext): void {
  let userConnections = connections.get(userId);
  if (!userConnections) {
    userConnections = new Set();
    connections.set(userId, userConnections);
  }
  userConnections.add({ ws, userId });
}

export function removeConnection(userId: string, ws: WSContext): void {
  const userConnections = connections.get(userId);
  if (!userConnections) return;

  for (const client of userConnections) {
    if (client.ws === ws) {
      userConnections.delete(client);
      break;
    }
  }

  if (userConnections.size === 0) {
    connections.delete(userId);
  }
}

export function isOnline(userId: string): boolean {
  const userConnections = connections.get(userId);
  return !!userConnections && userConnections.size > 0;
}

export function getConnectionCount(userId: string): number {
  return connections.get(userId)?.size ?? 0;
}

export function sendToUser(userId: string, data: unknown): void {
  const userConnections = connections.get(userId);
  if (!userConnections) return;

  const message = JSON.stringify(data);
  for (const client of userConnections) {
    client.ws.send(message);
  }
}

export function sendToUserExcept(userId: string, excludeWs: WSContext, data: unknown): void {
  const userConnections = connections.get(userId);
  if (!userConnections) return;

  const message = JSON.stringify(data);
  for (const client of userConnections) {
    if (client.ws !== excludeWs) {
      client.ws.send(message);
    }
  }
}

export function getOnlineUserIds(): string[] {
  return Array.from(connections.keys());
}
