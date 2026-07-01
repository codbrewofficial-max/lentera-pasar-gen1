'use client';

import React from 'react';
import { MapPin, Calendar, Layers, ExternalLink } from 'lucide-react';
import { defaultPortfolios, PortfolioItem } from '../../lib/dummy-data';

interface PremiumPortfolioGridProps {
  title?: string;
  description?: string;
  portfolios?: PortfolioItem[];
}

export function PremiumPortfolioGrid({
  title = "Portofolio Masterpiece",
  description = "Tinjau kelengkapan visual, detail fungsional, serta orisinalitas material dari koleksi karya terpilih kami.",
  portfolios = defaultPortfolios
}: PremiumPortfolioGridProps) {
  return (
    <section id="premium-portfolio-grid" className="py-24 md:py-32 bg-[#0E0E0F] text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Block */}
        <div className="max-w-3xl mb-20 space-y-4">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#649FF6] uppercase block">HASIL KARYA</span>
          <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-white">{title}</h2>
          <p className="text-stone-400 text-xs md:text-sm leading-relaxed font-sans font-light">
            {description}
          </p>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {portfolios.map((project) => (
            <div
              key={project.id}
              className="bg-[#121214] border border-white/5 overflow-hidden flex flex-col group hover:border-[#649FF6]/30 transition-all duration-500 shadow-xl"
            >
              {/* Image Area */}
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-[103%] transition-all duration-700 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121214]/60 to-transparent" />
                <span className="absolute top-4 left-4 bg-[#0E0E0F] border border-white/10 px-3 py-1 text-[9px] tracking-widest uppercase text-stone-300">
                  {project.category}
                </span>
              </div>

              {/* Text / Info Area */}
              <div className="p-8 space-y-6 flex-grow flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-stone-500 text-[10px] tracking-widest uppercase font-mono border-b border-white/5 pb-4">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-[#F56B71]" />
                      <span>{project.location || "Indonesia"}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-[#649FF6]" />
                      <span>{project.year}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Layers className="w-3 h-3 text-[#B283AF]" />
                      <span>{project.client}</span>
                    </span>
                  </div>

                  <h3 className="text-2xl font-serif font-light text-white group-hover:text-[#649FF6] transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-stone-400 text-xs leading-relaxed font-sans font-light">
                    {project.description}
                  </p>
                </div>

                {/* Tags & Action Row */}
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[9px] text-stone-400 bg-white/5 px-2.5 py-1 font-sans border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs font-semibold text-[#649FF6] group-hover:text-white transition-colors tracking-widest flex items-center space-x-1">
                    <span>DETAIL KARYA</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
