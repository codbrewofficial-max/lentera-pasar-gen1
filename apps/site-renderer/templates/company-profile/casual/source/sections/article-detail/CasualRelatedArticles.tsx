'use client';

import React from 'react';
import Link from 'next/link';
import { articlesData } from '@/lib/dummy-data';
import { ArrowRight } from 'lucide-react';

export interface CasualRelatedArticlesProps {
  title?: string;
  description?: string;
  currentSlug?: string;
}

export function CasualRelatedArticles({
  title = 'Inspirasi Terkait yang Tak Kalah Seru',
  description = 'Lanjutkan petualangan belajarmu dengan membaca beberapa tips penting lainnya langsung dari dapur kreativitas tim Ruang Karsa.',
  currentSlug = '5-tips-branding-umkm-kuliner',
}: CasualRelatedArticlesProps) {
  
  // Filter out current active article and pick other articles
  const related = articlesData.filter(art => art.slug !== currentSlug).slice(0, 2);

  return (
    <section id="CasualRelatedArticles" className="py-16 bg-gray-50 border-t border-gray-100 relative overflow-hidden">
      
      {/* Decorative Blob */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-64 h-64 rounded-full bg-[#F56B71]/5 blur-2xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold text-[#649FF6] uppercase tracking-widest block font-mono">
            REKOMENDASI BACAAN
          </span>
          <h3 className="font-sans font-extrabold text-2xl text-gray-950 tracking-tight">
            {title}
          </h3>
          <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* 2 Related Article Cards Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {related.map((art, idx) => (
            <div
              key={art.id}
              className="group bg-white rounded-[32px] overflow-hidden border border-gray-150 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col md:flex-row"
            >
              
              {/* Cover mini image */}
              <div className="md:w-2/5 aspect-[16/10] md:aspect-auto relative bg-gray-100 overflow-hidden shrink-0">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Text Info */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-gray-400">
                    {art.publishedAt}
                  </span>
                  <h4 className="font-sans font-extrabold text-base text-gray-950 group-hover:text-[#F56B71] transition-colors line-clamp-2 leading-snug">
                    <Link href={`/articles/${art.slug}`}>
                      {art.title}
                    </Link>
                  </h4>
                </div>

                <Link
                  id={`related-read-${art.slug}`}
                  href={`/articles/${art.slug}`}
                  className="text-xs font-bold text-[#649FF6] hover:text-[#649FF6]/80 inline-flex items-center gap-1 group/link"
                >
                  <span>Baca Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
