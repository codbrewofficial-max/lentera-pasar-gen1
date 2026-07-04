'use client';

import React from 'react';
import { Star, Sparkles } from 'lucide-react';

export interface CasualPortfolioHeroProps {
  title?: string;
  description?: string;
  badge?: string;
  imageUrl?: string;
}

export function CasualPortfolioHero({
  title = 'Galeri Karya & Kolaborasi Seru',
  description = 'Lihat bagaimana kami berkolaborasi dengan ratusan pemilik usaha lokal untuk menyulap identitas visual mereka menjadi ramah, estetik, dan digemari pembeli. Tiap karya adalah perpaduan rasa cinta dan komitmen.',
  badge,
  imageUrl,
}: CasualPortfolioHeroProps) {
  return imageUrl ? (
    <section id="CasualPortfolioHero" className="relative py-16 md:py-24 overflow-hidden text-center text-white">
      <div className="absolute inset-0">
        <img src={imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/70 to-gray-950/90" />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold tracking-wide uppercase backdrop-blur-sm">
          <Sparkles className="w-4 h-4" style={{ color: '#F56B71' }} />
          <span>{badge || 'PORTOFOLIO SUKSES UMKM'}</span>
        </div>

        <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
          {title}
        </h1>

        <p className="font-sans text-base sm:text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto">
          {description}
        </p>
      </div>
    </section>
  ) : (
    <section id="CasualPortfolioHero" className="relative py-16 md:py-24 bg-gradient-to-b from-[#F56B71]/10 via-[#B283AF]/5 to-white overflow-hidden text-center">
      {/* Playful Floating Badges */}
      <div className="absolute top-10 left-10 text-2xl select-none rotate-12">⭐</div>
      <div className="absolute top-20 right-10 text-2xl select-none -rotate-12">🎨</div>
      <div className="absolute bottom-10 left-1/3 text-xl select-none animate-bounce">🍪</div>
      <div className="absolute bottom-12 right-1/3 text-xl select-none">📷</div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F56B71]/15 text-[#F56B71] text-xs font-bold tracking-wide uppercase">
          <Sparkles className="w-4 h-4 fill-[#F56B71]" />
          <span>PORTOFOLIO SUKSES UMKM</span>
        </div>

        <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-gray-950 tracking-tight leading-tight">
          {title}
        </h1>

        <p className="font-sans text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
          {description}
        </p>

        {/* Dynamic visual metric bar */}
        <div className="flex flex-wrap justify-center items-center gap-6 pt-4 text-xs font-mono font-bold text-gray-500 uppercase">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#649FF6]" /> Brand Identity</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#F56B71]" /> Social Content</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#B283AF]" /> Website Design</span>
        </div>
      </div>
    </section>
  );
}
