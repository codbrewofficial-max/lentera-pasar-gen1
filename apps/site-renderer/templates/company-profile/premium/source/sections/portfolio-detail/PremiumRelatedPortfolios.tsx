'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { defaultPortfolios, PortfolioItem } from '../../lib/dummy-data';

export interface PremiumRelatedPortfoliosProps {
  title?: string;
  description?: string;
  currentId?: string;
  portfolios?: PortfolioItem[];
}

export function PremiumRelatedPortfolios({
  title = 'Karya Pilihan Lainnya',
  description = 'Jelajahi rangkaian karya lain dari portofolio kami yang menonjolkan standar kualitas dan detail yang sama.',
  currentId,
  portfolios = defaultPortfolios,
}: PremiumRelatedPortfoliosProps) {
  const filtered = portfolios.filter((item) => item.id !== currentId).slice(0, 2);

  if (filtered.length === 0) {
    return null;
  }

  return (
    <section id="premium-related-portfolios" className="py-24 md:py-32 bg-[#0E0E0F] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#B283AF] uppercase block">Koleksi Terkait</span>
          <h2 className="text-3xl font-serif font-light tracking-tight">{title}</h2>
          <p className="text-stone-400 text-xs md:text-sm leading-relaxed font-sans font-light">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="border border-white/5 bg-[#121214] p-6 flex flex-col sm:flex-row gap-6 hover:border-[#649FF6]/40 transition-colors group"
            >
              <div className="w-full sm:w-1/3 aspect-[4/3] sm:aspect-square bg-stone-900 overflow-hidden shrink-0 relative">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[8px] tracking-widest text-[#649FF6] uppercase font-mono block">
                    {project.category}
                  </span>
                  <h3 className="text-base font-serif font-light text-white group-hover:text-[#649FF6] transition-colors leading-snug line-clamp-2">
                    <a href={`/portfolio?id=${project.id}`}>{project.title}</a>
                  </h3>
                  <p className="text-stone-400 text-[11px] leading-relaxed font-sans font-light line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <a
                  href={`/portfolio?id=${project.id}`}
                  className="inline-flex items-center space-x-1.5 text-[10px] font-bold tracking-wider uppercase text-stone-300 hover:text-[#649FF6] transition-colors"
                >
                  <span>Lihat Detail</span>
                  <ArrowRight className="w-3 h-3 text-[#F56B71]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PremiumRelatedPortfolios;
