import { createFileRoute } from '@tanstack/react-router';
import { trpc } from '../lib/trpc';
import { useSession } from '../lib/auth';

export const Route = createFileRoute('/history')({
  component: HistoryPage,
});

function HistoryPage(): React.ReactElement {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const history = trpc.calls.history.useQuery();

  function formatDuration(seconds: number | null): string {
    if (!seconds) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function formatTime(date: string | Date): string {
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  const statusConfig: Record<string, { label: string; color: string }> = {
    ended: { label: 'Ended', color: 'text-text-secondary' },
    answered: { label: 'Answered', color: 'text-violet' },
    missed: { label: 'Missed', color: 'text-danger' },
    declined: { label: 'Declined', color: 'text-danger' },
    ringing: { label: 'Ringing', color: 'text-warning' },
  };

  return (
    <div className="mx-auto max-w-lg px-5 py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">History</h1>

      {history.isLoading ? (
        <p className="text-sm text-text-tertiary">Loading...</p>
      ) : history.data?.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-subtle p-10 text-center">
          <p className="text-sm text-text-secondary">No calls yet</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {history.data?.map((call: any) => {
            const isOutgoing = call.callerId === userId;
            const config = statusConfig[call.status] ?? { label: call.status, color: 'text-text-tertiary' };

            return (
              <div
                key={call.id}
                className="flex items-center gap-3 border-b border-border-subtle py-3 last:border-b-0"
              >
                <div className={`text-base ${isOutgoing ? 'text-text-tertiary' : 'text-violet'}`}>
                  {isOutgoing ? '↗' : '↙'}
                </div>

                <div className="flex flex-1 flex-col">
                  <span className="display-id text-text-primary">
                    {isOutgoing ? call.calleeId : call.callerId}
                  </span>
                  <span className={`text-xs ${config.color}`}>
                    {config.label}
                    {call.duration != null && call.duration > 0 && ` · ${formatDuration(call.duration)}`}
                  </span>
                </div>

                <span className="text-xs text-text-tertiary">{formatTime(call.startedAt)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
