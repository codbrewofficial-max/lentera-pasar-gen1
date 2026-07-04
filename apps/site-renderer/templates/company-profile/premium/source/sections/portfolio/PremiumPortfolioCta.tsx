'use client';

import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

interface PremiumPortfolioCtaProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  imageUrl?: string;
}

export function PremiumPortfolioCta({
  title = "Ingin Melihat Cetak Biru Lengkap?",
  description = "Kami mengundang calon klien terhormat untuk berkunjung ke studio kami demi mempelajari portofolio teknis mendalam, contoh material taktil, dan studi maket fisik proyek kami.",
  ctaLabel = "MINTA SALINAN PORTOFOLIO CETAK",
  ctaUrl = "/contact",
  imageUrl
}: PremiumPortfolioCtaProps) {
  return (
    <section id="premium-portfolio-cta" className="py-24 md:py-32 bg-[#0E0E0F] text-white relative overflow-hidden">
      {imageUrl && (
        <div className="absolute inset-0">
          <img src={imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-stone-950/80" />
        </div>
      )}
      {/* Absolute colored accent glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#649FF6]/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
        <div className="flex items-center justify-center space-x-2">
          <BookOpen className="w-4 h-4 text-[#B283AF]" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#B283AF] uppercase">KONSULTASI DESAIN</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-white leading-tight">
          {title}
        </h2>

        <p className="text-stone-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans font-light">
          {description}
        </p>

        <div className="pt-6">
          <a
            id="portfolio-cta-btn"
            href={ctaUrl}
            className="group relative inline-flex items-center justify-between text-xs font-semibold tracking-[0.25em] uppercase px-10 py-5 bg-gradient-to-r from-[#649FF6] via-[#B283AF] to-[#F56B71] text-white hover:opacity-95 transition-all shadow-xl"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-4 h-4 ml-4 text-white group-hover:translate-x-1.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
