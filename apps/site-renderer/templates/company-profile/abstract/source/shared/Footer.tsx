'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin, Phone, Github, Instagram, Linkedin, Twitter } from 'lucide-react';

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
  description = "Mendobrak kebosanan visual dengan dekonstruksi estetik. Kami merancang identitas digital, web art, dan branding avant-garde yang hidup, bernyawa, dan bertenaga tinggi.",
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
    <footer className="relative w-full bg-[#080808] text-white border-t-8 border-white overflow-hidden py-16">
      {/* Decorative colored geometric shapes */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-[#B283AF] opacity-20 rounded-full blur-3xl pointer-events-none -mr-48 -mt-48" />
      <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-[#649FF6] opacity-10 rounded-full blur-3xl pointer-events-none -ml-40 -mb-40" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* UPPER FOOTER - Two Column Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b-2 border-neutral-800">
          
          {/* Studio Brand Intro (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="relative inline-block mb-4">
                <div className="absolute -inset-1 bg-[#B283AF] transform rotate-1" />
                <span className="relative block bg-black border-2 border-white px-4 py-2 font-mono font-black text-xl tracking-widest">
                  {businessName.toUpperCase()}
                </span>
              </div>
              <p className="text-neutral-400 font-sans text-sm leading-relaxed max-w-md">
                {description}
              </p>
            </div>

            {/* Social Grid - Geometric square buttons */}
            <div className="flex gap-3 pt-4">
              <a 
                href={instagramUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="w-12 h-12 flex items-center justify-center bg-neutral-900 border-2 border-white hover:bg-[#F56B71] hover:text-black hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-4px_4px_0px_rgba(255,255,255,1)] transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="w-12 h-12 flex items-center justify-center bg-neutral-900 border-2 border-white hover:bg-[#649FF6] hover:text-black hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-4px_4px_0px_rgba(255,255,255,1)] transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href={twitterUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="w-12 h-12 flex items-center justify-center bg-neutral-900 border-2 border-white hover:bg-[#B283AF] hover:text-black hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-4px_4px_0px_rgba(255,255,255,1)] transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Nav Links Column (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-mono text-xs font-bold text-[#649FF6] tracking-widest uppercase mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#649FF6]" /> EKSPLORASI
            </h4>
            <ul className="space-y-3 font-mono text-sm">
              <li>
                <Link href={getHref('/')} className="hover:text-[#F56B71] hover:underline flex items-center group gap-1">
                  <span>Home</span> <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href={getHref('/about')} className="hover:text-[#F56B71] hover:underline flex items-center group gap-1">
                  <span>Tentang Kami</span> <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href={getHref('/services')} className="hover:text-[#F56B71] hover:underline flex items-center group gap-1">
                  <span>Layanan</span> <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href={getHref('/portfolio')} className="hover:text-[#F56B71] hover:underline flex items-center group gap-1">
                  <span>Portofolio</span> <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href={getHref('/articles')} className="hover:text-[#F56B71] hover:underline flex items-center group gap-1">
                  <span>Artikel</span> <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href={getHref('/contact')} className="hover:text-[#F56B71] hover:underline flex items-center group gap-1">
                  <span>Kontak</span> <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <h4 className="font-mono text-xs font-bold text-[#F56B71] tracking-widest uppercase mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#F56B71]" /> KOORDINAT KAMI
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
            
            {/* Built for Lentera Pasar badge */}
            <div className="mt-8 border border-dashed border-neutral-700 p-3 rounded bg-neutral-900/40 text-xs text-neutral-500 font-mono">
              Designed for <span className="text-white font-bold">Lentera Pasar Website Builder</span>. All rights reserved.
            </div>
          </div>
        </div>

        {/* LOWER FOOTER - Giant stylized background typography + Copyright */}
        <div className="relative mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-mono text-xs text-neutral-500">
            © {currentYear} {businessName}. Hak Cipta Dilindungi.
          </div>
          
          <div className="flex gap-6 font-mono text-xs text-neutral-500">
            <a href="#" className="hover:text-white">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white">Syarat & Ketentuan</a>
          </div>
          
          {/* Huge decorative outline text in background */}
          <div className="absolute right-0 -bottom-8 font-mono font-black text-6xl md:text-8xl tracking-tighter text-neutral-900 select-none pointer-events-none opacity-20 uppercase">
            ABSTRACT
          </div>
        </div>
      </div>
    </footer>
  );
}
