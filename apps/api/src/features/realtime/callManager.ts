import { eq } from 'drizzle-orm';
import { db } from '../../auth/auth';
import { calls, user } from '../../db/schema';
import { sendToUser, sendToUserExcept } from './presence';
import type { WSContext } from 'hono/ws';

const RING_TIMEOUT_MS = 30_000;
const activeTimers = new Map<string, ReturnType<typeof setTimeout>>();

export async function initiateCall(
  callerId: string,
  calleeId: string,
): Promise<{ callId: string }> {
  const callerProfile = await db
    .select({
      id: user.id,
      username: user.username,
      displayId: user.displayId,
      avatarUrl: user.avatarUrl,
    })
    .from(user)
    .where(eq(user.id, callerId))
    .limit(1);

  const result = await db
    .insert(calls)
    .values({
      callerId,
      calleeId,
      status: 'ringing',
      startedAt: new Date(),
    })
    .returning({ id: calls.id });

  const callId = result[0]!.id;

  sendToUser(calleeId, {
    type: 'call:incoming',
    callId,
    caller: callerProfile[0]!,
  });

  // Auto-miss after 30 seconds
  const timer = setTimeout(async () => {
    activeTimers.delete(callId);
    await db
      .update(calls)
      .set({ status: 'missed', endedAt: new Date() })
      .where(eq(calls.id, callId));
    sendToUser(callerId, { type: 'call:hangup', callId });
    sendToUser(calleeId, { type: 'call:cancelled', callId });
  }, RING_TIMEOUT_MS);

  activeTimers.set(callId, timer);

  return { callId };
}

export async function answerCall(
  callId: string,
  userId: string,
  answeringWs: WSContext,
): Promise<void> {
  clearCallTimer(callId);

  const now = new Date();
  await db
    .update(calls)
    .set({ status: 'answered', answeredAt: now })
    .where(eq(calls.id, callId));

  const call = await getCall(callId);
  if (!call) return;

  const otherUserId = call.callerId === userId ? call.calleeId : call.callerId;

  sendToUser(otherUserId, { type: 'call:answered', callId });

  // Notify other devices of the answering user
  sendToUserExcept(userId, answeringWs, {
    type: 'call:answered-elsewhere',
    callId,
  });
}

export async function declineCall(callId: string, userId: string): Promise<void> {
  clearCallTimer(callId);

  await db
    .update(calls)
    .set({ status: 'declined', endedAt: new Date() })
    .where(eq(calls.id, callId));

  const call = await getCall(callId);
  if (!call) return;

  const otherUserId = call.callerId === userId ? call.calleeId : call.callerId;
  sendToUser(otherUserId, { type: 'call:declined', callId });
}

export async function hangupCall(callId: string, userId: string): Promise<void> {
  clearCallTimer(callId);

  const call = await getCall(callId);
  if (!call) return;

  const now = new Date();
  const duration =
    call.answeredAt
      ? Math.round((now.getTime() - call.answeredAt.getTime()) / 1000)
      : null;

  const newStatus = call.status === 'ringing' ? 'missed' : 'ended';

  await db
    .update(calls)
    .set({ status: newStatus, endedAt: now, duration })
    .where(eq(calls.id, callId));

  const otherUserId = call.callerId === userId ? call.calleeId : call.callerId;
  sendToUser(otherUserId, {
    type: newStatus === 'missed' ? 'call:cancelled' : 'call:hangup',
    callId,
  });
}

export function relayIceCandidate(
  callId: string,
  fromUserId: string,
  toUserId: string,
  candidate: unknown,
): void {
  sendToUser(toUserId, { type: 'call:ice-candidate', callId, candidate });
}

export function relaySdp(
  callId: string,
  fromUserId: string,
  toUserId: string,
  sdp: unknown,
): void {
  sendToUser(toUserId, { type: 'call:sdp', callId, sdp });
}

async function getCall(callId: string): Promise<{
  callerId: string;
  calleeId: string;
  status: string;
  answeredAt: Date | null;
} | null> {
  const result = await db
    .select({
      callerId: calls.callerId,
      calleeId: calls.calleeId,
      status: calls.status,
      answeredAt: calls.answeredAt,
    })
    .from(calls)
    .where(eq(calls.id, callId))
    .limit(1);

  return result[0] ?? null;
}

function clearCallTimer(callId: string): void {
  const timer = activeTimers.get(callId);
  if (timer) {
    clearTimeout(timer);
    activeTimers.delete(callId);
  }
}
