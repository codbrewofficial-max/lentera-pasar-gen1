import React from "react";
import Link from "next/link";
import { Facebook, Globe, Instagram, Linkedin, Mail, MapPin, Phone, ShoppingBag, Twitter } from "lucide-react";

export interface CatalogFooterNavItem {
  pageKey: string;
  label: string;
  path: string;
}

export interface FormalCatalogSiteFooterProps {
  navItems?: CatalogFooterNavItem[];
  getHref: (path: string) => string;
  businessName: string;
  taglineLabel?: string;
  logoUrl?: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  workingHours: string;
  instagramUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
}

// Footer khusus Katalog Produk, identitas visual sama dengan FormalSiteFooter (company
// profile). Blueprint menyebut "newsletter" & "link kebijakan" di footer katalog, tapi
// keduanya sengaja belum dibuat di sini karena belum ada endpoint newsletter subscription
// maupun halaman kebijakan/privasi beneran di backend — menambah form/link yang tidak
// berfungsi akan menyesatkan pengunjung (lihat kebijakan hardcoded content di project).
export const FormalCatalogSiteFooter: React.FC<FormalCatalogSiteFooterProps> = ({
  getHref,
  businessName,
  taglineLabel = "Katalog Produk",
  logoUrl,
  description,
  address,
  email,
  phone,
  workingHours,
  instagramUrl,
  facebookUrl,
  linkedinUrl,
  twitterUrl,
  websiteUrl,
  navItems
}) => {
  const currentYear = new Date().getFullYear();
  const DEFAULT_QUICK_LINKS: CatalogFooterNavItem[] = [
    { pageKey: "home", label: "Beranda", path: "/" },
    { pageKey: "products", label: "Produk", path: "/products" },
    { pageKey: "articles", label: "Artikel", path: "/articles" },
    { pageKey: "faq", label: "FAQ", path: "/faq" },
    { pageKey: "contact", label: "Kontak", path: "/contact" }
  ];
  const resolvedLinks = navItems && navItems.length > 0 ? navItems : DEFAULT_QUICK_LINKS;
  const hasSocial = instagramUrl || facebookUrl || linkedinUrl || twitterUrl || websiteUrl;

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <div className="md:col-span-5 flex flex-col space-y-4">
            <Link href={getHref("/")} className="flex items-center space-x-2.5">
              {logoUrl ? (
                <img src={logoUrl} alt={businessName} className="w-8 h-8 rounded-none object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="bg-slate-950 text-white p-2 rounded-none">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-semibold text-lg text-white leading-tight">{businessName}</span>
                <span className="text-[9px] text-[#1E3A5F] font-mono tracking-wider uppercase leading-none">{taglineLabel}</span>
              </div>
            </Link>
            <p className="text-sm font-light leading-relaxed text-slate-400">{description}</p>
            {hasSocial && (
              <div className="flex items-center gap-2 pt-1">
                {instagramUrl && (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 flex items-center justify-center rounded-none bg-slate-800 hover:bg-[#1E3A5F] text-slate-400 hover:text-white transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {facebookUrl && (
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 flex items-center justify-center rounded-none bg-slate-800 hover:bg-[#1E3A5F] text-slate-400 hover:text-white transition-colors">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {linkedinUrl && (
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-8 h-8 flex items-center justify-center rounded-none bg-slate-800 hover:bg-[#1E3A5F] text-slate-400 hover:text-white transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {twitterUrl && (
                  <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter/X" className="w-8 h-8 flex items-center justify-center rounded-none bg-slate-800 hover:bg-[#1E3A5F] text-slate-400 hover:text-white transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {websiteUrl && (
                  <a href={websiteUrl} target="_blank" rel="noopener noreferrer" aria-label="Website" className="w-8 h-8 flex items-center justify-center rounded-none bg-slate-800 hover:bg-[#1E3A5F] text-slate-400 hover:text-white transition-colors">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="md:col-span-3 flex flex-col space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Navigasi</h3>
            <ul className="space-y-2 text-sm font-light">
              {resolvedLinks.map((link) => (
                <li key={link.path}>
                  <Link href={getHref(link.path)} className="hover:text-[#1E3A5F] hover:underline transition-all">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 flex flex-col space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Informasi Kontak</h3>
            <div className="space-y-3 text-sm font-light text-slate-400">
              {address && (
                <div className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-[#1E3A5F] mt-0.5 flex-shrink-0" />
                  <span>{address}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-[#1E3A5F] flex-shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-[#1E3A5F] transition-colors">{email}</a>
                </div>
              )}
              {phone && (
                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-[#1E3A5F] flex-shrink-0" />
                  <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="hover:text-[#1E3A5F] transition-colors">{phone}</a>
                </div>
              )}
              {workingHours && (
                <div className="text-xs font-mono pt-1 border-t border-slate-800">{workingHours}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 bg-slate-950 py-5 text-xs font-mono text-center text-slate-500 space-y-1">
        <p>
          &copy; {currentYear} {businessName} &mdash; Powered by <span className="text-slate-400 font-semibold">Lentera Pasar</span>
        </p>
        <p className="text-[10px] text-slate-600">
          Developed by the <span className="text-slate-500">LabKerKomIT Community Team</span>
        </p>
      </div>
    </footer>
  );
};

export default FormalCatalogSiteFooter;
