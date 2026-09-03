import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMockAuth } from '@/lib/mockAuth';

function GoogleButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="w-full h-12 rounded-full border border-primary/30 bg-background text-primary text-sm uppercase tracking-[0.14em] hover:bg-muted transition-colors flex items-center justify-center gap-3"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
      {label}
    </button>
  );
}

export default function AuthLogin() {
  const { login, loginWithGoogle } = useMockAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    await loginWithGoogle();
    navigate('/');
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-5 py-16">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center font-display text-3xl text-primary mb-2">CodeSupa</Link>
        <p className="text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-10">Café &amp; Restro</p>

        <div className="bg-card border border-border rounded-3xl p-8">
          <h1 className="font-display text-3xl text-primary mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-7">Log in to manage your reservations.</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Email or phone</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" className="w-full h-11 mt-2 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary/50" placeholder="you@email.com" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full h-11 mt-2 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary/50" placeholder="••••••••" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button type="submit" disabled={busy} className="w-full h-12 bg-primary text-primary-foreground rounded-full text-sm uppercase tracking-[0.14em] hover:bg-secondary disabled:opacity-50 transition-colors">
              {busy ? 'Signing in…' : 'Continue'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase tracking-[0.14em]">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <GoogleButton onClick={google} label="Continue with Google" />

          <div className="mt-6 flex flex-col items-center gap-2 text-sm">
            <Link to="/forgot" className="text-muted-foreground hover:text-primary">Forgot password?</Link>
            <p className="text-muted-foreground">New here? <Link to="/signup" className="text-primary border-b border-primary/40">Create an account</Link></p>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground italic">
          Authentication is powered by Supabase.
        </p>
      </div>
    </div>
  );
}