'use client';

import React, { useState } from 'react';
import { Calendar, ArrowLeft, Copy, Twitter, Facebook, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { RichHtml } from '@/components/content/RichHtml';

// Section "article_detail.article_content" ini menggabungkan apa yang sebelumnya jadi 2
// section terpisah (Hero + Content) sesuai penyederhanaan struktur Article Detail jadi 3
// section: Content, Related, CTA.
export interface CasualArticleContentProps {
  contentMaxWidth?: string;
  showAuthor?: string;
  showPublishDate?: string;
  showShareLink?: string;
  backHref?: string;
  businessName?: string;
  businessLogoUrl?: string;
  article?: {
    title: string;
    content: string;
    imageUrl: string;
    publishedAt: string;
    tags: string[];
  };
}

export function CasualArticleContent({
  contentMaxWidth = 'max-w-3xl',
  showAuthor = 'true',
  showPublishDate = 'true',
  showShareLink = 'true',
  backHref = '/articles',
  businessName,
  businessLogoUrl,
  article,
}: CasualArticleContentProps) {
  const [copied, setCopied] = useState(false);
  if (!article) return null;

  const isShowAuthor = showAuthor === 'true' || showAuthor === 'Boolean(true)' || showAuthor === 'TRUE';
  const isShowDate = showPublishDate === 'true' || showPublishDate === 'Boolean(true)' || showPublishDate === 'TRUE';
  const isShowShare = showShareLink === 'true' || showShareLink === 'Boolean(true)' || showShareLink === 'TRUE';

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="CasualArticleContent" className="bg-white">
      {/* Header (dulu section terpisah "Pembuka Detail Artikel") */}
      <div className="pt-12 pb-10 bg-gradient-to-b from-[#649FF6]/10 to-transparent overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-6">
            <Link id="back-to-articles-link" href={backHref} className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#649FF6] transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Kembali</span>
            </Link>
          </div>

          <div className="space-y-6 text-center md:text-left">
            {Array.isArray(article.tags) && article.tags.length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-white text-[#649FF6] border border-[#649FF6]/20 shadow-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-950 tracking-tight leading-tight">
              {article.title}
            </h1>

            {(isShowAuthor || isShowDate) && (businessName || article.publishedAt) && (
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2 pb-4 border-b border-gray-100">
                {isShowAuthor && businessName && (
                  <div className="flex items-center gap-2.5">
                    {businessLogoUrl && (
                      <img src={businessLogoUrl} alt={businessName} className="w-10 h-10 rounded-full object-cover border-2 border-[#649FF6]/25" />
                    )}
                    <span className="text-sm font-bold text-gray-900 block text-left">{businessName}</span>
                  </div>
                )}
                {isShowDate && article.publishedAt && (
                  <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono font-bold text-gray-400 uppercase tracking-widest pl-4 border-l border-gray-200">
                    <Calendar className="w-4 h-4 text-gray-300" />
                    <span>RILIS: {article.publishedAt}</span>
                  </div>
                )}
              </div>
            )}

            {article.imageUrl && (
              <div className="mt-8 rounded-[40px] overflow-hidden border-4 border-white shadow-xl aspect-[16/9] bg-gray-100">
                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="py-10">
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${contentMaxWidth}`}>
          <div className="prose prose-lg prose-gray max-w-none text-left">
            <RichHtml html={article.content} emptyFallback="Konten artikel belum tersedia." />
          </div>

          {isShowShare && (
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 p-6 rounded-[28px]">
              <div>
                <h4 className="font-sans font-bold text-sm text-gray-950">Sukai tulisan inspiratif ini?</h4>
                <p className="text-xs text-gray-500 font-sans mt-0.5">Bagikan pada sesama kawan UMKM agar bisa sukses bareng-bareng!</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 hover:text-gray-900 font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Tautan</span>
                    </>
                  )}
                </button>
                <button className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-blue-500 hover:bg-gray-50 shadow-sm">
                  <Twitter className="w-4 h-4 fill-current" />
                </button>
                <button className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-blue-800 hover:bg-gray-50 shadow-sm">
                  <Facebook className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
