'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PortfolioItem } from '../../lib/dummy-data';
import { RichHtml } from '@/components/content/RichHtml';

// Section "portfolio_detail.portfolio_detail_content" ini menggabungkan apa yang
// sebelumnya jadi 2 section terpisah (Hero + Content) sesuai penyederhanaan struktur
// Portfolio Detail jadi 3 section: Content, Related, CTA.
export interface CasualPortfolioDetailContentProps {
  project?: PortfolioItem;
  badge?: string;
  backHref?: string;
  businessName?: string;
  businessLogoUrl?: string;
  contentMaxWidth?: string;
  showAuthor?: string;
  showPublishDate?: string;
  showShareLink?: string;
}

export function CasualPortfolioDetailContent({
  project,
  badge = 'Studi Kasus',
  backHref = '/portfolio',
  businessName,
  businessLogoUrl,
  contentMaxWidth = 'max-w-3xl',
  showAuthor = 'true',
  showPublishDate = 'true',
  showShareLink = 'true',
}: CasualPortfolioDetailContentProps) {
  if (!project) return null;

  const isShowAuthor = showAuthor === 'true' || showAuthor === 'Boolean(true)' || showAuthor === 'TRUE';
  const isShowDate = showPublishDate === 'true' || showPublishDate === 'Boolean(true)' || showPublishDate === 'TRUE';
  const isShowShare = showShareLink === 'true' || showShareLink === 'Boolean(true)' || showShareLink === 'TRUE';

  return (
    <section id="CasualPortfolioDetailContent" className="bg-white">
      {/* Header (dulu section terpisah "Pembuka Detail Portfolio") */}
      <div className="pt-12 pb-10 bg-gradient-to-b from-[#649FF6]/10 to-transparent overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-6">
            <Link id="back-to-portfolio-link" href={backHref} className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-[#649FF6] transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Kembali</span>
            </Link>
          </div>

          <div className="space-y-6 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {badge && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white text-[#649FF6] border border-[#649FF6]/20 shadow-sm">{badge}</span>
              )}
              {project.category && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F56B71]/10 text-[#F56B71]">{project.category}</span>
              )}
            </div>

            <h1 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-950 tracking-tight leading-tight">
              {project.title}
            </h1>

            {((isShowAuthor && businessName) || (isShowDate && project.year) || project.client) && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-mono font-bold text-gray-400">
                {isShowAuthor && businessName && (
                  <span className="inline-flex items-center gap-2 normal-case font-sans text-gray-700">
                    {businessLogoUrl && <img src={businessLogoUrl} alt={businessName} className="w-6 h-6 rounded-full object-cover" />}
                    {businessName}
                  </span>
                )}
                {project.client && <span>KLIEN: {project.client}</span>}
                {isShowDate && project.year && <span>TAHUN {project.year}</span>}
              </div>
            )}
          </div>

          {project.imageUrl && (
            <div className="mt-10 rounded-[40px] overflow-hidden aspect-video bg-gray-100 shadow-xl">
              <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="py-12">
        <div className={`${contentMaxWidth} mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className="prose prose-lg max-w-none font-sans text-gray-700 leading-relaxed">
            <RichHtml html={project.description} emptyFallback="Cerita lengkap proyek ini akan segera hadir." />
          </div>

          {isShowShare && (
            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center gap-3 text-xs font-bold text-gray-400">
              <span className="w-8 h-8 rounded-full bg-[#649FF6]/10 flex items-center justify-center text-[#649FF6]">✦</span>
              <span>Suka sama hasil kerja kami? Yuk, ceritakan ke teman-temanmu juga!</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CasualPortfolioDetailContent;
