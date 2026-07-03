import type { NavigationContract } from './types';
const isExternal = (value: string) => /^https?:\/\//i.test(value) || value.startsWith('mailto:') || value.startsWith('tel:');
export function getSiteHref(siteSlug: string, path?: string | null) {
  const value = path || '/';
  if (isExternal(value)) return value;
  const normalized = value.startsWith('/') ? value : `/${value}`;
  if (process.env.NEXT_PUBLIC_SITE_RENDERER_MODE === 'domain') return normalized;
  if (normalized === '/') return `/${siteSlug}`;
  return `/${siteSlug}${normalized}`;
}
export function resolveTargetHref({ siteSlug, navigation, content, prefix = 'cta', fallback }: { siteSlug: string; navigation?: NavigationContract; content?: Record<string, any>; prefix?: 'cta' | 'secondaryCta' | string; fallback?: string }) {
  const targetType = content?.[`${prefix}TargetType`];
  const pageKey = content?.[`${prefix}TargetPageKey`];
  const customUrl = content?.[`${prefix}CustomUrl`];
  const legacyUrl = content?.[`${prefix}Url`] || fallback;
  if (targetType === 'page' && pageKey) {
    const target = navigation?.availableTargets?.find((item) => item.type === 'page' && item.pageKey === pageKey);
    return getSiteHref(siteSlug, target?.path || legacyUrl || '/');
  }
  if (targetType === 'whatsapp') {
    const target = navigation?.availableTargets?.find((item) => item.type === 'whatsapp');
    return target?.path || legacyUrl || '#';
  }
  if (targetType === 'custom') return customUrl || legacyUrl || '#';
  return getSiteHref(siteSlug, legacyUrl || '/');
}

// Dipakai untuk link internal ke halaman "list" (services/portfolio/articles/about/dst)
// yang slug-nya bisa diubah owner lewat menu Halaman & Sections di dashboard. Selalu coba
// resolve dulu dari navigation.availableTargets (data dinamis dari WebsitePage.slug);
// fallbackPath hanya dipakai kalau pageKey itu tidak ditemukan (mis. halaman belum ada /
// belum published).
export function getPageHrefByKey(siteSlug: string, navigation: NavigationContract | undefined, pageKey: string, fallbackPath: string) {
  const target = navigation?.availableTargets?.find((item) => item.type === 'page' && item.pageKey === pageKey);
  return getSiteHref(siteSlug, target?.path || fallbackPath);
}

// Dipakai untuk link ke halaman detail dinamis (portfolio/:id, articles/:slug) — base path
// diambil dari slug halaman "list" yang sebenarnya (bisa custom), bukan literal hardcoded.
export function getDetailHref(siteSlug: string, navigation: NavigationContract | undefined, listPageKey: string, fallbackListPath: string, detailId?: string | null) {
  const target = navigation?.availableTargets?.find((item) => item.type === 'page' && item.pageKey === listPageKey);
  const basePath = (target?.path || fallbackListPath).replace(/\/$/, '') || fallbackListPath;
  return getSiteHref(siteSlug, `${basePath}/${detailId || ''}`);
}

export function getArticleDetailHref(siteSlug: string, navigation: NavigationContract | undefined, articleSlug?: string | null) {
  return getDetailHref(siteSlug, navigation, 'articles', '/articles', articleSlug);
}

export function getPortfolioDetailHref(siteSlug: string, navigation: NavigationContract | undefined, portfolioId?: string | null) {
  return getDetailHref(siteSlug, navigation, 'portfolio', '/portfolio', portfolioId);
}
