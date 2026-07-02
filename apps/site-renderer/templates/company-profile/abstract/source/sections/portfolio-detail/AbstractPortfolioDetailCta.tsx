'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

interface AbstractPortfolioDetailCtaProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export function AbstractPortfolioDetailCta({
  title = 'Ingin Brand Anda Menjadi Karya Selanjutnya?',
  description = 'Setiap proyek dimulai dari satu percakapan berani. Ceritakan visi Anda dan mari kita dobrak kenyamanan visual pasar bersama.',
  ctaLabel = 'AJUKAN PROYEK KOLABORASI',
  ctaUrl = '/contact',
}: AbstractPortfolioDetailCtaProps) {
  return (
    <section className="relative bg-[#B283AF] text-black py-20 px-6 border-b-8 border-white overflow-hidden">
      <div className="absolute left-0 bottom-0 w-64 h-64 bg-[#649FF6] -ml-20 -mb-20 transform -rotate-12" />
      <div className="absolute right-1/4 top-0 w-1 bg-black h-full transform -skew-x-12 opacity-10" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-block bg-black text-white font-mono text-xs font-bold tracking-widest px-3 py-1 mb-2">
              {'// PROYEK_BERIKUTNYA'}
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black uppercase tracking-tight leading-tight">
              {title}
            </h2>

            <p className="text-black/85 font-sans text-base sm:text-lg leading-relaxed max-w-2xl border-l-4 border-black pl-4">
              {description}
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <Link href={ctaUrl} className="group relative inline-block w-full sm:w-auto">
              <div className="absolute inset-0 bg-black transform translate-x-2.5 translate-y-2.5 transition-transform duration-200" />
              <div className="absolute inset-0 bg-[#F56B71] transform -translate-x-1 -translate-y-1 transition-transform duration-200 group-hover:-translate-x-2 group-hover:-translate-y-2" />

              <button className="relative w-full bg-white text-black border-2 border-black font-mono font-bold text-xs tracking-widest py-5 px-8 flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-colors">
                <span>{ctaLabel.toUpperCase()}</span>
                <Sparkles className="w-4 h-4 text-[#649FF6]" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AbstractPortfolioDetailCta;
