'use client';

import React, { useState } from 'react';
import { articlesData } from '@/lib/dummy-data';
import { Copy, Share2, Twitter, Facebook, CheckCircle2 } from 'lucide-react';

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

  // Format content text: parse simple double-asterisks for bolding, and replace newlines with nice paragraph layouts
  const formatParagraphs = (text: string) => {
    return text.split('\n\n').map((para, pIdx) => {
      // Simple parse of bullet-like lists
      if (para.startsWith('1.') || para.startsWith('2.') || para.startsWith('3.') || para.startsWith('4.') || para.startsWith('5.')) {
        const lines = para.split('\n');
        return (
          <div key={pIdx} className="space-y-4 my-6">
            {lines.map((line, lIdx) => {
              // Parse title and body
              const parts = line.split('**');
              if (parts.length > 2) {
                return (
                  <div key={lIdx} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#649FF6] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {line.trim().charAt(0)}
                    </span>
                    <div>
                      <strong className="font-sans font-extrabold text-gray-950 block text-base mb-1">
                        {parts[1]}
                      </strong>
                      <span className="font-sans text-sm text-gray-700 leading-relaxed block">
                        {parts.slice(2).join('')}
                      </span>
                    </div>
                  </div>
                );
              }
              return (
                <p key={lIdx} className="font-sans text-sm text-gray-700 leading-relaxed pl-6">
                  {line}
                </p>
              );
            })}
          </div>
        );
      }

      // Default paragraph text rendering
      return (
        <p key={pIdx} className="font-sans text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
          {para}
        </p>
      );
    });
  };

  return (
    <section id="CasualArticleContent" className="py-10 bg-white">
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${contentMaxWidth}`}>
        
        {/* Article Body Content */}
        <div className="prose prose-lg prose-gray max-w-none text-left">
          {formatParagraphs(article.content)}
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
