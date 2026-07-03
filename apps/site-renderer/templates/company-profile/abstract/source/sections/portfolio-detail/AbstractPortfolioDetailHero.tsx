'use client';

import React from 'react';
import { motion } from 'motion/react';
import { defaultPortfolios, PortfolioItem } from '../../lib/dummy-data';
import { stripHtmlToText } from '@/components/content/RichHtml';

interface AbstractPortfolioDetailHeroProps {
  showCoverImage?: string;
  badge?: string;
  project?: PortfolioItem;
}

export function AbstractPortfolioDetailHero({
  showCoverImage = 'true',
  badge = 'Studi Kasus',
  project = defaultPortfolios[0],
}: AbstractPortfolioDetailHeroProps) {
  const isShowCover = showCoverImage === 'true';

  return (
    <section className="relative bg-[#111111] text-white py-20 px-6 border-b-8 border-white overflow-hidden">
      {/* Decorative colored blobs */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-[#649FF6] opacity-10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute left-10 bottom-0 w-80 h-80 bg-[#B283AF] opacity-5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Category & Meta Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-800">
          <div className="inline-block bg-[#F56B71] text-black font-mono text-xs font-bold px-3 py-1.5 uppercase border border-white">
            {'// ' + badge.toUpperCase()}
          </div>
          <div className="font-mono text-xs text-neutral-400">
            KATEGORI: <span className="text-white font-bold">{project.category.toUpperCase()}</span>
          </div>
        </div>

        {/* Big Bold Headline */}
        <div className="space-y-6 mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-mono font-black uppercase tracking-tight leading-tight text-white"
          >
            {project.title}
          </motion.h1>

          {project.description && (
            <p className="text-neutral-300 font-sans text-sm sm:text-base leading-relaxed max-w-2xl border-l-4 border-[#649FF6] pl-4">
              {stripHtmlToText(project.description, 220)}
            </p>
          )}

          {/* Client/Year bar */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <div>
              <span className="font-mono text-[9px] text-neutral-500 block uppercase">Client Partner</span>
              <span className="font-mono text-xs font-bold text-white uppercase">{project.client}</span>
            </div>
            <div>
              <span className="font-mono text-[9px] text-neutral-500 block uppercase">Tahun</span>
              <span className="font-mono text-xs font-bold text-white uppercase">{project.year}</span>
            </div>
          </div>
        </div>

        {isShowCover && project.imageUrl && (
          <div className="w-full aspect-video bg-neutral-900 border-2 border-white overflow-hidden">
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}

export default AbstractPortfolioDetailHero;
