import type { ApiResponse, ArticleDetailPayload, ArticleSummary, PublicPagePayload, RedirectPayload } from './types';

const DEFAULT_API_BASE_URL = 'http://localhost:4000/api/v1';

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || DEFAULT_API_BASE_URL;
}

async function readJsonSafe(res: Response) {
  return (await res.json().catch(() => null)) as ApiResponse<any> | { error?: { message?: string } } | null;
}

async function apiGet<T>(path: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getApiBaseUrl().replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const res = await fetch(`${baseUrl}${cleanPath}`, {
    ...options,
    headers: { Accept: 'application/json', ...(options.headers || {}) },
    next: { revalidate: 30, ...(options as any).next }
  });
  const json = await readJsonSafe(res);
  if (!res.ok || !json || !('data' in json)) {
    throw new Error((json as any)?.error?.message || `API request failed: ${res.status}`);
  }
  return json.data as T;
}

function stripUndefined(value: any): any {
  if (Array.isArray(value)) return value.map(stripUndefined);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, stripUndefined(item)])
    );
  }
  return value;
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const baseUrl = getApiBaseUrl().replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const res = await fetch(`${baseUrl}${cleanPath}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(stripUndefined(body))
  });
  const json = await readJsonSafe(res);
  if (!res.ok || !json || !('data' in json)) {
    throw new Error((json as any)?.error?.message || `API request failed: ${res.status}`);
  }
  return json.data as T;
}

export function getPublicHomePage(siteSlug: string) {
  return apiGet<PublicPagePayload>(`/public/sites/${siteSlug}`);
}

export function getPublicPage(siteSlug: string, pageSlug: string) {
  return apiGet<PublicPagePayload | RedirectPayload>(`/public/sites/${siteSlug}/pages/${pageSlug}`);
}

export function getPublicArticles(siteSlug: string) {
  return apiGet<ArticleSummary[]>(`/public/sites/${siteSlug}/articles`);
}

export function getPublicArticleDetail(siteSlug: string, articleSlug: string) {
  return apiGet<ArticleDetailPayload>(`/public/sites/${siteSlug}/articles/${articleSlug}`);
}

export function submitContact(siteSlug: string, payload: Record<string, any>) {
  return apiPost(`/public/sites/${siteSlug}/contact`, payload);
}

export async function submitTracking(payload: Record<string, any>) {
  try {
    return await apiPost(`/public/tracking/events`, payload);
  } catch (error) {
    // Tracking tidak boleh merusak pengalaman pengunjung.
    // Di mode development tetap tampilkan pesan agar bug API mudah dilacak.
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[tracking] failed:', error);
    }
    return null;
  }
}
