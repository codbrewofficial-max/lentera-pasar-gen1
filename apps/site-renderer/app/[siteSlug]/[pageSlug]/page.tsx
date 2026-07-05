import { notFound, redirect } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { RenderSections } from '@/components/sections/SectionRegistry';
import { PageTracking } from '@/components/tracking/PageTracking';
import { PublicPagination } from '@/components/layout/PublicPagination';
import { getPublicPage, getPublicPortfolios, getPublicProducts } from '@/lib/api';
import { getSiteHref } from '@/lib/links';
import { getSeoDescription, getSeoTitle } from '@/lib/seo';
import type { CrudItem } from '@/lib/types';

type Props = {
  params: Promise<{ siteSlug: string; pageSlug: string }>;
  searchParams: Promise<{ page?: string; categoryId?: string; minPrice?: string; maxPrice?: string; sort?: string; q?: string }>;
};

const PORTFOLIO_PAGE_SIZE = 9;
const PRODUCT_PAGE_SIZE = 12;

export async function generateMetadata({ params }: Props) {
  const { siteSlug, pageSlug } = await params;
  const payload = await getPublicPage(siteSlug, pageSlug).catch(() => null);
  if (!payload || 'redirect' in payload) return { title: 'Website tidak ditemukan' };

  return {
    title: getSeoTitle(payload),
    description: getSeoDescription(payload),
    openGraph: {
      title: getSeoTitle(payload),
      description: getSeoDescription(payload),
      type: 'website'
    }
  };
}

export default async function SiteGenericPage({ params, searchParams }: Props) {
  const { siteSlug, pageSlug } = await params;
  const { page: pageParam, categoryId, minPrice, maxPrice, sort, q } = await searchParams;
  const payload = await getPublicPage(siteSlug, pageSlug).catch(() => null);

  if (!payload) notFound();
  if ('redirect' in payload) redirect(getSiteHref(siteSlug, payload.redirect.to));

  // Halaman Portfolio (grid) butuh daftar portfolio yang dipaginasi, bukan seluruh data
  // yang sudah dibundel di buildPublicPage (unpaginated). Halaman lain (about/services/
  // contact/dll) tetap pakai payload apa adanya.
  const isPortfolioListPage = payload.page.pageKey === 'portfolio';
  // Halaman Products (Katalog Produk) sama polanya dengan Portfolio, tapi juga bisa
  // difilter kategori/rentang harga dan diurutkan lewat query string (dipakai oleh
  // Product Filter Sidebar di tema).
  const isProductListPage = payload.page.pageKey === 'products';
  let pagination = null;

  if (isPortfolioListPage) {
    const currentPage = Math.max(1, Number(pageParam) || 1);
    const portfoliosResult = await getPublicPortfolios(siteSlug, currentPage, PORTFOLIO_PAGE_SIZE).catch(() => ({
      items: [],
      pagination: { page: 1, pageSize: PORTFOLIO_PAGE_SIZE, total: 0, totalPages: 1 }
    }));
    pagination = portfoliosResult.pagination;
    const portfolioItems: CrudItem[] = portfoliosResult.items.map((item) => ({
      ...item,
      description: item.description ?? undefined,
      imageUrl: item.imageUrl ?? undefined
    }));
    payload.page.sections = payload.page.sections.map((section) => ({
      ...section,
      data: { ...section.data, portfolios: portfolioItems }
    }));
  }

  if (isProductListPage) {
    const currentPage = Math.max(1, Number(pageParam) || 1);
    const productsResult = await getPublicProducts(siteSlug, {
      page: currentPage,
      pageSize: PRODUCT_PAGE_SIZE,
      categoryId: categoryId || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort: sort || undefined,
      q: q || undefined
    }).catch(() => ({
      items: [],
      pagination: { page: 1, pageSize: PRODUCT_PAGE_SIZE, total: 0, totalPages: 1 }
    }));
    const filters = { categoryId: categoryId || undefined, minPrice: minPrice ? Number(minPrice) : undefined, maxPrice: maxPrice ? Number(maxPrice) : undefined, sort: sort || undefined, q: q || undefined };
    payload.page.sections = payload.page.sections.map((section) => ({
      ...section,
      data: { ...section.data, products: productsResult.items, pagination: productsResult.pagination, filters }
    }));
  }

  // Products punya slot section sendiri ("products.product_pagination") yang render
  // paginasinya di dalam RenderSections lewat data.pagination di atas — beda dengan
  // Portfolio yang paginasinya masih dirender manual di luar RenderSections. Jadi
  // <PublicPagination> generik di bawah HANYA dipakai untuk Portfolio.
  const externalPagination = isPortfolioListPage ? pagination : null;

  return (
    <SiteShell siteSlug={siteSlug} payload={payload}>
      <PageTracking payload={payload} />
      <RenderSections siteSlug={siteSlug} payload={payload} />
      {externalPagination && (
        <div className="lp-container pb-16">
          <PublicPagination siteSlug={siteSlug} basePath={`/${pageSlug}`} pagination={externalPagination} />
        </div>
      )}
    </SiteShell>
  );
}
