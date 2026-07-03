'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { portfolioData, PortfolioItem } from '../../lib/dummy-data';
import { stripHtmlToText } from '@/components/content/RichHtml';

export interface CasualPortfolioDetailHeroProps {
  showCoverImage?: string;
  badge?: string;
  project?: PortfolioItem;
  backHref?: string;
}

export function CasualPortfolioDetailHero({
  showCoverImage = 'true',
  badge = 'Studi Kasus',
  project = portfolioData[0],
  backHref = '/portfolio',
}: CasualPortfolioDetailHeroProps) {
  const isShowCoverImage = showCoverImage === 'true' || showCoverImage === 'Boolean(true)' || showCoverImage === 'TRUE';

  return (
    <section id="CasualPortfolioDetailHero" className="pt-12 pb-10 bg-gradient-to-b from-[#649FF6]/10 to-transparent overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            id="back-to-portfolio-link"
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#649FF6] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Portofolio</span>
          </Link>
        </div>

        {/* Content details */}
        <div className="space-y-6 text-center md:text-left">
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-[#649FF6] border border-[#649FF6]/20 shadow-sm">
              {badge}
            </span>
            {project.category && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F56B71]/10 text-[#F56B71]">
                {project.category}
              </span>
            )}
          </div>

          <h1 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-950 tracking-tight leading-tight">
            {project.title}
          </h1>

          {project.description && (
            <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto md:mx-0">
              {stripHtmlToText(project.description, 220)}
            </p>
          )}

          <div className="flex items-center justify-center md:justify-start gap-4 pt-2 text-xs font-mono font-bold text-gray-400">
            <span>KLIEN: {project.client}</span>
            <span>•</span>
            <span>TAHUN {project.year}</span>
          </div>
        </div>

        {isShowCoverImage && project.imageUrl && (
          <div className="mt-10 rounded-[40px] overflow-hidden aspect-video bg-gray-100 shadow-xl">
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}

export default CasualPortfolioDetailHero;
