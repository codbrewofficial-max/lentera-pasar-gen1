'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface PremiumHomeCtaContactProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  imageUrl?: string;
  email?: string;
  whatsapp?: string;
}

export function PremiumHomeCtaContact({
  title = "Mari Diskusikan Mahakarya Anda",
  description = "Kami mengundang Anda untuk berkunjung ke studio kami di Kebayoran Baru atau menjadwalkan panggilan pribadi jarak jauh bersama Principal Architect kami.",
  ctaLabel = "JADWALKAN KONSULTASI PRIVAT",
  ctaUrl = "/contact",
  imageUrl,
  email,
  whatsapp,
}: PremiumHomeCtaContactProps) {
  return (
    <section id="premium-home-cta-contact" className="py-24 md:py-32 bg-[#FAF9F6] text-[#121212] relative overflow-hidden">
      {imageUrl && (
        <div className="absolute inset-0">
          <img src={imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-stone-950/80" />
        </div>
      )}
      {/* Delicate line decorations */}
      <div className="absolute top-0 left-10 w-[1px] h-full bg-stone-200/50" />
      <div className="absolute top-0 right-10 w-[1px] h-full bg-stone-200/50" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#B283AF]" />
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#B283AF] uppercase">MULAI DIALOG</span>
        </div>

        <h2 className={`text-3xl md:text-5xl font-serif font-light tracking-tight ${imageUrl ? 'text-white' : 'text-stone-900'} leading-tight`}>
          {title}
        </h2>

        <p className={`text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-sans font-light ${imageUrl ? "text-stone-200" : "text-stone-600"}`}>
          {description}
        </p>

        <div className="pt-6">
          <a
            id="home-cta-contact-button"
            href={ctaUrl}
            className="group relative inline-flex items-center justify-between text-xs font-semibold tracking-[0.25em] uppercase px-10 py-5 bg-[#0E0E0F] text-white hover:bg-[#649FF6] transition-all shadow-xl"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-4 h-4 ml-4 text-[#F56B71] group-hover:translate-x-1.5 transition-transform" />
          </a>
        </div>

        {(email || whatsapp) && (
          <div className="pt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] tracking-widest text-stone-400 uppercase font-mono">
            {email && <span>EMAIL: {email}</span>}
            {email && whatsapp && <span>•</span>}
            {whatsapp && <span>WHATSAPP: {whatsapp}</span>}
          </div>
        )}
      </div>
    </section>
  );
}
