import { useEffect, useRef } from 'react';

interface VideoViewProps {
  stream: MediaStream | null;
  muted?: boolean;
  className?: string;
}

export default function VideoView({
  stream,
  muted = false,
  className = '',
}: VideoViewProps): React.ReactElement {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={`relative overflow-hidden rounded-lg bg-surface-1 ${className}`}>
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-surface-3" />
        </div>
      )}
    </div>
  );
}
