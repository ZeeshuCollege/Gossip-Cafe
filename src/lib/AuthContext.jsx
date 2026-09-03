import React, { createContext, useContext } from 'react';
import { useMockAuth } from '@/lib/mockAuth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, logout } = useMockAuth();
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: Boolean(user),
      isLoadingAuth: false,
      isLoadingPublicSettings: false,
      authError: null,
      appPublicSettings: null,
      authChecked: true,
      logout,
      navigateToLogin: () => { window.location.href = '/login'; },
      checkUserAuth: async () => {},
      checkAppState: async () => {}
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
