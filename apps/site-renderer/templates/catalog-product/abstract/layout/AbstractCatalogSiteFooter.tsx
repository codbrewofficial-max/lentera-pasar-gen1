import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Sparkles } from "lucide-react";

export interface AbstractCatalogFooterNavItem {
  pageKey: string;
  label: string;
  path: string;
}

export interface AbstractCatalogSiteFooterProps {
  navItems?: AbstractCatalogFooterNavItem[];
  getHref: (path: string) => string;
  businessName: string;
  logoUrl?: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  instagramUrl?: string;
  facebookUrl?: string;
}

export const AbstractCatalogSiteFooter: React.FC<AbstractCatalogSiteFooterProps> = ({
  getHref,
  businessName,
  logoUrl,
  description,
  address,
  email,
  phone,
  instagramUrl,
  facebookUrl,
  navItems
}) => {
  const currentYear = new Date().getFullYear();
  const DEFAULT_LINKS: AbstractCatalogFooterNavItem[] = [
    { pageKey: "home", label: "beranda", path: "/" },
    { pageKey: "products", label: "produk", path: "/products" },
    { pageKey: "articles", label: "artikel", path: "/articles" },
    { pageKey: "faq", label: "faq", path: "/faq" },
    { pageKey: "contact", label: "kontak", path: "/contact" }
  ];
  const resolvedLinks = navItems && navItems.length > 0 ? navItems : DEFAULT_LINKS;
  const hasSocial = instagramUrl || facebookUrl;

  return (
    <footer className="bg-[#151515] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link href={getHref("/")} className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#649FF6]">
              {logoUrl ? <img src={logoUrl} alt={businessName} className="h-full w-full rounded-2xl object-cover" referrerPolicy="no-referrer" /> : <Sparkles className="h-4 w-4 text-white" />}
            </div>
            <span className="text-lg font-extrabold text-white">{businessName}</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-400">{description}</p>
          {hasSocial && (
            <div className="mt-4 flex items-center gap-2">
              {instagramUrl && <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-neutral-300 hover:bg-[#649FF6] hover:text-white"><Instagram className="h-4 w-4" /></a>}
              {facebookUrl && <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-neutral-300 hover:bg-[#649FF6] hover:text-white"><Facebook className="h-4 w-4" /></a>}
            </div>
          )}
        </div>
        <div className="md:col-span-3">
          <h3 className="font-mono text-xs uppercase tracking-wide text-neutral-500">navigasi</h3>
          <ul className="mt-4 space-y-2 text-sm text-neutral-300">
            {resolvedLinks.map((link) => (<li key={link.path}><Link href={getHref(link.path)} className="hover:text-[#649FF6]">{link.label}</Link></li>))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <h3 className="font-mono text-xs uppercase tracking-wide text-neutral-500">kontak</h3>
          <div className="mt-4 space-y-2.5 text-sm text-neutral-300">
            {address && <div className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#649FF6]" /><span>{address}</span></div>}
            {email && <div className="flex items-center gap-2.5"><Mail className="h-4 w-4 shrink-0 text-[#649FF6]" /><a href={`mailto:${email}`} className="hover:text-[#649FF6]">{email}</a></div>}
            {phone && <div className="flex items-center gap-2.5"><Phone className="h-4 w-4 shrink-0 text-[#649FF6]" /><a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="hover:text-[#649FF6]">{phone}</a></div>}
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center font-mono text-xs lowercase text-neutral-500">
        © {currentYear} {businessName} — powered by lentera pasar
      </div>
    </footer>
  );
};

export default AbstractCatalogSiteFooter;
