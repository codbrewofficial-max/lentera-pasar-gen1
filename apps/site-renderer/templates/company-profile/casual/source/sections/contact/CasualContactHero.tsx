'use client';

import React from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';

export interface CasualContactHeroProps {
  title?: string;
  description?: string;
}

export function CasualContactHero({
  title = 'Hubungi Tim Kreatif Kami!',
  description = 'Pintu studio kami selalu terbuka lebar untuk obrolan seru. Mau tanya-tanya paket, konsultasi konsep jualanmu, atau mau sekadar curhat bisnis? Pilih metode kontak yang paling membuatmu nyaman.',
}: CasualContactHeroProps) {
  return (
    <section id="CasualContactHero" className="relative py-16 md:py-24 bg-gradient-to-b from-[#649FF6]/10 via-[#B283AF]/5 to-white overflow-hidden text-center">
      {/* Playful Floating Accents */}
      <div className="absolute top-10 left-10 text-2xl select-none rotate-12">👋</div>
      <div className="absolute top-20 right-10 text-2xl select-none -rotate-12">💬</div>
      <div className="absolute bottom-10 left-1/4 text-xl select-none animate-bounce">💌</div>
      <div className="absolute bottom-12 right-1/4 text-xl select-none">🗺️</div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#649FF6]/15 text-[#649FF6] text-xs font-bold tracking-wide uppercase">
          <MessageCircle className="w-4 h-4 text-[#649FF6]" />
          <span>SAPA KAMI HARI INI</span>
        </div>

        <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-gray-950 tracking-tight leading-tight">
          {title}
        </h1>

        <p className="font-sans text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
          {description}
        </p>

        {/* Small horizontal colored line */}
        <div className="flex justify-center gap-1.5 pt-4">
          <div className="w-12 h-2 rounded-full bg-[#649FF6]" />
          <div className="w-4 h-2 rounded-full bg-[#F56B71]" />
          <div className="w-4 h-2 rounded-full bg-[#B283AF]" />
        </div>
      </div>
    </section>
  );
}
