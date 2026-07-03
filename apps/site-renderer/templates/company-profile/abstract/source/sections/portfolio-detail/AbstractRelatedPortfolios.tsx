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
}

export function AbstractRelatedPortfolios({
  title = 'Karya Terkait Lainnya',
  description = 'Eksplorasi proyek lain yang membawa pendekatan visual berani serupa.',
  currentId,
  portfolios = defaultPortfolios,
}: AbstractRelatedPortfoliosProps) {
  const filtered = portfolios.filter((item) => item.id !== currentId).slice(0, 3);

  if (filtered.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-[#111111] text-white py-20 px-6 border-b-8 border-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#B283AF] mb-4">
            {'// KOLEKSI // LAINNYA'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-mono font-black uppercase tracking-tight leading-tight text-white">
            {title}
          </h2>
          <p className="text-neutral-400 font-sans text-sm leading-relaxed mt-4">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[4/3] bg-neutral-900 border-2 border-neutral-800 group-hover:border-white transition-colors overflow-hidden mb-4">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/80 text-white font-mono text-[10px] font-bold px-2.5 py-1 uppercase border border-white/20">
                  {project.category}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-mono font-bold uppercase text-base text-white group-hover:text-[#649FF6] transition-colors leading-snug">
                  {project.title}
                </h3>
                <p className="text-neutral-400 font-sans text-sm leading-relaxed line-clamp-2">
                  {stripHtmlToText(project.description, 140)}
                </p>

                <div className="pt-4 border-t border-neutral-800 flex justify-between items-center">
                  <div>
                    <span className="font-mono text-[9px] text-neutral-500 block uppercase">Client Partner</span>
                    <span className="font-mono text-xs font-bold text-white uppercase">{project.client}</span>
                  </div>

                  <a
                    href={`/portfolio?id=${project.id}`}
                    className="w-10 h-10 border-2 border-white flex items-center justify-center bg-neutral-900 text-white group-hover:bg-white group-hover:text-black transition-all group-hover:rotate-45"
                    aria-label={`Lihat ${project.title}`}
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AbstractRelatedPortfolios;
