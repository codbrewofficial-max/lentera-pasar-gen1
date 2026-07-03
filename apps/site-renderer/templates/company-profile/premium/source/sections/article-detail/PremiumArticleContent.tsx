'use client';

import React from 'react';
import { Share2, Instagram, Linkedin, Copy } from 'lucide-react';
import { defaultArticles, ArticleItem } from '../../lib/dummy-data';
import { RichHtml } from '@/components/content/RichHtml';

interface PremiumArticleContentProps {
  contentMaxWidth?: string; // "max-w-2xl", "max-w-3xl", etc.
  showShareHint?: string; // "true" / "false"
  article?: ArticleItem;
}

export function PremiumArticleContent({
  contentMaxWidth = "max-w-2xl",
  showShareHint = "true",
  article = defaultArticles[0]
}: PremiumArticleContentProps) {
  if (!article) return null;

  const displayShare = showShareHint === "true";

  return (
    <section id="premium-article-content" className="py-12 md:py-20 bg-[#FAF9F6] text-[#121212]">
      <div className={`${contentMaxWidth} mx-auto px-6`}>
        {/* Article Body Content */}
        <article className="prose prose-stone max-w-none text-stone-800 text-sm md:text-base leading-relaxed space-y-6 font-sans font-light">
          <RichHtml
            html={article.content}
            emptyFallback="Konten artikel kosong atau sedang dalam proses penyusunan oleh redaksi."
          />
        </article>

        {/* Share Hint / Social Block */}
        {displayShare && (
          <div className="mt-16 pt-8 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-2 text-stone-500 text-xs font-sans">
              <Share2 className="w-4 h-4 text-[#B283AF]" />
              <span className="tracking-wide">BAGIKAN ARTIKEL INI</span>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => alert("Tautan artikel telah disalin!")}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-stone-200 text-[10px] tracking-wider uppercase font-semibold text-stone-600 hover:text-stone-900 hover:border-stone-400 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>SALIN LINK</span>
              </button>

              <a
                href="https://linkedin.com"
                className="inline-flex items-center justify-center p-2 border border-stone-200 text-stone-600 hover:text-[#649FF6] hover:border-[#649FF6]/40 transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://instagram.com"
                className="inline-flex items-center justify-center p-2 border border-stone-200 text-stone-600 hover:text-[#F56B71] hover:border-[#F56B71]/40 transition-colors"
                aria-label="Share on Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
