'use client';

import React from 'react';

interface PremiumArticlesHeroProps {
  title?: string;
  description?: string;
  badge?: string;
  imageUrl?: string;
}

export function PremiumArticlesHero({
  title = "Jurnal & Wawasan Spasial",
  description = "Tinjauan berkala dari meja redaksi Niskala mengenai filsafat arsitektur modern tropis, riset kebertahanan material, wawasan hukum properti warisan, serta tren investasi butik."
  , badge, imageUrl
}: PremiumArticlesHeroProps) {
  return imageUrl ? (
    <section id="premium-articles-hero" className="relative py-24 md:py-32 overflow-hidden text-center text-white">
      <div className="absolute inset-0">
        <img src={imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/70 to-stone-950/85" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-6">
        <span className="text-[10px] font-bold tracking-[0.3em] text-[#B283AF] uppercase block">{badge || 'NISKALA JOURNAL'}</span>
        <h1 className="text-4xl md:text-6xl font-serif font-light tracking-tight max-w-4xl mx-auto leading-tight">
          {title}
        </h1>
        <div className="w-16 h-[1px] bg-gradient-to-r from-[#649FF6] via-[#B283AF] to-[#F56B71] mx-auto" />
        <p className="text-stone-200 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans font-light">
          {description}
        </p>
      </div>
    </section>
  ) : (
    <section id="premium-articles-hero" className="py-24 md:py-32 bg-[#FAF9F6] text-[#121212] relative overflow-hidden">
      {/* Editorial grid design background */}
      <div className="absolute top-0 left-16 w-[1px] h-full bg-stone-200/40" />
      <div className="absolute top-0 right-16 w-[1px] h-full bg-stone-200/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-6">
        <span className="text-[10px] font-bold tracking-[0.3em] text-[#B283AF] uppercase block">NISKALA JOURNAL</span>
        <h1 className="text-4xl md:text-6xl font-serif font-light tracking-tight text-stone-900 max-w-4xl mx-auto leading-tight">
          {title}
        </h1>
        <div className="w-16 h-[1px] bg-gradient-to-r from-[#649FF6] via-[#B283AF] to-[#F56B71] mx-auto" />
        <p className="text-stone-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans font-light">
          {description}
        </p>
      </div>
    </section>
  );
}
