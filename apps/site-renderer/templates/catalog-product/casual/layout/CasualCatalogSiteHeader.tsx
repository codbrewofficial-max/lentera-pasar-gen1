"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, X } from "lucide-react";

export interface CasualCatalogNavItem {
  pageKey: string;
  label: string;
  path: string;
}

export interface CasualCatalogSiteHeaderProps {
  siteSlug: string;
  getHref: (path: string) => string;
  businessName: string;
  logoUrl?: string;
  navItems?: CasualCatalogNavItem[];
  ctaLabel?: string;
  ctaPath?: string;
}

export const CasualCatalogSiteHeader: React.FC<CasualCatalogSiteHeaderProps> = ({
  getHref,
  businessName,
  logoUrl,
  navItems,
  ctaLabel = "Belanja Sekarang",
  ctaPath = "/products"
}) => {
  const DEFAULT_NAV_LINKS: CasualCatalogNavItem[] = [
    { pageKey: "home", label: "Beranda", path: "/" },
    { pageKey: "products", label: "Produk", path: "/products" },
    { pageKey: "articles", label: "Artikel", path: "/articles" },
    { pageKey: "faq", label: "FAQ", path: "/faq" },
    { pageKey: "contact", label: "Kontak", path: "/contact" }
  ];
  const resolvedLinks = (navItems && navItems.length > 0 ? navItems : DEFAULT_NAV_LINKS).map((item) => ({ ...item, href: getHref(item.path) }));

  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const homeHref = getHref("/");
  const productsHref = getHref("/products");

  useEffect(() => setIsOpen(false), [pathname]);

  const isActive = (href: string) => (href === homeHref ? pathname === href : pathname === href || pathname?.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href={homeHref} className="flex shrink-0 items-center gap-2.5">
            {logoUrl ? (
              <img src={logoUrl} alt={businessName} className="h-10 w-10 rounded-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="rounded-full bg-[#649FF6] p-2 text-white">
                <ShoppingBag className="h-6 w-6" />
              </div>
            )}
            <span className="hidden text-lg font-extrabold text-gray-950 sm:inline">{businessName}</span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {resolvedLinks.map((link) => (
              <Link
                key={link.path}
                href={link.href}
                className={`text-sm font-bold transition-colors ${isActive(link.href) ? "text-[#649FF6]" : "text-gray-600 hover:text-[#649FF6]"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <form method="get" action={productsHref} className="hidden max-w-xs flex-1 items-center rounded-full border border-gray-200 md:flex">
            <input type="search" name="q" placeholder="Cari produk..." aria-label="Cari produk" className="w-full bg-transparent px-4 py-2 text-sm text-gray-700 focus:outline-none" />
            <button type="submit" aria-label="Cari" className="px-3 py-2 text-gray-500 hover:text-[#649FF6]">
              <Search className="h-4 w-4" />
            </button>
          </form>

          <div className="hidden lg:block">
            <Link href={getHref(ctaPath)} className="inline-flex items-center justify-center rounded-full bg-[#F56B71] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-[#F56B71]/20 transition-all hover:scale-105 hover:bg-[#F56B71]/90">
              {ctaLabel}
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="rounded-full p-2 text-gray-600 hover:bg-gray-50 lg:hidden" aria-label="Toggle Menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="mt-3 space-y-2 border-t border-gray-100 pt-3 lg:hidden">
            <form method="get" action={productsHref} className="flex items-center rounded-full border border-gray-200">
              <input type="search" name="q" placeholder="Cari produk..." aria-label="Cari produk" className="w-full bg-transparent px-4 py-2.5 text-sm text-gray-700 focus:outline-none" />
              <button type="submit" aria-label="Cari" className="px-3 py-2.5 text-gray-500"><Search className="h-4 w-4" /></button>
            </form>
            {resolvedLinks.map((link) => (
              <Link key={link.path} href={link.href} className={`block rounded-full px-4 py-2.5 text-sm font-bold ${isActive(link.href) ? "bg-[#649FF6]/15 text-[#649FF6]" : "text-gray-600 hover:bg-gray-50"}`}>
                {link.label}
              </Link>
            ))}
            <Link href={getHref(ctaPath)} className="block rounded-full bg-[#F56B71] px-4 py-2.5 text-center text-sm font-bold text-white">
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default CasualCatalogSiteHeader;
