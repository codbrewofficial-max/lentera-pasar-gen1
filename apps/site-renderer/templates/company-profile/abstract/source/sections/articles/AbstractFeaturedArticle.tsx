'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Star, ArrowRight } from 'lucide-react';
import { defaultArticles, ArticleItem } from '../../lib/dummy-data';

interface AbstractFeaturedArticleProps {
  title?: string;
  description?: string;
  article?: ArticleItem;
  articlesHref?: string;
}

export function AbstractFeaturedArticle({
  title = "Sorotan editor bulan ini",
  description = "Bedah mendalam eksperimen visual yang menantang keseragaman digital.",
  article = defaultArticles[0],
  articlesHref = '/articles'
}: AbstractFeaturedArticleProps) {
  return (
    <section className="relative bg-white text-neutral-900 py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">

        <div className="mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F56B71]/10">
            <Star className="w-3.5 h-3.5 fill-current text-[#F56B71]" />
            <span className="font-mono text-xs lowercase tracking-wide text-[#F56B71]">artikel utama</span>
          </div>
          <h2 className="text-3xl font-sans font-extrabold tracking-tight text-neutral-900 leading-tight">
            {title}
          </h2>
          <p className="text-neutral-500 font-sans text-sm max-w-2xl">
            {description}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="group rounded-[2.5rem] bg-neutral-50 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          <div className="lg:col-span-6 relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-square rounded-3xl bg-neutral-200 overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-4 left-4 bg-[#B283AF] text-white font-mono text-[11px] lowercase font-semibold px-3 py-1.5 rounded-full">
              6 menit baca
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs lowercase tracking-wide text-[#F56B71]">
                  {article.category}
                </span>
                <span className="font-sans text-xs text-neutral-400">
                  {article.publishedAt}
                </span>
              </div>

              <h3 className="font-sans text-2xl sm:text-3xl font-bold text-neutral-900 group-hover:text-[#649FF6] transition-colors leading-tight">
                {article.title}
              </h3>

              <p className="text-neutral-500 font-sans text-sm sm:text-base leading-relaxed">
                {article.description}
              </p>
            </div>

            <div className="pt-8 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <img
                  src={article.author.avatarUrl}
                  alt={article.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <span className="block font-sans text-sm font-semibold text-neutral-900">{article.author.name}</span>
                  <span className="block font-sans text-xs text-neutral-400">{article.author.role}</span>
                </div>
              </div>

              <Link
                href={`${articlesHref}/${article.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 hover:bg-[#649FF6] text-white font-sans font-semibold text-sm transition-colors"
              >
                <span>Baca ulasan</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
