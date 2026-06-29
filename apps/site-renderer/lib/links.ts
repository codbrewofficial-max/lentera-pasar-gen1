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
