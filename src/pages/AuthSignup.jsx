import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMockAuth } from '@/lib/mockAuth';

// AUTH BLUEPRINT — sign-up + OTP UI only. OTP send/verify is stubbed in mockAuth.
// TODO: replace signup()/verifyOtp() with a real SMS/email OTP provider.

function GoogleButton({ onClick, label }) {
  return (
    <button onClick={onClick} className="w-full h-12 rounded-full border border-primary/30 bg-background text-primary text-sm uppercase tracking-[0.14em] hover:bg-muted transition-colors flex items-center justify-center gap-3">
      <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
      {label}
    </button>
  );
}

function OtpInput({ value, onChange }) {
  const refs = useRef([]);
  useEffect(() => { refs.current[0]?.focus(); }, []);
  const set = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = value.split('');
    next[i] = v;
    onChange(next.join('').padEnd(6, '').slice(0, 6));
    if (v && i < 5) refs.current[i + 1]?.focus();
  };
  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus();
  };
  const onPaste = (e) => {
    e.preventDefault();
    const digits = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    if (digits) onChange(digits);
  };
  return (
    <div className="flex gap-3 justify-between" onPaste={onPaste}>
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={value[i] || ''}
          onChange={(e) => set(i, e.target.value)}
          onKeyDown={(e) => onKey(i, e)}
          inputMode="numeric"
          maxLength={1}
          className="w-12 h-14 bg-transparent text-center font-display text-2xl text-primary border-b-2 border-primary/40 focus:border-primary focus:outline-none transition-colors"
        />
      ))}
    </div>
  );
}

export default function AuthSignup() {
  const { signup, verifyOtp, resendOtp, loginWithGoogle } = useMockAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); // form | otp
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const submitForm = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await signup(form);
      setStep('otp');
      setTimer(30);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const submitOtp = async (e) => {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await verifyOtp(otp);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    await resendOtp();
    setTimer(30);
  };

  const google = async () => {
    await loginWithGoogle();
    navigate('/');
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-5 py-16">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center font-display text-3xl text-primary mb-2">Gossip</Link>
        <p className="text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-10">Café &amp; Restro</p>

        <div className="bg-card border border-border rounded-3xl p-8">
          {step === 'form' ? (
            <>
              <h1 className="font-display text-3xl text-primary mb-1">Become a regular</h1>
              <p className="text-sm text-muted-foreground mb-7">Create your account to reserve in seconds.</p>
              <form onSubmit={submitForm} className="space-y-4">
                <div>
                  <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Full name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full h-11 mt-2 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary/50" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Email or phone</label>
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full h-11 mt-2 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary/50" placeholder="you@email.com" />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Phone (optional)</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full h-11 mt-2 px-4 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary/50" placeholder="+91 ..." />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <button type="submit" disabled={busy} className="w-full h-12 bg-primary text-primary-foreground rounded-full text-sm uppercase tracking-[0.14em] hover:bg-secondary disabled:opacity-50 transition-colors">
                  {busy ? 'Sending code…' : 'Send verification code'}
                </button>
              </form>
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground uppercase tracking-[0.14em]">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <GoogleButton onClick={google} label="Sign up with Google" />
              <p className="mt-6 text-center text-sm text-muted-foreground">Already a regular? <Link to="/login" className="text-primary border-b border-primary/40">Log in</Link></p>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl text-primary mb-1">Enter the code</h1>
              <p className="text-sm text-muted-foreground mb-7">We sent a 6-digit code to <span className="text-foreground">{form.email || form.phone}</span>.</p>
              <form onSubmit={submitOtp} className="space-y-6">
                <OtpInput value={otp} onChange={setOtp} />
                {error && <p className="text-sm text-destructive">{error}</p>}
                <button type="submit" disabled={busy || otp.length !== 6} className="w-full h-12 bg-primary text-primary-foreground rounded-full text-sm uppercase tracking-[0.14em] hover:bg-secondary disabled:opacity-50 transition-colors">
                  {busy ? 'Verifying…' : 'Verify &amp; continue'}
                </button>
              </form>
              <div className="mt-6 text-center text-sm">
                {timer > 0 ? (
                  <p className="text-muted-foreground">Resend code in {timer}s</p>
                ) : (
                  <button onClick={resend} className="text-primary border-b border-primary/40">Resend code</button>
                )}
              </div>
              <button onClick={() => setStep('form')} className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-primary">← Back</button>
            </>
          )}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground italic">
          Blueprint only — OTP is mocked (try 123456). Connect a real provider before launch.
        </p>
      </div>
    </div>
  );
}