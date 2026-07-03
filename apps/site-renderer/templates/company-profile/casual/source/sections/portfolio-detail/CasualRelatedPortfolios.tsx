'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { portfolioData, PortfolioItem } from '../../lib/dummy-data';
import { stripHtmlToText } from '@/components/content/RichHtml';

export interface CasualRelatedPortfoliosProps {
  title?: string;
  description?: string;
  currentId?: string;
  portfolios?: PortfolioItem[];
  portfolioDetailHref?: (id: string) => string;
}

export function CasualRelatedPortfolios({
  title = 'Proyek Lain yang Mungkin Kamu Suka',
  description = 'Intip beberapa kolaborasi seru kami lainnya bareng pemilik UMKM keren.',
  currentId,
  portfolios = portfolioData,
  portfolioDetailHref,
}: CasualRelatedPortfoliosProps) {
  const filtered = portfolios.filter((item) => item.id !== currentId).slice(0, 3);

  if (filtered.length === 0) {
    return null;
  }

  return (
    <section id="CasualRelatedPortfolios" className="py-16 bg-gray-50 relative overflow-hidden">
      <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-[#F56B71]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
          <span className="text-sm font-bold text-[#F56B71] uppercase tracking-widest block font-mono">
            PORTOFOLIO TERKAIT
          </span>
          <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-gray-950 tracking-tight">
            {title}
          </h2>
          <p className="font-sans text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((portfolio) => (
            <div
              key={portfolio.id}
              className="group rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 bg-white flex flex-col"
            >
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
                    id={`related-portfolio-view-${portfolio.id}`}
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

export default CasualRelatedPortfolios;
