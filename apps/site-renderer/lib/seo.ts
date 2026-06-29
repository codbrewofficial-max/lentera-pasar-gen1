import type { PublicPagePayload } from './types';
export function getSeoTitle(payload: PublicPagePayload) { return payload.page?.seoTitle || payload.seo?.title || payload.website.name; }
