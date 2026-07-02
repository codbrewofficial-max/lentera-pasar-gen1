'use client';

import React from 'react';
import { portfolioData, PortfolioItem } from '../../lib/dummy-data';

export interface CasualPortfolioDetailContentProps {
  contentMaxWidth?: string;
  showShareHint?: string;
  project?: PortfolioItem;
}

export function CasualPortfolioDetailContent({
  contentMaxWidth = 'max-w-3xl',
  showShareHint = 'true',
  project = portfolioData[0],
}: CasualPortfolioDetailContentProps) {
  const isShowShareHint = showShareHint === 'true' || showShareHint === 'Boolean(true)' || showShareHint === 'TRUE';

  return (
    <section id="CasualPortfolioDetailContent" className="py-12 bg-white">
      <div className={`${contentMaxWidth} mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className="prose prose-lg max-w-none font-sans text-gray-700 leading-relaxed whitespace-pre-line">
          {project.description || 'Cerita lengkap proyek ini akan segera hadir.'}
        </div>

        {isShowShareHint && (
          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center gap-3 text-xs font-bold text-gray-400">
            <span className="w-8 h-8 rounded-full bg-[#649FF6]/10 flex items-center justify-center text-[#649FF6]">✦</span>
            <span>Suka sama hasil kerja kami? Yuk, ceritakan ke teman-temanmu juga!</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default CasualPortfolioDetailContent;
