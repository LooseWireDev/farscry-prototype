import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useState, useCallback, useEffect } from 'react';
import { useSession } from '../lib/auth';
import { trpc } from '../lib/trpc';
import { useWebSocket } from '../hooks/useWebSocket';
import { useCall } from '../hooks/useCall';
import ContactCard from '../components/ContactCard';
import IncomingCall from '../components/IncomingCall';
import ActiveCall from '../components/ActiveCall';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage(): React.ReactElement {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.navigate({ to: '/login' });
    }
  }, [isPending, session, router]);

  if (isPending || !session?.user) {
    return <div />;
  }

  return <ContactsView />;
}

function ContactsView(): React.ReactElement {
  const { data: session } = useSession();
  const { send, connected, onMessage } = useWebSocket(!!session?.user);
  const call = useCall({ send, onMessage });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const contacts = trpc.contacts.list.useQuery();
  const addContact = trpc.contacts.add.useMutation({
    onSuccess: () => {
      contacts.refetch();
      setSearchResults([]);
      setSearchQuery('');
    },
  });

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `/trpc/contacts.search?input=${encodeURIComponent(JSON.stringify({ query: searchQuery }))}`,
      );
      const data = await res.json();
      setSearchResults(data.result?.data ?? []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, [searchQuery]);

  return (
    <>
      {call.callState.status === 'ringing-in' && (
        <IncomingCall
          callerName={call.callState.caller.username}
          callerDisplayId={call.callState.caller.displayId}
          onAnswer={call.answerCall}
          onDecline={call.declineCall}
        />
      )}

      {call.callState.status === 'active' && (
        <ActiveCall
          localStream={call.localStream}
          remoteStream={call.remoteStream}
          isMuted={call.isMuted}
          isVideoOff={call.isVideoOff}
          onToggleMute={call.toggleMute}
          onToggleVideo={call.toggleVideo}
          onHangUp={call.hangUp}
        />
      )}

      <div className="mx-auto max-w-lg px-5 py-8">
        <div className="mb-6 flex items-center gap-2">
          <div
            className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-violet animate-pulse-soft' : 'bg-text-tertiary'}`}
          />
          <span className="eyebrow text-text-tertiary">
            {connected ? 'Online' : 'Offline'}
          </span>
        </div>

        <div className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="username#code or username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 rounded-lg border border-border bg-surface-1 px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-violet/40 focus:bg-surface-2"
            />
            <button
              onClick={handleSearch}
              disabled={searching || !searchQuery.trim()}
              className="rounded-lg bg-violet px-4 py-2.5 text-sm font-semibold text-text-inverse transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              {searching ? '...' : 'Find'}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-3 flex flex-col gap-1.5">
              <p className="eyebrow text-text-tertiary">Results</p>
              {searchResults.map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface-1 px-3.5 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">{user.username}</p>
                    <p className="display-id text-text-tertiary">{user.displayId}</p>
                  </div>
                  <button
                    onClick={() => addContact.mutate({ contactId: user.id })}
                    className="rounded-md bg-violet-subtle px-3 py-1 text-xs font-semibold text-violet transition-opacity hover:opacity-80"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="eyebrow mb-3 text-text-tertiary">Contacts</h2>

          {contacts.isLoading ? (
            <p className="text-sm text-text-tertiary">Loading...</p>
          ) : contacts.data?.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border-subtle p-10 text-center">
              <p className="text-sm text-text-secondary">No contacts yet</p>
              <p className="mt-1.5 text-xs text-text-tertiary">
                Search by display ID to add someone
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {contacts.data?.map((contact: any) => (
                <ContactCard
                  key={contact.contactId}
                  username={contact.username}
                  displayId={contact.displayId}
                  nickname={contact.nickname}
                  avatarUrl={contact.avatarUrl}
                  onCall={() => call.initiateCall(contact.contactId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
