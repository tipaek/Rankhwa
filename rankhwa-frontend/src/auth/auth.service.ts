import api from '../api/client';
import { z } from 'zod';
import type { User } from '../types/User';

const LoginResponse = z.object({ token: z.string() });
type LoginResponse = z.infer<typeof LoginResponse>;

export async function login(email: string, password: string) {
  const { data } = await api.post<LoginResponse>('/auth/login', {
    email,
    password,
  });
  return LoginResponse.parse(data).token;
}

export async function register(
  email: string,
  password: string,
  displayName: string,
) {
  await api.post('/auth/register', { email, password, displayName });
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get<User>('/users/me');
  return data;
}
