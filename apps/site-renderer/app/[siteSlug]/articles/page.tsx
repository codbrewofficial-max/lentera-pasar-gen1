import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { RenderSections } from '@/components/sections/SectionRegistry';
import { PageTracking } from '@/components/tracking/PageTracking';
import { getPublicArticles, getPublicPage } from '@/lib/api';

type Props = { params: Promise<{ siteSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { siteSlug } = await params;
  const page = await getPublicPage(siteSlug, 'articles').catch(() => null);
  if (!page || 'redirect' in page) return { title: 'Artikel' };
  return { title: page.page?.seoTitle || page.page?.navLabel || page.page?.title || 'Artikel', description: page.page?.seoDescription || page.seo?.description };
}

export default async function ArticlesPage({ params }: Props) {
  const { siteSlug } = await params;
  const [pagePayload, articles] = await Promise.all([
    getPublicPage(siteSlug, 'articles').catch(() => null),
    getPublicArticles(siteSlug).catch(() => []),
  ]);
  if (!pagePayload || 'redirect' in pagePayload) notFound();
  const payload = {
    ...pagePayload,
    page: { ...pagePayload.page, sections: pagePayload.page.sections.map((section) => ({ ...section, data: { ...section.data, articles } })) }
  };
  return (
    <SiteShell siteSlug={siteSlug} payload={payload}>
      <PageTracking payload={payload} />
      <RenderSections siteSlug={siteSlug} payload={payload} />
    </SiteShell>
  );
}
