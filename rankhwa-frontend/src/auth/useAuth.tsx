import { useContext } from 'react';
import { Ctx } from './AuthProvider';

export function useAuth() {
  return useContext(Ctx);
}