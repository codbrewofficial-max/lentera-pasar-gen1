'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Newspaper } from 'lucide-react';
import { defaultArticles, ArticleItem } from '../../lib/dummy-data';

interface AbstractArticlePreviewProps {
  title?: string;
  description?: string;
  articles?: ArticleItem[];
}

const ACCENTS = ['#649FF6', '#F56B71', '#B283AF'];

export function AbstractArticlePreview({
  title = "Jurnal pemikiran dan cerita desain",
  description = "Eksplorasi wawasan teori warna, eksperimen kreatif, dan cerita di balik proses kerja kami.",
  articles = defaultArticles
}: AbstractArticlePreviewProps) {
  return (
    <section className="relative bg-[#151515] text-white py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-white/10">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10">
              <Newspaper className="w-3.5 h-3.5 text-[#B283AF]" />
              <span className="font-mono text-xs lowercase tracking-wide text-neutral-200">publikasi terbaru</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-none text-white">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-neutral-400 font-sans text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art, index) => {
            const accent = ACCENTS[index % ACCENTS.length];

            return (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-3xl bg-white/5 p-5 flex flex-col justify-between h-full min-h-[420px] transition-colors hover:bg-white/[0.08]"
              >
                <div className="relative aspect-[16/10] rounded-2xl bg-neutral-900 overflow-hidden mb-5">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-3 flex-grow">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] lowercase tracking-wide" style={{ color: accent }}>
                      {art.category}
                    </span>
                    <span className="font-sans text-xs text-neutral-500">{art.publishedAt}</span>
                  </div>

                  <h3 className="font-sans text-lg font-bold text-white group-hover:text-[#649FF6] transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-neutral-400 font-sans text-xs leading-relaxed line-clamp-3">
                    {art.description}
                  </p>
                </div>

                <div className="pt-5 border-t border-white/10 flex justify-between items-center mt-6">
                  <div className="flex items-center gap-2">
                    <img
                      src={art.author.avatarUrl}
                      alt={art.author.name}
                      className="w-7 h-7 rounded-full"
                    />
                    <span className="font-sans text-xs font-semibold text-white">{art.author.name}</span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-neutral-900 transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
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
