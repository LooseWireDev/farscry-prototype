export const CALL_TIMEOUT_MS = 30_000; // 30 seconds to answer
export const HEARTBEAT_INTERVAL_MS = 30_000;
export const HEARTBEAT_TIMEOUT_MS = 35_000; // interval + 5s buffer
export const RECONNECT_DELAY_MS = 1_000;
export const RECONNECT_MAX_DELAY_MS = 30_000;
export const RECONNECT_MAX_ATTEMPTS = 10;

export const WS_CLOSE_NORMAL = 1000;
export const WS_CLOSE_GOING_AWAY = 1001;
export const WS_CLOSE_AUTH_FAILED = 4001;
export const WS_CLOSE_DUPLICATE = 4002;

export const VIDEO_CONSTRAINTS = {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  frameRate: { ideal: 30 },
} as const;

export const AUDIO_CONSTRAINTS = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
} as const;
