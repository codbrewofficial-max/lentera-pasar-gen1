"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { cn } from "@/templates/company-profile/formal/source/lib/utils";
import { Button } from "@/templates/company-profile/formal/source/shared/Button";

export interface CatalogNavItem {
  pageKey: string;
  label: string;
  path: string;
}

export interface FormalCatalogSiteHeaderProps {
  siteSlug: string;
  getHref: (path: string) => string;
  businessName: string;
  taglineLabel?: string;
  logoUrl?: string;
  navItems?: CatalogNavItem[];
  ctaLabel?: string;
  ctaPath?: string;
}

// Header khusus Katalog Produk: sama identitas visual dengan FormalSiteHeader (company
// profile) — logo, nav, tombol CTA dengan sudut tegas & warna navy/gold khas Formal — tapi
// ditambah kolom pencarian produk (blueprint: "kolom pencarian, crucial untuk katalog").
// Sengaja TIDAK dibuat ikon wishlist karena belum ada fitur wishlist beneran di backend;
// menambah ikon yang tidak berfungsi akan menyesatkan pengunjung.
export const FormalCatalogSiteHeader: React.FC<FormalCatalogSiteHeaderProps> = ({
  siteSlug,
  getHref,
  businessName,
  taglineLabel = "Katalog Produk",
  logoUrl,
  navItems,
  ctaLabel = "Lihat Produk",
  ctaPath = "/products"
}) => {
  const DEFAULT_NAV_LINKS: CatalogNavItem[] = [
    { pageKey: "home", label: "Beranda", path: "/" },
    { pageKey: "products", label: "Produk", path: "/products" },
    { pageKey: "articles", label: "Artikel", path: "/articles" },
    { pageKey: "faq", label: "FAQ", path: "/faq" },
    { pageKey: "contact", label: "Kontak", path: "/contact" }
  ];

  const resolvedLinks = (navItems && navItems.length > 0 ? navItems : DEFAULT_NAV_LINKS).map((item) => ({
    ...item,
    href: getHref(item.path)
  }));

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const homeHref = getHref("/");
  const productsHref = getHref("/products");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isLinkActive = (href: string, linkPageKey?: string) => {
    if (href === homeHref) return pathname === href;
    if (linkPageKey === "articles" && pathname?.includes("/articles/")) return true;
    if (linkPageKey === "products" && pathname?.includes("/products/")) return true;
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b",
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-slate-100 py-3" : "bg-white border-slate-100 py-4"
      )}
    >
      <div className="relative z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link href={homeHref} className="flex shrink-0 items-center space-x-2.5 group">
            {logoUrl ? (
              <img src={logoUrl} alt={businessName} className="w-10 h-10 rounded-none object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="bg-slate-950 text-white p-2 rounded-none">
                <ShoppingBag className="w-6 h-6" />
              </div>
            )}
            <div className="hidden flex-col sm:flex">
              <span className="font-semibold text-lg text-slate-900 leading-tight group-hover:text-[#1E3A5F] transition-colors">
                {businessName}
              </span>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase leading-none">{taglineLabel}</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-7">
            {resolvedLinks.map((link) => {
              const active = isLinkActive(link.href, link.pageKey);
              return (
                <Link
                  key={link.path}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium tracking-wide transition-colors py-1 relative",
                    active ? "text-[#1E3A5F]" : "text-slate-600 hover:text-[#1E3A5F]"
                  )}
                >
                  {link.label}
                  {active && <span className="absolute bottom-0 left-0 w-full h-[3px] bg-slate-950 rounded-none" />}
                </Link>
              );
            })}
          </nav>

          <form method="get" action={productsHref} className="hidden md:flex flex-1 max-w-xs items-center border border-slate-200">
            <input
              type="search"
              name="q"
              placeholder="Cari produk..."
              aria-label="Cari produk"
              className="w-full bg-transparent px-3 py-2 text-sm text-slate-700 focus:outline-none"
            />
            <button type="submit" aria-label="Cari" className="px-3 py-2 text-slate-500 hover:text-[#1E3A5F]">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="hidden lg:block">
            <Button href={getHref(ctaPath)} variant="primary" size="sm" className="min-h-[38px]">
              {ctaLabel}
            </Button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-none text-slate-600 hover:text-[#1E3A5F] hover:bg-slate-50 transition-all focus:outline-none min-h-[44px] min-w-[44px]"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "lg:hidden fixed left-0 right-0 bg-white border-b border-slate-100 shadow-lg transition-all duration-500 ease-in-out z-30 top-0",
          isOpen ? "translate-y-[65px] opacity-100 visible" : "translate-y-0 opacity-0 pointer-events-none invisible"
        )}
      >
        <div className="px-4 pt-4 pb-6 space-y-3">
          <form method="get" action={productsHref} className="flex items-center border border-slate-200">
            <input type="search" name="q" placeholder="Cari produk..." aria-label="Cari produk" className="w-full bg-transparent px-3 py-2.5 text-sm text-slate-700 focus:outline-none" />
            <button type="submit" aria-label="Cari" className="px-3 py-2.5 text-slate-500">
              <Search className="w-4 h-4" />
            </button>
          </form>
          {resolvedLinks.map((link) => {
            const active = isLinkActive(link.href, link.pageKey);
            return (
              <Link
                key={link.path}
                href={link.href}
                className={cn(
                  "block px-4 py-2.5 rounded-none text-base font-medium transition-colors",
                  active ? "bg-[#1E3A5F]/10 text-[#1E3A5F]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 px-4">
            <Button href={getHref(ctaPath)} variant="primary" className="w-full">
              {ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default FormalCatalogSiteHeader;
