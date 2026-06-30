'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles, ArrowRight } from 'lucide-react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Tentang Kami', href: '/about' },
    { name: 'Layanan', href: '/services' },
    { name: 'Portofolio', href: '/portfolio' },
    { name: 'Artikel', href: '/articles' },
    { name: 'Hubungi Kami', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header id="main-header" className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link id="logo-link" href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-[#649FF6] flex items-center justify-center shadow-lg shadow-[#649FF6]/20 group-hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-lg text-gray-950 tracking-tight leading-none">
                  Ruang Karsa
                </span>
                <span className="text-[10px] font-mono text-[#F56B71] font-semibold tracking-wider uppercase mt-1">
                  Casual Theme
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                id={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-[#649FF6]/10 text-[#649FF6] font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA & Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              id="header-cta"
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#F56B71] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md hover:bg-[#F56B71]/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Konsultasi Gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-2xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div id="mobile-menu" className="md:hidden bg-white/95 border-b border-gray-100 animate-in slide-in-from-top-4 duration-200">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                id={`mobile-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-2xl text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-[#649FF6]/10 text-[#649FF6] font-bold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100">
              <Link
                id="mobile-header-cta"
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 bg-[#F56B71] text-white w-full py-3.5 rounded-2xl text-base font-semibold shadow-md hover:bg-[#F56B71]/90 transition-all duration-200"
              >
                Konsultasi Gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
