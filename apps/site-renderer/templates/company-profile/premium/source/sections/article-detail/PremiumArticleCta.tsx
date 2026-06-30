'use client';

import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

interface PremiumArticleCtaProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export function PremiumArticleCta({
  title = "Terinspirasi oleh Tulisan Kami?",
  description = "Tinggalkan coretan konsep mentah Anda atau jadwalkan janji pertemuan langsung di studio kami untuk menuangkan gagasan tersebut ke dalam rancangan arsitektural matang.",
  ctaLabel = "MULAI PROYEK KONSEPTUAL ANDA",
  ctaUrl = "/contact"
}: PremiumArticleCtaProps) {
  return (
    <section id="premium-article-cta" className="py-24 md:py-32 bg-[#FAF9F6] text-[#121212] relative overflow-hidden border-t border-stone-200">
      {/* Editorial aesthetic lines */}
      <div className="absolute top-0 left-20 w-[1px] h-full bg-stone-200/50" />
      <div className="absolute top-0 right-20 w-[1px] h-full bg-stone-200/50" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
        <div className="flex items-center justify-center space-x-2">
          <BookOpen className="w-4 h-4 text-[#B283AF]" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#B283AF] uppercase">KOLABORASI IDE</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-stone-900 leading-tight">
          {title}
        </h2>

        <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans font-light">
          {description}
        </p>

        <div className="pt-6">
          <a
            id="article-detail-cta-btn"
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
