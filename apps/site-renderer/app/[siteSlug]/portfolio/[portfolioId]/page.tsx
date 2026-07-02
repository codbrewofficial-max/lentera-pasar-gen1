import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { RenderSections } from '@/components/sections/SectionRegistry';
import { PortfolioTracking } from '@/components/tracking/PageTracking';
import { getPublicHomePage, getPublicPortfolioDetail, getPublicPage } from '@/lib/api';
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
  const hasPortfolioTemplate = portfolioTemplate && !('redirect' in portfolioTemplate) && (portfolioTemplate.page.sections?.length ?? 0) > 0;

  // Sama seperti article-detail: kalau portfolio-detail belum punya section terpasang,
  // resolveActiveTheme() di SiteShell tidak akan menemukan templateTheme apa pun dari
  // sections: [] dan jatuh ke header generik. Ambil theme dari home page sebagai referensi
  // supaya header/footer tema (Formal/Casual/Premium/Abstract) tetap konsisten.
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

  const payload = hasPortfolioTemplate
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