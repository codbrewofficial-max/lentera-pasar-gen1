"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Sparkles, X } from "lucide-react";

export interface AbstractCatalogNavItem {
  pageKey: string;
  label: string;
  path: string;
}

export interface AbstractCatalogSiteHeaderProps {
  siteSlug: string;
  getHref: (path: string) => string;
  businessName: string;
  logoUrl?: string;
  navItems?: AbstractCatalogNavItem[];
  ctaLabel?: string;
  ctaPath?: string;
}

export const AbstractCatalogSiteHeader: React.FC<AbstractCatalogSiteHeaderProps> = ({
  getHref,
  businessName,
  logoUrl,
  navItems,
  ctaLabel = "mulai belanja",
  ctaPath = "/products"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const homeHref = getHref("/");
  const productsHref = getHref("/products");

  const DEFAULT_NAV: AbstractCatalogNavItem[] = [
    { pageKey: "home", label: "beranda", path: "/" },
    { pageKey: "products", label: "produk", path: "/products" },
    { pageKey: "articles", label: "artikel", path: "/articles" },
    { pageKey: "faq", label: "faq", path: "/faq" },
    { pageKey: "contact", label: "kontak", path: "/contact" }
  ];
  const navigation = (navItems && navItems.length > 0 ? navItems : DEFAULT_NAV).map((item) => ({ ...item, href: getHref(item.path) }));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6">
        <Link href={homeHref} className="group flex shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#649FF6] transition-transform group-hover:scale-105">
            {logoUrl ? <img src={logoUrl} alt={businessName} className="h-full w-full rounded-2xl object-cover" referrerPolicy="no-referrer" /> : <Sparkles className="h-5 w-5 text-white" />}
          </div>
          <span className="hidden font-sans text-base font-extrabold tracking-tight text-neutral-900 sm:inline">{businessName}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.path} href={link.href} className={`rounded-full px-4 py-2 font-mono text-sm lowercase transition-colors ${isActive ? "bg-[#649FF6]/10 text-[#649FF6]" : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"}`}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <form method="get" action={productsHref} className="hidden max-w-[200px] flex-1 items-center rounded-full border border-neutral-200 lg:flex">
          <input type="search" name="q" placeholder="cari produk..." aria-label="Cari produk" className="w-full bg-transparent px-4 py-2 text-sm text-neutral-700 focus:outline-none" />
          <button type="submit" aria-label="Cari" className="px-3 py-2 text-neutral-400 hover:text-[#649FF6]"><Search className="h-4 w-4" /></button>
        </form>

        <div className="hidden md:block">
          <Link href={getHref(ctaPath)} className="inline-flex items-center gap-2 rounded-full bg-[#649FF6] px-6 py-2.5 font-mono text-sm font-bold lowercase text-white transition-colors hover:bg-[#5389e0]">
            {ctaLabel}
          </Link>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="rounded-full p-2 text-neutral-600 hover:bg-neutral-50 md:hidden" aria-label="Toggle Menu">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-1 border-t border-neutral-100 px-6 py-4 md:hidden">
          <form method="get" action={productsHref} className="mb-2 flex items-center rounded-full border border-neutral-200">
            <input type="search" name="q" placeholder="cari produk..." aria-label="Cari produk" className="w-full bg-transparent px-4 py-2.5 text-sm text-neutral-700 focus:outline-none" />
            <button type="submit" aria-label="Cari" className="px-3 py-2.5 text-neutral-400"><Search className="h-4 w-4" /></button>
          </form>
          {navigation.map((link) => (
            <Link key={link.path} href={link.href} className="block rounded-full px-4 py-2.5 font-mono text-sm lowercase text-neutral-600 hover:bg-neutral-50">{link.label}</Link>
          ))}
          <Link href={getHref(ctaPath)} className="mt-2 block rounded-full bg-[#649FF6] px-4 py-2.5 text-center font-mono text-sm font-bold lowercase text-white">{ctaLabel}</Link>
        </div>
      )}
    </header>
  );
};

export default AbstractCatalogSiteHeader;
