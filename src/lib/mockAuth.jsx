import React, { createContext, useContext, useState, useEffect } from 'react';

// ───────────────────────────────────────────────────────────────────────────
// MOCK AUTH — BLUEPRINT ONLY
// This is a front-end-only stub so the owner/developer can wire real auth later.
// This lightweight browser-only auth keeps the demo usable without a server.
// No real credentials, OAuth client IDs, or OTP keys are used here yet.
// ───────────────────────────────────────────────────────────────────────────

const MockAuthContext = createContext(null);
const STORAGE_KEY = 'gossip_mock_user';

export function MockAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [pendingOtp, setPendingOtp] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (u) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const login = async (email, password) => {
    if (!email || !password) throw new Error('Email and password are required');
    const u = { email, name: email.split('@')[0], phone: '' };
    persist(u);
    return u;
  };

  const signup = async ({ name, email, phone }) => {
    const code = '123456'; // mock OTP — replace with real provider-generated code
    setPendingOtp({ name, email, phone, code });
    return { otpSent: true };
  };

  const verifyOtp = async (otpCode) => {
    if (!pendingOtp) throw new Error('No pending verification');
    if (!otpCode || otpCode.length !== 6) throw new Error('Enter the 6-digit code');
    const u = {
      name: pendingOtp.name,
      email: pendingOtp.email,
      phone: pendingOtp.phone || ''
    };
    persist(u);
    setPendingOtp(null);
    return u;
  };

  const resendOtp = async () => {
    if (!pendingOtp) return;
    setPendingOtp({ ...pendingOtp, code: '123456' });
    return { otpSent: true };
  };

  const loginWithGoogle = async () => {
    const u = { name: 'Google User', email: 'guest@gmail.com', phone: '' };
    persist(u);
    return u;
  };

  const logout = () => persist(null);

  const updateUser = (data) => {
    const u = { ...user, ...data };
    persist(u);
    return u;
  };

  return (
    <MockAuthContext.Provider
      value={{ user, login, signup, verifyOtp, resendOtp, loginWithGoogle, logout, updateUser, pendingOtp }}
    >
      {children}
    </MockAuthContext.Provider>
  );
}

export const useMockAuth = () => useContext(MockAuthContext);