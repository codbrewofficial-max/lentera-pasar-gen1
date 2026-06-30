'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Send } from 'lucide-react';

interface AbstractHomeCtaContactProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export function AbstractHomeCtaContact({
  title = "Mari Bangun Sesuatu Yang Mengejutkan Pasar Bersama-sama",
  description = "Punya ide gila, brand yang butuh dekonstruksi total, atau proyek ambisius yang ingin Anda hidupkan? Studio Sinestesia siap membantu mewujudkannya dengan estetika visual terbaik.",
  ctaLabel = "MULAI KONEKSI SEKARANG",
  ctaUrl = "/contact"
}: AbstractHomeCtaContactProps) {
  return (
    <section className="relative bg-[#F56B71] text-black py-20 px-6 border-b-8 border-white overflow-hidden">
      {/* Decorative abstract elements */}
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-[#B283AF] -mr-20 -mb-20 transform rotate-12" />
      <div className="absolute left-1/4 top-0 w-1 bg-black h-full transform skew-x-12 opacity-10" />
      <div className="absolute left-1/4 top-0 w-3 bg-black h-full transform -skew-x-6 translate-x-10 opacity-5" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content Area (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-block bg-black text-white font-mono text-xs font-bold tracking-widest px-3 py-1 mb-2">
              {"// LET'S COLLABORATE"}
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black tracking-tight leading-tight uppercase">
              {title}
            </h2>
            
            <p className="text-black/80 font-sans text-base sm:text-lg leading-relaxed max-w-2xl border-l-4 border-black pl-4">
              {description}
            </p>
          </div>

          {/* Dynamic Button Area (4 cols) */}
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <Link href={ctaUrl} className="group relative inline-block w-full sm:w-auto">
              {/* Back shadows */}
              <div className="absolute inset-0 bg-black transform translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-200" />
              <div className="absolute inset-0 bg-[#649FF6] transform -translate-x-1 -translate-y-1 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-200" />
              
              <button className="relative w-full bg-white text-black border-2 border-black font-mono font-bold text-xs tracking-widest py-5 px-8 flex items-center justify-center gap-3 transition-colors hover:bg-black hover:text-white">
                <span>{ctaLabel.toUpperCase()}</span>
                <Send className="w-4 h-4 shrink-0" />
              </button>
            </Link>
          </div>
          
        </div>
      </div>
    </section>
  );
}
