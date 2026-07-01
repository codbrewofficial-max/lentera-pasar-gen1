'use client';

import React from 'react';
import { defaultArticles, ArticleItem } from '../../lib/dummy-data';

interface PremiumArticleDetailHeroProps {
  showPublishedDate?: string; // "true" / "false"
  showCoverImage?: string; // "true" / "false"
  article?: ArticleItem;
}

export function PremiumArticleDetailHero({
  showPublishedDate = "true",
  showCoverImage = "true",
  article = defaultArticles[0]
}: PremiumArticleDetailHeroProps) {
  if (!article) return null;

  const displayDate = showPublishedDate === "true";
  const displayCover = showCoverImage === "true";

  return (
    <section id="premium-article-detail-hero" className="py-16 md:py-24 bg-[#FAF9F6] text-[#121212] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        {/* Article Breadcrumb & Metadata */}
        <div className="space-y-6 text-center">
          <div className="flex items-center justify-center space-x-3 text-[10px] font-mono tracking-[0.25em] text-stone-500 uppercase">
            <span className="text-[#649FF6] font-semibold">{article.category}</span>
            {displayDate && (
              <>
                <span>•</span>
                <span>{article.publishedDate}</span>
              </>
            )}
            <span>•</span>
            <span>{article.readTime}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-stone-900 leading-tight">
            {article.title}
          </h1>

          {/* Author info */}
          <div className="flex items-center justify-center space-x-4 pt-4 pb-8 border-b border-stone-200">
            <div className="text-left">
              <span className="text-[10px] text-stone-400 block tracking-wider uppercase">DITULIS OLEH</span>
              <span className="text-sm font-serif font-light text-stone-800">{article.author}</span>
              {article.authorRole && (
                <span className="text-[10px] text-stone-500 block font-sans">{article.authorRole}</span>
              )}
            </div>
          </div>
        </div>

        {/* Big Editorial Cover Image */}
        {displayCover && (
          <div className="mt-12 aspect-[21/10] bg-stone-200 overflow-hidden shadow-2xl relative">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 to-transparent" />
          </div>
        )}
      </div>
    </section>
  );
}
