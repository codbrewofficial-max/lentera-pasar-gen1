'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { defaultArticles, ArticleItem } from '../../lib/dummy-data';

interface PremiumRelatedArticlesProps {
  title?: string;
  description?: string;
  relatedArticles?: ArticleItem[];
}

export function PremiumRelatedArticles({
  title = "Baca Artikel Terkait",
  description = "Perluas cakrawala wawasan arsitektur Anda dengan topik kurasi lainnya di bawah ini.",
  relatedArticles = defaultArticles.slice(1) // default to next articles
}: PremiumRelatedArticlesProps) {
  return (
    <section id="premium-related-articles" className="py-24 md:py-32 bg-[#0E0E0F] text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Block */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#B283AF] uppercase block">REKOMENDASI JURNAL</span>
          <h2 className="text-3xl font-serif font-light tracking-tight">{title}</h2>
          <p className="text-stone-400 text-xs md:text-sm leading-relaxed font-sans font-light">
            {description}
          </p>
        </div>

        {/* Small card previews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {relatedArticles.map((item) => (
            <div
              key={item.id}
              className="border border-white/5 bg-[#121214] p-6 flex flex-col sm:flex-row gap-6 hover:border-[#649FF6]/40 transition-colors group"
            >
              {/* Image box */}
              <div className="w-full sm:w-1/3 aspect-[4/3] sm:aspect-square bg-stone-900 overflow-hidden shrink-0 relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>

              {/* Text box */}
              <div className="flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[8px] tracking-widest text-[#649FF6] uppercase font-mono block">
                    {item.category}
                  </span>
                  <h3 className="text-base font-serif font-light text-white group-hover:text-[#649FF6] transition-colors leading-snug line-clamp-2">
                    <a href={`/articles/${item.id}`}>{item.title}</a>
                  </h3>
                  <p className="text-stone-400 text-[11px] leading-relaxed font-sans font-light line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <a
                  href={`/articles/${item.id}`}
                  className="inline-flex items-center space-x-1.5 text-[10px] font-bold tracking-wider uppercase text-stone-300 hover:text-[#649FF6] transition-colors"
                >
                  <span>BACA</span>
                  <ArrowRight className="w-3 h-3 text-[#F56B71]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
