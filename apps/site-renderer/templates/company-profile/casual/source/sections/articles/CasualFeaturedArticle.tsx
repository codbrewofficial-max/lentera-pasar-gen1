'use client';

import React from 'react';
import Link from 'next/link';
import { articlesData, ArticleItem } from '../../lib/dummy-data';
import { ArrowRight, Bookmark, Calendar, User } from 'lucide-react';

export interface CasualFeaturedArticleProps {
  title?: string;
  description?: string;
  badge?: string;
  article?: ArticleItem;
  articlesHref?: string;
  imageUrl?: string;
  ctaLabel?: string;
}

export function CasualFeaturedArticle({
  title = 'Artikel Sorotan Terpopuler Pekan Ini',
  description = 'Rangkuman ide terpanas yang paling banyak didiskusikan pemilik usaha lokal saat ini. Baca selengkapnya untuk memperkaya wawasan taktik jualan tokomu.',
  badge = 'SOROTAN REDAKSI',
  article: featuredArticle,
  articlesHref = '/articles',
  imageUrl,
  ctaLabel,
}: CasualFeaturedArticleProps) {
  
  // Showcase the first article as featured
  const featured = featuredArticle || articlesData[0];

  return (
    <section id="CasualFeaturedArticle" className="bg-white relative overflow-hidden">
      {imageUrl ? (
        <div className="relative py-16 md:py-20 mb-4 overflow-hidden text-white text-center">
          <div className="absolute inset-0">
            <img src={imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gray-950/70" />
          </div>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
            <span className="text-sm font-bold text-white/80 uppercase tracking-widest block font-mono">{badge}</span>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight">{title}</h2>
            <p className="font-sans text-base text-gray-200 leading-relaxed">{description}</p>
            {ctaLabel && (
              <div className="pt-2">
                <Link href={articlesHref} className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-100 transition-all">
                  <span>{ctaLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="absolute top-1/4 left-10 w-80 h-80 rounded-full bg-[#B283AF]/5 blur-3xl pointer-events-none" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 md:py-16">
        {!imageUrl && (
          /* Section Heading */
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-sm font-bold text-[#F56B71] uppercase tracking-widest block font-mono">
              {badge}
            </span>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
              {title}
            </h2>
            <p className="font-sans text-base text-gray-600 leading-relaxed">
              {description}
            </p>
            {ctaLabel && (
              <div className="pt-2">
                <Link href={articlesHref} className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-full text-sm font-bold transition-all">
                  <span>{ctaLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Featured Wide Card */}
        {featured ? (
          <div className="max-w-5xl mx-auto bg-gray-50 rounded-[44px] overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12">
            
            {/* Image Col */}
            <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto min-h-[300px] bg-gray-100 overflow-hidden">
              <img
                src={featured.imageUrl}
                alt={featured.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6 bg-[#F56B71] text-white px-4 py-1.5 rounded-full text-xs font-extrabold shadow-sm flex items-center gap-1">
                <Bookmark className="w-3.5 h-3.5 fill-white" />
                <span>HOT & TRENDING</span>
              </div>
            </div>

            {/* Info Col */}
            <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono font-bold text-[#649FF6] uppercase tracking-wider">
                  <span>{featured.publishedAt}</span>
                  <span>•</span>
                  <span>Oleh {featured.author.name}</span>
                </div>

                <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-gray-950 hover:text-[#649FF6] transition-colors leading-tight">
                  <Link href={`${articlesHref}/${featured.slug}`}>
                    {featured.title}
                  </Link>
                </h3>

                <p className="font-sans text-sm text-gray-600 leading-relaxed">
                  {featured.excerpt}
                </p>

                {/* Tags inside featured article */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {featured.tags.map(tag => (
                    <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-white text-gray-600 border border-gray-150">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author & Read More */}
              <div className="pt-6 border-t border-gray-200/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={featured.author.avatar}
                    alt={featured.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">{featured.author.name}</span>
                    <span className="text-[10px] text-gray-400 block uppercase font-mono tracking-widest">{featured.author.role}</span>
                  </div>
                </div>

                <Link
                  id="featured-article-read-btn"
                  href={`${articlesHref}/${featured.slug}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#649FF6] text-white px-6 py-3.5 rounded-full text-sm font-bold shadow-md shadow-[#649FF6]/10 hover:bg-[#649FF6]/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        ) : null}

      </div>
    </section>
  );
}
