'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { defaultArticles, ArticleItem } from '../../lib/dummy-data';

interface PremiumArticlePreviewProps {
  title?: string;
  description?: string;
  articles?: ArticleItem[];
}

export function PremiumArticlePreview({
  title = "Arsip & Rangkuman Artikel",
  description = "Tinjau kelengkapan arsip publikasi kami untuk memperkaya wawasan Anda sebelum memulai proyek konstruksi mewah.",
  articles = defaultArticles
}: PremiumArticlePreviewProps) {
  return (
    <section id="premium-article-preview" className="py-24 md:py-32 bg-[#0E0E0F] text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Block */}
        <div className="max-w-3xl mb-20 space-y-4">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#649FF6] uppercase block">ARSIP JURNAL</span>
          <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-white">{title}</h2>
          <p className="text-stone-400 text-xs md:text-sm leading-relaxed font-sans font-light">
            {description}
          </p>
        </div>

        {/* List of articles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((item) => (
            <div
              key={item.id}
              className="border border-white/5 bg-[#121214] p-6 md:p-8 flex flex-col justify-between hover:border-[#649FF6]/40 transition-all duration-500 group"
            >
              {/* Top part */}
              <div className="space-y-6">
                {/* Visual Thumbnail */}
                <div className="relative aspect-[16/10] bg-stone-900 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                  />
                  <span className="absolute top-3 left-3 bg-[#0E0E0F] border border-white/5 text-[8px] tracking-widest uppercase text-stone-300 px-2.5 py-1">
                    {item.category}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="text-stone-500 font-mono text-[9px] tracking-widest uppercase">
                    {item.publishedDate} • {item.readTime}
                  </div>
                  <h3 className="text-lg font-serif font-light text-white group-hover:text-[#649FF6] transition-colors leading-snug">
                    <a href={`/articles/${item.id}`}>
                      {item.title}
                    </a>
                  </h3>
                  <p className="text-stone-400 text-xs leading-relaxed font-sans font-light line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Author & Action Footer */}
              <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-stone-500 block uppercase tracking-wider font-sans">PENULIS</span>
                  <span className="text-xs text-stone-300 font-serif font-light">{item.author}</span>
                </div>

                <a
                  href={`/articles/${item.id}`}
                  className="p-2 border border-white/5 text-stone-400 hover:text-[#649FF6] hover:border-[#649FF6]/40 transition-colors"
                  aria-label={`Read ${item.title}`}
                >
                  <ArrowRight className="w-4 h-4 text-[#F56B71]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
