'use client';

import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { defaultPortfolios, PortfolioItem } from '../../lib/dummy-data';

export interface PremiumPortfolioDetailHeroProps {
  showCoverImage?: string;
  badge?: string;
  project?: PortfolioItem;
}

export function PremiumPortfolioDetailHero({
  showCoverImage = 'true',
  badge = 'Studi Kasus',
  project = defaultPortfolios[0],
}: PremiumPortfolioDetailHeroProps) {
  const isShowCoverImage = showCoverImage === 'true' || showCoverImage === 'Boolean(true)' || showCoverImage === 'TRUE';

  return (
    <section id="premium-portfolio-detail-hero" className="pt-16 pb-20 md:pt-24 md:pb-28 bg-[#0E0E0F] text-white relative overflow-hidden">
      {/* Editorial aesthetic lines */}
      <div className="absolute top-0 left-20 w-[1px] h-full bg-white/5 hidden lg:block" />
      <div className="absolute top-0 right-20 w-[1px] h-full bg-white/5 hidden lg:block" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <a
          id="back-to-portfolio-link"
          href="/portfolio"
          className="inline-flex items-center space-x-2 text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400 hover:text-[#649FF6] transition-colors mb-10 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Portofolio</span>
        </a>

        <div className="flex items-center space-x-2 mb-6">
          <Sparkles className="w-4 h-4 text-[#B283AF]" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#B283AF] uppercase">{badge}</span>
          {project.category && (
            <>
              <span className="text-stone-600">/</span>
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#649FF6] uppercase">{project.category}</span>
            </>
          )}
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light tracking-tight text-white leading-tight max-w-3xl">
          {project.title}
        </h1>

        {project.description && (
          <p className="mt-6 text-stone-400 text-sm md:text-base leading-relaxed max-w-2xl font-sans font-light">
            {project.description}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 pt-6 border-t border-white/5">
          <div>
            <span className="text-[9px] text-stone-500 block uppercase tracking-wider font-sans">Klien</span>
            <span className="text-xs text-stone-300 font-serif font-light">{project.client}</span>
          </div>
          <div>
            <span className="text-[9px] text-stone-500 block uppercase tracking-wider font-sans">Tahun</span>
            <span className="text-xs text-stone-300 font-serif font-light">{project.year}</span>
          </div>
          {project.location && (
            <div>
              <span className="text-[9px] text-stone-500 block uppercase tracking-wider font-sans">Lokasi</span>
              <span className="text-xs text-stone-300 font-serif font-light">{project.location}</span>
            </div>
          )}
        </div>

        {isShowCoverImage && project.imageUrl && (
          <div className="mt-12 aspect-[16/9] w-full bg-stone-900 overflow-hidden">
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}

export default PremiumPortfolioDetailHero;
