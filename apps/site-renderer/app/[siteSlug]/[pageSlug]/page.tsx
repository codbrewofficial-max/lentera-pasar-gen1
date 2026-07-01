import { notFound, redirect } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { RenderSections } from '@/components/sections/SectionRegistry';
import { PageTracking } from '@/components/tracking/PageTracking';
import { getPublicPage } from '@/lib/api';
import { getSiteHref } from '@/lib/links';
import { getSeoDescription, getSeoTitle } from '@/lib/seo';

type Props = { params: Promise<{ siteSlug: string; pageSlug: string }> };

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

export default async function SiteGenericPage({ params }: Props) {
  const { siteSlug, pageSlug } = await params;
  const payload = await getPublicPage(siteSlug, pageSlug).catch(() => null);

  if (!payload) notFound();
  if ('redirect' in payload) redirect(getSiteHref(siteSlug, payload.redirect.to));

  return (
    <SiteShell siteSlug={siteSlug} payload={payload}>
      <PageTracking payload={payload} />
      <RenderSections siteSlug={siteSlug} payload={payload} />
    </SiteShell>
  );
}
