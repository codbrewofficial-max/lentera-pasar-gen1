'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Instagram, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export interface CasualFooterProps {
  getHref: (path: string) => string;
  businessName: string;
  description?: string;
  address: string;
  phone: string;
  email: string;
  whatsappHref: string;
  instagramUrl?: string;
  logoUrl?: string;
}

export function Footer({
  getHref,
  businessName,
  description = 'Partner kreatif andalan UMKM Indonesia. Membantu menaikkan kelas brand lokal dengan identitas visual yang seru dan menyenangkan.',
  address,
  phone,
  email,
  whatsappHref,
  instagramUrl = 'https://instagram.com',
  logoUrl,
}: CasualFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-gray-50 border-t border-gray-100 overflow-hidden relative">
      {/* Decorative Blob Accents */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 rounded-full bg-[#B283AF]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 rounded-full bg-[#649FF6]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link id="footer-logo-link" href={getHref('/')} className="flex items-center gap-2 group">
              {logoUrl ? (
                <img src={logoUrl} alt={businessName} className="w-9 h-9 rounded-xl object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-[#649FF6] flex items-center justify-center shadow-md group-hover:rotate-6 transition-transform">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="font-sans font-bold text-lg text-gray-950 tracking-tight">
                {businessName}
              </span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              {description}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-[#B283AF] hover:scale-110 shadow-sm border border-gray-100 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={`mailto:${email}`} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-[#649FF6] hover:scale-110 shadow-sm border border-gray-100 transition-all">
                <Mail className="w-4 h-4" />
              </a>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-[#F56B71] hover:scale-110 shadow-sm border border-gray-100 transition-all">
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Col */}
          <div className="space-y-4">
            <h4 className="font-sans font-semibold text-sm text-gray-950 uppercase tracking-wider">
              Jelajahi
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href={getHref('/')} className="text-gray-600 hover:text-[#649FF6] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href={getHref('/about')} className="text-gray-600 hover:text-[#649FF6] transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href={getHref('/services')} className="text-gray-600 hover:text-[#649FF6] transition-colors">
                  Layanan Kami
                </Link>
              </li>
              <li>
                <Link href={getHref('/portfolio')} className="text-gray-600 hover:text-[#649FF6] transition-colors">
                  Portofolio Kreatif
                </Link>
              </li>
            </ul>
          </div>

          {/* More Links Col */}
          <div className="space-y-4">
            <h4 className="font-sans font-semibold text-sm text-gray-950 uppercase tracking-wider">
              Inspirasi
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href={getHref('/articles')} className="text-gray-600 hover:text-[#649FF6] transition-colors">
                  Tips & Artikel
                </Link>
              </li>
              <li>
                <Link href={getHref('/contact')} className="text-gray-600 hover:text-[#649FF6] transition-colors">
                  Kontak & Lokasi
                </Link>
              </li>
              <li>
                <span className="text-gray-400 cursor-not-allowed">
                  Dashboard CMS
                </span>
              </li>
              <li>
                <span className="text-gray-400 cursor-not-allowed">
                  Lentera Pasar
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-4">
            <h4 className="font-sans font-semibold text-sm text-gray-950 uppercase tracking-wider">
              Hubungi
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-[#F56B71] shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4.5 h-4.5 text-[#649FF6] shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4.5 h-4.5 text-[#B283AF] shrink-0" />
                <span>{email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div>
            &copy; {currentYear} {businessName}. Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-[#F56B71] fill-[#F56B71]" />
            <span>untuk UMKM Indonesia • Lentera Pasar</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
