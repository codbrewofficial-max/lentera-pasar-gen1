import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { RenderArticleDetail, RenderSections } from '@/components/sections/SectionRegistry';
import { ArticleTracking } from '@/components/tracking/PageTracking';
import { getPublicArticleDetail, getPublicPage } from '@/lib/api';
import { getArticleSeoDescription, getArticleSeoTitle } from '@/lib/seo';

type Props = { params: Promise<{ siteSlug: string; articleSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { siteSlug, articleSlug } = await params;
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

export default async function ArticleDetailPage({ params }: Props) {
  const { siteSlug, articleSlug } = await params;
  const detail = await getPublicArticleDetail(siteSlug, articleSlug).catch(() => null);
  if (!detail) notFound();

  const articleTemplate = await getPublicPage(siteSlug, 'article-detail').catch(() => null);
  const shellPayload = articleTemplate && !('redirect' in articleTemplate)
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
          sections: []
        }
      };

  const payloadWithArticleSections = articleTemplate && !('redirect' in articleTemplate)
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
