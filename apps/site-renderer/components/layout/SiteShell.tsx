import Link from 'next/link';
import type { ReactNode } from 'react';
import type { PublicPagePayload } from '@/lib/types';
import { getSiteHref } from '@/lib/links';

type Props = { siteSlug: string; payload: Pick<PublicPagePayload, 'website' | 'businessProfile' | 'navigation'>; children: ReactNode };
export function SiteShell({ siteSlug, payload, children }: Props) {
  const navbarItems = payload.navigation?.navbar?.items || [];
  const footerItems = payload.navigation?.footer?.items || [];
  const cta = payload.navigation?.navbar?.cta;
  const ctaHref = getSiteHref(siteSlug, cta?.path || '/contact');
  const businessName = payload.businessProfile?.name || payload.website.name;
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="lp-container flex min-h-16 items-center justify-between gap-4 py-3">
          <Link href={getSiteHref(siteSlug, '/')} className="min-w-0"><span className="block text-lg font-black tracking-tight text-slate-950">{businessName}</span><span className="block text-xs font-semibold text-slate-500">Company Profile</span></Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
            {navbarItems.map((item) => <Link key={item.pageKey} href={getSiteHref(siteSlug, item.path)} className="rounded-full px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-950">{item.label}</Link>)}
          </nav>
          <Link href={ctaHref} className="lp-btn lp-btn-primary hidden sm:inline-flex">{cta?.label || 'Hubungi Kami'}</Link>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-slate-200 bg-slate-950 text-white">
        <div className="lp-container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div><h2 className="text-2xl font-black">{businessName}</h2><p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">{payload.businessProfile?.description || payload.businessProfile?.tagline || 'Website company profile yang menampilkan profil, layanan, portofolio, artikel, dan kontak bisnis.'}</p></div>
          <div><h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">Menu</h3><div className="mt-4 grid gap-2">{footerItems.map((item) => <Link key={item.pageKey} href={getSiteHref(siteSlug, item.path)} className="text-sm text-slate-300 hover:text-white">{item.label}</Link>)}</div></div>
          <div><h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-400">Kontak</h3><div className="mt-4 space-y-2 text-sm text-slate-300">{payload.businessProfile?.whatsapp && <p>WhatsApp: {payload.businessProfile.whatsapp}</p>}{payload.businessProfile?.email && <p>Email: {payload.businessProfile.email}</p>}{payload.businessProfile?.address && <p>Alamat: {payload.businessProfile.address}</p>}</div></div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-slate-400">© {new Date().getFullYear()} {businessName}. Powered by Lentera Pasar.</div>
      </footer>
    </div>
  );
}
