'use client';

import React from 'react';
import { motion } from 'motion/react';
import { defaultArticles, ArticleItem } from '../../lib/dummy-data';

interface AbstractArticleDetailHeroProps {
  showPublishedDate?: string;
  showCoverImage?: string;
  article?: ArticleItem;
}

export function AbstractArticleDetailHero({
  showPublishedDate = "true",
  showCoverImage = "true",
  article = defaultArticles[0],
}: AbstractArticleDetailHeroProps) {
  const isShowDate = showPublishedDate === "true";
  const isShowCover = showCoverImage === "true";

  return (
    <section className="relative bg-[#111111] text-white py-20 px-6 border-b-8 border-white overflow-hidden">
      {/* Decorative colored blobs */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-[#649FF6] opacity-10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute left-10 bottom-0 w-80 h-80 bg-[#B283AF] opacity-5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Category & Date Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-800">
          <div className="inline-block bg-[#F56B71] text-black font-mono text-xs font-bold px-3 py-1.5 uppercase border border-white">
            {"// " + article.category.toUpperCase()}
          </div>
          
          {isShowDate && (
            <div className="font-mono text-xs text-neutral-400">
              PUBLISHED AT: <span className="text-white font-bold">{article.publishedAt.toUpperCase()}</span>
            </div>
          )}
        </div>

        {/* Big Bold Headline */}
        <div className="space-y-6 mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-mono font-black uppercase tracking-tight leading-tight text-white"
          >
            {article.title}
          </motion.h1>

          {/* Author bar */}
          <div className="flex items-center gap-3">
            <img 
              src={article.author.avatarUrl} 
              alt={article.author.name} 
              className="w-10 h-10 rounded-full border border-white grayscale"
            />
            <div>
              <span className="block font-mono text-xs font-bold text-white uppercase">{article.author.name}</span>
              <span className="block font-mono text-[9px] text-neutral-500 uppercase">{article.author.role}</span>
            </div>
          </div>
        </div>

        {/* Large Cover Image with shifted border blocks */}
        {isShowCover && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative w-full aspect-[21/9] border-4 border-white bg-black overflow-hidden shadow-[-12px_12px_0px_#B283AF]"
          >
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover grayscale contrast-110"
            />
          </motion.div>
        )}

      </div>
    </section>
  );
}
