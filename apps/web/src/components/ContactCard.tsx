interface ContactCardProps {
  username: string | null;
  displayId: string | null;
  nickname: string | null;
  avatarUrl: string | null;
  onCall: () => void;
}

export default function ContactCard({
  username,
  displayId,
  nickname,
  avatarUrl,
  onCall,
}: ContactCardProps): React.ReactElement {
  const displayName = nickname ?? username ?? 'Unknown';
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-border-subtle bg-surface-1 p-3 transition-colors hover:border-violet/30 hover:bg-surface-2">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-3 text-sm font-semibold text-text-secondary">
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="h-full w-full rounded-full object-cover" />
        ) : (
          initials
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-text-primary">{displayName}</span>
        {displayId && (
          <span className="display-id truncate text-text-tertiary">{displayId}</span>
        )}
      </div>

      <button
        onClick={onCall}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-subtle text-violet opacity-0 transition-all hover:bg-violet hover:text-text-inverse group-hover:opacity-100"
        aria-label={`Call ${displayName}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="M3.654 1.328a.678.678 0 00-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 004.168 6.608 17.569 17.569 0 006.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 00-.063-1.015l-2.307-1.794a.678.678 0 00-.58-.122l-2.19.547a1.745 1.745 0 01-1.657-.459L5.482 8.062a1.745 1.745 0 01-.46-1.657l.548-2.19a.678.678 0 00-.122-.58L3.654 1.328z" />
        </svg>
      </button>
    </div>
  );
}
