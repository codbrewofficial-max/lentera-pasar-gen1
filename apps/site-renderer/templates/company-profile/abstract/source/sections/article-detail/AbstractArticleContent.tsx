'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Share2, Facebook, Twitter, Copy } from 'lucide-react';
import Link from 'next/link';
import { ArticleItem } from '../../lib/dummy-data';
import { RichHtml } from '@/components/content/RichHtml';

// Section "article_detail.article_content" ini menggabungkan apa yang sebelumnya jadi 2
// section terpisah (Hero + Content) sesuai penyederhanaan struktur Article Detail jadi 3
// section: Content, Related, CTA.
interface AbstractArticleContentProps {
  article?: ArticleItem;
  backHref?: string;
  businessName?: string;
  businessLogoUrl?: string;
  contentMaxWidth?: string;
  showAuthor?: string;
  showPublishDate?: string;
  showShareLink?: string;
}

export function AbstractArticleContent({
  article,
  backHref = '/articles',
  businessName,
  businessLogoUrl,
  contentMaxWidth = 'max-w-3xl',
  showAuthor = 'true',
  showPublishDate = 'true',
  showShareLink = 'true',
}: AbstractArticleContentProps) {
  if (!article) return null;

  const isShowAuthor = showAuthor === 'true';
  const isShowDate = showPublishDate === 'true';
  const isShowShare = showShareLink === 'true';

  return (
    <section className="relative bg-white text-neutral-900 overflow-hidden">
      {/* Header (dulu section terpisah "Pembuka Detail Artikel") */}
      <div className="relative bg-[#151515] text-white py-20 px-6 overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#649FF6] opacity-[0.08] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-6">
            <Link href={backHref} className="inline-flex items-center gap-2 text-xs font-mono lowercase text-neutral-400 hover:text-white transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>kembali</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
            {article.category && (
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#F56B71] text-white font-mono text-xs lowercase font-semibold">
                {article.category}
              </div>
            )}
            {isShowDate && article.publishedAt && (
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

            {isShowAuthor && businessName && (
              <div className="flex items-center gap-3">
                {businessLogoUrl && <img src={businessLogoUrl} alt={businessName} className="w-10 h-10 rounded-full" />}
                <span className="block font-sans text-sm font-semibold text-white">{businessName}</span>
              </div>
            )}
          </div>

          {article.imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative w-full aspect-[21/9] rounded-[2rem] overflow-hidden bg-neutral-900"
            >
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="py-16 px-6">
        <div className={`${contentMaxWidth} mx-auto relative z-10`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {isShowShare ? (
              <div className="lg:col-span-3 lg:block flex flex-row items-center gap-4 lg:space-y-6">
                <div className="font-mono text-xs lowercase text-neutral-400 tracking-wide flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#F56B71]" /> bagikan
                </div>
                <div className="flex lg:flex-col gap-3">
                  <button className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-[#649FF6] hover:text-white flex items-center justify-center text-neutral-600 transition-colors cursor-pointer">
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-[#F56B71] hover:text-white flex items-center justify-center text-neutral-600 transition-colors cursor-pointer">
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-[#B283AF] hover:text-white flex items-center justify-center text-neutral-600 transition-colors cursor-pointer">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden lg:col-span-3" />
            )}

            <div className="lg:col-span-9 space-y-6 font-sans text-neutral-600 text-base sm:text-lg leading-relaxed">
              {article.description && (
                <p className="text-neutral-900 font-sans font-semibold leading-relaxed border-l-4 border-[#649FF6] pl-6 text-base py-1">
                  {article.description}
                </p>
              )}

              <div className="[&_a]:text-[#649FF6] [&_a]:underline [&_strong]:text-neutral-900 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6">
                <RichHtml html={article.content} emptyFallback="Konten artikel belum tersedia." />
              </div>

              {Array.isArray(article.tags) && article.tags.length > 0 && (
                <div className="pt-8 border-t border-neutral-100 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span key={tag} className="font-sans text-xs text-neutral-500 hover:text-neutral-900 transition-colors bg-neutral-100 rounded-full px-3 py-1.5">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
