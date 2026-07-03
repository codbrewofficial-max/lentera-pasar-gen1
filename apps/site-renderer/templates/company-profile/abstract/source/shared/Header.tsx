'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sparkles } from 'lucide-react';

interface NavItem { pageKey: string; label: string; path: string; }

interface HeaderProps {
  siteSlug: string;
  getHref: (path: string) => string;
  businessName: string;
  taglineLabel?: string;
  logoUrl?: string;
  navItems?: NavItem[];
  ctaLabel?: string;
  ctaPath?: string;
}

export function Header({ siteSlug, getHref, businessName, taglineLabel = 'Creative Studio', logoUrl, navItems, ctaLabel, ctaPath }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const DEFAULT_NAV: NavItem[] = [
    { pageKey: 'home', label: 'Home', path: '/' },
    { pageKey: 'about', label: 'Tentang Kami', path: '/about' },
    { pageKey: 'services', label: 'Layanan', path: '/services' },
    { pageKey: 'portfolio', label: 'Portofolio', path: '/portfolio' },
    { pageKey: 'articles', label: 'Artikel', path: '/articles' },
    { pageKey: 'contact', label: 'Hubungi Kami', path: '/contact' },
  ];
  const navigation = (navItems && navItems.length > 0 ? navItems : DEFAULT_NAV)
    .map((item) => ({ ...item, name: item.label, href: getHref(item.path) }));

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href={getHref('/')} className="group flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-[#649FF6] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            {logoUrl ? (
              <img src={logoUrl} alt={businessName} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <Sparkles className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-sans font-extrabold text-base text-neutral-900 tracking-tight">{businessName}</span>
            <span className="font-mono text-[10px] lowercase tracking-wider text-neutral-400">{taglineLabel}</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.path}
                href={link.href}
                className={`px-4 py-2 rounded-full font-sans text-sm font-semibold transition-colors ${
                  isActive ? 'bg-[#649FF6] text-white' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block shrink-0">
          <Link
            href={getHref('/contact')}
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#F56B71] hover:bg-[#e15a61] text-white font-sans text-sm font-bold transition-colors"
          >
            Mulai kolaborasi
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center">
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 rounded-full bg-neutral-100 text-neutral-900 hover:bg-neutral-200 transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-0 w-full bg-white border-b border-neutral-200 md:hidden z-40 shadow-lg shadow-neutral-900/5"
          >
            <div className="flex flex-col p-3 gap-1">
              {navigation.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.path}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-2xl font-sans text-sm font-semibold transition-colors ${
                      isActive ? 'bg-[#649FF6] text-white' : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link
                href={getHref('/contact')}
                onClick={() => setIsOpen(false)}
                className="mt-2 px-4 py-3.5 rounded-2xl bg-[#F56B71] text-white font-sans text-sm font-bold text-center hover:bg-[#e15a61] transition-colors"
              >
                Mulai kolaborasi
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
