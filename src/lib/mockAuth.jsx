import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext(null);
const TOKEN_KEY = 'gossip_cafe_auth_token';

async function request(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers }
  });
  const body = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(body?.error || 'Request failed');
  return body;
}

export function MockAuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const applySession = (session) => {
    if (session?.token) localStorage.setItem(TOKEN_KEY, session.token);
    if (session?.user) setUser(session.user);
    return session?.user;
  };

  useEffect(() => {
    localStorage.removeItem('gossip_mock_user');
    localStorage.removeItem('gossip_cafe_reservations');
    if (localStorage.getItem(TOKEN_KEY)) request('/api/auth/me').then(({ user: current }) => setUser(current)).catch(() => {
      localStorage.removeItem(TOKEN_KEY);
    });
    if (supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (!data.session) return;
        const profile = data.session.user;
        request('/api/auth/google', {
          method: 'POST',
          body: JSON.stringify({
            email: profile.email,
            name: profile.user_metadata?.full_name || profile.user_metadata?.name,
            providerId: profile.id
          })
        }).then(applySession).catch(console.error);
      });
    }
  }, []);

  const login = async (email, password) => applySession(await request('/api/auth/login', {
    method: 'POST', body: JSON.stringify({ email, password })
  }));
  const signup = async (data) => applySession(await request('/api/auth/signup', {
    method: 'POST', body: JSON.stringify(data)
  }));
  const loginWithGoogle = async () => {
    if (!supabase) throw new Error('Google sign-in is not configured. Add the Supabase VITE variables to .env.local.');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/login' }
    });
    if (error) throw error;
  };
  const logout = async () => {
    try { await request('/api/auth/logout', { method: 'POST' }); } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      if (supabase) await supabase.auth.signOut();
    }
  };
  const updateUser = (data) => {
    const next = { ...user, ...data };
    setUser(next);
    return next;
  };

  return <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, logout, updateUser }}>
    {children}
  </AuthContext.Provider>;
}

export const useMockAuth = () => useContext(AuthContext);
