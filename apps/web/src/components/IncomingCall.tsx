interface IncomingCallProps {
  callerName: string | null;
  callerDisplayId: string | null;
  onAnswer: () => void;
  onDecline: () => void;
}

export default function IncomingCall({
  callerName,
  callerDisplayId,
  onAnswer,
  onDecline,
}: IncomingCallProps): React.ReactElement {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90 backdrop-blur-sm">
      <div className="flex w-80 flex-col items-center gap-6 rounded-2xl border border-border bg-surface-1 p-8 shadow-violet">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-subtle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-7 w-7 animate-ring text-violet"
          >
            <path d="M3.654 1.328a.678.678 0 00-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 004.168 6.608 17.569 17.569 0 006.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 00-.063-1.015l-2.307-1.794a.678.678 0 00-.58-.122l-2.19.547a1.745 1.745 0 01-1.657-.459L5.482 8.062a1.745 1.745 0 01-.46-1.657l.548-2.19a.678.678 0 00-.122-.58L3.654 1.328z" />
          </svg>
        </div>

        <div className="text-center">
          <p className="text-lg font-medium text-text-primary">{callerName ?? 'Unknown'}</p>
          {callerDisplayId && (
            <p className="display-id mt-1 text-text-tertiary">{callerDisplayId}</p>
          )}
          <p className="eyebrow mt-3 text-violet animate-pulse-soft">Incoming</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onDecline}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-3 text-text-secondary transition-colors hover:bg-danger hover:text-white"
            aria-label="Decline call"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <button
            onClick={onAnswer}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-violet text-text-inverse transition-transform hover:scale-105"
            aria-label="Answer call"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path d="M3.654 1.328a.678.678 0 00-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 004.168 6.608 17.569 17.569 0 006.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 00-.063-1.015l-2.307-1.794a.678.678 0 00-.58-.122l-2.19.547a1.745 1.745 0 01-1.657-.459L5.482 8.062a1.745 1.745 0 01-.46-1.657l.548-2.19a.678.678 0 00-.122-.58L3.654 1.328z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
