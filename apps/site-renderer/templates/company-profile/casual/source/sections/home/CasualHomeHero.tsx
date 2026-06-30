'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star } from 'lucide-react';

export interface CasualHomeHeroProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  imageUrl?: string;
}

export function CasualHomeHero({
  eyebrow = '✨ KREATIF & DEKAT DI HATI',
  title = 'Bikin Wajah Brand UMKM Kamu Lebih Ceria & Profesional!',
  subtitle = 'Ruang Karsa membantu studio kreatif, kedai kopi, katering kuliner, dan usaha kecil menengah lainnya tampil menawan dengan desain identitas brand, kelola sosial media, serta website builder modern.',
  ctaLabel = 'Mulai Konsultasi',
  ctaUrl = '/contact',
  secondaryCtaLabel = 'Lihat Portofolio',
  secondaryCtaUrl = '/portfolio',
  imageUrl = 'https://picsum.photos/seed/hero/800/600',
}: CasualHomeHeroProps) {
  return (
    <section id="CasualHomeHero" className="relative py-16 md:py-24 bg-gradient-to-b from-[#649FF6]/10 via-[#B283AF]/5 to-transparent overflow-hidden">
      {/* Decorative organic blob shapes */}
      <div className="absolute top-1/4 left-10 w-24 h-24 rounded-full bg-[#649FF6]/20 blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-32 h-32 rounded-full bg-[#F56B71]/15 blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-[#B283AF]/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text content col */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#649FF6]/15 text-[#649FF6] text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 fill-[#649FF6]" />
              <span>{eyebrow}</span>
            </div>

            <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-gray-950 tracking-tight leading-tight">
              {title}
            </h1>

            <p className="font-sans text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Link
                id="hero-primary-cta"
                href={ctaUrl}
                className="inline-flex items-center justify-center gap-2 bg-[#F56B71] text-white px-8 py-4 rounded-full text-base font-bold shadow-lg shadow-[#F56B71]/20 hover:bg-[#F56B71]/90 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                id="hero-secondary-cta"
                href={secondaryCtaUrl}
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-800 border-2 border-gray-150 px-8 py-4 rounded-full text-base font-bold shadow-sm hover:bg-gray-50 hover:text-gray-950 active:scale-[0.98] transition-all duration-200"
              >
                <span>{secondaryCtaLabel}</span>
              </Link>
            </div>

            {/* Social Trust Proofs inside Hero */}
            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-500">
              <div className="flex items-center -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://picsum.photos/seed/u1/100/100" alt="Client Avatar" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://picsum.photos/seed/u2/100/100" alt="Client Avatar" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://picsum.photos/seed/u3/100/100" alt="Client Avatar" />
              </div>
              <div className="flex flex-col items-center lg:items-start leading-none">
                <div className="flex items-center text-amber-400 gap-0.5">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-gray-900 font-bold ml-1">4.9/5</span>
                </div>
                <span className="text-xs text-gray-500 mt-1">Dipercaya 200+ Pemilik Usaha Lokal</span>
              </div>
            </div>
          </div>

          {/* Image col */}
          <div className="lg:col-span-5 flex justify-center relative">
            {/* Visual background decorations for image */}
            <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-tr from-[#649FF6] to-[#B283AF] opacity-10 blur-xl pointer-events-none" />
            <div className="absolute -top-3 -left-3 w-12 h-12 bg-[#F56B71] rounded-2xl flex items-center justify-center text-white font-bold text-lg rotate-12 shadow-lg">
              ✨
            </div>
            <div className="absolute -bottom-4 -right-2 bg-white px-4 py-2.5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2 animate-bounce duration-[4000ms]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-gray-800">100% Produk Kreatif Lokal</span>
            </div>

            {/* Main Image */}
            <div className="w-full max-w-md aspect-[4/3] sm:aspect-square md:aspect-[4/3] rounded-[36px] overflow-hidden border-8 border-white shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500 bg-gray-100">
              <img
                src={imageUrl}
                alt="Ruang Karsa Kreatif UMKM"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
