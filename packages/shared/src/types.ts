export interface User {
  id: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Contact {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  isFavorite: boolean;
  addedAt: string;
}

export interface CallSession {
  id: string;
  callerId: string;
  calleeId: string;
  status: CallStatus;
  startedAt: string;
  answeredAt?: string;
  endedAt?: string;
  endReason?: CallEndReason;
}

export type CallStatus =
  | 'ringing'
  | 'connecting'
  | 'active'
  | 'ended';

export type CallEndReason =
  | 'completed'
  | 'declined'
  | 'busy'
  | 'no_answer'
  | 'cancelled'
  | 'failed'
  | 'timeout';

export interface IceServer {
  urls: string | string[];
  username?: string;
  credential?: string;
}

export interface PushToken {
  token: string;
  platform: 'ios' | 'android';
  voipToken?: string; // iOS PushKit token
}

export interface UserPresence {
  userId: string;
  online: boolean;
  lastSeen?: string;
}
