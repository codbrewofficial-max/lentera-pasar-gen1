'use client';

import React from 'react';
import { articlesData } from '../../lib/dummy-data';
import { Calendar, User, ArrowLeft, Bookmark } from 'lucide-react';
import Link from 'next/link';

export interface CasualArticleDetailHeroProps {
  showPublishedDate?: string;
  showCoverImage?: string;
  article?: {
    title: string;
    excerpt: string;
    imageUrl: string;
    publishedAt: string;
    author: {
      name: string;
      avatar: string;
      role: string;
    };
    tags: string[];
  };
}

export function CasualArticleDetailHero({
  showPublishedDate = 'true',
  showCoverImage = 'true',
  article = articlesData[0],
}: CasualArticleDetailHeroProps) {
  
  const isShowDate = showPublishedDate === 'true' || showPublishedDate === 'Boolean(true)' || showPublishedDate === 'TRUE';
  const isShowCoverImage = showCoverImage === 'true' || showCoverImage === 'Boolean(true)' || showCoverImage === 'TRUE';

  return (
    <section id="CasualArticleDetailHero" className="pt-12 pb-10 bg-gradient-to-b from-[#649FF6]/10 to-transparent overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            id="back-to-articles-link"
            href="/articles"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#649FF6] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Semua Tips</span>
          </Link>
        </div>

        {/* Content details */}
        <div className="space-y-6 text-center md:text-left">
          
          {/* Tags */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {article.tags.map(tag => (
              <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-white text-[#649FF6] border border-[#649FF6]/20 shadow-sm">
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-950 tracking-tight leading-tight">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#649FF6]/25"
              />
              <div className="text-left">
                <span className="text-sm font-bold text-gray-900 block">{article.author.name}</span>
                <span className="text-xs text-gray-400 block font-sans">{article.author.role}</span>
              </div>
            </div>

            {isShowDate && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono font-bold text-gray-400 uppercase tracking-widest pl-4 border-l border-gray-200">
                <Calendar className="w-4 h-4 text-gray-300" />
                <span>RILIS: {article.publishedAt}</span>
              </div>
            )}
          </div>

          {/* Cover Image (As requested: "sediakan elemen cover image opsional, dikontrol showCoverImage") */}
          {isShowCoverImage && (
            <div className="mt-8 rounded-[40px] overflow-hidden border-4 border-white shadow-xl aspect-[16/9] bg-gray-100">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
