'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Compass } from 'lucide-react';
import { defaultArticles, ArticleItem } from '../../lib/dummy-data';

interface AbstractRelatedArticlesProps {
  title?: string;
  description?: string;
  articles?: ArticleItem[];
}

const ACCENTS = ['#649FF6', '#B283AF'];

export function AbstractRelatedArticles({
  title = "Artikel terkait lainnya",
  description = "Lanjutkan penjelajahan Anda dengan deretan naskah pilihan dari kurasi redaksi kami.",
  articles = defaultArticles.slice(1, 3)
}: AbstractRelatedArticlesProps) {
  return (
    <section className="relative bg-[#151515] text-white py-24 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-white/10">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10">
              <Compass className="w-3.5 h-3.5 text-[#F56B71]" />
              <span className="font-mono text-xs lowercase tracking-wide text-neutral-200">rekomendasi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight text-white leading-none">
              {title}
            </h2>
          </div>
          <div className="md:col-span-4">
            <p className="text-neutral-400 font-sans text-xs sm:text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((art, index) => {
            const accent = ACCENTS[index % ACCENTS.length];

            return (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-3xl bg-white/5 p-6 flex flex-col justify-between h-full min-h-[340px] transition-colors hover:bg-white/[0.08]"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-[10px] lowercase tracking-wide" style={{ color: accent }}>{art.category}</span>
                    <span className="font-sans text-xs text-neutral-500">{art.publishedAt}</span>
                  </div>

                  <h3 className="font-sans text-xl font-bold text-white group-hover:text-[#649FF6] transition-colors leading-snug mb-3">
                    {art.title}
                  </h3>

                  <p className="text-neutral-400 font-sans text-xs leading-relaxed line-clamp-3">
                    {art.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-between items-center mt-6">
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
