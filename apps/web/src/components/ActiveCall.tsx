import VideoView from './VideoView';

interface ActiveCallProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isVideoOff: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onHangUp: () => void;
}

export default function ActiveCall({
  localStream,
  remoteStream,
  isMuted,
  isVideoOff,
  onToggleMute,
  onToggleVideo,
  onHangUp,
}: ActiveCallProps): React.ReactElement {
  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-bg">
      <VideoView stream={remoteStream} className="flex-1" />

      <VideoView
        stream={localStream}
        muted
        className="absolute right-4 top-4 h-40 w-28 border border-border shadow-lg"
      />

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-4 bg-gradient-to-t from-bg/80 to-transparent p-6 pb-10">
        <ControlButton
          active={!isMuted}
          onClick={onToggleMute}
          label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M1 1l22 22M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 16.95A7 7 0 015 12M12 19v4M8 23h8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </ControlButton>

        <ControlButton
          active={!isVideoOff}
          onClick={onToggleVideo}
          label={isVideoOff ? 'Enable video' : 'Disable video'}
        >
          {isVideoOff ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M1 1l22 22M21 7.5v9l-4-2.5M16 16H5a2 2 0 01-2-2V7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M23 7l-7 5 7 5V7zM14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </ControlButton>

        <button
          onClick={onHangUp}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-danger text-white transition-transform hover:scale-105"
          aria-label="Hang up"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
            <path d="M3.68 16.07l3.92-3.11V9.59c2.85-.93 5.94-.93 8.8 0v3.38l3.91 3.1c.46.36.76.93.76 1.57v.4c0 .73-.6 1.32-1.32 1.32h-2.49c-.73 0-1.32-.6-1.32-1.32v-2.15c-2.58-.78-5.3-.78-7.88 0v2.15c0 .73-.6 1.32-1.32 1.32H4.25c-.73 0-1.32-.6-1.32-1.32v-.4c0-.64.29-1.21.75-1.57z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ControlButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <button
      onClick={onClick}
      className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
        active
          ? 'bg-surface-3 text-text-primary hover:bg-surface-2'
          : 'bg-danger text-white'
      }`}
      aria-label={label}
    >
      {children}
    </button>
  );
}
