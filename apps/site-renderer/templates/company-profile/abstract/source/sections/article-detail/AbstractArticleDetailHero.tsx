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
    <section className="relative bg-[#151515] text-white py-20 px-6 overflow-hidden">
      <div className="absolute right-0 top-0 w-96 h-96 bg-[#649FF6] opacity-[0.08] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#F56B71] text-white font-mono text-xs lowercase font-semibold">
            {article.category}
          </div>

          {isShowDate && (
            <div className="font-sans text-xs text-neutral-400">
              Dipublikasikan <span className="text-white font-semibold">{article.publishedAt}</span>
            </div>
          )}
        </div>

        <div className="space-y-6 mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-tight text-white"
          >
            {article.title}
          </motion.h1>

          <div className="flex items-center gap-3">
            <img
              src={article.author.avatarUrl}
              alt={article.author.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <span className="block font-sans text-sm font-semibold text-white">{article.author.name}</span>
              <span className="block font-sans text-xs text-neutral-500">{article.author.role}</span>
            </div>
          </div>
        </div>

        {isShowCover && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative w-full aspect-[21/9] rounded-[2rem] overflow-hidden bg-neutral-900"
          >
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

      </div>
    </section>
  );
}
