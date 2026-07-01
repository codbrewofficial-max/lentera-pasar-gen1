'use client';

import React from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin, ArrowUp } from 'lucide-react';

interface FooterNavItem { pageKey: string; label: string; path: string; }

interface FooterProps {
  navItems?: FooterNavItem[];
  businessName?: string;
  logoUrl?: string;
  getHref: (path: string) => string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
}

export function Footer({
  businessName = "Niskala Atelier",
  logoUrl,
  getHref,
  description = "Menciptakan ruang berestetika tinggi dan fungsional kelas atas untuk residensi privat, resor, dan korporat di Indonesia.",
  address = "Alamat belum diisi.",
  phone = "-",
  email = "email@contoh.com",
  instagramUrl = "https://instagram.com",
  linkedinUrl = "https://linkedin.com",
  navItems,
}: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="premium-footer" className="bg-[#0E0E0F] text-white border-t border-white/5 pt-20 pb-12 transition-all">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Left column: Brand */}
        <div id="footer-col-brand" className="space-y-6 md:col-span-1">
          <a href={getHref('/')} className="flex items-center space-x-3">
            {logoUrl ? (
              <img src={logoUrl} alt={businessName} className="h-8 w-auto object-contain" />
            ) : (
              <div className="relative flex items-center justify-center w-8 h-8 rounded-sm bg-gradient-to-br from-[#649FF6] to-[#B283AF]">
                <span className="text-xs font-bold text-white tracking-widest">{businessName.substring(0, 1)}</span>
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#F56B71]" />
              </div>
            )}
            <span className="font-sans font-medium text-sm tracking-[0.25em] text-white uppercase">
              {businessName}
            </span>
          </a>
          <p className="text-xs text-stone-400 leading-relaxed font-sans font-light">
            {description}
          </p>
          <div className="flex space-x-4">
            <a href={instagramUrl} className="p-2 border border-white/5 hover:border-[#649FF6] text-stone-400 hover:text-white transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href={linkedinUrl} className="p-2 border border-white/5 hover:border-[#B283AF] text-stone-400 hover:text-white transition-all">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Mid Col 1: Links */}
        <div id="footer-col-navigation" className="space-y-4">
          <h4 className="text-[10px] font-semibold tracking-[0.3em] text-stone-400 uppercase">NAVIGASI</h4>
          <ul className="space-y-2.5">
            <li><a href={getHref('/')} className="text-xs text-stone-300 hover:text-[#649FF6] transition-colors tracking-wider">Beranda</a></li>
            <li><a href={getHref('/about')} className="text-xs text-stone-300 hover:text-[#649FF6] transition-colors tracking-wider">Tentang Kami</a></li>
            <li><a href={getHref('/services')} className="text-xs text-stone-300 hover:text-[#B283AF] transition-colors tracking-wider">Layanan Desain</a></li>
            <li><a href={getHref('/portfolio')} className="text-xs text-stone-300 hover:text-[#F56B71] transition-colors tracking-wider">Portofolio Karya</a></li>
            <li><a href={getHref('/articles')} className="text-xs text-stone-300 hover:text-[#649FF6] transition-colors tracking-wider">Artikel & Jurnal</a></li>
            <li><a href={getHref('/contact')} className="text-xs text-stone-300 hover:text-[#B283AF] transition-colors tracking-wider">Hubungi Kami</a></li>
          </ul>
        </div>

        {/* Mid Col 2: Info Kontak */}
        <div id="footer-col-contact" className="space-y-4">
          <h4 className="text-[10px] font-semibold tracking-[0.3em] text-stone-400 uppercase">KONTAK UTAMA</h4>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-[#F56B71] shrink-0 mt-0.5" />
              <span className="text-xs text-stone-300 leading-relaxed font-light">
                {address}
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-[#649FF6] shrink-0" />
              <span className="text-xs text-stone-300 font-light">{phone}</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-[#B283AF] shrink-0" />
              <span className="text-xs text-stone-300 font-light">{email}</span>
            </li>
          </ul>
        </div>

        {/* Mid Col 3: Kurasi Jurnal */}
        <div id="footer-col-newsletter" className="space-y-4">
          <h4 className="text-[10px] font-semibold tracking-[0.3em] text-stone-400 uppercase">LENTERA PREMIUM</h4>
          <p className="text-xs text-stone-400 leading-relaxed font-light">
            Dapatkan kurasi tren arsitektur dan wawasan spasial berkala langsung di inbox Anda.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex items-center border border-white/10 p-1 bg-white/5">
            <input
              type="email"
              placeholder="Email Anda"
              className="bg-transparent border-none text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-0 px-3 py-1.5 w-full font-light"
            />
            <button
              type="submit"
              className="bg-[#649FF6]/10 text-[#649FF6] hover:bg-[#649FF6]/20 text-[10px] font-bold tracking-[0.2em] px-4 py-2 transition-colors uppercase border-l border-white/5"
            >
              IKUTI
            </button>
          </form>
        </div>
      </div>

      {/* Bottom info */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-stone-500 tracking-wider">
          © {new Date().getFullYear()} {businessName}. All rights reserved. Dikembangkan bersama Lentera Pasar.
        </p>
        <div className="flex items-center space-x-6">
          <a href="#" className="text-[10px] text-stone-500 hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-[10px] text-stone-500 hover:text-white transition-colors">Terms of Service</a>
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 text-[10px] text-stone-400 hover:text-white transition-colors uppercase tracking-[0.2em]"
          >
            <span>KEMBALI KE ATAS</span>
            <ArrowUp className="w-3 h-3 text-[#F56B71]" />
          </button>
        </div>
      </div>
    </footer>
  );
}
