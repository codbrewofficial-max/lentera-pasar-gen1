'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface PremiumContactCtaProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export function PremiumContactCta({
  title = "Mari Memulai Langkah Pertama",
  description = "Tinggalkan keraguan Anda. Dedikasi kami adalah memastikan setiap goresan konsep bertransformasi menjadi karya seni fisik yang fungsional dan bernilai investasi tinggi.",
  ctaLabel = "MULAI CHAT WHATSAPP SEKARANG",
  ctaUrl = "https://wa.me/628119009900"
}: PremiumContactCtaProps) {
  return (
    <section id="premium-contact-cta" className="py-24 md:py-32 bg-[#0E0E0F] text-white relative overflow-hidden">
      {/* Delicate background blur shapes */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-[#F56B71]/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#649FF6]" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#649FF6] uppercase">KOLABORASI SEKARANG</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-white leading-tight">
          {title}
        </h2>

        <p className="text-stone-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans font-light">
          {description}
        </p>

        <div className="pt-6">
          <a
            id="contact-cta-btn"
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-between text-xs font-semibold tracking-[0.25em] uppercase px-10 py-5 bg-gradient-to-r from-[#649FF6] via-[#B283AF] to-[#F56B71] text-white hover:opacity-95 transition-all shadow-2xl"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-4 h-4 ml-4 text-white group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
