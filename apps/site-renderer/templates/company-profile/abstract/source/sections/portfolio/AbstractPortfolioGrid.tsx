'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, FolderHeart } from 'lucide-react';
import { defaultPortfolios, PortfolioItem } from '../../lib/dummy-data';
import { stripHtmlToText } from '@/components/content/RichHtml';

interface AbstractPortfolioGridProps {
  title?: string;
  description?: string;
  portfolios?: PortfolioItem[];
}

const ACCENTS = ['#649FF6', '#F56B71', '#B283AF'];

export function AbstractPortfolioGrid({
  title = "Seluruh karya Studio Sinestesia",
  description = "Jelajahi portfolio lengkap kami. Setiap proyek mewakili perpaduan warna berani dan fungsionalitas yang dikalibrasi secara ketat.",
  portfolios = defaultPortfolios
}: AbstractPortfolioGridProps) {
  return (
    <section className="relative bg-[#151515] text-white py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">

        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10">
            <FolderHeart className="w-3.5 h-3.5 text-[#F56B71]" />
            <span className="font-mono text-xs lowercase tracking-wide text-neutral-200">arsip karya lengkap</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-neutral-400 font-sans text-sm sm:text-base leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolios.map((item, index) => {
            const accent = ACCENTS[index % ACCENTS.length];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-3xl bg-white/5 p-6 flex flex-col justify-between h-full min-h-[480px] transition-colors hover:bg-white/[0.08]"
              >
                <div className="relative w-full aspect-[16/10] rounded-2xl bg-neutral-900 overflow-hidden mb-6">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className="absolute top-3 left-3 text-[11px] font-mono lowercase font-semibold px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: accent }}
                  >
                    {item.year}
                  </div>
                </div>

                <div className="space-y-3 flex-grow">
                  <span className="font-mono text-[10px] lowercase tracking-wide text-neutral-500">
                    {item.category}
                  </span>

                  <h3 className="font-sans text-2xl font-bold text-white group-hover:text-[#649FF6] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-neutral-400 font-sans text-sm leading-relaxed">
                    {stripHtmlToText(item.description, 140)}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-between items-center mt-8">
                  <div>
                    <span className="font-sans text-xs text-neutral-500 block">Klien</span>
                    <span className="font-sans text-sm font-semibold text-white">{item.client}</span>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-neutral-900 transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
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
