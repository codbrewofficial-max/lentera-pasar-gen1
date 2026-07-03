'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
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
interface AbstractPortfolioDetailContentProps {
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

export function AbstractPortfolioDetailContent({
  project,
  badge = 'Studi Kasus',
  backHref = '/portfolio',
  businessName,
  businessLogoUrl,
  contentMaxWidth = 'max-w-3xl',
  showAuthor = 'true',
  showPublishDate = 'true',
  showShareLink = 'true',
}: AbstractPortfolioDetailContentProps) {
  if (!project) return null;

  const isShowAuthor = showAuthor === 'true';
  const isShowDate = showPublishDate === 'true';
  const isShowShare = showShareLink === 'true';
  const width = widthClass(contentMaxWidth);

  return (
    <section className="relative bg-white text-neutral-900 overflow-hidden">
      {/* Header (dulu section terpisah "Pembuka Detail Portfolio") */}
      <div className="relative bg-[#151515] text-white py-20 px-6 overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#649FF6] opacity-[0.08] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="mb-6">
            <Link href={backHref} className="inline-flex items-center gap-2 text-xs font-mono lowercase text-neutral-400 hover:text-white transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>kembali</span>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
            {badge && (
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#F56B71] text-white font-mono text-xs lowercase font-semibold">
                {badge}
              </div>
            )}
            {project.category && (
              <div className="font-sans text-xs text-neutral-400">
                Kategori: <span className="text-white font-semibold">{project.category}</span>
              </div>
            )}
          </div>

          <div className="space-y-6 mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-tight text-white"
            >
              {project.title}
            </motion.h1>

            <div className="flex flex-wrap items-center gap-8 pt-2">
              {isShowAuthor && businessName && (
                <div className="flex items-center gap-2">
                  {businessLogoUrl && <img src={businessLogoUrl} alt={businessName} className="w-8 h-8 rounded-full" />}
                  <span className="font-sans text-sm font-semibold text-white">{businessName}</span>
                </div>
              )}
              {project.client && (
                <div>
                  <span className="font-sans text-xs text-neutral-500 block mb-0.5">Klien</span>
                  <span className="font-sans text-sm font-semibold text-white">{project.client}</span>
                </div>
              )}
              {isShowDate && project.year && (
                <div>
                  <span className="font-sans text-xs text-neutral-500 block mb-0.5">Tahun</span>
                  <span className="font-sans text-sm font-semibold text-white">{project.year}</span>
                </div>
              )}
            </div>
          </div>

          {project.imageUrl && (
            <div className="w-full aspect-video rounded-[2rem] bg-neutral-900 overflow-hidden">
              <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="py-20 px-6">
        <div className={`${width} mx-auto`}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#649FF6]/10 mb-8">
            <span className="font-mono text-xs lowercase tracking-wide text-[#649FF6]">detail proyek</span>
          </div>

          <div className="font-sans text-base leading-relaxed text-neutral-600">
            <RichHtml html={project.description} emptyFallback="Cerita lengkap proyek ini akan segera hadir." />
          </div>

          {isShowShare && (
            <div className="mt-12 pt-6 border-t border-neutral-100 flex items-center gap-3 font-sans text-xs font-medium text-neutral-400">
              <span className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-[#F56B71]">
                <Sparkles className="w-4 h-4" />
              </span>
              <span>Suka karya ini? Sebarkan ke jaringanmu.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AbstractPortfolioDetailContent;
