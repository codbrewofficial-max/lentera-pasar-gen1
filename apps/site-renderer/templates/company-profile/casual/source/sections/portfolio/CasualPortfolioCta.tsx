'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MessageSquare, Sparkles } from 'lucide-react';

export interface CasualPortfolioCtaProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  imageUrl?: string;
}

export function CasualPortfolioCta({
  title = 'Mau Giliran Bisnismu Masuk Galeri Sukses Ini?',
  description = 'Tidak usah minder karena merasa usahamu masih kecil atau rumahan. Kami mendesain khusus untuk menaikkan kelas UMKM lokal dengan budget bersahabat. Yuk, ambil langkah pertamamu hari ini!',
  ctaLabel = 'Mulai Sesi Curhat (Gratis)',
  ctaUrl = 'https://wa.me/628123456789',
  imageUrl,
}: CasualPortfolioCtaProps) {
  return (
    <section id="CasualPortfolioCta" className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 left-10 w-80 h-80 rounded-full bg-[#B283AF]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-[#649FF6]/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Container box */}
        <div className="bg-gradient-to-tr from-[#649FF6] via-[#B283AF] to-[#F56B71] rounded-[48px] p-8 md:p-14 text-center text-white shadow-xl relative overflow-hidden">
          
                    
          {imageUrl && (
          
            <div className="absolute inset-0">
          
              <img src={imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          
              <div className="absolute inset-0 bg-gray-950/70" />
          
            </div>
          
          )}
          
          <div className="relative z-10">
{/* Sparkly overlay */}
          <div className="absolute top-4 left-6 text-2xl select-none rotate-12">✨</div>
          <div className="absolute bottom-4 right-6 text-2xl select-none -rotate-12">☕</div>

          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold font-sans">
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>MARI BERKOLABORASI</span>
            </div>

            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              {title}
            </h2>

            <p className="font-sans text-sm sm:text-base text-white/90 leading-relaxed">
              {description}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                id="portfolio-cta-primary-btn"
                href={ctaUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-gray-900 px-8 py-4 rounded-full text-base font-bold shadow-lg hover:bg-gray-100 hover:scale-[1.03] active:scale-[0.98] transition-all"
              >
                <MessageSquare className="w-5 h-5 text-[#F56B71] fill-[#F56B71]/10" />
                <span>{ctaLabel}</span>
              </a>

              <Link
                id="portfolio-cta-contact"
                href="/contact"
                className="inline-flex items-center gap-1.5 text-white hover:text-white/80 font-extrabold text-sm py-2 px-4 transition-all hover:translate-x-1"
              >
                <span>Atau Isi Formulir Kontak</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <span className="text-[10px] text-white/60 block font-mono">
              SUDAH SELESAI? HUBUNGI SEKARANG UNTUK BOOKING SESI JULI-AGUSTUS 2026
            </span>
          </div>

        </div>

        </div>

      </div>
    </section>
  );
}
