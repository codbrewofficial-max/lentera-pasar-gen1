'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { defaultPortfolios, PortfolioItem } from '../../lib/dummy-data';
import { stripHtmlToText } from '@/components/content/RichHtml';

interface AbstractRelatedPortfoliosProps {
  title?: string;
  description?: string;
  currentId?: string;
  portfolios?: PortfolioItem[];
  portfolioDetailHref?: (id: string) => string;
}

const ACCENTS = ['#649FF6', '#F56B71', '#B283AF'];

export function AbstractRelatedPortfolios({
  title = 'Karya terkait lainnya',
  description = 'Eksplorasi proyek lain yang membawa pendekatan visual serupa.',
  currentId,
  portfolios = defaultPortfolios,
  portfolioDetailHref,
}: AbstractRelatedPortfoliosProps) {
  const filtered = portfolios.filter((item) => item.id !== currentId).slice(0, 3);

  if (filtered.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-[#151515] text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 mb-4">
            <span className="font-mono text-xs lowercase tracking-wide text-neutral-200">koleksi lainnya</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-extrabold tracking-tight leading-tight text-white">
            {title}
          </h2>
          <p className="text-neutral-400 font-sans text-sm leading-relaxed mt-4">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((project, index) => {
            const accent = ACCENTS[index % ACCENTS.length];
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative aspect-[4/3] rounded-2xl bg-neutral-900 overflow-hidden mb-4">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className="absolute top-3 left-3 text-[11px] font-mono lowercase font-semibold px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: accent }}
                  >
                    {project.category}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-sans font-bold text-base text-white group-hover:text-[#649FF6] transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-neutral-400 font-sans text-sm leading-relaxed line-clamp-2">
                    {stripHtmlToText(project.description, 140)}
                  </p>

                  <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <div>
                      <span className="font-sans text-xs text-neutral-500 block">Klien</span>
                      <span className="font-sans text-sm font-semibold text-white">{project.client}</span>
                    </div>

                    <a
                      href={portfolioDetailHref ? portfolioDetailHref(project.id) : `/portfolio/${project.id}`}
                      className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-neutral-900 transition-colors"
                      aria-label={`Lihat ${project.title}`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AbstractRelatedPortfolios;
