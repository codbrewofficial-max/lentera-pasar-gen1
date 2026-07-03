import { notFound, redirect } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { RenderArticleDetail, RenderPortfolioDetail, RenderSections } from '@/components/sections/SectionRegistry';
import { ArticleTracking, PortfolioTracking } from '@/components/tracking/PageTracking';
import { getPublicArticleDetail, getPublicHomePage, getPublicPage, getPublicPortfolioDetail } from '@/lib/api';
import { getSiteHref } from '@/lib/links';
import { getArticleSeoDescription, getArticleSeoTitle, getPortfolioSeoDescription, getPortfolioSeoTitle } from '@/lib/seo';

// PENTING: Next.js mewajibkan nama segmen dinamis yang SAMA untuk semua rute di level
// yang sama (tidak boleh [articleSlug] dan [portfolioId] berdampingan di bawah
// [siteSlug]/[pageSlug]/...). Karena itu rute detail Artikel & Portfolio yang pakai slug
// halaman custom digabung jadi satu file ini, dan dibedakan lewat pageKey hasil resolve
// dari `pageSlug` (bisa "articles" atau "portfolio"). Rute statis /articles/:slug dan
// /portfolio/:id tetap terpisah seperti biasa dan tidak terpengaruh oleh perubahan ini.
type Props = { params: Promise<{ siteSlug: string; pageSlug: string; articleSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { siteSlug, pageSlug, articleSlug: detailId } = await params;
  const listPage = await getPublicPage(siteSlug, pageSlug).catch(() => null);
  if (!listPage || 'redirect' in listPage) return { title: 'Halaman tidak ditemukan' };

  if (listPage.page?.pageKey === 'portfolio') {
    const detail = await getPublicPortfolioDetail(siteSlug, detailId).catch(() => null);
    if (!detail) return { title: 'Portfolio tidak ditemukan' };
    return {
      title: getPortfolioSeoTitle(detail),
      description: getPortfolioSeoDescription(detail),
      openGraph: {
        title: getPortfolioSeoTitle(detail),
        description: getPortfolioSeoDescription(detail),
        type: 'website',
        images: detail.portfolio.imageUrl ? [{ url: detail.portfolio.imageUrl }] : undefined
      }
    };
  }

  if (listPage.page?.pageKey === 'articles') {
    const detail = await getPublicArticleDetail(siteSlug, detailId).catch(() => null);
    if (!detail) return { title: 'Artikel tidak ditemukan' };
    return {
      title: getArticleSeoTitle(detail),
      description: getArticleSeoDescription(detail),
      openGraph: {
        title: getArticleSeoTitle(detail),
        description: getArticleSeoDescription(detail),
        type: 'article',
        images: detail.article.coverImageUrl ? [{ url: detail.article.coverImageUrl }] : undefined
      }
    };
  }

  return { title: 'Halaman tidak ditemukan' };
}

export default async function DetailFromCustomSlugPage({ params }: Props) {
  const { siteSlug, pageSlug, articleSlug: detailId } = await params;

  const listPage = await getPublicPage(siteSlug, pageSlug).catch(() => null);
  if (!listPage) notFound();

  if ('redirect' in listPage) {
    const cleanTo = listPage.redirect.to.replace(/\/$/, '') || `/${pageSlug}`;
    redirect(getSiteHref(siteSlug, `${cleanTo}/${detailId}`));
  }

  if (listPage.page?.pageKey === 'portfolio') {
    return <PortfolioDetailBody siteSlug={siteSlug} portfolioId={detailId} />;
  }

  if (listPage.page?.pageKey === 'articles') {
    return <ArticleDetailBody siteSlug={siteSlug} articleSlug={detailId} />;
  }

  notFound();
}

async function ArticleDetailBody({ siteSlug, articleSlug }: { siteSlug: string; articleSlug: string }) {
  const detail = await getPublicArticleDetail(siteSlug, articleSlug).catch(() => null);
  if (!detail) notFound();

  const articleTemplate = await getPublicPage(siteSlug, 'article-detail').catch(() => null);
  const hasArticleTemplate = articleTemplate && !('redirect' in articleTemplate) && (articleTemplate.page.sections?.length ?? 0) > 0;

  let fallbackThemeSections: any[] = [];
  if (!hasArticleTemplate) {
    const homePage = await getPublicHomePage(siteSlug).catch(() => null);
    const referenceTheme = homePage?.page?.sections?.find((section) => section.templateTheme)?.templateTheme;
    if (referenceTheme) {
      fallbackThemeSections = [
        {
          id: 'article-detail-theme-probe',
          slotKey: 'article_detail.theme_probe',
          templateTheme: referenceTheme,
          content: {},
          data: {}
        }
      ];
    }
  }

  const shellPayload = hasArticleTemplate
    ? articleTemplate
    : {
        website: detail.website,
        seo: detail.seo,
        businessProfile: detail.businessProfile,
        navigation: detail.navigation,
        page: {
          pageKey: 'article_detail',
          title: 'Detail Artikel',
          navLabel: 'Detail Artikel',
          footerLabel: 'Detail Artikel',
          slug: 'article-detail',
          path: '/articles/:articleSlug',
          purpose: 'Template detail artikel.',
          isPublished: true,
          isDynamicDetailPage: true,
          seoTitle: detail.seo?.title,
          seoDescription: detail.seo?.description,
          sections: fallbackThemeSections
        }
      };

  const payloadWithArticleSections = hasArticleTemplate
    ? {
        ...articleTemplate,
        page: {
          ...articleTemplate.page,
          sections: articleTemplate.page.sections.map((section) => ({
            ...section,
            data: {
              ...section.data,
              article: detail.article,
              relatedArticles: detail.relatedArticles,
              articles: detail.relatedArticles
            }
          }))
        }
      }
    : null;

  return (
    <SiteShell siteSlug={siteSlug} payload={shellPayload as any}>
      <ArticleTracking detail={detail} />
      {payloadWithArticleSections && payloadWithArticleSections.page.sections.length > 0 ? (
        <RenderSections siteSlug={siteSlug} payload={payloadWithArticleSections as any} />
      ) : (
        <RenderArticleDetail siteSlug={siteSlug} detail={detail} />
      )}
    </SiteShell>
  );
}

async function PortfolioDetailBody({ siteSlug, portfolioId }: { siteSlug: string; portfolioId: string }) {
  const detail = await getPublicPortfolioDetail(siteSlug, portfolioId).catch(() => null);
  if (!detail) notFound();

  const portfolioTemplate = await getPublicPage(siteSlug, 'portfolio-detail').catch(() => null);
  const hasPortfolioTemplate = portfolioTemplate && !('redirect' in portfolioTemplate) && (portfolioTemplate.page.sections?.length ?? 0) > 0;

  let fallbackThemeSections: any[] = [];
  if (!hasPortfolioTemplate) {
    const homePage = await getPublicHomePage(siteSlug).catch(() => null);
    const referenceTheme = homePage?.page?.sections?.find((section) => section.templateTheme)?.templateTheme;
    if (referenceTheme) {
      fallbackThemeSections = [
        {
          id: 'portfolio-detail-theme-probe',
          slotKey: 'portfolio_detail.theme_probe',
          templateTheme: referenceTheme,
          content: {},
          data: {}
        }
      ];
    }
  }

  const shellPayload = hasPortfolioTemplate
    ? portfolioTemplate
    : {
        website: detail.website,
        seo: detail.seo,
        businessProfile: detail.businessProfile,
        navigation: detail.navigation,
        page: {
          pageKey: 'portfolio_detail',
          title: detail.portfolio.title,
          navLabel: 'Detail Portfolio',
          footerLabel: 'Detail Portfolio',
          slug: 'portfolio-detail',
          path: '/portfolio/:portfolioId',
          purpose: 'Template detail portfolio.',
          isPublished: true,
          isDynamicDetailPage: true,
          seoTitle: detail.seo?.title,
          seoDescription: detail.seo?.description,
          sections: fallbackThemeSections
        }
      };

  const payloadWithPortfolioSections = hasPortfolioTemplate
    ? {
        ...portfolioTemplate,
        page: {
          ...portfolioTemplate.page,
          sections: portfolioTemplate.page.sections.map((section) => ({
            ...section,
            data: {
              ...section.data,
              portfolio: detail.portfolio,
              relatedPortfolios: detail.relatedPortfolios,
              portfolios: [detail.portfolio, ...detail.relatedPortfolios]
            }
          }))
        }
      }
    : null;

  return (
    <SiteShell siteSlug={siteSlug} payload={shellPayload as any}>
      <PortfolioTracking detail={detail} />
      {payloadWithPortfolioSections && payloadWithPortfolioSections.page.sections.length > 0 ? (
        <RenderSections siteSlug={siteSlug} payload={payloadWithPortfolioSections as any} />
      ) : (
        <RenderPortfolioDetail siteSlug={siteSlug} detail={detail} />
      )}
    </SiteShell>
  );
}
