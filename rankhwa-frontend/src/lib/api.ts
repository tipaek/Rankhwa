import { fetcher } from './fetcher';

export interface ManhwaSummary {
  id: number;
  title: string;
  author?: string | null;
  avgRating?: number | null;
  voteCount?: number;
  coverUrl?: string | null;
  bannerUrl?: string | null;
  chapters?: number | null;

  genres?: string[];
  titleEnglish?: string | null;
  titleRomaji?: string | null;
  titleNative?: string | null;
}

export interface ManhwaDetail extends ManhwaSummary {
  description?: string | null;
  releaseDate?: string | null;
}

export interface User {
  id: number;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface ListSummary {
  id: number;
  name: string;
  isDefault: boolean;
  itemCount: number;
  createdAt: string;
}

export interface ListDetail {
  id: number;
  name: string;
  isDefault: boolean;
  manhwaIds: number[];
}

export interface RatingResponse {
  score: number;
}

// ---- Auth endpoints ----
export async function register(email: string, password: string, displayName: string): Promise<string> {
  return fetcher<string>('/auth/register', { method: 'POST', json: { email, password, displayName } });
}

export async function login(email: string, password: string): Promise<string> {
  const res = await fetcher<{ token: string }>('/auth/login', { method: 'POST', json: { email, password } });
  return res.token;
}

export async function getMe(): Promise<User> {
  return fetcher<User>('/users/me', { method: 'GET', auth: true });
}

// ---- Public endpoints ----
export interface SearchParams {
  query?: string;
  min_rating?: number;
  min_votes?: number;
  year?: number;
  sort?: 'rating' | 'date' | 'title';
  genres?: string;
  page?: number;
  size?: number;
}

export async function getManhwaList(params: SearchParams = {}): Promise<ManhwaSummary[]> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.append(k, String(v));
  });
  const qs = query.toString();
  try {
    return await fetcher<ManhwaSummary[]>(`/manhwa${qs ? `?${qs}` : ''}`, { method: 'GET' });
  } catch (e: any) {
    if (e?.message === 'Forbidden') return [];
    throw e;
  }
}

export async function getManhwaDetail(id: number): Promise<ManhwaDetail | null> {
  try {
    return await fetcher<ManhwaDetail>(`/manhwa/${id}`, { method: 'GET' });
  } catch (e: any) {
    if (e?.message === 'Forbidden') return null;
    throw e;
  }
}

// ---- Ratings (protected) ----
export async function getMyRating(id: number): Promise<RatingResponse> {
  return fetcher<RatingResponse>(`/manhwa/${id}/rating`, { method: 'GET', auth: true });
}

export async function postRating(id: number, score: number): Promise<void> {
  await fetcher<void>(`/manhwa/${id}/rating`, { method: 'POST', json: { score }, auth: true });
}

// ---- Lists (protected) ----
export async function getLists(): Promise<ListSummary[]> {
  return fetcher<ListSummary[]>('/lists', { method: 'GET', auth: true });
}

export async function createList(name: string): Promise<ListDetail> {
  return fetcher<ListDetail>('/lists', { method: 'POST', json: { name }, auth: true });
}

export async function renameList(listId: number, name: string): Promise<void> {
  await fetcher<void>(`/lists/${listId}`, { method: 'PATCH', json: { name }, auth: true });
}

export async function deleteList(listId: number): Promise<void> {
  await fetcher<void>(`/lists/${listId}`, { method: 'DELETE', auth: true });
}

export async function getListDetail(listId: number): Promise<ListDetail> {
  return fetcher<ListDetail>(`/lists/${listId}`, { method: 'GET', auth: true });
}

export async function addItemToList(listId: number, manhwaId: number): Promise<void> {
  await fetcher<void>(`/lists/${listId}/items`, { method: 'POST', json: { manhwaId }, auth: true });
}

export async function removeItemFromList(listId: number, manhwaId: number): Promise<void> {
  await fetcher<void>(`/lists/${listId}/items/${manhwaId}`, { method: 'DELETE', auth: true });
}
