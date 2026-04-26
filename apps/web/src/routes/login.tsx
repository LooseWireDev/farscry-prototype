import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { signIn, signUp, useSession } from '../lib/auth';
import Logo from '../components/Logo';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage(): React.ReactElement {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      router.navigate({ to: '/' });
    }
  }, [session, router]);

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = isSignUp
      ? await signUp.email({ email, password, name })
      : await signIn.email({ email, password });

    setLoading(false);

    if (result.error) {
      setError(
        result.error.message ?? (isSignUp ? 'Failed to create account' : 'Invalid email or password'),
      );
      return;
    }

    router.navigate({ to: '/' });
  }

  const inputClass =
    'rounded-lg border border-border bg-surface-1 px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-violet/40 focus:bg-surface-2';

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center text-center">
          <Logo size={56} className="mb-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            {isSignUp ? 'Create account' : 'Welcome back'}
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            {isSignUp ? 'Just calls. No bloat.' : 'Sign in to continue'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          {isSignUp && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className={inputClass}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            className={inputClass}
          />

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-violet px-4 py-2.5 text-sm font-semibold text-text-inverse transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? '...' : isSignUp ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-text-tertiary">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-text-secondary underline-offset-2 hover:text-violet hover:underline"
          >
            {isSignUp ? 'Sign in' : 'Create one'}
          </button>
        </p>
      </div>
    </div>
  );
}
