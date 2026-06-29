import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { RenderSections } from '@/components/sections/SectionRegistry';
import { PageTracking } from '@/components/tracking/PageTracking';
import { getPublicHomePage } from '@/lib/api';
import { getSeoTitle } from '@/lib/seo';

type Props = { params: Promise<{ siteSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { siteSlug } = await params;
  const page = await getPublicHomePage(siteSlug).catch(() => null);
  if (!page) return { title: 'Website tidak ditemukan' };
  return { title: getSeoTitle(page), description: page.seo?.description || page.website.name };
}

export default async function SiteHomePage({ params }: Props) {
  const { siteSlug } = await params;
  const page = await getPublicHomePage(siteSlug).catch(() => null);
  if (!page) notFound();
  return (
    <SiteShell siteSlug={siteSlug} payload={page}>
      <PageTracking payload={page} />
      <RenderSections siteSlug={siteSlug} payload={page} />
    </SiteShell>
  );
}
