'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import type { PublicPagePayload } from '@/lib/types';
import { getSiteHref } from '@/lib/links';
import { FormalSiteHeader } from '@/templates/company-profile/formal/source/layout/FormalSiteHeader';
import { FormalSiteFooter } from '@/templates/company-profile/formal/source/layout/FormalSiteFooter';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { Header as CasualSiteHeader } from '@/templates/company-profile/casual/source/shared/Header';
import { Footer as CasualSiteFooter } from '@/templates/company-profile/casual/source/shared/Footer';
import { Header as PremiumSiteHeader } from '@/templates/company-profile/premium/source/shared/Header';
import { Footer as PremiumSiteFooter } from '@/templates/company-profile/premium/source/shared/Footer';
import { Header as AbstractSiteHeader } from '@/templates/company-profile/abstract/source/shared/Header';
import { Footer as AbstractSiteFooter } from '@/templates/company-profile/abstract/source/shared/Footer';
import { FormalCatalogSiteHeader } from '@/templates/catalog-product/formal/layout/FormalCatalogSiteHeader';
import { FormalCatalogSiteFooter } from '@/templates/catalog-product/formal/layout/FormalCatalogSiteFooter';

type Props = {
  siteSlug: string;
  payload: Pick<PublicPagePayload, 'website' | 'businessProfile' | 'navigation'> & {
    page?: Pick<PublicPagePayload['page'], 'sections'>;
  };
  children: ReactNode;
};

type Theme = 'formal' | 'casual' | 'premium' | 'abstract';

function normalizePhone(value?: unknown) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return raw;
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  return digits;
}

function asTheme(value?: string | null): Theme | null {
  const normalized = (value || '').toLowerCase();
  if (normalized === 'formal' || normalized === 'casual' || normalized === 'premium' || normalized === 'abstract') return normalized;
  return null;
}

// Fallback historis: sebelum Navbar/Footer bisa dipilih sendiri (section "global.navbar" /
// "global.footer"), tema header/footer selalu ikut tema section konten halaman. Dipakai
// hanya kalau owner belum pernah memilih tampilan Navbar/Footer secara eksplisit, supaya
// website yang sudah ada tidak tiba-tiba kehilangan header/footer bertema.
function resolveThemeFromPageContent(payload: Props['payload']): Theme | null {
  const sections = payload.page?.sections || [];
  for (const section of sections) {
    const theme = asTheme(section.templateTheme);
    if (theme) return theme;
  }
  return null;
}

export function SiteShell({ siteSlug, payload, children }: Props) {
  const websiteType = payload.website.websiteType;
  const navbarItems = payload.navigation?.navbar?.items || [];
  const footerItems = payload.navigation?.footer?.items || [];
  const cta = payload.navigation?.navbar?.cta;
  const ctaHref = getSiteHref(siteSlug, cta?.path || '/contact');
  const businessName = payload.businessProfile?.name || payload.website.name;
  const tagline = payload.businessProfile?.tagline || 'Company Profile';
  const logoUrl = typeof payload.businessProfile?.logoUrl === 'string' ? payload.businessProfile.logoUrl : '';
  const logoAlt = typeof payload.businessProfile?.logoAlt === 'string' && payload.businessProfile.logoAlt.trim()
    ? payload.businessProfile.logoAlt
    : `Logo ${businessName}`;
  const whatsapp = normalizePhone(payload.businessProfile?.whatsapp);
  const email = payload.businessProfile?.contactEmail || payload.businessProfile?.email;
  const description =
    payload.businessProfile?.description ||
    payload.businessProfile?.tagline ||
    'Website company profile yang menampilkan profil, layanan, portofolio, artikel, dan kontak bisnis.';

  const contentTheme = resolveThemeFromPageContent(payload);
  // Navbar & Footer sekarang section tersendiri yang bisa dipilih bebas lintas tema —
  // masing-masing di-resolve independen, BOLEH beda satu sama lain (mis. Navbar Formal +
  // Footer Casual). Kalau owner belum pernah memilih, fallback ke tema konten halaman
  // seperti perilaku lama.
  const navbarTheme = asTheme(payload.navigation?.navbar?.theme) || contentTheme;
  const footerTheme = asTheme(payload.navigation?.footer?.theme) || contentTheme;
  const getHref = (path: string) => getSiteHref(siteSlug, path);

  const header = (() => {
    // Katalog Produk & Company Profile sama-sama bisa punya theme string "formal" (dua
    // TemplatePack terpisah, kebetulan pakai slug yang sama). Dicek lebih dulu supaya
    // website catalog_product tidak salah ambil header Company Profile Formal.
    if (websiteType === 'catalog_product') {
      if (navbarTheme === 'formal') {
        return (
          <FormalCatalogSiteHeader
            siteSlug={siteSlug}
            getHref={getHref}
            businessName={businessName}
            taglineLabel={tagline}
            logoUrl={logoUrl || undefined}
            navItems={navbarItems.length > 0 ? navbarItems : undefined}
            ctaLabel={cta?.label || 'Lihat Produk'}
            ctaPath={cta?.path || '/products'}
          />
        );
      }
      // Tema lain untuk Katalog Produk belum dibangun — jatuh ke header generik di
      // bawah (skip semua pengecekan tema Company Profile).
    } else if (navbarTheme === 'formal') {
      return (
        <FormalSiteHeader
          siteSlug={siteSlug}
          getHref={getHref}
          businessName={businessName}
          taglineLabel={tagline}
          logoUrl={logoUrl || undefined}
          navItems={navbarItems.length > 0 ? navbarItems : undefined}
          ctaLabel={cta?.label || 'Hubungi Kami'}
          ctaPath={cta?.path || '/contact'}
        />
      );
    }
    if (navbarTheme === 'casual') {
      return (
        <CasualSiteHeader
          siteSlug={siteSlug}
          getHref={getHref}
          businessName={businessName}
          taglineLabel={tagline}
          logoUrl={logoUrl || undefined}
          navItems={navbarItems.length > 0 ? navbarItems : undefined}
          ctaLabel={cta?.label || 'Hubungi Kami'}
          ctaPath={cta?.path || '/contact'}
        />
      );
    }
    if (navbarTheme === 'premium') {
      return (
        <PremiumSiteHeader
          getHref={getHref}
          businessName={businessName}
          logoUrl={logoUrl || undefined}
          navItems={navbarItems.length > 0 ? navbarItems : undefined}
          ctaLabel={cta?.label || 'Konsultasi'}
          ctaPath={cta?.path || '/contact'}
        />
      );
    }
    if (navbarTheme === 'abstract') {
      return (
        <AbstractSiteHeader
          siteSlug={siteSlug}
          getHref={getHref}
          businessName={businessName}
          taglineLabel={tagline}
          logoUrl={logoUrl || undefined}
          navItems={navbarItems.length > 0 ? navbarItems : undefined}
          ctaLabel={cta?.label || 'Hubungi Kami'}
          ctaPath={cta?.path || '/contact'}
        />
      );
    }
    return (
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="lp-container flex min-h-16 items-center justify-between gap-4 py-3">
          <Link href={getSiteHref(siteSlug, '/')} className="flex min-w-0 items-center gap-3">
            {logoUrl && (
              <img src={logoUrl} alt={logoAlt} className="h-11 w-11 shrink-0 rounded-2xl object-contain bg-white p-1 ring-1 ring-slate-200" />
            )}
            <span className="min-w-0">
              <span className="block truncate text-lg font-black tracking-tight text-slate-950">{businessName}</span>
              <span className="block truncate text-xs font-semibold text-slate-500">{tagline}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
            {navbarItems.map((item) => (
              <Link
                key={item.pageKey}
                href={getSiteHref(siteSlug, item.path)}
                className="rounded-full px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <Link href={ctaHref} className="lp-btn lp-btn-primary">
              {cta?.label || 'Hubungi Kami'}
            </Link>
          </div>

          <details className="group relative lg:hidden">
            <summary className="list-none rounded-full border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 marker:hidden">
              Menu
            </summary>
            <div className="absolute right-0 top-12 w-[min(280px,calc(100vw-32px))] rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl">
              <nav className="grid gap-1" aria-label="Navigasi mobile">
                {navbarItems.length > 0 ? (
                  navbarItems.map((item) => (
                    <Link
                      key={item.pageKey}
                      href={getSiteHref(siteSlug, item.path)}
                      className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
                    >
                      {item.label}
                    </Link>
                  ))
                ) : (
                  <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                    Menu belum diatur.
                  </p>
                )}
                <Link href={ctaHref} className="lp-btn lp-btn-primary mt-2 w-full">
                  {cta?.label || 'Hubungi Kami'}
                </Link>
              </nav>
            </div>
          </details>
        </div>
      </header>
    );
  })();

  const footer = (() => {
    if (websiteType === 'catalog_product') {
      if (footerTheme === 'formal') {
        return (
          <FormalCatalogSiteFooter
            getHref={getHref}
            businessName={businessName}
            taglineLabel={tagline}
            logoUrl={logoUrl || undefined}
            description={description}
            address={payload.businessProfile?.address || ''}
            email={email || ''}
            phone={payload.businessProfile?.phone || ''}
            workingHours={payload.businessProfile?.workingHours || payload.businessProfile?.operationalHours || ''}
            instagramUrl={payload.businessProfile?.instagramUrl || undefined}
            facebookUrl={payload.businessProfile?.facebookUrl || undefined}
            linkedinUrl={payload.businessProfile?.linkedinUrl || undefined}
            twitterUrl={payload.businessProfile?.twitterUrl || undefined}
            websiteUrl={payload.businessProfile?.websiteUrl || undefined}
            navItems={footerItems.length > 0 ? footerItems : undefined}
          />
        );
      }
    } else if (footerTheme === 'formal') {
      return (
        <FormalSiteFooter
          getHref={getHref}
          businessName={businessName}
          taglineLabel={tagline}
          logoUrl={logoUrl || undefined}
          description={description}
          establishedYear={typeof payload.businessProfile?.establishedYear === 'string' ? payload.businessProfile.establishedYear : undefined}
          founderName={typeof payload.businessProfile?.founderName === 'string' ? payload.businessProfile.founderName : undefined}
          address={payload.businessProfile?.address || ''}
          email={email || ''}
          phone={payload.businessProfile?.phone || ''}
          workingHours={payload.businessProfile?.workingHours || payload.businessProfile?.operationalHours || ''}
          instagramUrl={payload.businessProfile?.instagramUrl || undefined}
          facebookUrl={payload.businessProfile?.facebookUrl || undefined}
          linkedinUrl={payload.businessProfile?.linkedinUrl || undefined}
          twitterUrl={payload.businessProfile?.twitterUrl || undefined}
          websiteUrl={payload.businessProfile?.websiteUrl || undefined}
          navItems={footerItems.length > 0 ? footerItems : undefined}
        />
      );
    }
    if (footerTheme === 'casual') {
      return (
        <CasualSiteFooter
          getHref={getHref}
          businessName={businessName}
          taglineLabel={tagline}
          logoUrl={logoUrl || undefined}
          description={description}
          establishedYear={typeof payload.businessProfile?.establishedYear === 'string' ? payload.businessProfile.establishedYear : undefined}
          founderName={typeof payload.businessProfile?.founderName === 'string' ? payload.businessProfile.founderName : undefined}
          address={payload.businessProfile?.address || ''}
          email={email || ''}
          phone={payload.businessProfile?.phone || ''}
          workingHours={payload.businessProfile?.workingHours || payload.businessProfile?.operationalHours || ''}
          instagramUrl={payload.businessProfile?.instagramUrl || undefined}
          facebookUrl={payload.businessProfile?.facebookUrl || undefined}
          linkedinUrl={payload.businessProfile?.linkedinUrl || undefined}
          twitterUrl={payload.businessProfile?.twitterUrl || undefined}
          websiteUrl={payload.businessProfile?.websiteUrl || undefined}
          navItems={footerItems.length > 0 ? footerItems : undefined}
        />
      );
    }
    if (footerTheme === 'premium') {
      return (
        <PremiumSiteFooter
          getHref={getHref}
          businessName={businessName}
          description={description}
          address={payload.businessProfile?.address || ''}
          phone={payload.businessProfile?.phone || ''}
          email={email || ''}
          logoUrl={logoUrl || undefined}
          navItems={footerItems.length > 0 ? footerItems : undefined}
        />
      );
    }
    if (footerTheme === 'abstract') {
      return (
        <AbstractSiteFooter
          getHref={getHref}
          businessName={businessName}
          description={description}
          address={payload.businessProfile?.address || ''}
          phone={payload.businessProfile?.phone || ''}
          email={email || ''}
          navItems={footerItems.length > 0 ? footerItems : undefined}
        />
      );
    }
    return (
      <footer className="border-t border-slate-200 bg-slate-950 text-white">
        <div className="lp-container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              {logoUrl && <img src={logoUrl} alt={logoAlt} className="h-12 w-12 rounded-2xl bg-white object-contain p-1" />}
              <h2 className="text-2xl font-black">{businessName}</h2>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300 line-clamp-5">{description}</p>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">Menu</h3>
            <div className="mt-4 grid gap-2">
              {footerItems.length > 0 ? (
                footerItems.map((item) => (
                  <Link
                    key={item.pageKey}
                    href={getSiteHref(siteSlug, item.path)}
                    className="text-sm text-slate-300 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))
              ) : (
                <p className="text-sm text-slate-400">Menu footer belum diatur.</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">Kontak</h3>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              {whatsapp && (
                <p>
                  WhatsApp:{' '}
                  <a className="hover:text-white" href={`https://wa.me/${whatsapp}`}>
                    {payload.businessProfile?.whatsapp}
                  </a>
                </p>
              )}
              {email && <p>Email: {email}</p>}
              {payload.businessProfile?.address && <p>Alamat: {payload.businessProfile.address}</p>}
              {!whatsapp && !email && !payload.businessProfile?.address && (
                <p>Informasi kontak belum dilengkapi.</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-5 text-center text-xs text-slate-400">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {businessName}. Powered by Lentera Pasar.
        </div>
      </footer>
    );
  })();

  const wrapperClass =
    navbarTheme === 'premium' || footerTheme === 'premium'
      ? 'min-h-screen bg-[#0E0E0F] text-white'
      : navbarTheme === 'abstract' || footerTheme === 'abstract'
      ? 'min-h-screen bg-[#0d0d0d] text-white'
      : navbarTheme === 'casual' || footerTheme === 'casual'
      ? 'min-h-screen bg-white text-gray-950'
      : 'min-h-screen bg-white text-slate-950';

  return (
    <div className={wrapperClass}>
      {header}
      <main className={navbarTheme === 'formal' ? 'pt-[72px]' : ''}>{children}</main>
      {footer}
      {navbarTheme === 'formal' && <FloatingWhatsApp whatsappNumber={payload.businessProfile?.whatsapp || undefined} />}
    </div>
  );
}
