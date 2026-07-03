'use client';

import React from 'react';
import { Share2, Facebook, Twitter, Copy } from 'lucide-react';
import { defaultArticles, ArticleItem } from '../../lib/dummy-data';
import { RichHtml } from '@/components/content/RichHtml';

interface AbstractArticleContentProps {
  contentMaxWidth?: string;
  showShareHint?: string;
  article?: ArticleItem;
}

export function AbstractArticleContent({
  contentMaxWidth = "max-w-3xl",
  showShareHint = "true",
  article = defaultArticles[0],
}: AbstractArticleContentProps) {
  const isShowShare = showShareHint === "true";

  return (
    <section className="relative bg-white text-neutral-900 py-16 px-6 overflow-hidden">
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

            <p className="text-neutral-900 font-sans font-semibold leading-relaxed border-l-4 border-[#649FF6] pl-6 text-base py-1">
              {article.description}
            </p>

            <div className="[&_a]:text-[#649FF6] [&_a]:underline [&_strong]:text-neutral-900 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6">
              <RichHtml html={article.content} emptyFallback="Konten artikel belum tersedia." />
            </div>

            <blockquote className="rounded-3xl bg-neutral-50 p-6 font-sans text-base font-medium text-neutral-700 leading-relaxed my-10">
              &ldquo;Desain yang berani tidak mencari keseimbangan yang nyaman. Ia melepaskan energi ekspresif untuk memikat indera.&rdquo;
            </blockquote>

            <div className="pt-8 border-t border-neutral-100 flex flex-wrap gap-2">
              {article.tags?.map((tag) => (
                <span key={tag} className="font-sans text-xs text-neutral-500 hover:text-neutral-900 transition-colors bg-neutral-100 rounded-full px-3 py-1.5">
                  #{tag}
                </span>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
