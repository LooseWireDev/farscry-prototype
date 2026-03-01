declare module 'react-native-callkeep' {
  export interface SetupOptions {
    ios: {
      appName: string;
      imageName?: string;
      supportsVideo?: boolean;
      maximumCallGroups?: number;
      maximumCallsPerCallGroup?: number;
      includesCallsInRecents?: boolean;
      ringtoneSound?: string;
    };
    android: {
      alertTitle: string;
      alertDescription: string;
      cancelButton: string;
      okButton: string;
      additionalPermissions?: string[];
      selfManaged?: boolean;
      foregroundService?: {
        channelId: string;
        channelName: string;
        notificationTitle: string;
        notificationIcon?: string;
      };
    };
  }

  export type CallKeepEventType =
    | 'answerCall'
    | 'endCall'
    | 'didActivateAudioSession'
    | 'didDeactivateAudioSession'
    | 'didDisplayIncomingCall'
    | 'didPerformSetMutedCallAction'
    | 'didToggleHoldCallAction'
    | 'didPerformDTMFAction'
    | 'showIncomingCallUi'
    | 'silenceIncomingCall'
    | 'checkReachability'
    | 'didLoadWithEvents';

  export interface AnswerCallPayload {
    callUUID: string;
  }

  export interface EndCallPayload {
    callUUID: string;
  }

  export interface MuteCallPayload {
    callUUID: string;
    muted: boolean;
  }

  export interface HoldCallPayload {
    callUUID: string;
    hold: boolean;
  }

  export interface DTMFPayload {
    callUUID: string;
    digits: string;
  }

  export interface DisplayIncomingCallPayload {
    callUUID: string;
    handle: string;
    localizedCallerName: string;
    hasVideo: string;
    fromPushKit: string;
    payload: Record<string, unknown>;
  }

  const RNCallKeep: {
    setup(options: SetupOptions): Promise<boolean>;
    hasDefaultPhoneAccount(): boolean;

    displayIncomingCall(
      uuid: string,
      handle: string,
      localizedCallerName?: string,
      handleType?: string,
      hasVideo?: boolean,
      options?: Record<string, unknown>,
    ): void;

    startCall(
      uuid: string,
      handle: string,
      contactIdentifier?: string,
      handleType?: string,
      hasVideo?: boolean,
    ): void;

    reportConnectingOutgoingCallWithUUID(uuid: string): void;
    reportConnectedOutgoingCallWithUUID(uuid: string): void;
    reportEndCallWithUUID(uuid: string, reason: number): void;
    endCall(uuid: string): void;
    endAllCalls(): void;

    setMutedCall(uuid: string, muted: boolean): void;
    setOnHold(uuid: string, hold: boolean): void;

    checkIfBusy(): Promise<boolean>;
    checkSpeaker(): Promise<boolean>;

    setAvailable(available: boolean): void;
    setForegroundServiceSettings(settings: Record<string, unknown>): void;
    setCurrentCallActive(uuid: string): void;

    updateDisplay(
      uuid: string,
      displayName: string,
      handle: string,
      options?: Record<string, unknown>,
    ): void;

    addEventListener(
      event: CallKeepEventType,
      handler: (data: Record<string, unknown>) => void,
    ): void;
    removeEventListener(event: CallKeepEventType): void;

    backToForeground(): void;

    // iOS CXCallDirectoryProvider support
    hasPhoneAccount(): Promise<boolean>;
    registerPhoneAccount(): void;
    registerAndroidEvents(): void;

    // End call reasons (maps to CXCallEndedReason)
    END_CALL_REASONS: {
      FAILED: 1;
      REMOTE_ENDED: 2;
      UNANSWERED: 3;
      ANSWERED_ELSEWHERE: 4;
      DECLINED_ELSEWHERE: 5;
      MISSED: 6;
    };
  };

  export default RNCallKeep;
}
