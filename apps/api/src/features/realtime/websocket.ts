import { Hono } from 'hono';
import { createNodeWebSocket } from '@hono/node-ws';
import { auth } from '../../auth/auth';
import { addConnection, removeConnection, sendToUser } from './presence';
import { clientEventSchema } from './types';
import type { ServerEvent } from './types';
import {
  initiateCall,
  answerCall,
  declineCall,
  hangupCall,
  relayIceCandidate,
  relaySdp,
} from './callManager';
import { eq } from 'drizzle-orm';
import { db } from '../../auth/auth';
import { calls } from '../../db/schema';

export const wsApp = new Hono();

export const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app: wsApp });

wsApp.get(
  '/ws',
  upgradeWebSocket(async (c) => {
    let userId: string | null = null;

    return {
      async onOpen(_event, ws) {
        // Authenticate via session cookie (sent automatically by browser on WS upgrade)
        const session = await auth.api.getSession({ headers: c.req.raw.headers });

        if (!session?.user?.id) {
          ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated' } satisfies ServerEvent));
          ws.close(1008, 'Not authenticated');
          return;
        }

        userId = session.user.id;
        addConnection(userId, ws);
      },

      async onMessage(event, ws) {
        if (!userId) return;

        const parsed = clientEventSchema.safeParse(
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data,
        );

        if (!parsed.success) {
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' } satisfies ServerEvent));
          return;
        }

        const msg = parsed.data;

        // WebSocket message handler is an entry point — wrap to prevent process crash on bad input
        try {
          switch (msg.type) {
            case 'call:initiate': {
              const { callId } = await initiateCall(userId, msg.calleeId);
              ws.send(JSON.stringify({ type: 'call:initiated', callId } satisfies ServerEvent));
              break;
            }

            case 'call:answer': {
              await answerCall(msg.callId, userId, ws);
              break;
            }

            case 'call:decline': {
              await declineCall(msg.callId, userId);
              break;
            }

            case 'call:hangup': {
              await hangupCall(msg.callId, userId);
              break;
            }

            case 'call:ice-candidate': {
              const call = await getCallPeer(msg.callId, userId);
              if (call) {
                relayIceCandidate(msg.callId, userId, call.peerId, msg.candidate);
              }
              break;
            }

            case 'call:sdp': {
              const call = await getCallPeer(msg.callId, userId);
              if (call) {
                relaySdp(msg.callId, userId, call.peerId, msg.sdp);
              }
              break;
            }
          }
        } catch (err) {
          console.error(`[ws] error handling ${msg.type}:`, err);
          ws.send(JSON.stringify({ type: 'error', message: 'Server error' } satisfies ServerEvent));
        }
      },

      onClose() {
        if (userId) {
          removeConnection(userId, arguments[1]);
        }
      },
    };
  }),
);

async function getCallPeer(
  callId: string,
  userId: string,
): Promise<{ peerId: string } | null> {
  const result = await db
    .select({ callerId: calls.callerId, calleeId: calls.calleeId })
    .from(calls)
    .where(eq(calls.id, callId))
    .limit(1);

  if (result.length === 0) return null;

  const call = result[0]!;
  const peerId = call.callerId === userId ? call.calleeId : call.callerId;
  return { peerId };
}
