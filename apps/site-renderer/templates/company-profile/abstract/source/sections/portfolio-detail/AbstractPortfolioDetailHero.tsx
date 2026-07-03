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
    <section className="relative bg-[#151515] text-white py-20 px-6 overflow-hidden">
      <div className="absolute right-0 top-0 w-96 h-96 bg-[#649FF6] opacity-[0.08] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#F56B71] text-white font-mono text-xs lowercase font-semibold">
            {badge}
          </div>
          <div className="font-sans text-xs text-neutral-400">
            Kategori: <span className="text-white font-semibold">{project.category}</span>
          </div>
        </div>

        <div className="space-y-6 mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-tight text-white"
          >
            {project.title}
          </motion.h1>

          {project.description && (
            <p className="text-neutral-300 font-sans text-sm sm:text-base leading-relaxed max-w-2xl">
              {stripHtmlToText(project.description, 220)}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-8 pt-2">
            <div>
              <span className="font-sans text-xs text-neutral-500 block mb-0.5">Klien</span>
              <span className="font-sans text-sm font-semibold text-white">{project.client}</span>
            </div>
            <div>
              <span className="font-sans text-xs text-neutral-500 block mb-0.5">Tahun</span>
              <span className="font-sans text-sm font-semibold text-white">{project.year}</span>
            </div>
          </div>
        </div>

        {isShowCover && project.imageUrl && (
          <div className="w-full aspect-video rounded-[2rem] bg-neutral-900 overflow-hidden">
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}

export default AbstractPortfolioDetailHero;
