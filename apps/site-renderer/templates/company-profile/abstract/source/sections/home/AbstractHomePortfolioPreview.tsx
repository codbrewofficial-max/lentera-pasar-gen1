'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowUpRight, FolderGit } from 'lucide-react';
import { defaultPortfolios, PortfolioItem } from '../../lib/dummy-data';
import { stripHtmlToText } from '@/components/content/RichHtml';

interface AbstractHomePortfolioPreviewProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  portfolios?: PortfolioItem[];
}

const ACCENTS = ['#649FF6', '#F56B71', '#B283AF'];

export function AbstractHomePortfolioPreview({
  title = "Koleksi eksperimen visual kami",
  description = "Intip deretan proyek terpilih kami. Tiap karya adalah perpaduan komposisi warna berani dan identitas modern yang dirancang buat brand yang ingin tampil beda.",
  ctaLabel = "Lihat semua portfolio",
  ctaUrl = "/portfolio",
  portfolios = defaultPortfolios.slice(0, 3)
}: AbstractHomePortfolioPreviewProps) {
  return (
    <section className="relative bg-white text-neutral-900 py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-neutral-100">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#649FF6]/10">
              <FolderGit className="w-3.5 h-3.5 text-[#649FF6]" />
              <span className="font-mono text-xs lowercase tracking-wide text-[#649FF6]">proyek pilihan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-tight text-neutral-900">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-neutral-500 font-sans text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {portfolios.map((item, index) => {
            const accent = ACCENTS[index % ACCENTS.length];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-3xl bg-neutral-50 hover:bg-neutral-100 p-5 flex flex-col justify-between h-full transition-colors duration-300"
              >
                <div className="relative w-full aspect-[4/3] rounded-2xl bg-neutral-200 overflow-hidden mb-6">
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
                  <span className="font-mono text-[10px] lowercase tracking-wide text-neutral-400 block">
                    {item.category}
                  </span>
                  <h3 className="font-sans text-lg font-bold text-neutral-900 group-hover:text-[#649FF6] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-neutral-500 font-sans text-xs line-clamp-3">
                    {stripHtmlToText(item.description, 140)}
                  </p>
                </div>

                <div className="pt-6 border-t border-neutral-200 flex justify-between items-center mt-6">
                  <span className="font-sans text-xs text-neutral-400">
                    Klien: {item.client}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-neutral-900 group-hover:bg-[#649FF6] group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Link
            href={ctaUrl}
            className="inline-flex items-center px-8 py-4 rounded-full bg-neutral-900 hover:bg-[#649FF6] text-white font-sans font-bold text-sm transition-colors"
          >
            {ctaLabel}
          </Link>
        </div>

      </div>
    </section>
  );
}
