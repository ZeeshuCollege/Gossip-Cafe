import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMockAuth } from '@/lib/mockAuth';

function GoogleButton({ onClick, label, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full h-12 rounded-full border border-primary/30 bg-background text-primary text-sm uppercase tracking-[0.14em] hover:bg-muted disabled:opacity-60 transition-colors flex items-center justify-center gap-3"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
      {label}
    </button>
  );
}

export default function AuthSignup() {
  const { user, signup, loginWithGoogle } = useMockAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await signup(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setError('');
    setBusy(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return <div className="min-h-screen grid place-items-center bg-background px-5 py-16">
    <div className="w-full max-w-md">
      <Link to="/" className="block text-center font-display text-3xl text-primary mb-2">Gossip</Link>
      <p className="text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-10">Café &amp; Restro</p>
      <div className="bg-card border border-border rounded-3xl p-8">
        <h1 className="font-display text-3xl text-primary mb-1">Become a regular</h1>
        <p className="text-sm text-muted-foreground mb-7">Create your account to reserve in seconds.</p>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Full name" value={form.name} onChange={(name) => setForm({ ...form, name })} placeholder="Your name" />
          <Field label="Email" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} placeholder="you@email.com" />
          <Field label="Phone (optional)" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} placeholder="+91 ..." />
          <Field label="Password" type="password" value={form.password} onChange={(password) => setForm({ ...form, password })} placeholder="At least 8 characters" />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={busy} className="w-full h-12 bg-primary text-primary-foreground rounded-full text-sm uppercase tracking-[0.14em] hover:bg-secondary disabled:opacity-50 transition-colors">
            {busy ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <div className="flex items-center gap-3 my-6"><div className="flex-1 h-px bg-border" /><span className="text-xs text-muted-foreground uppercase tracking-[0.14em]">or</span><div className="flex-1 h-px bg-border" /></div>
        <GoogleButton onClick={google} label="Sign up with Google" />
        <p className="mt-6 text-center text-sm text-muted-foreground">Already a regular? <Link to="/login" className="text-primary border-b border-primary/40">Log in</Link></p>
      </div>
    </div>
  </div>;
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return <div>
    <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
    <input required={label !== 'Phone (optional)'} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full h-11 mt-2 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary/50" placeholder={placeholder} />
  </div>;
}
