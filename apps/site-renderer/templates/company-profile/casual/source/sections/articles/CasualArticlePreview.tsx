'use client';

import React from 'react';
import Link from 'next/link';
import { articlesData, ArticleItem } from '../../lib/dummy-data';
import { ArrowRight, Calendar, User } from 'lucide-react';

export interface CasualArticlePreviewProps {
  title?: string;
  description?: string;
  articles?: ArticleItem[];
  articlesHref?: string;
}

export function CasualArticlePreview({
  title = 'Artikel & Inspirasi Menarik Lainnya',
  description = 'Jelajahi kumpulan wawasan praktis dari studio kami. Kami membagikan tips gratis seputar fotografi produk, copywriting sosmed, dan branding secara konsisten.',
  articles = articlesData,
  articlesHref = '/articles',
}: CasualArticlePreviewProps) {
  
  // Show all articles in the general feed list
  const list = articles;

  const getBorderColor = (idx: number) => {
    const borders = ['hover:border-[#649FF6]/40', 'hover:border-[#F56B71]/40', 'hover:border-[#B283AF]/40'];
    return borders[idx % borders.length];
  };

  const getHoverTextColor = (idx: number) => {
    const textColors = ['group-hover:text-[#649FF6]', 'group-hover:text-[#F56B71]', 'group-hover:text-[#B283AF]'];
    return textColors[idx % textColors.length];
  };

  return (
    <section id="CasualArticlePreview" className="py-20 bg-gray-50 relative overflow-hidden">
      
      {/* Decorative Blob */}
      <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-[#649FF6]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-sm font-bold text-[#649FF6] uppercase tracking-widest block font-mono">
            FEED ARTIKEL
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
            {title}
          </h2>
          <p className="font-sans text-base text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {list.map((art, index) => (
            <div
              key={art.id}
              className={`group bg-white rounded-[32px] overflow-hidden border-2 border-transparent transition-all duration-300 ${getBorderColor(index)} hover:shadow-xl flex flex-col justify-between`}
            >
              <div className="space-y-5">
                
                {/* Cover Image with tag */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-[10px] font-extrabold shadow-sm">
                    {art.tags[0]}
                  </div>
                </div>

                {/* Info Text */}
                <div className="px-6 space-y-3">
                  <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-gray-400">
                    <span>{art.publishedAt}</span>
                    <span>•</span>
                    <span>{art.tags.slice(1).join(', ')}</span>
                  </div>

                  <h3 className={`font-sans font-extrabold text-lg leading-snug text-gray-950 transition-colors ${getHoverTextColor(index)}`}>
                    <Link href={`${articlesHref}/${art.slug}`}>
                      {art.title}
                    </Link>
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>

              </div>

              {/* Author Footer info */}
              <div className="mt-6 px-6 pb-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={art.author.avatar}
                    alt={art.author.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="leading-none">
                    <span className="text-xs font-bold text-gray-900 block">{art.author.name}</span>
                    <span className="text-[9px] text-gray-400 block font-mono mt-0.5">{art.author.role}</span>
                  </div>
                </div>

                <Link
                  id={`read-article-${art.slug}`}
                  href={`${articlesHref}/${art.slug}`}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#649FF6]/10 hover:text-[#649FF6] transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
