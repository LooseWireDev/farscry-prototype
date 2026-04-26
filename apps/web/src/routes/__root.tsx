import { createRootRoute, Outlet, Link, useRouter } from '@tanstack/react-router';
import { useSession, signOut } from '../lib/auth';
import Wordmark from '../components/Wordmark';

export const Route = createRootRoute({
  component: RootLayout,
});

const navLinkClass =
  'rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary [&.active]:bg-surface-2 [&.active]:text-text-primary';

function RootLayout(): React.ReactElement {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-subtle bg-bg px-5">
        <Link to="/" className="transition-opacity hover:opacity-80">
          <Wordmark />
        </Link>

        <nav className="flex items-center gap-1">
          {session?.user ? (
            <>
              <Link to="/" className={navLinkClass}>
                Contacts
              </Link>
              <Link to="/history" className={navLinkClass}>
                History
              </Link>
              <Link to="/settings" className={navLinkClass}>
                Settings
              </Link>
              <button
                onClick={async () => {
                  await signOut();
                  router.navigate({ to: '/login' });
                }}
                className="ml-2 rounded-md px-3 py-1.5 text-sm text-text-tertiary transition-colors hover:text-danger"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className={navLinkClass}>
              Sign in
            </Link>
          )}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
