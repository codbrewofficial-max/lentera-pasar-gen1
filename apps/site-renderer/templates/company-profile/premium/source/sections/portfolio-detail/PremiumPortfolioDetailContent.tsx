'use client';

import React from 'react';
import { defaultPortfolios, PortfolioItem } from '../../lib/dummy-data';

export interface PremiumPortfolioDetailContentProps {
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

export function PremiumPortfolioDetailContent({
  contentMaxWidth = 'max-w-3xl',
  showShareHint = 'true',
  project = defaultPortfolios[0],
}: PremiumPortfolioDetailContentProps) {
  const isShowShareHint = showShareHint === 'true' || showShareHint === 'Boolean(true)' || showShareHint === 'TRUE';
  const width = widthClass(contentMaxWidth);

  return (
    <section id="premium-portfolio-detail-content" className="py-20 md:py-28 bg-[#FAF9F6] text-[#121212] border-t border-stone-200">
      <div className={`${width} mx-auto px-6`}>
        {Array.isArray(project.tags) && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold tracking-widest uppercase text-stone-500 border border-stone-300 px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="prose prose-stone max-w-none font-sans font-light text-stone-700 leading-relaxed whitespace-pre-line text-sm md:text-base">
          {project.description || 'Cerita lengkap proyek ini akan segera hadir.'}
        </div>

        {isShowShareHint && (
          <div className="mt-12 pt-6 border-t border-stone-200 text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400">
            Karya ini bagian dari koleksi eksklusif kami
          </div>
        )}
      </div>
    </section>
  );
}

export default PremiumPortfolioDetailContent;
