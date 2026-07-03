'use client';

import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { defaultPortfolios, PortfolioItem } from '../../lib/dummy-data';
import { stripHtmlToText } from '@/components/content/RichHtml';

interface PremiumHomePortfolioPreviewProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  portfolios?: PortfolioItem[];
}

export function PremiumHomePortfolioPreview({
  title = "Karya Terpilih & Landmark",
  description = "Tinjau beberapa mahakarya spatial yang menggambarkan komitmen kami terhadap presisi struktural, kecanggihan sirkulasi udara, serta penataan estetika taktil.",
  ctaLabel = "LIHAT SEMUA PORTOFOLIO",
  ctaUrl = "/portfolio",
  portfolios = defaultPortfolios.slice(0, 3) // Show first 3 for preview
}: PremiumHomePortfolioPreviewProps) {
  return (
    <section id="premium-home-portfolio-preview" className="py-24 md:py-32 bg-[#FAF9F6] text-[#121212]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Block */}
        <div className="max-w-3xl mb-20 space-y-4">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#B283AF] uppercase block">KURASI ESTETIKA</span>
          <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-stone-900">{title}</h2>
          <p className="text-stone-600 text-sm md:text-base leading-relaxed font-sans font-light">
            {description}
          </p>
        </div>

        {/* Portfolio Showcase Grid (Large Cards with Hairline borders) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {portfolios.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-stone-200/60 overflow-hidden shadow-sm group hover:shadow-xl transition-all duration-500 flex flex-col h-full"
            >
              {/* Image Area */}
              <div className="relative overflow-hidden aspect-[4/3] bg-stone-100">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 border border-stone-200 text-[10px] tracking-widest font-semibold uppercase text-stone-800">
                  {project.category}
                </div>
              </div>

              {/* Text Area */}
              <div className="p-8 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-stone-400 text-[10px] tracking-widest uppercase font-mono">
                    <MapPin className="w-3 h-3 text-[#F56B71]" />
                    <span>{project.location || "Indonesia"}</span>
                    <span>•</span>
                    <span>{project.year}</span>
                  </div>
                  <h3 className="text-xl font-serif font-light text-stone-900 group-hover:text-[#649FF6] transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-stone-600 text-xs leading-relaxed font-sans font-light">
                    {stripHtmlToText(project.description, 140)}
                  </p>
                </div>

                {/* Tags & Action */}
                <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[9px] text-stone-500 bg-stone-100 px-2 py-1 font-sans"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={`/portfolio?id=${project.id}`}
                    className="text-xs font-semibold text-stone-800 group-hover:text-[#649FF6] transition-colors tracking-widest"
                  >
                    DETAIL →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Link */}
        <div className="text-center">
          <a
            id="portfolio-preview-cta"
            href={ctaUrl}
            className="inline-flex items-center space-x-3 text-xs font-semibold tracking-[0.25em] text-stone-900 hover:text-[#649FF6] transition-colors py-2.5 border-b border-stone-300 hover:border-[#649FF6]"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F56B71]" />
          </a>
        </div>
      </div>
    </section>
  );
}
