'use client';

import React, { useState } from 'react';
import { articlesData } from '../../lib/dummy-data';
import { Copy, Share2, Twitter, Facebook, CheckCircle2 } from 'lucide-react';
import { RichHtml } from '@/components/content/RichHtml';

export interface CasualArticleContentProps {
  contentMaxWidth?: string;
  showShareHint?: string;
  article?: {
    content: string;
  };
}

export function CasualArticleContent({
  contentMaxWidth = 'max-w-3xl',
  showShareHint = 'true',
  article = articlesData[0],
}: CasualArticleContentProps) {
  
  const [copied, setCopied] = useState(false);

  const isShowShare = showShareHint === 'true' || showShareHint === 'Boolean(true)' || showShareHint === 'TRUE';

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="CasualArticleContent" className="py-10 bg-white">
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${contentMaxWidth}`}>
        
        {/* Article Body Content */}
        <div className="prose prose-lg prose-gray max-w-none text-left">
          <RichHtml html={article.content} emptyFallback="Konten artikel belum tersedia." />
        </div>

        {/* Share Hint Widget (As requested: "showShareHint" string prop to control visibility) */}
        {isShowShare && (
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 p-6 rounded-[28px]">
            <div>
              <h4 className="font-sans font-bold text-sm text-gray-950">
                Sukai tulisan inspiratif ini?
              </h4>
              <p className="text-xs text-gray-500 font-sans mt-0.5">
                Bagikan pada sesama kawan UMKM agar bisa sukses bareng-bareng!
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Copy button */}
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
    </section>
  );
}
