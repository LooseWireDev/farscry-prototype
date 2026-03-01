/**
 * WebSocket message types exchanged between the mobile app and signaling server.
 *
 * The signaling server never handles media — it only brokers call setup
 * by relaying SDP offers/answers and ICE candidates between peers.
 */

// Client → Server messages

export interface RegisterMessage {
  type: 'register';
  userId: string;
  token: string;
  pushToken?: {
    token: string;
    platform: 'ios' | 'android';
    voipToken?: string;
  };
}

export interface CallOfferMessage {
  type: 'call:offer';
  callId: string;
  targetUserId: string;
  sdp: string;
}

export interface CallAnswerMessage {
  type: 'call:answer';
  callId: string;
  targetUserId: string;
  sdp: string;
}

export interface IceCandidateMessage {
  type: 'ice:candidate';
  callId: string;
  targetUserId: string;
  candidate: string;
  sdpMid: string | null;
  sdpMLineIndex: number | null;
}

export interface CallDeclineMessage {
  type: 'call:decline';
  callId: string;
  targetUserId: string;
  reason: 'declined' | 'busy';
}

export interface CallHangupMessage {
  type: 'call:hangup';
  callId: string;
  targetUserId: string;
}

export interface CallCancelMessage {
  type: 'call:cancel';
  callId: string;
  targetUserId: string;
}

export interface PingMessage {
  type: 'ping';
}

// Server → Client messages

export interface CallIncomingMessage {
  type: 'call:incoming';
  callId: string;
  callerId: string;
  callerName: string;
  sdp: string;
}

export interface CallAnsweredMessage {
  type: 'call:answered';
  callId: string;
  sdp: string;
}

export interface IceCandidateRelayMessage {
  type: 'ice:candidate';
  callId: string;
  candidate: string;
  sdpMid: string | null;
  sdpMLineIndex: number | null;
}

export interface CallDeclinedMessage {
  type: 'call:declined';
  callId: string;
  reason: 'declined' | 'busy';
}

export interface CallHungUpMessage {
  type: 'call:hungup';
  callId: string;
}

export interface CallCancelledMessage {
  type: 'call:cancelled';
  callId: string;
}

export interface CallTimeoutMessage {
  type: 'call:timeout';
  callId: string;
}

export interface ErrorMessage {
  type: 'error';
  code: string;
  message: string;
}

export interface PongMessage {
  type: 'pong';
}

export interface RegisteredMessage {
  type: 'registered';
  userId: string;
}

// Union types for routing

export type ClientMessage =
  | RegisterMessage
  | CallOfferMessage
  | CallAnswerMessage
  | IceCandidateMessage
  | CallDeclineMessage
  | CallHangupMessage
  | CallCancelMessage
  | PingMessage;

export type ServerMessage =
  | CallIncomingMessage
  | CallAnsweredMessage
  | IceCandidateRelayMessage
  | CallDeclinedMessage
  | CallHungUpMessage
  | CallCancelledMessage
  | CallTimeoutMessage
  | ErrorMessage
  | PongMessage
  | RegisteredMessage;
