'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowUpRight, Compass } from 'lucide-react';
import { defaultArticles, ArticleItem } from '../../lib/dummy-data';

interface AbstractRelatedArticlesProps {
  title?: string;
  description?: string;
  articles?: ArticleItem[];
}

export function AbstractRelatedArticles({
  title = "Kajian Pemikiran Terkait Lainnya",
  description = "Lanjutkan penjelajahan intelektual Anda dengan deretan naskah pilihan dari kurasi redaksi kami.",
  articles = defaultArticles.slice(1, 3) // Exclude the first one (which is the main article)
}: AbstractRelatedArticlesProps) {
  return (
    <section className="relative bg-[#111111] text-white py-24 px-6 border-b-8 border-white overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-neutral-800">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#649FF6]">
              <Compass className="w-4 h-4 text-[#F56B71]" /> {"// ARSIP_REKOMENDASI"}
            </div>
            <h2 className="text-2xl sm:text-3xl font-mono font-black uppercase tracking-tight text-white leading-none">
              {title}
            </h2>
          </div>
          <div className="md:col-span-4">
            <p className="text-neutral-400 font-sans text-xs sm:text-sm leading-relaxed border-l-2 border-[#B283AF] pl-4">
              {description}
            </p>
          </div>
        </div>

        {/* Small 2-column Related Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {articles.map((art, index) => {
            const shadowColor = index % 2 === 0 ? "bg-[#649FF6]" : "bg-[#B283AF]";

            return (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                {/* Back offset shadow block */}
                <div className={`absolute inset-0 ${shadowColor} transform translate-x-3 translate-y-3 border-2 border-white transition-transform group-hover:translate-x-4 group-hover:translate-y-4 duration-300`} />
                
                {/* Card Container */}
                <div className="relative bg-black border-2 border-white p-6 flex flex-col justify-between h-full min-h-[380px]">
                  <div>
                    {/* Upper row */}
                    <div className="flex justify-between items-center mb-4 text-neutral-500 font-mono text-[9px]">
                      <span className="font-bold text-[#F56B71] uppercase">{"// " + art.category.toUpperCase()}</span>
                      <span>{art.publishedAt}</span>
                    </div>

                    {/* Headline */}
                    <h3 className="font-mono text-xl font-black uppercase tracking-tight text-white group-hover:text-[#649FF6] transition-colors leading-snug mb-3">
                      {art.title}
                    </h3>

                    <p className="text-neutral-400 font-sans text-xs leading-relaxed line-clamp-3">
                      {art.description}
                    </p>
                  </div>

                  {/* Read Link */}
                  <div className="pt-6 border-t border-neutral-800 flex justify-between items-center mt-6">
                    <div className="flex items-center gap-2">
                      <img 
                        src={art.author.avatarUrl} 
                        alt={art.author.name} 
                        className="w-7 h-7 rounded-full border border-white grayscale"
                      />
                      <span className="font-mono text-[9px] text-white font-bold uppercase">{art.author.name}</span>
                    </div>

                    <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center bg-neutral-950 text-white group-hover:bg-white group-hover:text-black transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
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
