import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useMockAuth } from '@/lib/mockAuth';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useMockAuth();
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // If auth state already resolved user
    if (user) {
      navigate('/', { replace: true });
      return;
    }

    // Check for error parameters returned in hash or search params
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const searchParams = new URLSearchParams(window.location.search);
    const error =
      searchParams.get('error_description') ||
      searchParams.get('error') ||
      hashParams.get('error_description') ||
      hashParams.get('error');

    if (error) {
      setErrorMsg(decodeURIComponent(error.replace(/\+/g, ' ')));
      return;
    }

    let timeoutId;
    if (supabase) {
      // Check session directly in case auth state change already fired or is processing
      supabase.auth.getSession().then(({ data, error: sessionErr }) => {
        if (sessionErr) {
          setErrorMsg(sessionErr.message);
        } else if (data?.session) {
          navigate('/', { replace: true });
        } else {
          // Allow up to 3 seconds for session extraction before assuming timeout
          timeoutId = setTimeout(() => {
            supabase.auth.getSession().then(({ data: retryData }) => {
              if (retryData?.session) {
                navigate('/', { replace: true });
              } else {
                navigate('/', { replace: true });
              }
            });
          }, 2000);
        }
      });
    } else {
      navigate('/login', { replace: true });
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user, navigate, location]);

  if (errorMsg) {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-5 py-16">
        <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 text-center shadow-lg">
          <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive mx-auto flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="font-display text-2xl text-foreground mb-2">Authentication Failed</h2>
          <p className="text-sm text-muted-foreground mb-6">{errorMsg}</p>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="w-full h-11 bg-primary text-primary-foreground rounded-full text-xs uppercase tracking-[0.15em] hover:bg-secondary transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background px-5 py-16">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-10 text-center shadow-lg">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-primary font-display text-lg">G</span>
          </div>
        </div>
        <h2 className="font-display text-2xl text-primary mb-1">Gossip Café</h2>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Authenticating</p>
        <p className="text-sm text-muted-foreground">Completing your sign-in, please wait a moment…</p>
      </div>
    </div>
  );
}
