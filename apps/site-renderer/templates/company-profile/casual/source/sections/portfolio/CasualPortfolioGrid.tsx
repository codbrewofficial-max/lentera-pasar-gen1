'use client';

import React, { useState } from 'react';
import { portfolioData, PortfolioItem } from '@/lib/dummy-data';
import { Filter, ArrowRight, Sparkles } from 'lucide-react';

export interface CasualPortfolioGridProps {
  title?: string;
  description?: string;
  portfolios?: PortfolioItem[];
}

export function CasualPortfolioGrid({
  title = 'Inspirasi Karya Pilihan',
  description = 'Gunakan filter di bawah ini untuk menjelajahi karya tim kreatif kami. Temukan konsep visual yang paling cocok dengan kepribadian dan nilai unik dari tokomu.',
  portfolios = portfolioData,
}: CasualPortfolioGridProps) {
  
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Branding & Kemasan', 'Sosial Media', 'Website Desain', 'Kampanye Foto'];

  const filteredPortfolios = activeCategory === 'Semua'
    ? portfolios
    : portfolios.filter(item => item.category === activeCategory);

  return (
    <section id="CasualPortfolioGrid" className="py-20 bg-white relative overflow-hidden">
      
      {/* Decorative Blob */}
      <div className="absolute top-1/3 left-0 -translate-x-1/4 w-80 h-80 rounded-full bg-[#649FF6]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-sm font-bold text-[#649FF6] uppercase tracking-widest block font-mono">
            GALERI HASIL KARYA
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
            {title}
          </h2>
          <p className="font-sans text-base text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Categories Interactive Pill Filter */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-12 max-w-4xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-btn-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-250 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#649FF6] text-white shadow-md shadow-[#649FF6]/25 scale-[1.03]'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Portfolios List */}
        {filteredPortfolios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {filteredPortfolios.map((item, index) => (
              <div
                key={item.id}
                className="group bg-white rounded-[36px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Visual Cover */}
                <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  {/* Floating tags */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-sm">
                    {item.category}
                  </div>
                </div>

                {/* Content info */}
                <div className="p-8 flex-grow flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-400">
                      <span>CLIENT: {item.client}</span>
                      <span>•</span>
                      <span>TAHUN {item.year}</span>
                    </div>

                    <h3 className="font-sans font-extrabold text-2xl text-gray-950 group-hover:text-[#F56B71] transition-colors leading-tight">
                      {item.title}
                    </h3>

                    <p className="font-sans text-sm text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Footer card info */}
                  <div className="pt-5 border-t border-gray-50 flex justify-between items-center text-xs">
                    <span className="font-mono text-gray-400 font-bold uppercase tracking-wider">
                      #RuangKarsaStudio
                    </span>
                    <a
                      id={`portfolio-details-${item.id}`}
                      href={`/portfolio?id=${item.id}`}
                      className="text-[#649FF6] hover:text-[#649FF6]/80 font-bold inline-flex items-center gap-1.5 group/link"
                    >
                      <span>Pelajari Studi Kasus</span>
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 max-w-md mx-auto space-y-4">
            <span className="text-4xl">🤷‍♂️</span>
            <h4 className="font-sans font-bold text-lg text-gray-900">Project Belum Ada</h4>
            <p className="text-sm text-gray-500">Kami sedang merapikan beberapa dokumentasi project baru untuk kategori ini. Hubungi kami untuk berkonsultasi!</p>
          </div>
        )}

      </div>
    </section>
  );
}
