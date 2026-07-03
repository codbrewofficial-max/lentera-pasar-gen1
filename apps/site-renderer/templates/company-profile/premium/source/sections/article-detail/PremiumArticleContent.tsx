'use client';

import React from 'react';
import { ArrowLeft, Share2, Instagram, Linkedin, Copy } from 'lucide-react';
import Link from 'next/link';
import { ArticleItem } from '../../lib/dummy-data';
import { RichHtml } from '@/components/content/RichHtml';

// Section "article_detail.article_content" ini menggabungkan apa yang sebelumnya jadi 2
// section terpisah (Hero + Content) sesuai penyederhanaan struktur Article Detail jadi 3
// section: Content, Related, CTA.
interface PremiumArticleContentProps {
  article?: ArticleItem;
  backHref?: string;
  businessName?: string;
  businessLogoUrl?: string;
  contentMaxWidth?: string;
  showAuthor?: string;
  showPublishDate?: string;
  showShareLink?: string;
}

export function PremiumArticleContent({
  article,
  backHref = '/articles',
  businessName,
  businessLogoUrl,
  contentMaxWidth = 'max-w-2xl',
  showAuthor = 'true',
  showPublishDate = 'true',
  showShareLink = 'true',
}: PremiumArticleContentProps) {
  if (!article) return null;

  const isShowAuthor = showAuthor === 'true';
  const isShowDate = showPublishDate === 'true';
  const isShowShare = showShareLink === 'true';

  return (
    <section id="premium-article-content" className="bg-[#FAF9F6] text-[#121212]">
      {/* Header (dulu section terpisah "Pembuka Detail Artikel") */}
      <div className="py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <Link href={backHref} className="inline-flex items-center space-x-2 text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400 hover:text-[#649FF6] transition-colors group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Kembali</span>
            </Link>
          </div>

          <div className="space-y-6 text-center">
            {(article.category || (isShowDate && article.publishedDate) || article.readTime) && (
              <div className="flex items-center justify-center space-x-3 text-[10px] font-mono tracking-[0.25em] text-stone-500 uppercase">
                {article.category && <span className="text-[#649FF6] font-semibold">{article.category}</span>}
                {isShowDate && article.publishedDate && (
                  <>
                    <span>•</span>
                    <span>{article.publishedDate}</span>
                  </>
                )}
                {article.readTime && (
                  <>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </>
                )}
              </div>
            )}

            <h1 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-stone-900 leading-tight">
              {article.title}
            </h1>

            {isShowAuthor && businessName && (
              <div className="flex items-center justify-center space-x-3 pt-4 pb-8 border-b border-stone-200">
                {businessLogoUrl && <img src={businessLogoUrl} alt={businessName} className="w-8 h-8 rounded-full object-cover" />}
                <div className="text-left">
                  <span className="text-[10px] text-stone-400 block tracking-wider uppercase">DITULIS OLEH</span>
                  <span className="text-sm font-serif font-light text-stone-800">{businessName}</span>
                </div>
              </div>
            )}
          </div>

          {article.imageUrl && (
            <div className="mt-12 aspect-[21/10] bg-stone-200 overflow-hidden shadow-2xl relative">
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 to-transparent" />
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="py-12 md:py-20">
        <div className={`${contentMaxWidth} mx-auto px-6`}>
          <article className="prose prose-stone max-w-none text-stone-800 text-sm md:text-base leading-relaxed space-y-6 font-sans font-light">
            <RichHtml html={article.content} emptyFallback="Konten artikel kosong atau sedang dalam proses penyusunan oleh redaksi." />
          </article>

          {isShowShare && (
            <div className="mt-16 pt-8 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-2 text-stone-500 text-xs font-sans">
                <Share2 className="w-4 h-4 text-[#B283AF]" />
                <span className="tracking-wide">BAGIKAN ARTIKEL INI</span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => alert('Tautan artikel telah disalin!')}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-stone-200 text-[10px] tracking-wider uppercase font-semibold text-stone-600 hover:text-stone-900 hover:border-stone-400 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>SALIN LINK</span>
                </button>
                <a href="https://linkedin.com" className="inline-flex items-center justify-center p-2 border border-stone-200 text-stone-600 hover:text-[#649FF6] hover:border-[#649FF6]/40 transition-colors" aria-label="Share on LinkedIn">
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
                <a href="https://instagram.com" className="inline-flex items-center justify-center p-2 border border-stone-200 text-stone-600 hover:text-[#F56B71] hover:border-[#F56B71]/40 transition-colors" aria-label="Share on Instagram">
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
