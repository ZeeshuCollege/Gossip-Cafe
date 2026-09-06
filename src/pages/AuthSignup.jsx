import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMockAuth } from '@/lib/mockAuth';

function GoogleButton({ onClick, label }) {
  return <button type="button" onClick={onClick} className="w-full h-12 rounded-full border border-primary/30 bg-background text-primary text-sm uppercase tracking-[0.14em] hover:bg-muted transition-colors flex items-center justify-center gap-3">
    <span className="font-bold text-blue-500">G</span>{label}
  </button>;
}

export default function AuthSignup() {
  const { signup, loginWithGoogle } = useMockAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

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
    try { await loginWithGoogle(); } catch (err) { setError(err.message); }
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
