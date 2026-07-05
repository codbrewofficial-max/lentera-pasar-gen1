"use client";

import React, { useState } from "react";
import { ArrowRight, Menu, Search, X } from "lucide-react";

export interface PremiumCatalogNavItem {
  pageKey: string;
  label: string;
  path: string;
}

export interface PremiumCatalogSiteHeaderProps {
  businessName: string;
  logoUrl?: string;
  getHref: (path: string) => string;
  navItems?: PremiumCatalogNavItem[];
  ctaLabel?: string;
  ctaPath?: string;
}

export const PremiumCatalogSiteHeader: React.FC<PremiumCatalogSiteHeaderProps> = ({
  businessName,
  logoUrl,
  getHref,
  navItems,
  ctaLabel = "LIHAT KOLEKSI",
  ctaPath = "/products"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const productsHref = getHref("/products");

  const DEFAULT_NAV: PremiumCatalogNavItem[] = [
    { pageKey: "home", label: "BERANDA", path: "/" },
    { pageKey: "products", label: "PRODUK", path: "/products" },
    { pageKey: "articles", label: "ARTIKEL", path: "/articles" },
    { pageKey: "faq", label: "FAQ", path: "/faq" },
    { pageKey: "contact", label: "KONTAK", path: "/contact" }
  ];
  const navLinks = (navItems && navItems.length > 0 ? navItems.map((i) => ({ ...i, label: i.label.toUpperCase() })) : DEFAULT_NAV).map((item) => ({ ...item, href: getHref(item.path) }));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0E0E0F]/90 text-white backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <a href={getHref("/")} className="group flex items-center space-x-3">
          {logoUrl ? (
            <img src={logoUrl} alt={businessName} className="h-8 w-auto object-contain" referrerPolicy="no-referrer" />
          ) : (
            <div className="relative flex h-8 w-8 items-center justify-center bg-gradient-to-br from-[#649FF6] to-[#B283AF]">
              <span className="text-xs font-bold tracking-widest text-white">{businessName.substring(0, 1)}</span>
            </div>
          )}
          <span className="hidden font-sans text-sm font-medium uppercase tracking-[0.25em] text-white md:inline group-hover:text-[#649FF6]">{businessName}</span>
        </a>

        <nav className="hidden items-center space-x-10 md:flex">
          {navLinks.map((link) => (
            <a key={link.path} href={link.href} className="group relative py-2 text-xs font-medium tracking-[0.25em] text-stone-300 transition-all hover:text-white">
              {link.label}
              <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-[#649FF6] via-[#B283AF] to-[#F56B71] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <form method="get" action={productsHref} className="hidden max-w-[180px] flex-1 items-center border border-white/10 lg:flex">
          <input type="search" name="q" placeholder="Cari produk..." aria-label="Cari produk" className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder:text-stone-500 focus:outline-none" />
          <button type="submit" aria-label="Cari" className="px-2 py-2 text-stone-400 hover:text-white"><Search className="h-4 w-4" /></button>
        </form>

        <div className="hidden md:block">
          <a href={getHref(ctaPath)} className="inline-flex items-center space-x-2 border border-white/15 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition-all hover:border-[#649FF6] hover:bg-white/5">
            <span>{ctaLabel}</span>
            <ArrowRight className="h-3.5 w-3.5 text-[#F56B71]" />
          </a>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-stone-300 md:hidden" aria-label="Toggle Menu">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-1 border-t border-white/5 bg-[#0E0E0F] px-6 py-4 md:hidden">
          <form method="get" action={productsHref} className="mb-3 flex items-center border border-white/10">
            <input type="search" name="q" placeholder="Cari produk..." aria-label="Cari produk" className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-stone-500 focus:outline-none" />
            <button type="submit" aria-label="Cari" className="px-3 py-2.5 text-stone-400"><Search className="h-4 w-4" /></button>
          </form>
          {navLinks.map((link) => (
            <a key={link.path} href={link.href} className="block px-2 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-stone-300 hover:text-white">{link.label}</a>
          ))}
          <a href={getHref(ctaPath)} className="mt-2 block border border-white/15 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white">{ctaLabel}</a>
        </div>
      )}
    </header>
  );
};

export default PremiumCatalogSiteHeader;
