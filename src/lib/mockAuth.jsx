import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

const AuthContext = createContext(null);
const TOKEN_KEY = 'gossip_cafe_auth_token';
const USER_KEY = 'gossip_cafe_user';

async function request(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  const body = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(body?.error || 'Request failed');
  return body;
}

const mapSupabaseUser = (sbUser) => {
  if (!sbUser) return null;
  return {
    id: sbUser.id,
    name:
      sbUser.user_metadata?.full_name ||
      sbUser.user_metadata?.name ||
      sbUser.email?.split('@')[0] ||
      'Member',
    email: sbUser.email,
    phone: sbUser.phone || sbUser.user_metadata?.phone || '',
    avatar:
      sbUser.user_metadata?.avatar_url ||
      sbUser.user_metadata?.picture ||
      '',
    provider: sbUser.app_metadata?.provider || 'google'
  };
};

export function MockAuthProvider({ children }) {
  // Load saved user immediately from local storage to avoid flash of logged-out state
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const applySession = (session) => {
    if (session?.token) localStorage.setItem(TOKEN_KEY, session.token);
    if (session?.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(session.user));
      setUser(session.user);
    }
    return session?.user;
  };

  useEffect(() => {
    let isMounted = true;
    let subscription = null;

    if (supabase) {
      // 1. Check existing Supabase session
      supabase.auth.getSession().then(({ data }) => {
        if (!isMounted) return;
        if (data?.session?.user) {
          const profile = mapSupabaseUser(data.session.user);
          localStorage.setItem(USER_KEY, JSON.stringify(profile));
          setUser(profile);
          if (data.session.access_token) {
            localStorage.setItem(TOKEN_KEY, data.session.access_token);
          }

          // Optional: sync to backend API if express server is running
          request('/api/auth/google', {
            method: 'POST',
            body: JSON.stringify({
              email: profile.email,
              name: profile.name,
              providerId: profile.id
            })
          })
            .then((res) => {
              if (isMounted && res) applySession(res);
            })
            .catch(() => {
              // Static host or backend offline, profile is already safely set
            });
        }
        setLoading(false);
      }).catch((err) => {
        console.warn('Error fetching Supabase session:', err);
        setLoading(false);
      });

      // 2. Listen to real-time auth state changes
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;
        if ((event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') && session?.user) {
          const profile = mapSupabaseUser(session.user);
          localStorage.setItem(USER_KEY, JSON.stringify(profile));
          setUser(profile);
          if (session.access_token) {
            localStorage.setItem(TOKEN_KEY, session.access_token);
          }

          request('/api/auth/google', {
            method: 'POST',
            body: JSON.stringify({
              email: profile.email,
              name: profile.name,
              providerId: profile.id
            })
          })
            .then((res) => {
              if (isMounted && res) applySession(res);
            })
            .catch(() => {});
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setUser(null);
        }
      });

      subscription = authListener?.subscription;
    } else {
      setLoading(false);
    }

    // 3. Check local backend session token if present
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (savedToken) {
      request('/api/auth/me')
        .then(({ user: current }) => {
          if (isMounted && current) {
            localStorage.setItem(USER_KEY, JSON.stringify(current));
            setUser(current);
          }
        })
        .catch(() => {
          // If backend returns 401/error and there is no active supabase session
          if (!supabase) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            setUser(null);
          }
        });
    }

    return () => {
      isMounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) =>
    applySession(
      await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
    );

  const signup = async (data) =>
    applySession(
      await request('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    );

  const loginWithGoogle = async () => {
    if (!supabase) {
      throw new Error(
        'Google sign-in is not configured. Please ensure VITE_SUPABASE_URL and Supabase keys are set.'
      );
    }

    const isLocal =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1');

    const redirectEnvUrl =
      typeof import.meta !== 'undefined' && import.meta.env
        ? import.meta.env.VITE_AUTH_REDIRECT_URL
        : '';
    const redirectUrl = isLocal
      ? `${window.location.origin}/auth/callback`
      : (redirectEnvUrl || `${window.location.origin}/auth/callback`);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) throw error;
    return data;
  };

  const logout = async () => {
    try {
      await request('/api/auth/logout', { method: 'POST' }).catch(() => {});
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
      if (supabase) {
        await supabase.auth.signOut().catch(console.error);
      }
    }
  };

  const updateUser = (data) => {
    const next = { ...user, ...data };
    localStorage.setItem(USER_KEY, JSON.stringify(next));
    setUser(next);
    return next;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useMockAuth = () => useContext(AuthContext);
