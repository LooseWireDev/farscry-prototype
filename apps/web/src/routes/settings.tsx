import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { trpc } from '../lib/trpc';

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
});

function SettingsPage(): React.ReactElement {
  const profile = trpc.users.getProfile.useQuery();
  const subscription = trpc.subscriptions.status.useQuery();
  const family = trpc.families.get.useQuery();

  const [username, setUsername] = useState('');
  const setUsernameMutation = trpc.users.setUsername.useMutation({
    onSuccess: () => profile.refetch(),
  });

  const hasUsername = !!profile.data?.username;

  return (
    <div className="mx-auto max-w-lg px-5 py-8">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Settings</h1>

      <Section label="Profile">
        {profile.isLoading ? (
          <p className="text-sm text-text-tertiary">Loading...</p>
        ) : (
          <div className="flex flex-col gap-3">
            <Row label="Email" value={profile.data?.email ?? ''} />
            <Row
              label="Display ID"
              value={profile.data?.displayId ?? 'Not set'}
              mono={!!profile.data?.displayId}
              accent={!!profile.data?.displayId}
            />

            {!hasUsername && (
              <div className="mt-2 border-t border-border-subtle pt-4">
                <p className="mb-3 text-xs leading-relaxed text-text-tertiary">
                  Choose a username to get your display ID. This cannot be changed later.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    className="flex-1 rounded-md border border-border bg-bg px-3 py-2 font-mono text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-violet/40"
                  />
                  <button
                    onClick={() => setUsernameMutation.mutate({ username })}
                    disabled={!username || setUsernameMutation.isPending}
                    className="rounded-md bg-violet px-3 py-2 text-sm font-semibold text-text-inverse disabled:opacity-40"
                  >
                    Set
                  </button>
                </div>
                {setUsernameMutation.error && (
                  <p className="mt-2 text-xs text-danger">
                    {setUsernameMutation.error.message}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </Section>

      <Section label="Subscription">
        <Row
          label="Plan"
          value={subscription.data?.active ? 'Active' : 'Self-hosted'}
          accent={subscription.data?.active}
        />
      </Section>

      <Section label="Family">
        {family.data ? (
          <div className="flex flex-col gap-3">
            <Row label="Name" value={family.data.name} />
            <Row label="Members" value={String(family.data.members.length)} />
          </div>
        ) : (
          <p className="text-sm text-text-tertiary">Not in a family</p>
        )}
      </Section>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }): React.ReactElement {
  return (
    <section className="mb-6">
      <h2 className="eyebrow mb-3 text-text-tertiary">{label}</h2>
      <div className="rounded-xl border border-border-subtle bg-surface-1 p-5">
        {children}
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  mono = false,
  accent = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}): React.ReactElement {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-text-secondary">{label}</span>
      <span
        className={`text-sm ${mono ? 'font-mono' : ''} ${accent ? 'text-violet' : 'text-text-primary'}`}
      >
        {value}
      </span>
    </div>
  );
}
