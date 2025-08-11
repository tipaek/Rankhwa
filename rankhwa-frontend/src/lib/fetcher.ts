const APP_EVENTS = {
  fetchStart: 'app:fetch:start',
  fetchEnd: 'app:fetch:end',
  coldStartShow: 'app:coldstart:show',
  coldStartHide: 'app:coldstart:hide',
} as const;

let firstFetchStartedAt: number | null = null;
let firstFetchDone = false;
let coldStartTimer: number | null = null;

function emit(name: string, detail?: any) {
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

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

  // ✱ Only set Content-Type when actually sending JSON
  const headers: HeadersInit = { ...(hdrsIn || {}) };
  if (json !== undefined) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const init: RequestInit = {
    ...rest,
    headers,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  };

  emit(APP_EVENTS.fetchStart, { path });
  if (!firstFetchStartedAt) {
    firstFetchStartedAt = performance.now();
    // if first request takes longer than 900ms, show cold-start banner
    coldStartTimer = window.setTimeout(() => {
      if (!firstFetchDone) emit(APP_EVENTS.coldStartShow);
    }, 900);
  }

  const res = await fetch(`${base}${path}`, init);

  // signal fetch end
  emit(APP_EVENTS.fetchEnd, { path });

  // mark first request completion & hide overlay (if any)
  if (!firstFetchDone && firstFetchStartedAt != null) {
    firstFetchDone = true;
    if (coldStartTimer) window.clearTimeout(coldStartTimer);
    emit(APP_EVENTS.coldStartHide);
  }

  if (res.status === 401 && auth) {
    localStorage.removeItem('token');
    unauthorizedHandler?.();
    throw new Error('Unauthorized');
  }
  if (res.status === 403) {
    throw new Error('Forbidden');
  }
  if (!res.ok) {
    const errorBody = await parseJsonSafe(res);

  // ---------- Friendly auth messages (REGISTER + LOGIN) ----------
  const pathLower = (path || '').toLowerCase();
  const eb = errorBody as any;
  const asString =
    typeof errorBody === 'string'
      ? errorBody
      : (eb?.message || eb?.error || eb?.detail || '');

  // Broad detector for “already registered” across APIs & phrasings
  const looksLikeAlreadyExists =
    res.status === 409 ||
    /\balready\b.*\b(in\s*use|exist|registered|taken)\b/i.test(asString) ||
    /\b(in\s*use|taken)\b/i.test(asString) && /\b(email|user(name)?)\b/i.test(asString) ||
    /duplicate|conflict|unique constraint/i.test(asString) ||
    String(eb?.code || '').toUpperCase() === 'USER_EXISTS';

  // LOGIN
  if (pathLower.startsWith('/auth/login') && [400, 401, 404].includes(res.status)) {
    throw new Error('Invalid email or password. Please try again.');
  }

  // REGISTER
  if (pathLower.startsWith('/auth/register')) {
    if (looksLikeAlreadyExists) {
      throw new Error('Email already registered. Try logging in instead.');
    }
    if ([400, 422].includes(res.status)) {
      if (typeof errorBody === 'string' && errorBody.trim()) throw new Error(errorBody.trim());
      if (asString) throw new Error(asString);
      throw new Error('Please verify your inputs and try again.');
    }
  }

    const message =
      typeof errorBody === 'string'
        ? errorBody
        : (errorBody?.message || `Request failed (HTTP ${res.status})`);
    throw new Error(message);
  }
  if (res.status === 204) return null as unknown as T;

  return (await parseJsonSafe(res)) as T;
}
