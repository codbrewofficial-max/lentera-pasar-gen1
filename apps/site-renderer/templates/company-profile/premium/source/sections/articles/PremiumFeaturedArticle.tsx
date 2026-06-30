'use client';

import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { defaultArticles, ArticleItem } from '../../lib/dummy-data';

interface PremiumFeaturedArticleProps {
  title?: string;
  description?: string;
  article?: ArticleItem;
}

export function PremiumFeaturedArticle({
  title = "Sorotan Redaksi Jurnal",
  description = "Artikel terpilih bulan ini mengupas pergeseran arti kemewahan spasial dalam arsitektur tropis kontemporer.",
  article = defaultArticles[0]
}: PremiumFeaturedArticleProps) {
  if (!article) return null;

  return (
    <section id="premium-featured-article" className="py-24 md:py-32 bg-[#FAF9F6] text-[#121212] border-t border-stone-200/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="mb-12 flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#F56B71] uppercase block">UNGGULAN UTAMA</span>
            <h2 className="text-xl font-serif text-stone-900">{title}</h2>
          </div>
          <span className="text-xs text-stone-400 font-sans font-light hidden sm:block">
            {description}
          </span>
        </div>

        {/* Feature Layout Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Cover image (7 cols) */}
          <div className="lg:col-span-7 relative group overflow-hidden bg-stone-100 aspect-[16/10]">
            <a href={`/articles/${article.id}`}>
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-all duration-700 filter brightness-95"
              />
              <div className="absolute inset-0 bg-[#0E0E0F]/5 group-hover:bg-transparent transition-colors" />
            </a>
          </div>

          {/* Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center space-x-3 text-[10px] font-mono tracking-widest text-stone-500 uppercase">
              <span className="text-[#649FF6] font-semibold">{article.category}</span>
              <span>•</span>
              <span>{article.publishedDate}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>

            <h3 className="text-2xl md:text-4xl font-serif font-light text-stone-900 group-hover:text-[#649FF6] transition-colors leading-snug">
              <a href={`/articles/${article.id}`}>
                {article.title}
              </a>
            </h3>

            <p className="text-stone-600 text-xs md:text-sm leading-relaxed font-sans font-light">
              {article.description}
            </p>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 block tracking-wider font-sans uppercase">PENULIS</span>
                <span className="text-xs font-serif font-light text-stone-800">{article.author}</span>
                {article.authorRole && (
                  <span className="text-[9px] text-stone-400 block font-sans">{article.authorRole}</span>
                )}
              </div>

              <a
                href={`/articles/${article.id}`}
                className="group inline-flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-stone-900 hover:text-[#649FF6] transition-colors"
              >
                <span>BACA SELENGKAPNYA</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F56B71] group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
