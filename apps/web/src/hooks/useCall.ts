import { useState, useEffect, useRef, useCallback } from 'react';

interface CallerInfo {
  id: string;
  username: string | null;
  displayId: string | null;
  avatarUrl: string | null;
}

type CallState =
  | { status: 'idle' }
  | { status: 'ringing-out'; callId: string; calleeId: string }
  | { status: 'ringing-in'; callId: string; caller: CallerInfo }
  | { status: 'active'; callId: string; peerId: string }
  | { status: 'ended'; callId: string };

interface UseCallOptions {
  send: (data: unknown) => void;
  onMessage: (handler: (data: unknown) => void) => () => void;
}

interface UseCallReturn {
  callState: CallState;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  initiateCall: (calleeId: string) => Promise<void>;
  answerCall: () => void;
  declineCall: () => void;
  hangUp: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  isMuted: boolean;
  isVideoOff: boolean;
}

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

export function useCall({ send, onMessage }: UseCallOptions): UseCallReturn {
  const [callState, setCallState] = useState<CallState>({ status: 'idle' });
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const callIdRef = useRef<string | null>(null);

  const cleanup = useCallback(() => {
    pcRef.current?.close();
    pcRef.current = null;
    localStream?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
    setRemoteStream(null);
    setIsMuted(false);
    setIsVideoOff(false);
    callIdRef.current = null;
  }, [localStream]);

  function createPeerConnection(): RTCPeerConnection {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    pc.onicecandidate = (event) => {
      // Read callId at fire time, not close time — it changes from temp to real after server confirms
      const currentCallId = callIdRef.current;
      if (event.candidate && currentCallId && !currentCallId.startsWith('pending-')) {
        send({ type: 'call:ice-candidate', callId: currentCallId, candidate: event.candidate.toJSON() });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0] ?? null);
    };

    pcRef.current = pc;
    return pc;
  }

  async function getMedia(): Promise<MediaStream> {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setLocalStream(stream);
    return stream;
  }

  const initiateCall = useCallback(async (calleeId: string) => {
    const stream = await getMedia();
    send({ type: 'call:initiate', calleeId });

    // callId will come back from server; we set ringing-out state
    setCallState({ status: 'ringing-out', callId: '', calleeId });

    // Peer connection is created now; ICE candidates wait for the real callId before being sent
    callIdRef.current = `pending-${Date.now()}`;
    const pc = createPeerConnection();
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
  }, [send]);

  const answerCall = useCallback(async () => {
    if (callState.status !== 'ringing-in') return;

    const stream = await getMedia();
    callIdRef.current = callState.callId;
    const pc = createPeerConnection();
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    callIdRef.current = callState.callId;
    send({ type: 'call:answer', callId: callState.callId });
    setCallState({ status: 'active', callId: callState.callId, peerId: callState.caller.id });
  }, [callState, send]);

  const declineCall = useCallback(() => {
    if (callState.status !== 'ringing-in') return;
    send({ type: 'call:decline', callId: callState.callId });
    setCallState({ status: 'idle' });
  }, [callState, send]);

  const hangUp = useCallback(() => {
    if (callState.status === 'idle' || callState.status === 'ended') return;
    send({ type: 'call:hangup', callId: callState.callId });
    cleanup();
    setCallState({ status: 'idle' });
  }, [callState, send, cleanup]);

  const toggleMute = useCallback(() => {
    localStream?.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsMuted((m) => !m);
  }, [localStream]);

  const toggleVideo = useCallback(() => {
    localStream?.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setIsVideoOff((v) => !v);
  }, [localStream]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    return onMessage(async (data: any) => {
      switch (data.type) {
        case 'call:incoming':
          setCallState({
            status: 'ringing-in',
            callId: data.callId,
            caller: data.caller,
          });
          break;

        case 'call:initiated': {
          // Server confirmed the call was created; update local state with the real callId
          callIdRef.current = data.callId;
          setCallState((prev) => {
            if (prev.status === 'ringing-out') {
              return { ...prev, callId: data.callId };
            }
            return prev;
          });
          break;
        }

        case 'call:answered': {
          // Callee accepted — caller now creates and sends the SDP offer
          if (!pcRef.current) break;

          const offer = await pcRef.current.createOffer();
          await pcRef.current.setLocalDescription(offer);
          send({ type: 'call:sdp', callId: data.callId, sdp: offer });

          setCallState((prev) => {
            if (prev.status === 'ringing-out') {
              return { status: 'active', callId: data.callId, peerId: prev.calleeId };
            }
            return prev;
          });
          break;
        }

        case 'call:sdp': {
          const pc = pcRef.current;
          if (!pc) break;

          const sdp = data.sdp as RTCSessionDescriptionInit;
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));

          if (sdp.type === 'offer') {
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            send({ type: 'call:sdp', callId: data.callId, sdp: answer });
          }
          break;
        }

        case 'call:ice-candidate': {
          if (pcRef.current && data.candidate) {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
          break;
        }

        case 'call:hangup':
        case 'call:cancelled':
        case 'call:declined':
          cleanup();
          setCallState({ status: 'idle' });
          break;

        case 'call:answered-elsewhere':
          cleanup();
          setCallState({ status: 'idle' });
          break;
      }
    });
  }, [onMessage, send, cleanup]);

  return {
    callState,
    localStream,
    remoteStream,
    initiateCall,
    answerCall,
    declineCall,
    hangUp,
    toggleMute,
    toggleVideo,
    isMuted,
    isVideoOff,
  };
}
