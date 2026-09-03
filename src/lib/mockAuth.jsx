import React, { createContext, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '@/api/supabaseClient';

const AuthContext = createContext(null);

const configurationError = () =>
  new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');

export function MockAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [pendingEmail, setPendingEmail] = useState('');

  useEffect(() => {
    if (!supabase) return undefined;
    let mounted = true;
    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      if (mounted) setUser(currentUser);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user ?? null);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    if (!supabase) throw configurationError();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  };

  const signup = async ({ name, email, phone, password }) => {
    if (!supabase) throw configurationError();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } }
    });
    if (error) throw error;
    setPendingEmail(email);
    return data;
  };

  const verifyOtp = async (token) => {
    if (!supabase) throw configurationError();
    const { data, error } = await supabase.auth.verifyOtp({ email: pendingEmail, token, type: 'signup' });
    if (error) throw error;
    setUser(data.user);
    return data.user;
  };

  const resendOtp = async () => {
    if (!supabase) throw configurationError();
    const { error } = await supabase.auth.resend({ type: 'signup', email: pendingEmail });
    if (error) throw error;
  };

  const loginWithGoogle = async () => {
    if (!supabase) throw configurationError();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` }
    });
    if (error) throw error;
  };

  const logout = async () => {
    if (!supabase) {
      setUser(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  const updateUser = (data) => (user ? { ...user, ...data } : user);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      verifyOtp,
      resendOtp,
      loginWithGoogle,
      logout,
      updateUser,
      isSupabaseConfigured
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useMockAuth = () => useContext(AuthContext);
