import { z } from 'zod';

// ─── Server → Client Events ────────────────────────────────────────────────

export const serverEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('call:incoming'), callId: z.string(), caller: z.object({ id: z.string(), username: z.string().nullable(), displayId: z.string().nullable(), avatarUrl: z.string().nullable() }) }),
  z.object({ type: z.literal('call:initiated'), callId: z.string() }),
  z.object({ type: z.literal('call:answered'), callId: z.string() }),
  z.object({ type: z.literal('call:declined'), callId: z.string() }),
  z.object({ type: z.literal('call:hangup'), callId: z.string() }),
  z.object({ type: z.literal('call:cancelled'), callId: z.string() }),
  z.object({ type: z.literal('call:answered-elsewhere'), callId: z.string() }),
  z.object({ type: z.literal('call:ice-candidate'), callId: z.string(), candidate: z.unknown() }),
  z.object({ type: z.literal('call:sdp'), callId: z.string(), sdp: z.unknown() }),
  z.object({ type: z.literal('presence:online'), userId: z.string() }),
  z.object({ type: z.literal('presence:offline'), userId: z.string() }),
  z.object({ type: z.literal('error'), message: z.string() }),
]);

export type ServerEvent = z.infer<typeof serverEventSchema>;

// ─── Client → Server Events ────────────────────────────────────────────────

export const clientEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('call:initiate'), calleeId: z.string().min(1).max(64) }),
  z.object({ type: z.literal('call:answer'), callId: z.string() }),
  z.object({ type: z.literal('call:decline'), callId: z.string() }),
  z.object({ type: z.literal('call:hangup'), callId: z.string() }),
  z.object({ type: z.literal('call:ice-candidate'), callId: z.string(), candidate: z.unknown() }),
  z.object({ type: z.literal('call:sdp'), callId: z.string(), sdp: z.unknown() }),
]);

export type ClientEvent = z.infer<typeof clientEventSchema>;
