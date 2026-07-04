import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/layout/SiteShell';
import { RenderProductDetail, RenderSections } from '@/components/sections/SectionRegistry';
import { ProductTracking } from '@/components/tracking/PageTracking';
import { getPublicHomePage, getPublicProductDetail, getPublicPage } from '@/lib/api';
import { getProductSeoDescription, getProductSeoTitle } from '@/lib/seo';

type Props = { params: Promise<{ siteSlug: string; productSlug: string }> };

export async function generateMetadata({ params }: Props) {
  const { siteSlug, productSlug } = await params;
  const detail = await getPublicProductDetail(siteSlug, productSlug).catch(() => null);
  if (!detail) return { title: 'Produk tidak ditemukan' };

  return {
    title: getProductSeoTitle(detail),
    description: getProductSeoDescription(detail),
    openGraph: {
      title: getProductSeoTitle(detail),
      description: getProductSeoDescription(detail),
      type: 'website',
      images: detail.product.images?.[0]?.url ? [{ url: detail.product.images[0].url }] : undefined
    }
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { siteSlug, productSlug } = await params;
  const detail = await getPublicProductDetail(siteSlug, productSlug).catch(() => null);
  if (!detail) notFound();

  const productTemplate = await getPublicPage(siteSlug, 'product-detail').catch(() => null);
  const hasProductTemplate = productTemplate && !('redirect' in productTemplate) && (productTemplate.page.sections?.length ?? 0) > 0;

  // Sama seperti article-detail/portfolio-detail: kalau product-detail belum punya section
  // terpasang, resolveActiveTheme() di SiteShell tidak akan menemukan templateTheme apa pun
  // dari sections: [] dan jatuh ke header generik. Ambil theme dari home page sebagai
  // referensi supaya header/footer tema tetap konsisten.
  //
  // PENTING: section "theme_probe" di bawah ini HANYA dipakai SiteShell untuk mendeteksi tema
  // header/footer (lihat resolveActiveTheme di SiteShell.tsx). Section ini TIDAK PERNAH boleh
  // ikut dilempar ke <RenderSections /> sebagai konten halaman, karena slotKey
  // "product_detail.theme_probe" memang sengaja tidak terdaftar di registry manapun. Konten
  // halaman yang sebenarnya diambil dari detail.productDetailSections lewat
  // <RenderProductDetail /> di bawah.
  let fallbackThemeSections: any[] = [];
  if (!hasProductTemplate) {
    const homePage = await getPublicHomePage(siteSlug).catch(() => null);
    const referenceTheme = homePage?.page?.sections?.find((section) => section.templateTheme)?.templateTheme;
    if (referenceTheme) {
      fallbackThemeSections = [
        {
          id: 'product-detail-theme-probe',
          slotKey: 'product_detail.theme_probe',
          templateTheme: referenceTheme,
          content: {},
          data: {}
        }
      ];
    }
  }

  const shellPayload = hasProductTemplate
    ? productTemplate
    : {
        website: detail.website,
        seo: detail.seo,
        businessProfile: detail.businessProfile,
        navigation: detail.navigation,
        page: {
          pageKey: 'product_detail',
          title: detail.product.title,
          navLabel: 'Detail Produk',
          footerLabel: 'Detail Produk',
          slug: 'product-detail',
          path: '/products/:productSlug',
          purpose: 'Template detail produk.',
          isPublished: true,
          isDynamicDetailPage: true,
          seoTitle: detail.seo?.title,
          seoDescription: detail.seo?.description,
          sections: fallbackThemeSections
        }
      };

  const payloadWithProductSections = hasProductTemplate
    ? {
        ...productTemplate,
        page: {
          ...productTemplate.page,
          sections: productTemplate.page.sections.map((section) => ({
            ...section,
            data: {
              ...section.data,
              product: detail.product,
              relatedProducts: detail.relatedProducts
            }
          }))
        }
      }
    : null;

  return (
    <SiteShell siteSlug={siteSlug} payload={shellPayload as any}>
      <ProductTracking detail={detail} />
      {payloadWithProductSections && payloadWithProductSections.page.sections.length > 0 ? (
        <RenderSections siteSlug={siteSlug} payload={payloadWithProductSections as any} />
      ) : (
        <RenderProductDetail siteSlug={siteSlug} detail={detail} />
      )}
    </SiteShell>
  );
}
