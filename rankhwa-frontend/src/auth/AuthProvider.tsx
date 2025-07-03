import React, { createContext, useEffect, useState } from 'react';
import { login as apiLogin, register as apiRegister, fetchMe } from './auth.service';
import type {User} from '../types/User';

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (e: string, p: string) => Promise<void>;
  register: (e: string, p: string, d: string) => Promise<void>;
  logout: () => void;
}
const Ctx = createContext<AuthCtx>(null!);
export {Ctx};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) return setLoading(false);
    fetchMe()
      .then(setUser)
      .catch(() => localStorage.removeItem('jwt'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const token = await apiLogin(email, password);
    localStorage.setItem('jwt', token);
    setUser(await fetchMe());
  };

  const register = async (email: string, password: string, displayName: string) => {
    await apiRegister(email, password, displayName);
    await login(email, password); // auto-login
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
};
