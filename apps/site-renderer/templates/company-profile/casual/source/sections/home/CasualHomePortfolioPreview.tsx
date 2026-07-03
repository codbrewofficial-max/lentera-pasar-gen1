'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { portfolioData, PortfolioItem } from '../../lib/dummy-data';
import { stripHtmlToText } from '@/components/content/RichHtml';

export interface CasualHomePortfolioPreviewProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  portfolios?: PortfolioItem[];
  portfolioDetailHref?: (id: string) => string;
}

export function CasualHomePortfolioPreview({
  title = 'Karya Favorit yang Bikin Kami Bangga',
  description = 'Intip beberapa kolaborasi terseru kami bersama para pemilik UMKM keren. Tiap brand punya cerita unik yang diterjemahkan ke dalam karya visual autentik.',
  ctaLabel = 'Lihat Semua Portofolio',
  ctaUrl = '/portfolio',
  portfolios = portfolioData,
  portfolioDetailHref,
}: CasualHomePortfolioPreviewProps) {
  
  // Only preview first 3 portfolios on Home
  const displayedPortfolios = portfolios.slice(0, 3);

  return (
    <section id="CasualHomePortfolioPreview" className="py-20 bg-white relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-[#F56B71]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-sm font-bold text-[#F56B71] uppercase tracking-widest block font-mono">
              GALERI KARYA
            </span>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
              {title}
            </h2>
            <p className="font-sans text-base text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
          <div className="shrink-0">
            <Link
              id="portfolio-preview-all-cta"
              href={ctaUrl}
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-full text-sm font-bold transition-all"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Portfolio Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayedPortfolios.map((portfolio, index) => (
            <div
              key={portfolio.id}
              className="group rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 bg-white flex flex-col"
            >
              {/* Image with Tag Overlay */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={portfolio.imageUrl}
                  alt={portfolio.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-sm">
                  {portfolio.category}
                </div>
              </div>

              {/* Info Area */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-[#649FF6] font-bold uppercase tracking-wider">
                    {portfolio.client} • {portfolio.year}
                  </span>
                  <h3 className="font-sans font-extrabold text-xl text-gray-950 group-hover:text-[#F56B71] transition-colors">
                    {portfolio.title}
                  </h3>
                  <p className="font-sans text-sm text-gray-600 leading-relaxed line-clamp-2">
                    {stripHtmlToText(portfolio.description, 140)}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-xs">
                  <span className="font-mono text-gray-400">Project Selesai</span>
                  <Link
                    id={`portfolio-view-${portfolio.id}`}
                    href={portfolioDetailHref ? portfolioDetailHref(portfolio.id) : `/portfolio/${portfolio.id}`}
                    className="text-[#649FF6] hover:text-[#649FF6]/80 font-bold inline-flex items-center gap-1 group/link"
                  >
                    <span>Detail Kasus</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
