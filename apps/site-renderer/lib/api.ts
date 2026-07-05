import type { ApiResponse, ArticleDetailPayload, ArticleSummary, PortfolioDetailPayload, PortfolioSummary, ProductDetailPayload, ProductSummary, PublicPagePayload, RedirectPayload } from './types';

export type PaginationMeta = { page: number; pageSize: number; total: number; totalPages: number };
export type PaginatedResult<T> = { items: T[]; pagination: PaginationMeta };

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

async function apiGetPaginated<T>(path: string, options: RequestInit = {}): Promise<PaginatedResult<T>> {
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
  const meta = (json as any).meta?.pagination;
  return {
    items: json.data as T[],
    pagination: meta || { page: 1, pageSize: (json.data as T[]).length, total: (json.data as T[]).length, totalPages: 1 }
  };
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

// Halaman listing publik (Articles Grid / Portfolio Grid) — dipaginasi lewat query
// ?page=&pageSize=, dipakai oleh apps/site-renderer/app/[siteSlug]/articles/page.tsx dan
// halaman generic [pageSlug]/page.tsx khusus untuk pageKey "portfolio".
export function getPublicArticles(siteSlug: string, page = 1, pageSize = 9) {
  return apiGetPaginated<ArticleSummary>(`/public/sites/${siteSlug}/articles?page=${page}&pageSize=${pageSize}`);
}

export function getPublicPortfolios(siteSlug: string, page = 1, pageSize = 9) {
  return apiGetPaginated<PortfolioSummary>(`/public/sites/${siteSlug}/portfolios?page=${page}&pageSize=${pageSize}`);
}

export function getPublicArticleDetail(siteSlug: string, articleSlug: string) {
  return apiGet<ArticleDetailPayload>(`/public/sites/${siteSlug}/articles/${articleSlug}`);
}

export function getPublicPortfolioDetail(siteSlug: string, portfolioId: string) {
  return apiGet<PortfolioDetailPayload>(`/public/sites/${siteSlug}/portfolios/${portfolioId}`);
}

// Product Grid di halaman "products" (Katalog Produk) — dipaginasi + bisa difilter
// kategori/rentang harga dan diurutkan. Dipakai oleh halaman generic [pageSlug]/page.tsx
// khusus untuk pageKey "products", niru pola getPublicPortfolios di atas.
export function getPublicProducts(
  siteSlug: string,
  options: { page?: number; pageSize?: number; categoryId?: string; minPrice?: number; maxPrice?: number; sort?: string; q?: string } = {}
) {
  const { page = 1, pageSize = 12, categoryId, minPrice, maxPrice, sort, q } = options;
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (categoryId) params.set('categoryId', categoryId);
  if (Number.isFinite(minPrice)) params.set('minPrice', String(minPrice));
  if (Number.isFinite(maxPrice)) params.set('maxPrice', String(maxPrice));
  if (sort) params.set('sort', sort);
  if (q) params.set('q', q);
  return apiGetPaginated<ProductSummary>(`/public/sites/${siteSlug}/products?${params.toString()}`);
}

export function getPublicProductDetail(siteSlug: string, productSlug: string) {
  return apiGet<ProductDetailPayload>(`/public/sites/${siteSlug}/products/${productSlug}`);
}

export function submitContact(siteSlug: string, payload: Record<string, any>) {
  return apiPost(`/public/sites/${siteSlug}/contact`, payload);
}

export async function submitTracking(payload: Record<string, any>) {
  try {
    return await apiPost(`/public/tracking/events`, payload);
  } catch (error) {
    // Tracking tidak boleh merusak pengalaman pengunjung.
    console.warn('Tracking event failed:', error);
    return null;
  }
}