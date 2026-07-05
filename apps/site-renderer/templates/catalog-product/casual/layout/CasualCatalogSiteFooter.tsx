import React from "react";
import Link from "next/link";
import { Facebook, Globe, Instagram, Linkedin, Mail, MapPin, Phone, ShoppingBag, Twitter } from "lucide-react";

export interface CasualCatalogFooterNavItem {
  pageKey: string;
  label: string;
  path: string;
}

export interface CasualCatalogSiteFooterProps {
  navItems?: CasualCatalogFooterNavItem[];
  getHref: (path: string) => string;
  businessName: string;
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

export const CasualCatalogSiteFooter: React.FC<CasualCatalogSiteFooterProps> = ({
  getHref,
  businessName,
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
  const DEFAULT_LINKS: CasualCatalogFooterNavItem[] = [
    { pageKey: "home", label: "Beranda", path: "/" },
    { pageKey: "products", label: "Produk", path: "/products" },
    { pageKey: "articles", label: "Artikel", path: "/articles" },
    { pageKey: "faq", label: "FAQ", path: "/faq" },
    { pageKey: "contact", label: "Kontak", path: "/contact" }
  ];
  const resolvedLinks = navItems && navItems.length > 0 ? navItems : DEFAULT_LINKS;
  const hasSocial = instagramUrl || facebookUrl || linkedinUrl || twitterUrl || websiteUrl;

  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="flex flex-col space-y-4 md:col-span-5">
            <Link href={getHref("/")} className="flex items-center gap-2.5">
              {logoUrl ? (
                <img src={logoUrl} alt={businessName} className="h-9 w-9 rounded-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="rounded-full bg-[#649FF6] p-2 text-white"><ShoppingBag className="h-5 w-5" /></div>
              )}
              <span className="text-lg font-extrabold text-gray-950">{businessName}</span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-gray-600">{description}</p>
            {hasSocial && (
              <div className="flex items-center gap-2 pt-1">
                {instagramUrl && <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#649FF6]/10 text-[#649FF6] hover:bg-[#649FF6] hover:text-white"><Instagram className="h-4 w-4" /></a>}
                {facebookUrl && <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#649FF6]/10 text-[#649FF6] hover:bg-[#649FF6] hover:text-white"><Facebook className="h-4 w-4" /></a>}
                {linkedinUrl && <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#649FF6]/10 text-[#649FF6] hover:bg-[#649FF6] hover:text-white"><Linkedin className="h-4 w-4" /></a>}
                {twitterUrl && <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter/X" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#649FF6]/10 text-[#649FF6] hover:bg-[#649FF6] hover:text-white"><Twitter className="h-4 w-4" /></a>}
                {websiteUrl && <a href={websiteUrl} target="_blank" rel="noopener noreferrer" aria-label="Website" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#649FF6]/10 text-[#649FF6] hover:bg-[#649FF6] hover:text-white"><Globe className="h-4 w-4" /></a>}
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-3 md:col-span-3">
            <h3 className="text-sm font-extrabold text-gray-950">Navigasi</h3>
            <ul className="space-y-2 text-sm">
              {resolvedLinks.map((link) => (
                <li key={link.path}><Link href={getHref(link.path)} className="text-gray-600 hover:text-[#649FF6]">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col space-y-3 md:col-span-4">
            <h3 className="text-sm font-extrabold text-gray-950">Kontak</h3>
            <div className="space-y-2.5 text-sm text-gray-600">
              {address && <div className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#649FF6]" /><span>{address}</span></div>}
              {email && <div className="flex items-center gap-2.5"><Mail className="h-4 w-4 shrink-0 text-[#649FF6]" /><a href={`mailto:${email}`} className="hover:text-[#649FF6]">{email}</a></div>}
              {phone && <div className="flex items-center gap-2.5"><Phone className="h-4 w-4 shrink-0 text-[#649FF6]" /><a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="hover:text-[#649FF6]">{phone}</a></div>}
              {workingHours && <p className="pt-1 text-xs text-gray-400">{workingHours}</p>}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 py-5 text-center text-xs text-gray-400">
        © {currentYear} {businessName} — Powered by Lentera Pasar
      </div>
    </footer>
  );
};

export default CasualCatalogSiteFooter;
