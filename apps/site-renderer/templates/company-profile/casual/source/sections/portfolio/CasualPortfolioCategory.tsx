'use client';

import React from 'react';
import Link from 'next/link';
import { Palette, Instagram, Laptop, Camera, ArrowRight } from 'lucide-react';

export interface CasualPortfolioCategoryProps {
  title?: string;
  description?: string;
  badge?: string;
  categories?: string[];
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const ICONS = [Palette, Instagram, Laptop, Camera];
const ACCENTS = ['#649FF6', '#F56B71', '#B283AF', '#649FF6'];

export function CasualPortfolioCategory({
  title = 'Kategori Portofolio Kreatif',
  description = 'Kami membagi portofolio kami menjadi beberapa bidang keahlian utama untuk memudahkan kamu menemukan inspirasi visual yang cocok untuk bidang jualan tokomu.',
  badge = 'BIDANG SPESIALISASI',
  categories = [],
  imageUrl,
  ctaLabel,
  ctaHref = '/contact',
}: CasualPortfolioCategoryProps) {
  // Kategori sekarang murni dari data Kategori Portfolio asli yang owner input di
  // dashboard (bukan lagi 4 kartu contoh dengan angka fiktif seperti "42 Project selesai").
  if (categories.length === 0) return null;

  return (
    <section id="CasualPortfolioCategory" className="bg-gray-50 relative overflow-hidden">
      {imageUrl ? (
        <div className="relative py-16 md:py-20 mb-4 overflow-hidden text-white text-center">
          <div className="absolute inset-0">
            <img src={imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gray-950/70" />
          </div>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
            <span className="text-sm font-bold text-white/80 uppercase tracking-widest block font-mono">{badge}</span>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight">{title}</h2>
            <p className="font-sans text-base text-gray-200 leading-relaxed">{description}</p>
            {ctaLabel && (
              <div className="pt-2">
                <Link href={ctaHref} className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-100 transition-all">
                  <span>{ctaLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="absolute top-0 right-10 w-72 h-72 bg-[#649FF6]/5 blur-3xl pointer-events-none" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 md:py-16">
        {!imageUrl && (
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <span className="text-sm font-bold text-[#B283AF] uppercase tracking-widest block font-mono">
              {badge}
            </span>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
              {title}
            </h2>
            <p className="font-sans text-base text-gray-600 leading-relaxed">
              {description}
            </p>
            {ctaLabel && (
              <div className="pt-2">
                <Link href={ctaHref} className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-full text-sm font-bold transition-all">
                  <span>{ctaLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Category Cards */}
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          {categories.map((category, index) => {
            const Icon = ICONS[index % ICONS.length];
            const accent = ACCENTS[index % ACCENTS.length];
            return (
              <div
                key={`${category}-${index}`}
                className="bg-white rounded-full pl-3 pr-5 py-2.5 border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accent}1a` }}>
                  <Icon className="w-4 h-4" style={{ color: accent }} />
                </div>
                <span className="font-sans font-bold text-sm text-gray-800">{category}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
