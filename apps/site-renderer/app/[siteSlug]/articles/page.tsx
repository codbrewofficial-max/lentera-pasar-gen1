import { notFound, redirect } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { RenderSections } from '@/components/sections/SectionRegistry';
import { PageTracking } from '@/components/tracking/PageTracking';
import { getPublicArticles, getPublicPage } from '@/lib/api';
import { getSiteHref } from '@/lib/links';
import { getSeoDescription, getSeoTitle } from '@/lib/seo';

type Props = { params: Promise<{ siteSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { siteSlug } = await params;
  const page = await getPublicPage(siteSlug, 'articles').catch(() => null);
  if (!page || 'redirect' in page) return { title: 'Artikel' };

  return {
    title: getSeoTitle(page),
    description: getSeoDescription(page)
  };
}

export default async function ArticlesPage({ params }: Props) {
  const { siteSlug } = await params;
  const [pagePayload, articles] = await Promise.all([
    getPublicPage(siteSlug, 'articles').catch(() => null),
    getPublicArticles(siteSlug).catch(() => []),
  ]);

  if (!pagePayload) notFound();
  if ('redirect' in pagePayload) redirect(getSiteHref(siteSlug, pagePayload.redirect.to));

  const payload = {
    ...pagePayload,
    page: {
      ...pagePayload.page,
      sections: pagePayload.page.sections.map((section) => ({
        ...section,
        data: { ...section.data, articles }
      }))
    }
  };

  return (
    <SiteShell siteSlug={siteSlug} payload={payload}>
      <PageTracking payload={payload} />
      <RenderSections siteSlug={siteSlug} payload={payload} />
    </SiteShell>
  );
}
