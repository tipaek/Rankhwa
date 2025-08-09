let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
}

type FetchOptions = RequestInit & {
  json?: any;
  auth?: boolean; // attach Authorization only if true
};

async function parseJsonSafe(res: Response) {
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) return res.text();
  try { return await res.json(); } catch { return null; }
}

export async function fetcher<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const base = import.meta.env.VITE_API_BASE;
  const { json, auth, headers: hdrsIn, ...rest } = options;

  const headers: HeadersInit = { 'Content-Type': 'application/json', ...(hdrsIn || {}) };
  if (auth) {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const init: RequestInit = {
    ...rest,
    headers,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  };

  const res = await fetch(`${base}${path}`, init);

  if (res.status === 401) {
    localStorage.removeItem('token');
    unauthorizedHandler?.();
    throw new Error('Unauthorized');
  }
  if (res.status === 403) {
    throw new Error('Forbidden');
  }
  if (!res.ok) {
    const errorBody = await parseJsonSafe(res);
    const message =
      typeof errorBody === 'string'
        ? errorBody
        : (errorBody?.message || `Request failed (HTTP ${res.status})`);
    throw new Error(message);
  }
  if (res.status === 204) return null as unknown as T;

  return (await parseJsonSafe(res)) as T;
}
