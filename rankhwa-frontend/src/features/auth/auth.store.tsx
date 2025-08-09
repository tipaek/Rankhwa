import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as api from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { setUnauthorizedHandler } from '@/lib/fetcher';

interface AuthContextValue {
  user: api.User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: (redirect?: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<api.User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Logout clears localStorage and resets state.  Optionally accepts a
  // redirect URL; defaults to '/login'.
  const logout = useCallback((redirect?: string) => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    queryClient.clear();
    const destination = redirect ?? `/login?redirectTo=${encodeURIComponent(window.location.pathname + window.location.search)}`;
    // Use replace to prevent login page from being appended to history repeatedly.
    window.location.replace(destination);
  }, []);

  // Provide our logout function to the fetcher so it can be invoked on
  // unauthorized responses.  This runs only once.
  useEffect(() => {
    setUnauthorizedHandler(() => logout());
  }, [logout]);

  // On mount read any existing token from localStorage and attempt
  // loading the user profile.  If the token is invalid the call will
  // trigger the unauthorized handler and redirect to login.
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }
    setToken(storedToken);
    api
      .getMe()
      .then((u) => {
        setUser(u);
      })
      .catch(() => {
        // Already handled by unauthorizedHandler.
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const loginHandler = useCallback(async (email: string, password: string) => {
    const jwt = await api.login(email, password);
    localStorage.setItem('token', jwt);
    setToken(jwt);
    const u = await api.getMe();
    setUser(u);
  }, []);

  const registerHandler = useCallback(
    async (email: string, password: string, displayName: string) => {
      await api.register(email, password, displayName);
      await loginHandler(email, password);
    },
    [loginHandler]
  );

  const value: AuthContextValue = {
    user,
    token,
    isLoading,
    login: loginHandler,
    register: registerHandler,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}