'use client';

import React from 'react';
import { ArrowRight, MessageSquare, Sparkles } from 'lucide-react';

export interface CasualContactCtaProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export function CasualContactCta({
  title = 'Sudah Mantap untuk Memulai Langkah Pertamamu?',
  description = 'Mumpung slot project kreatif bulan depan masih tersedia beberapa, yuk sapa kami sekarang juga sebelum kehabisan antrean! Tim kreatif desainer kami siap menyambutmu.',
  ctaLabel = 'Hubungi WhatsApp Sekarang',
  ctaUrl = 'https://wa.me/628123456789',
}: CasualContactCtaProps) {
  return (
    <section id="CasualContactCta" className="py-20 bg-white relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 w-80 h-80 rounded-full bg-[#649FF6]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-[#B283AF]/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Playful Box Card */}
        <div className="bg-gradient-to-tr from-[#649FF6]/10 via-[#B283AF]/15 to-[#F56B71]/10 rounded-[48px] p-8 md:p-14 text-center border-2 border-white shadow-xl relative overflow-hidden">
          
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-gray-800 text-xs font-bold shadow-sm font-sans">
              <Sparkles className="w-3.5 h-3.5 text-[#F56B71] fill-[#F56B71]" />
              <span>MARI AMBIL SLOT-MU</span>
            </div>

            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-950 tracking-tight leading-tight">
              {title}
            </h2>

            <p className="font-sans text-sm sm:text-base text-gray-700 leading-relaxed">
              {description}
            </p>

            <div className="pt-4 flex justify-center items-center">
              <a
                id="contact-cta-whatsapp-link"
                href={ctaUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 bg-[#F56B71] text-white px-8 py-4 rounded-full text-base font-bold shadow-lg shadow-[#F56B71]/20 hover:bg-[#F56B71]/90 hover:scale-[1.03] active:scale-[0.98] transition-all"
              >
                <MessageSquare className="w-5 h-5 fill-white/10" />
                <span>{ctaLabel}</span>
              </a>
            </div>

            <span className="text-[10px] text-gray-400 block font-mono">
              *TIDAK ADA BIAYA TERSEMBUNYI • DISKUSI GRATIS • KHUSUS UMKM LOKAL
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
