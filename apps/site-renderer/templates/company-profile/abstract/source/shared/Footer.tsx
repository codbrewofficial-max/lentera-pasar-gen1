'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin, Phone, Instagram, Linkedin, Twitter, Sparkles } from 'lucide-react';

interface FooterNavItem { pageKey: string; label: string; path: string; }

interface FooterProps {
  navItems?: FooterNavItem[];
  businessName?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  getHref: (path: string) => string;
}

export function Footer({
  businessName = "Studio Sinestesia",
  description = "Kami merancang identitas digital, web art, dan branding yang hidup, energik, dan relevan buat brand-brand yang berani tampil beda.",
  address = "Grand Wijaya Center Blok F-8, Jl. Wijaya II, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12160",
  phone = "+62 812-3456-7890",
  email = "hello@studiosinestesia.id",
  instagramUrl = "https://instagram.com",
  linkedinUrl = "https://linkedin.com",
  twitterUrl = "https://twitter.com",
  getHref,
  navItems,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-[#151515] text-white overflow-hidden py-20">
      {/* Soft gradient blobs for warmth */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-[#B283AF] opacity-20 rounded-full blur-3xl pointer-events-none -mr-48 -mt-48" />
      <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-[#649FF6] opacity-10 rounded-full blur-3xl pointer-events-none -ml-40 -mb-40" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-white/10">

          {/* Brand intro */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#649FF6] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-sans font-extrabold text-lg tracking-tight">
                  {businessName}
                </span>
              </div>
              <p className="text-neutral-400 font-sans text-sm leading-relaxed max-w-md">
                {description}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 hover:bg-[#F56B71] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 hover:bg-[#649FF6] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4.5 h-4.5" />
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 hover:bg-[#B283AF] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Nav links */}
          <div className="lg:col-span-3">
            <h4 className="font-mono text-[11px] lowercase text-[#649FF6] tracking-wider mb-6">
              eksplorasi
            </h4>
            <ul className="space-y-3 font-sans text-sm">
              {[
                { label: 'Home', path: '/' },
                { label: 'Tentang Kami', path: '/about' },
                { label: 'Layanan', path: '/services' },
                { label: 'Portofolio', path: '/portfolio' },
                { label: 'Artikel', path: '/articles' },
                { label: 'Kontak', path: '/contact' },
              ].map((item) => (
                <li key={item.path}>
                  <Link href={getHref(item.path)} className="text-neutral-300 hover:text-white flex items-center group gap-1">
                    <span>{item.label}</span> <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <h4 className="font-mono text-[11px] lowercase text-[#F56B71] tracking-wider mb-6">
                koordinat kami
              </h4>
              <ul className="space-y-4 font-sans text-sm text-neutral-300">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#B283AF] shrink-0 mt-0.5" />
                  <span>{address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#649FF6] shrink-0" />
                  <span>{phone}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#F56B71] shrink-0" />
                  <span>{email}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 rounded-2xl bg-white/5 p-4 text-xs text-neutral-400 font-sans">
              Dibuat dengan <span className="text-white font-semibold">Lentera Pasar Website Builder</span>.
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-sans text-xs text-neutral-500">
            © {currentYear} {businessName}. Hak cipta dilindungi.
          </div>

          <div className="flex gap-6 font-sans text-xs text-neutral-500">
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
