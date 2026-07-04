'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, MessageSquare, ArrowRight } from 'lucide-react';

export interface CasualPortfolioDetailCtaProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  imageUrl?: string;
}

export function CasualPortfolioDetailCta({
  title = 'Suka dengan Proyek Ini? Yuk, Bikin Versi Bisnismu!',
  description = 'Setiap proyek punya cerita unik seperti ini. Ceritakan kebutuhanmu, kita rancang solusi yang paling pas buat bisnismu.',
  ctaLabel = 'Mulai Obrolan Santai',
  ctaUrl = 'https://wa.me/628123456789',
  imageUrl,
}: CasualPortfolioDetailCtaProps) {
  return (
    <section id="CasualPortfolioDetailCta" className="py-16 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-10 w-64 h-64 rounded-full bg-[#649FF6]/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-tr from-[#649FF6]/10 via-[#B283AF]/10 to-[#F56B71]/15 rounded-[40px] p-8 md:p-12 text-center border-2 border-white shadow-xl relative overflow-hidden">
                    {imageUrl && (
            <div className="absolute inset-0">
              <img src={imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gray-950/70" />
            </div>
          )}
          <div className="relative z-10">
<div className="max-w-2xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-gray-800 text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#F56B71] fill-[#F56B71]" />
              <span>SIAP JADI PROYEK BERIKUTNYA</span>
            </div>

            <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-gray-950 leading-tight">
              {title}
            </h3>

            <p className="font-sans text-xs sm:text-sm text-gray-700 leading-relaxed">
              {description}
            </p>

            <div className="pt-3 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                id="portfolio-detail-cta-whatsapp-btn"
                href={ctaUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F56B71] text-white px-7 py-3.5 rounded-full text-sm font-bold shadow-md hover:bg-[#F56B71]/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-white/10" />
                <span>{ctaLabel}</span>
              </a>

              <Link
                id="portfolio-detail-cta-contact-btn"
                href="/contact"
                className="inline-flex items-center gap-1.5 text-gray-800 hover:text-gray-950 font-bold text-xs py-2 px-4 transition-all hover:translate-x-1"
              >
                <span>Atau Kirim Email</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

export default CasualPortfolioDetailCta;
