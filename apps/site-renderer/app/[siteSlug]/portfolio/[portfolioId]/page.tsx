import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { RenderSections } from '@/components/sections/SectionRegistry';
import { PortfolioTracking } from '@/components/tracking/PageTracking';
import { getPublicPortfolioDetail, getPublicPage } from '@/lib/api';
import { getPortfolioSeoDescription, getPortfolioSeoTitle } from '@/lib/seo';

type Props = { params: Promise<{ siteSlug: string; portfolioId: string }> };

export async function generateMetadata({ params }: Props) {
  const { siteSlug, portfolioId } = await params;
  const detail = await getPublicPortfolioDetail(siteSlug, portfolioId).catch(() => null);
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

export default async function PortfolioDetailPage({ params }: Props) {
  const { siteSlug, portfolioId } = await params;
  const detail = await getPublicPortfolioDetail(siteSlug, portfolioId).catch(() => null);
  if (!detail) notFound();

  const portfolioTemplate = await getPublicPage(siteSlug, 'portfolio-detail').catch(() => null);

  const shellPayload = portfolioTemplate && !('redirect' in portfolioTemplate)
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
          sections: []
        }
      };

  const payload = portfolioTemplate && !('redirect' in portfolioTemplate)
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
    : shellPayload;

  return (
    <SiteShell siteSlug={siteSlug} payload={shellPayload as any}>
      <PortfolioTracking detail={detail} />
      <RenderSections siteSlug={siteSlug} payload={payload as any} />
    </SiteShell>
  );
}