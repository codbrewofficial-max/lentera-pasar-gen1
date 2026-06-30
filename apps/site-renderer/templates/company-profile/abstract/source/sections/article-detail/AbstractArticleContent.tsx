'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Share2, Facebook, Twitter, Link2, Copy } from 'lucide-react';
import { defaultArticles, ArticleItem } from '../../lib/dummy-data';

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
    <section className="relative bg-[#0d0d0d] text-white py-16 px-6 border-b-8 border-white overflow-hidden">
      <div className={`${contentMaxWidth} mx-auto relative z-10`}>
        
        {/* Main Content Layout (Grid with Share sidebar on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Share Sidebar (3 cols) */}
          {isShowShare ? (
            <div className="lg:col-span-3 lg:block flex flex-row items-center gap-4 lg:space-y-6">
              <div className="font-mono text-xs text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#F56B71]" /> SHARE //
              </div>
              
              <div className="flex lg:flex-col gap-3">
                <button className="w-10 h-10 border border-neutral-700 hover:border-white bg-black flex items-center justify-center text-white hover:text-[#649FF6] hover:shadow-[-3px_3px_0px_white] transition-all cursor-pointer">
                  <Facebook className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 border border-neutral-700 hover:border-white bg-black flex items-center justify-center text-white hover:text-[#F56B71] hover:shadow-[-3px_3px_0px_white] transition-all cursor-pointer">
                  <Twitter className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 border border-neutral-700 hover:border-white bg-black flex items-center justify-center text-white hover:text-[#B283AF] hover:shadow-[-3px_3px_0px_white] transition-all cursor-pointer">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden lg:col-span-3" />
          )}

          {/* Article Text (9 cols) */}
          <div className="lg:col-span-9 space-y-6 font-sans text-neutral-300 text-base sm:text-lg leading-relaxed">
            
            {/* Lead paragraph */}
            <p className="text-white font-mono font-bold leading-relaxed border-l-4 border-[#649FF6] pl-6 text-base uppercase tracking-tight py-1">
              {article.description}
            </p>

            {/* Split paragraphs manually for beautiful layout */}
            {article.content.split('\n\n').map((para, idx) => {
              if (idx === 1) {
                return (
                  <div key={idx} className="my-10 relative">
                    {/* Shadow offset block */}
                    <div className="absolute inset-0 bg-[#B283AF] transform -skew-x-3 translate-x-1.5 translate-y-1.5 border border-white" />
                    <blockquote className="relative bg-black border-2 border-white p-6 font-mono text-sm tracking-wide text-[#649FF6] uppercase leading-relaxed">
                      &ldquo;DESAIN YANG REVOLUSI TIDAK MENCARI KESEIMBANGAN YANG NYAMAN. IA MELEPASKAN ENERGI EKSPRESIF DAN ASIMETRI UNTUK MEMIKAT INDERA.&rdquo;
                    </blockquote>
                  </div>
                );
              }
              return (
                <p key={idx} className="whitespace-pre-line">
                  {para}
                </p>
              );
            })}

            {/* Tags footer */}
            <div className="pt-8 border-t border-dashed border-neutral-800 flex flex-wrap gap-2">
              {article.tags?.map((tag) => (
                <span key={tag} className="font-mono text-[10px] text-neutral-500 hover:text-white transition-colors bg-neutral-900 border border-neutral-800 px-2.5 py-1">
                  #{tag.toUpperCase()}
                </span>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
