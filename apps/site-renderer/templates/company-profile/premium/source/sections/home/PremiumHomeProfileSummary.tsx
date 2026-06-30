'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PremiumHomeProfileSummaryProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  imageUrl?: string;
}

export function PremiumHomeProfileSummary({
  title = "Filosofi Desain Niskala",
  description = "Di Niskala Atelier, kami tidak sekadar menumpuk batu atau mendirikan pilar beton. Kami meneliti iklim tropis Indonesia, menelusuri alur angin natural, dan mengawinkan kemajuan sains konstruksi modern dengan kebijaksanaan lokal.\n\nSetiap garis yang kami goreskan di atas kertas cetak biru dirancang untuk mengoptimalkan kenyamanan batin penghuninya. Kami percaya bahwa hunian adalah tempat berlindung spiritual yang agung, sebuah perpanjangan dari kepribadian sejati Anda yang tidak lekang oleh pergantian zaman.",
  ctaLabel = "PELAJARI METODOLOGI KAMI",
  ctaUrl = "/about",
  imageUrl = "https://picsum.photos/seed/philosophy/800/1000"
}: PremiumHomeProfileSummaryProps) {
  return (
    <section id="premium-home-profile-summary" className="py-24 md:py-32 bg-[#FAF9F6] text-[#121212] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Side: Elegant Vertical Layout with Image & Hairline Frame */}
        <div className="lg:col-span-5 relative">
          <div className="absolute -top-4 -left-4 w-full h-full border border-stone-200 pointer-events-none z-0" />
          <div className="relative z-10 bg-stone-100 overflow-hidden shadow-xl aspect-[4/5]">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 hover:scale-105 transition-all duration-700"
            />
          </div>
          {/* Accent Badge */}
          <div className="absolute -bottom-6 -right-6 z-20 bg-[#0E0E0F] text-white p-6 shadow-2xl max-w-xs hidden sm:block">
            <span className="text-[9px] tracking-[0.3em] uppercase block text-stone-400 mb-1">FOUNDER & PRINCIPAL</span>
            <span className="text-sm font-serif tracking-wide block">Bramastra Niskala</span>
            <span className="text-[10px] text-[#649FF6] tracking-widest uppercase mt-2 block">&quot;Kejujuran Material&quot;</span>
          </div>
        </div>

        {/* Right Side: Philosophy Content */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center space-x-2">
            <span className="h-[1px] w-8 bg-[#B283AF]" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#B283AF] uppercase">LATAR BELAKANG</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-stone-900 leading-tight">
            {title}
          </h2>

          <div className="text-stone-600 text-sm md:text-base leading-relaxed space-y-4 font-sans font-light whitespace-pre-line">
            {description}
          </div>

          <div className="pt-4">
            <a
              id="profile-summary-cta"
              href={ctaUrl}
              className="group inline-flex items-center space-x-3 text-xs font-semibold tracking-[0.25em] text-stone-900 hover:text-[#649FF6] transition-colors py-2 border-b border-stone-300 hover:border-[#649FF6]"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#F56B71]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
