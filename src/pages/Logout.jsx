import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMockAuth } from '@/lib/mockAuth';

// AUTH BLUEPRINT — simple confirm-and-redirect logout flow.
export default function Logout() {
  const { logout } = useMockAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout().catch((error) => console.error('Sign out failed:', error));
    const t = setTimeout(() => navigate('/'), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen grid place-items-center bg-background px-5">
      <div className="text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-primary text-primary-foreground grid place-items-center mb-5">✓</div>
        <h1 className="font-display text-3xl text-primary">Signed out</h1>
        <p className="mt-2 text-muted-foreground">See you at CodeSupa soon.</p>
      </div>
    </div>
  );
}