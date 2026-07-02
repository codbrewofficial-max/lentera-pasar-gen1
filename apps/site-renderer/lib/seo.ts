import type { ArticleDetailPayload, PortfolioDetailPayload, PublicPagePayload } from './types';

const DEFAULT_DESCRIPTION =
  'Website company profile yang menampilkan profil, layanan, portofolio, artikel, dan kontak bisnis.';

function compact(value?: string | null) {
  return value?.replace(/\s+/g, ' ').trim() || '';
}

export function getSeoTitle(payload: PublicPagePayload) {
  return (
    compact(payload.page?.seoTitle) ||
    compact(payload.seo?.title) ||
    compact(payload.page?.navLabel) ||
    compact(payload.page?.title) ||
    compact(payload.website.name) ||
    'Website'
  );
}

export function getSeoDescription(payload: PublicPagePayload) {
  return (
    compact(payload.page?.seoDescription) ||
    compact(payload.seo?.description) ||
    compact(payload.businessProfile?.tagline) ||
    compact(payload.businessProfile?.description)?.slice(0, 155) ||
    compact(payload.website.name) ||
    DEFAULT_DESCRIPTION
  );
}

export function getArticleSeoTitle(detail: ArticleDetailPayload) {
  return compact(detail.seo?.title) || compact(detail.article.seoTitle) || compact(detail.article.title) || 'Artikel';
}

export function getArticleSeoDescription(detail: ArticleDetailPayload) {
  return (
    compact(detail.seo?.description) ||
    compact(detail.article.seoDescription) ||
    compact(detail.article.excerpt) ||
    compact(detail.businessProfile?.tagline) ||
    DEFAULT_DESCRIPTION
  );
}

export function getPortfolioSeoTitle(detail: PortfolioDetailPayload) {
  return compact(detail.seo?.title) || compact(detail.portfolio.title) || 'Portfolio';
}

export function getPortfolioSeoDescription(detail: PortfolioDetailPayload) {
  return (
    compact(detail.seo?.description) ||
    compact(detail.portfolio.description) ||
    compact(detail.businessProfile?.tagline) ||
    DEFAULT_DESCRIPTION
  );
}