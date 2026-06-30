'use client';

import React from 'react';

interface PremiumPortfolioHeroProps {
  title?: string;
  description?: string;
}

export function PremiumPortfolioHero({
  title = "Galeri Karya & Landmark Keindahan",
  description = "Eksplorasi antologi karya kami yang melintasi berbagai wilayah di Indonesia. Setiap struktur mengekspresikan karakter luhur material lokal, sirkulasi iklim tropis pasif, serta kemewahan tata spasial minimalis."
}: PremiumPortfolioHeroProps) {
  return (
    <section id="premium-portfolio-hero" className="py-24 md:py-32 bg-[#FAF9F6] text-[#121212] relative overflow-hidden">
      {/* Structural background lines */}
      <div className="absolute top-0 left-12 w-[1px] h-full bg-stone-200/40" />
      <div className="absolute top-0 right-12 w-[1px] h-full bg-stone-200/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-6">
        <span className="text-[10px] font-bold tracking-[0.3em] text-[#B283AF] uppercase block">GALLERY SHOWCASE</span>
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
