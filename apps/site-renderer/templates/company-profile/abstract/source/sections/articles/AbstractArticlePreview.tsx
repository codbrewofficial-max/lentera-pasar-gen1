'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowUpRight, Newspaper } from 'lucide-react';
import { defaultArticles, ArticleItem } from '../../lib/dummy-data';

interface AbstractArticlePreviewProps {
  title?: string;
  description?: string;
  articles?: ArticleItem[];
}

export function AbstractArticlePreview({
  title = "Jurnal Pemikiran & Dekonstruksi Desain",
  description = "Eksplorasi wawasan teori warna, eksperimen brutalist, dan perdebatan visual yang menantang kemapanan dunia kreatif digital.",
  articles = defaultArticles
}: AbstractArticlePreviewProps) {
  return (
    <section className="relative bg-[#111111] text-white py-24 px-6 border-b-8 border-white overflow-hidden">
      {/* Decorative text in background */}
      <div className="absolute right-10 bottom-0 text-[10rem] font-mono font-black text-neutral-900 select-none pointer-events-none opacity-20 -mb-10 uppercase">
        JOURNAL
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-neutral-800">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#649FF6]">
              <Newspaper className="w-4 h-4 text-[#B283AF]" /> {"// PUBLIKASI TERBARU"}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black uppercase tracking-tight leading-none text-white">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-neutral-400 font-sans text-sm leading-relaxed border-l-2 border-[#F56B71] pl-4">
              {description}
            </p>
          </div>
        </div>

        {/* Articles Grid (Asymmetric) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((art, index) => {
            // Alternating shadow colors
            const shadowColors = ["bg-[#649FF6]", "bg-[#F56B71]", "bg-[#B283AF]"];
            const shadowColor = shadowColors[index % shadowColors.length];
            const rotationClass = index % 3 === 0 ? "rotate-0.5" : index % 3 === 1 ? "-rotate-0.5" : "rotate-1";

            return (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative group ${rotationClass}`}
              >
                {/* Back offset shadow block */}
                <div className={`absolute inset-0 ${shadowColor} transform translate-x-3 translate-y-3 group-hover:translate-x-4.5 group-hover:translate-y-4.5 transition-transform duration-300 border-2 border-white`} />
                
                {/* Card box */}
                <div className="relative bg-black border-2 border-white p-5 flex flex-col justify-between h-full min-h-[440px]">
                  
                  {/* Photo Frame */}
                  <div className="relative aspect-[16/10] bg-neutral-900 border border-neutral-800 overflow-hidden mb-5">
                    <img 
                      src={art.imageUrl} 
                      alt={art.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-102 group-hover:scale-100"
                    />
                  </div>

                  {/* Card content */}
                  <div className="space-y-3 flex-grow">
                    <div className="flex justify-between items-center text-neutral-500 font-mono text-[9px]">
                      <span className="font-bold text-[#B283AF] uppercase">
                        {"// " + art.category.toUpperCase()}
                      </span>
                      <span>{art.publishedAt}</span>
                    </div>

                    <h3 className="font-mono text-lg font-black uppercase tracking-tight text-white group-hover:text-[#649FF6] transition-colors leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-neutral-400 font-sans text-xs leading-relaxed line-clamp-3">
                      {art.description}
                    </p>
                  </div>

                  {/* Author badge and arrow */}
                  <div className="pt-5 border-t border-neutral-800 flex justify-between items-center mt-6">
                    <div className="flex items-center gap-2">
                      <img 
                        src={art.author.avatarUrl} 
                        alt={art.author.name} 
                        className="w-7 h-7 rounded-full border border-white grayscale"
                      />
                      <span className="font-mono text-[10px] text-white font-bold uppercase">{art.author.name}</span>
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
