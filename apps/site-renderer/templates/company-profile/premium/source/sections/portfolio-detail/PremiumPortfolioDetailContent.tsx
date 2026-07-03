'use client';

import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { PortfolioItem } from '../../lib/dummy-data';
import { RichHtml } from '@/components/content/RichHtml';

function widthClass(value?: string) {
  const normalized = (value || '').toLowerCase();
  if (normalized.includes('2xl')) return 'max-w-2xl';
  if (normalized.includes('5xl') || normalized.includes('wide')) return 'max-w-5xl';
  return 'max-w-3xl';
}

// Section "portfolio_detail.portfolio_detail_content" ini menggabungkan apa yang
// sebelumnya jadi 2 section terpisah (Hero + Content) sesuai penyederhanaan struktur
// Portfolio Detail jadi 3 section: Content, Related, CTA.
export interface PremiumPortfolioDetailContentProps {
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

export function PremiumPortfolioDetailContent({
  project,
  badge = 'Studi Kasus',
  backHref = '/portfolio',
  businessName,
  businessLogoUrl,
  contentMaxWidth = 'max-w-3xl',
  showAuthor = 'true',
  showPublishDate = 'true',
  showShareLink = 'true',
}: PremiumPortfolioDetailContentProps) {
  if (!project) return null;

  const isShowAuthor = showAuthor === 'true';
  const isShowDate = showPublishDate === 'true';
  const isShowShare = showShareLink === 'true';
  const width = widthClass(contentMaxWidth);

  return (
    <section id="premium-portfolio-detail-content" className="bg-[#0E0E0F] text-white">
      {/* Header (dulu section terpisah "Pembuka Detail Portfolio") */}
      <div className="pt-16 pb-20 md:pt-24 md:pb-28 relative overflow-hidden">
        <div className="absolute top-0 left-20 w-[1px] h-full bg-white/5 hidden lg:block" />
        <div className="absolute top-0 right-20 w-[1px] h-full bg-white/5 hidden lg:block" />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <a href={backHref} className="inline-flex items-center space-x-2 text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400 hover:text-[#649FF6] transition-colors mb-10 group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali</span>
          </a>

          <div className="flex items-center space-x-2 mb-6">
            {badge && (
              <>
                <Sparkles className="w-4 h-4 text-[#B283AF]" />
                <span className="text-[10px] font-bold tracking-[0.3em] text-[#B283AF] uppercase">{badge}</span>
              </>
            )}
            {project.category && (
              <>
                <span className="text-stone-600">/</span>
                <span className="text-[10px] font-bold tracking-[0.3em] text-[#649FF6] uppercase">{project.category}</span>
              </>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light tracking-tight text-white leading-tight max-w-3xl">
            {project.title}
          </h1>

          {((isShowAuthor && businessName) || project.client || (isShowDate && project.year) || project.location) && (
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 pt-6 border-t border-white/5">
              {isShowAuthor && businessName && (
                <div className="flex items-center gap-2">
                  {businessLogoUrl && <img src={businessLogoUrl} alt={businessName} className="w-7 h-7 rounded-full object-cover" />}
                  <span className="text-xs text-stone-300 font-serif font-light">{businessName}</span>
                </div>
              )}
              {project.client && (
                <div>
                  <span className="text-[9px] text-stone-500 block uppercase tracking-wider font-sans">Klien</span>
                  <span className="text-xs text-stone-300 font-serif font-light">{project.client}</span>
                </div>
              )}
              {isShowDate && project.year && (
                <div>
                  <span className="text-[9px] text-stone-500 block uppercase tracking-wider font-sans">Tahun</span>
                  <span className="text-xs text-stone-300 font-serif font-light">{project.year}</span>
                </div>
              )}
              {project.location && (
                <div>
                  <span className="text-[9px] text-stone-500 block uppercase tracking-wider font-sans">Lokasi</span>
                  <span className="text-xs text-stone-300 font-serif font-light">{project.location}</span>
                </div>
              )}
            </div>
          )}

          {project.imageUrl && (
            <div className="mt-12 aspect-[16/9] w-full bg-stone-900 overflow-hidden">
              <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="py-20 md:py-28 bg-[#FAF9F6] text-[#121212] border-t border-stone-200">
        <div className={`${width} mx-auto px-6`}>
          {Array.isArray(project.tags) && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-bold tracking-widest uppercase text-stone-500 border border-stone-300 px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="prose prose-stone max-w-none font-sans font-light text-stone-700 leading-relaxed text-sm md:text-base">
            <RichHtml html={project.description} emptyFallback="Cerita lengkap proyek ini akan segera hadir." />
          </div>

          {isShowShare && (
            <div className="mt-12 pt-6 border-t border-stone-200 text-[10px] font-bold tracking-[0.25em] uppercase text-stone-400">
              Karya ini bagian dari koleksi eksklusif kami
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default PremiumPortfolioDetailContent;
