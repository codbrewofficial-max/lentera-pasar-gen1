'use client';

import React, { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

interface NavItem { pageKey: string; label: string; path: string; }

interface HeaderProps {
  businessName?: string;
  logoUrl?: string;
  getHref: (path: string) => string;
  navItems?: NavItem[];
  ctaLabel?: string;
  ctaPath?: string;
}

export function Header({ businessName = "Niskala Atelier", logoUrl, getHref, navItems, ctaLabel = 'Konsultasi', ctaPath = '/contact' }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const DEFAULT_NAV: NavItem[] = [
    { pageKey: "home", label: "BERANDA", path: "/" },
    { pageKey: "about", label: "TENTANG", path: "/about" },
    { pageKey: "services", label: "LAYANAN", path: "/services" },
    { pageKey: "portfolio", label: "PORTFOLIO", path: "/portfolio" },
    { pageKey: "articles", label: "ARTIKEL", path: "/articles" },
    { pageKey: "contact", label: "KONTAK", path: "/contact" }
  ];
  const navLinks = (navItems && navItems.length > 0 ? navItems.map(i => ({ ...i, label: i.label.toUpperCase() })) : DEFAULT_NAV)
    .map((item) => ({ ...item, href: getHref(item.path) }));

  return (
    <header id="premium-header" className="sticky top-0 z-50 w-full bg-[#0E0E0F]/90 backdrop-blur-md border-b border-white/5 text-white transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a id="header-brand-logo" href={getHref('/')} className="flex items-center space-x-3 group">
          {logoUrl ? (
            <img id="header-logo-img" src={logoUrl} alt={businessName} className="h-8 w-auto object-contain" />
          ) : (
            <div id="header-logo-placeholder" className="relative flex items-center justify-center w-8 h-8 rounded-sm bg-gradient-to-br from-[#649FF6] to-[#B283AF]">
              <span className="text-xs font-bold text-white tracking-widest">{businessName.substring(0, 1)}</span>
              {/* Subtle top light */}
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#F56B71]" />
            </div>
          )}
          <div className="flex flex-col text-left">
            <span id="header-brand-name" className="font-sans font-medium text-sm tracking-[0.25em] text-white uppercase group-hover:text-[#649FF6] transition-colors">
              {businessName}
            </span>
            <span className="text-[9px] text-stone-400 tracking-[0.3em] uppercase">SPATIAL ATELIER</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav id="header-desktop-nav" className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <a
              id={`nav-link-${link.label.toLowerCase()}`}
              key={link.label}
              href={link.href}
              className="text-xs font-medium tracking-[0.25em] text-stone-300 hover:text-white transition-all relative py-2 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-[#649FF6] via-[#B283AF] to-[#F56B71] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <a
            id="header-cta-btn"
            href={getHref(ctaPath)}
            className="inline-flex items-center space-x-2 text-xs font-semibold tracking-[0.2em] uppercase px-5 py-2.5 border border-white/15 rounded-none hover:border-[#649FF6] hover:bg-white/5 transition-all duration-300"
          >
            <span>KONSULTASI</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F56B71]" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          id="header-mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-stone-300 hover:text-white focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div id="header-mobile-drawer" className="md:hidden absolute top-20 left-0 w-full bg-[#0E0E0F] border-b border-white/5 px-6 py-8 flex flex-col space-y-6 transition-all duration-300 animate-fadeIn">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                id={`mobile-nav-link-${link.label.toLowerCase()}`}
                key={link.label}
                href={link.href}
                className="text-xs font-medium tracking-[0.2em] text-stone-300 hover:text-white py-2 border-b border-white/5"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            id="header-mobile-cta"
            href={getHref(ctaPath)}
            className="flex items-center justify-between text-xs font-semibold tracking-[0.2em] uppercase w-full px-5 py-4 border border-white/10 rounded-none bg-white/5"
            onClick={() => setIsOpen(false)}
          >
            <span>MULAI PROYEK</span>
            <ArrowRight className="w-4 h-4 text-[#F56B71]" />
          </a>
        </div>
      )}
    </header>
  );
}
