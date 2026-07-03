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
  title = 'Ingin brand Anda jadi karya kami selanjutnya?',
  description = 'Setiap proyek dimulai dari satu percakapan. Ceritakan visi Anda dan mari kita wujudkan bersama.',
  ctaLabel = 'Ajukan proyek kolaborasi',
  ctaUrl = '/contact',
}: AbstractPortfolioDetailCtaProps) {
  return (
    <section className="relative bg-gradient-to-br from-[#B283AF] via-[#649FF6] to-[#F56B71] text-white py-20 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20">
              <span className="font-mono text-xs lowercase tracking-wide text-white">proyek berikutnya</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-tight">
              {title}
            </h2>

            <p className="text-white/85 font-sans text-base sm:text-lg leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <Link
              href={ctaUrl}
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-full bg-white text-neutral-900 font-sans font-bold text-sm hover:bg-neutral-100 transition-colors"
            >
              <span>{ctaLabel}</span>
              <Sparkles className="w-4 h-4 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AbstractPortfolioDetailCta;
