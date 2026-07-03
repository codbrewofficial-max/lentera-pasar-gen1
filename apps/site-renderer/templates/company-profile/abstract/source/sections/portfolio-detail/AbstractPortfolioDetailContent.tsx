'use client';

import React from 'react';
import { defaultPortfolios, PortfolioItem } from '../../lib/dummy-data';
import { RichHtml } from '@/components/content/RichHtml';

interface AbstractPortfolioDetailContentProps {
  contentMaxWidth?: string;
  showShareHint?: string;
  project?: PortfolioItem;
}

function widthClass(value?: string) {
  const normalized = (value || '').toLowerCase();
  if (normalized.includes('2xl')) return 'max-w-2xl';
  if (normalized.includes('5xl') || normalized.includes('wide')) return 'max-w-5xl';
  return 'max-w-3xl';
}

export function AbstractPortfolioDetailContent({
  contentMaxWidth = 'max-w-3xl',
  showShareHint = 'true',
  project = defaultPortfolios[0],
}: AbstractPortfolioDetailContentProps) {
  const isShowShareHint = showShareHint === 'true';
  const width = widthClass(contentMaxWidth);

  return (
    <section className="relative bg-white text-black py-20 px-6 border-b-8 border-[#111111]">
      <div className={`${width} mx-auto`}>
        <div className="inline-block bg-black text-white font-mono text-xs font-bold px-3 py-1.5 uppercase mb-8">
          {'// DETAIL_PROYEK'}
        </div>

        <div className="font-sans text-base leading-relaxed text-neutral-800 border-l-4 border-[#F56B71] pl-6">
          <RichHtml html={project.description} emptyFallback="Cerita lengkap proyek ini akan segera hadir." />
        </div>

        {isShowShareHint && (
          <div className="mt-12 pt-6 border-t-2 border-black flex items-center gap-3 font-mono text-xs font-bold uppercase text-neutral-500">
            <span className="w-8 h-8 border-2 border-black flex items-center justify-center text-black">✦</span>
            <span>Suka karya ini? Sebarkan ke jaringanmu.</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default AbstractPortfolioDetailContent;
