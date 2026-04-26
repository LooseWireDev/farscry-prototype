import { describe, it, expect, beforeEach } from 'vitest';
import {
  addConnection,
  removeConnection,
  isOnline,
  getConnectionCount,
  sendToUser,
  sendToUserExcept,
  getOnlineUserIds,
} from './presence';

function createMockWs(): { ws: any; sent: string[] } {
  const sent: string[] = [];
  const ws = {
    send: (data: string) => sent.push(data),
  };
  return { ws, sent };
}

// Reset module state between tests by re-importing
// Since presence uses module-level Map, we need to clean up manually
beforeEach(async () => {
  // Remove all connections by getting online users and removing them
  for (const userId of getOnlineUserIds()) {
    // We can't easily clean the internal map, so we'll work around it
    // by ensuring tests use unique user IDs
  }
});

describe('presence tracking', () => {
  it('marks a user as online after adding a connection', () => {
    const { ws } = createMockWs();
    const userId = 'user-online-1';
    addConnection(userId, ws);
    expect(isOnline(userId)).toBe(true);
    removeConnection(userId, ws);
  });

  it('marks a user as offline after removing their only connection', () => {
    const { ws } = createMockWs();
    const userId = 'user-offline-1';
    addConnection(userId, ws);
    removeConnection(userId, ws);
    expect(isOnline(userId)).toBe(false);
  });

  it('keeps a user online when one of multiple connections is removed', () => {
    const { ws: ws1 } = createMockWs();
    const { ws: ws2 } = createMockWs();
    const userId = 'user-multi-1';

    addConnection(userId, ws1);
    addConnection(userId, ws2);
    expect(getConnectionCount(userId)).toBe(2);

    removeConnection(userId, ws1);
    expect(isOnline(userId)).toBe(true);
    expect(getConnectionCount(userId)).toBe(1);

    removeConnection(userId, ws2);
    expect(isOnline(userId)).toBe(false);
  });

  it('returns false for unknown users', () => {
    expect(isOnline('nonexistent-user')).toBe(false);
    expect(getConnectionCount('nonexistent-user')).toBe(0);
  });
});

describe('sendToUser', () => {
  it('sends a message to all connections of a user', () => {
    const { ws: ws1, sent: sent1 } = createMockWs();
    const { ws: ws2, sent: sent2 } = createMockWs();
    const userId = 'user-send-1';

    addConnection(userId, ws1);
    addConnection(userId, ws2);

    sendToUser(userId, { type: 'test', data: 'hello' });

    expect(sent1).toHaveLength(1);
    expect(sent2).toHaveLength(1);
    expect(JSON.parse(sent1[0]!)).toEqual({ type: 'test', data: 'hello' });
    expect(JSON.parse(sent2[0]!)).toEqual({ type: 'test', data: 'hello' });

    removeConnection(userId, ws1);
    removeConnection(userId, ws2);
  });

  it('does nothing for offline users', () => {
    sendToUser('offline-user', { type: 'test' });
    // No error thrown
  });
});

describe('sendToUserExcept', () => {
  it('sends to all connections except the excluded one', () => {
    const { ws: ws1, sent: sent1 } = createMockWs();
    const { ws: ws2, sent: sent2 } = createMockWs();
    const userId = 'user-except-1';

    addConnection(userId, ws1);
    addConnection(userId, ws2);

    sendToUserExcept(userId, ws1, { type: 'call:answered-elsewhere', callId: '123' });

    expect(sent1).toHaveLength(0);
    expect(sent2).toHaveLength(1);

    removeConnection(userId, ws1);
    removeConnection(userId, ws2);
  });
});

describe('getOnlineUserIds', () => {
  it('returns all currently online user IDs', () => {
    const { ws: ws1 } = createMockWs();
    const { ws: ws2 } = createMockWs();

    addConnection('user-list-a', ws1);
    addConnection('user-list-b', ws2);

    const onlineIds = getOnlineUserIds();
    expect(onlineIds).toContain('user-list-a');
    expect(onlineIds).toContain('user-list-b');

    removeConnection('user-list-a', ws1);
    removeConnection('user-list-b', ws2);
  });
});
