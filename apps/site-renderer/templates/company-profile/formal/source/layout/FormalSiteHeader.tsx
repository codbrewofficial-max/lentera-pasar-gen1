"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Shield } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "../shared/Button";

export interface NavItem { pageKey: string; label: string; path: string; }

export interface FormalSiteHeaderProps {
  siteSlug: string;
  getHref: (path: string) => string;
  businessName: string;
  taglineLabel?: string;
  logoUrl?: string;
  navItems?: NavItem[];
  ctaLabel?: string;
  ctaPath?: string;
}



export const FormalSiteHeader: React.FC<FormalSiteHeaderProps> = ({
  siteSlug,
  getHref,
  businessName,
  taglineLabel = "Consulting Group",
  logoUrl,
}) => {

  const DEFAULT_NAV_LINKS: NavItem[] = [
    { pageKey: "home", label: "Beranda", path: "/" },
    { pageKey: "about", label: "Tentang", path: "/about" },
    { pageKey: "services", label: "Layanan", path: "/services" },
    { pageKey: "portfolio", label: "Portofolio", path: "/portfolio" },
    { pageKey: "articles", label: "Artikel", path: "/articles" },
    { pageKey: "contact", label: "Kontak", path: "/contact" },
  ];
  const resolvedLinks = (navItems && navItems.length > 0 ? navItems : DEFAULT_NAV_LINKS).map(item => ({
    ...item,
    href: getHref(item.path)
  }));

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const homeHref = getHref("/");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsOpen(false), 0);
      return () => clearTimeout(timer);
    }
  }, [pathname, isOpen]);

  const isLinkActive = (path: string) => {
    const href = getHref(path);
    if (path === "/") return pathname === href;
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-slate-100 py-3"
          : "bg-white border-slate-100 py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href={homeHref} className="flex items-center space-x-2.5 group">
            {logoUrl ? (
              <img src={logoUrl} alt={businessName} className="w-9 h-9 rounded object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="bg-[#649FF6] text-white p-2 rounded">
                <Shield className="w-6 h-6" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-semibold text-lg md:text-xl text-slate-900 leading-tight group-hover:text-[#649FF6] transition-colors">
                {businessName}
              </span>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase leading-none">
                {taglineLabel}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {resolvedLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.path}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium tracking-wide transition-colors py-1 relative",
                    active ? "text-[#649FF6]" : "text-slate-600 hover:text-[#649FF6]"
                  )}
                >
                  {link.label}
                  {active && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#649FF6] rounded-full" />}
                </Link>
              );
            })}
          </nav>

          {/* Header CTA Button (Desktop) */}
          <div className="hidden md:block">
            <Button href={getHref("/contact")} variant="primary" size="sm" className="min-h-[38px]">
              {ctaLabel}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded text-slate-600 hover:text-[#649FF6] hover:bg-slate-50 transition-all focus:outline-none min-h-[44px] min-w-[44px]"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      <div
        className={cn(
          "md:hidden fixed inset-x-0 bg-white border-b border-slate-100 shadow-lg transition-all duration-300 ease-in-out overflow-hidden z-40",
          isOpen ? "top-[65px] max-h-[400px] opacity-100" : "top-[-400px] max-h-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="px-4 pt-4 pb-6 space-y-3">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <Link
                key={link.path}
                href={link.href}
                className={cn(
                  "block px-4 py-2.5 rounded text-base font-medium transition-colors",
                  active ? "bg-[#649FF6]/10 text-[#649FF6]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 px-4">
            <Button href={getHref("/contact")} variant="primary" className="w-full">
              {ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default FormalSiteHeader;
