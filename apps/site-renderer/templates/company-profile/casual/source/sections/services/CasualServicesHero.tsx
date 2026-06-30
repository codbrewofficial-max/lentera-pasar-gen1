'use client';

import React from 'react';
import { Sparkles, Stars } from 'lucide-react';

export interface CasualServicesHeroProps {
  title?: string;
  description?: string;
}

export function CasualServicesHero({
  title = 'Layanan Desain & Konten Tanpa Ribet!',
  description = 'Kami hadir untuk membantu mencerahkan visual bisnis lokal Indonesia. Pilih paket solusi yang kamu butuhkan, mulai dari identitas brand yang memikat, optimasi sosial media, foto katalog estetik, hingga pembuatan website jualan yang gercep.',
}: CasualServicesHeroProps) {
  return (
    <section id="CasualServicesHero" className="relative py-16 md:py-24 bg-gradient-to-b from-[#B283AF]/10 via-[#649FF6]/5 to-white overflow-hidden text-center">
      {/* Playful elements floating */}
      <div className="absolute top-12 left-12 text-3xl select-none rotate-[10deg] animate-pulse">✨</div>
      <div className="absolute top-24 right-16 text-3xl select-none rotate-[-15deg] animate-pulse duration-[3000ms]">🎨</div>
      <div className="absolute bottom-12 left-1/4 text-2xl select-none animate-bounce">☕</div>
      <div className="absolute bottom-16 right-1/4 text-2xl select-none">📈</div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#B283AF]/15 text-[#B283AF] text-xs font-bold tracking-wide uppercase">
          <Stars className="w-4 h-4 fill-[#B283AF]" />
          <span>SOLUSI KREATIF UMKM</span>
        </div>

        <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl text-gray-950 tracking-tight leading-tight">
          {title}
        </h1>

        <p className="font-sans text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
          {description}
        </p>

        {/* Small organic separator line */}
        <div className="flex justify-center gap-1.5 pt-4">
          <div className="w-12 h-2 rounded-full bg-[#649FF6]" />
          <div className="w-4 h-2 rounded-full bg-[#F56B71]" />
          <div className="w-4 h-2 rounded-full bg-[#B283AF]" />
        </div>
      </div>
    </section>
  );
}
