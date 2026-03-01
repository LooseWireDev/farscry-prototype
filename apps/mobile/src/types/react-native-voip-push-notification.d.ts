declare module 'react-native-voip-push-notification' {
  export type VoIPPushEventType =
    | 'register'
    | 'notification'
    | 'didLoadWithEvents';

  export interface VoIPPushPayload {
    [key: string]: unknown;
    callId?: string;
    callerId?: string;
    callerName?: string;
    hasVideo?: boolean;
    uuid?: string;
  }

  const VoipPushNotification: {
    requestPermissions(): void;
    registerVoipToken(): void;

    addEventListener(
      event: 'register',
      handler: (token: string) => void,
    ): void;
    addEventListener(
      event: 'notification',
      handler: (notification: VoIPPushPayload) => void,
    ): void;
    addEventListener(
      event: 'didLoadWithEvents',
      handler: (events: Array<{ name: string; data: unknown }>) => void,
    ): void;

    removeEventListener(event: VoIPPushEventType): void;

    onVoipNotificationCompleted(uuid: string): void;
  };

  export default VoipPushNotification;
}
