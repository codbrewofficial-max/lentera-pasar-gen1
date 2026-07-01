'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sparkles } from 'lucide-react';

interface NavItem { pageKey: string; label: string; path: string; }

interface HeaderProps {
  businessName?: string;
  logoUrl?: string;
  getHref: (path: string) => string;
  navItems?: NavItem[];
  ctaLabel?: string;
  ctaPath?: string;
}



export function Header({ businessName = "Studio Sinestesia", logoUrl, getHref, navItems, ctaLabel = 'Mulai Proyek', ctaPath = '/contact' }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="relative z-50 w-full bg-[#111111] text-white border-b-4 border-white overflow-visible">
      {/* Abstract background stripe */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#649FF6] via-[#F56B71] to-[#B283AF]" />

      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between relative">
        
        {/* LOGO AREA - Abstract Risograph Box */}
        <Link href={getHref('/')} className="group relative flex items-center">
          <div className="absolute -inset-1 bg-[#F56B71] transform -skew-x-12 transition-transform group-hover:scale-105 group-hover:rotate-2 duration-300" />
          <div className="absolute -inset-1 bg-[#649FF6] transform skew-x-6 translate-x-1 translate-y-1 opacity-70 transition-transform group-hover:translate-x-2 group-hover:translate-y-2 duration-300" />
          <div className="relative bg-black border-2 border-white px-4 py-2 font-mono font-bold tracking-widest text-sm flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt={businessName} className="h-6 w-auto object-contain" />
            ) : (
              <Sparkles className="w-4 h-4 text-[#649FF6]" />
            )}
            <span className="text-white group-hover:text-[#F56B71] transition-colors">{businessName.toUpperCase()}</span>
          </div>
        </Link>

        {/* DESKTOP NAV - Asymmetric Grid-like Boxes */}
        <nav className="hidden md:flex items-stretch h-full">
          {navLinks.map((link) => {
            const isActive = pathname === getHref(link.path);
            return (
              <Link 
                key={link.path}
                href={getHref(link.path)}
                className="relative flex items-center px-5 font-mono text-xs font-bold tracking-widest transition-all duration-200 border-l border-neutral-800 hover:text-black overflow-hidden group"
              >
                {/* Active or Hover Background Block */}
                <div 
                  className={`absolute inset-0 transition-transform duration-300 origin-bottom transform ${
                    isActive 
                      ? 'translate-y-0 bg-[#649FF6]' 
                      : 'translate-y-full group-hover:translate-y-0 bg-[#B283AF]'
                  }`} 
                />
                
                {/* Visual Accent Slice */}
                <span className="absolute top-2 right-2 text-[8px] opacity-30 group-hover:opacity-100 font-sans">
                  {"// " + link.label.slice(0, 3)}
                </span>
                
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
          
          <Link 
            href={getHref(ctaPath)} 
            className="flex items-center px-6 bg-[#F56B71] hover:bg-white text-black font-mono text-xs font-bold tracking-widest border-l-4 border-white hover:text-black transition-colors"
          >
            LET&apos;S TALK
          </Link>
        </nav>

        {/* MOBILE MENU TOGGLE - Asymmetric button */}
        <div className="md:hidden flex items-center">
          <button 
            id="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 bg-[#B283AF] border-2 border-white text-black hover:bg-white transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-24 left-0 w-full bg-[#111111] border-b-4 border-white text-white md:hidden z-40"
          >
            <div className="flex flex-col border-t border-neutral-800">
              {navLinks.map((link, idx) => {
                const isActive = pathname === getHref(link.path);
                return (
                  <Link
                    key={link.path}
                    href={getHref(link.path)}
                    onClick={() => setIsOpen(false)}
                    className={`px-6 py-4 font-mono text-sm font-bold tracking-widest border-b border-neutral-800 flex justify-between items-center transition-colors ${
                      isActive ? 'bg-[#649FF6] text-black' : 'hover:bg-[#B283AF] hover:text-black'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="text-xs opacity-50">0{idx + 1}/</span>
                  </Link>
                );
              })}
              <Link
                href={getHref(ctaPath)}
                onClick={() => setIsOpen(false)}
                className="px-6 py-5 bg-[#F56B71] text-black font-mono text-sm font-bold tracking-widest text-center hover:bg-white transition-colors"
              >
                MULAI KOLABORASI →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
