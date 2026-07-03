'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
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
    <section className="relative bg-white text-neutral-900 py-20 px-6">
      <div className={`${width} mx-auto`}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#649FF6]/10 mb-8">
          <span className="font-mono text-xs lowercase tracking-wide text-[#649FF6]">detail proyek</span>
        </div>

        <div className="font-sans text-base leading-relaxed text-neutral-600">
          <RichHtml html={project.description} emptyFallback="Cerita lengkap proyek ini akan segera hadir." />
        </div>

        {isShowShareHint && (
          <div className="mt-12 pt-6 border-t border-neutral-100 flex items-center gap-3 font-sans text-xs font-medium text-neutral-400">
            <span className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-[#F56B71]">
              <Sparkles className="w-4 h-4" />
            </span>
            <span>Suka karya ini? Sebarkan ke jaringanmu.</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default AbstractPortfolioDetailContent;
