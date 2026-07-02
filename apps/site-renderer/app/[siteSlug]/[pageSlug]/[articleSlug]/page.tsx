import { notFound, redirect } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { RenderArticleDetail, RenderSections } from '@/components/sections/SectionRegistry';
import { ArticleTracking } from '@/components/tracking/PageTracking';
import { getPublicArticleDetail, getPublicHomePage, getPublicPage } from '@/lib/api';
import { getSiteHref } from '@/lib/links';
import { getArticleSeoDescription, getArticleSeoTitle } from '@/lib/seo';

type Props = { params: Promise<{ siteSlug: string; pageSlug: string; articleSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { siteSlug, pageSlug, articleSlug } = await params;
  const articlesPage = await getPublicPage(siteSlug, pageSlug).catch(() => null);

  if (!articlesPage || 'redirect' in articlesPage || articlesPage.page?.pageKey !== 'articles') {
    return { title: 'Artikel tidak ditemukan' };
  }

  const detail = await getPublicArticleDetail(siteSlug, articleSlug).catch(() => null);
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

export default async function ArticleDetailFromCustomArticlesSlugPage({ params }: Props) {
  const { siteSlug, pageSlug, articleSlug } = await params;

  const articlesPage = await getPublicPage(siteSlug, pageSlug).catch(() => null);
  if (!articlesPage) notFound();

  if ('redirect' in articlesPage) {
    const cleanTo = articlesPage.redirect.to.replace(/\/$/, '') || '/articles';
    redirect(getSiteHref(siteSlug, `${cleanTo}/${articleSlug}`));
  }

  if (articlesPage.page?.pageKey !== 'articles') notFound();

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
    <SiteShell siteSlug={siteSlug} payload={shellPayload}>
      <ArticleTracking detail={detail} />
      {payloadWithArticleSections && payloadWithArticleSections.page.sections.length > 0 ? (
        <RenderSections siteSlug={siteSlug} payload={payloadWithArticleSections} />
      ) : (
        <RenderArticleDetail siteSlug={siteSlug} detail={detail} />
      )}
    </SiteShell>
  );
}