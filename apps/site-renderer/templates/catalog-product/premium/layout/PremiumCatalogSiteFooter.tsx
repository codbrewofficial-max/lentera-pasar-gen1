import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";

export interface PremiumCatalogFooterNavItem {
  pageKey: string;
  label: string;
  path: string;
}

export interface PremiumCatalogSiteFooterProps {
  navItems?: PremiumCatalogFooterNavItem[];
  businessName: string;
  logoUrl?: string;
  getHref: (path: string) => string;
  description: string;
  address: string;
  phone: string;
  email: string;
}

export const PremiumCatalogSiteFooter: React.FC<PremiumCatalogSiteFooterProps> = ({
  businessName,
  getHref,
  description,
  address,
  phone,
  email,
  navItems
}) => {
  const currentYear = new Date().getFullYear();
  const DEFAULT_LINKS: PremiumCatalogFooterNavItem[] = [
    { pageKey: "home", label: "Beranda", path: "/" },
    { pageKey: "products", label: "Produk", path: "/products" },
    { pageKey: "articles", label: "Artikel", path: "/articles" },
    { pageKey: "faq", label: "FAQ", path: "/faq" },
    { pageKey: "contact", label: "Kontak", path: "/contact" }
  ];
  const resolvedLinks = navItems && navItems.length > 0 ? navItems : DEFAULT_LINKS;

  return (
    <footer className="border-t border-white/5 bg-[#0E0E0F] pb-12 pt-20 text-white">
      <div className="mx-auto mb-16 grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <span className="font-serif text-xl font-light text-white">{businessName}</span>
          <p className="mt-4 max-w-sm text-sm font-light leading-relaxed text-stone-400">{description}</p>
        </div>
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-500">Navigasi</h3>
          <ul className="mt-4 space-y-2.5 text-sm font-light text-stone-300">
            {resolvedLinks.map((link) => (
              <li key={link.path}><a href={getHref(link.path)} className="hover:text-[#649FF6]">{link.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-500">Kontak</h3>
          <div className="mt-4 space-y-3 text-sm font-light text-stone-300">
            {address && <div className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#649FF6]" /><span>{address}</span></div>}
            {email && <div className="flex items-center gap-2.5"><Mail className="h-4 w-4 shrink-0 text-[#649FF6]" /><a href={`mailto:${email}`} className="hover:text-[#649FF6]">{email}</a></div>}
            {phone && <div className="flex items-center gap-2.5"><Phone className="h-4 w-4 shrink-0 text-[#649FF6]" /><a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="hover:text-[#649FF6]">{phone}</a></div>}
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 pt-8 text-center text-[10px] uppercase tracking-[0.2em] text-stone-600">
        &copy; {currentYear} {businessName} — Powered by Lentera Pasar
      </div>
    </footer>
  );
};

export default PremiumCatalogSiteFooter;
