import { notFound, redirect } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { RenderSections } from '@/components/sections/SectionRegistry';
import { PageTracking } from '@/components/tracking/PageTracking';
import { PublicPagination } from '@/components/layout/PublicPagination';
import { getPublicArticles, getPublicPage } from '@/lib/api';
import { getSiteHref } from '@/lib/links';
import { getSeoDescription, getSeoTitle } from '@/lib/seo';

type Props = {
  params: Promise<{ siteSlug: string }>;
  searchParams: Promise<{ page?: string }>;
};

const ARTICLES_PAGE_SIZE = 9;

export async function generateMetadata({ params }: Props) {
  const { siteSlug } = await params;
  const page = await getPublicPage(siteSlug, 'articles').catch(() => null);
  if (!page || 'redirect' in page) return { title: 'Artikel' };

  return {
    title: getSeoTitle(page),
    description: getSeoDescription(page)
  };
}

export default async function ArticlesPage({ params, searchParams }: Props) {
  const { siteSlug } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);

  const [pagePayload, articlesResult] = await Promise.all([
    getPublicPage(siteSlug, 'articles').catch(() => null),
    getPublicArticles(siteSlug, currentPage, ARTICLES_PAGE_SIZE).catch(() => ({
      items: [],
      pagination: { page: 1, pageSize: ARTICLES_PAGE_SIZE, total: 0, totalPages: 1 }
    })),
  ]);

  if (!pagePayload) notFound();
  if ('redirect' in pagePayload) redirect(getSiteHref(siteSlug, pagePayload.redirect.to));

  const { items: articles, pagination } = articlesResult;

  const payload = {
    ...pagePayload,
    page: {
      ...pagePayload.page,
      sections: pagePayload.page.sections.map((section) => ({
        ...section,
        data: { ...section.data, articles, pagination }
      }))
    }
  };

  // Katalog Produk punya slot "articles.article_pagination" sendiri yang render
  // paginasinya inline lewat data.pagination di atas — beda dengan Company Profile yang
  // belum punya slot pagination khusus dan masih pakai <PublicPagination> generik di luar
  // RenderSections. Kalau dua-duanya dirender bareng, paginasinya jadi dobel.
  const isCatalogProduct = payload.website.websiteType === 'catalog_product';

  return (
    <SiteShell siteSlug={siteSlug} payload={payload}>
      <PageTracking payload={payload} />
      <RenderSections siteSlug={siteSlug} payload={payload} />
      {!isCatalogProduct && (
        <div className="lp-container pb-16">
          <PublicPagination siteSlug={siteSlug} basePath="/articles" pagination={pagination} />
        </div>
      )}
    </SiteShell>
  );
}
