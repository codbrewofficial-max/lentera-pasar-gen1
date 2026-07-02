'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export interface PremiumPortfolioDetailCtaProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export function PremiumPortfolioDetailCta({
  title = 'Terinspirasi oleh Karya Ini?',
  description = 'Jadwalkan konsultasi privat dengan tim kami untuk mendiskusikan visi Anda dan mewujudkannya menjadi karya dengan standar kualitas yang sama.',
  ctaLabel = 'Jadwalkan Konsultasi Privat',
  ctaUrl = '/contact',
}: PremiumPortfolioDetailCtaProps) {
  return (
    <section id="premium-portfolio-detail-cta" className="py-24 md:py-32 bg-[#FAF9F6] text-[#121212] relative overflow-hidden border-t border-stone-200">
      <div className="absolute top-0 left-20 w-[1px] h-full bg-stone-200/50 hidden lg:block" />
      <div className="absolute top-0 right-20 w-[1px] h-full bg-stone-200/50 hidden lg:block" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#B283AF]" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#B283AF] uppercase">Wujudkan Visi Anda</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-stone-900 leading-tight">
          {title}
        </h2>

        <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans font-light">
          {description}
        </p>

        <div className="pt-6">
          <a
            id="portfolio-detail-cta-btn"
            href={ctaUrl}
            className="group relative inline-flex items-center justify-between text-xs font-semibold tracking-[0.25em] uppercase px-10 py-5 bg-[#0E0E0F] text-white hover:bg-[#649FF6] transition-colors shadow-2xl"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-4 h-4 ml-4 text-white group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default PremiumPortfolioDetailCta;
