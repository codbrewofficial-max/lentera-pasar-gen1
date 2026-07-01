'use client';

import React, { useState } from 'react';

interface PremiumPortfolioCategoryProps {
  title?: string;
  description?: string;
  onSelectCategory?: (category: string) => void;
}

export function PremiumPortfolioCategory({
  title = "Kategori Proyek",
  description = "Filter karya kami berdasarkan tipologi bangunan untuk mempermudah penelusuran portofolio Anda.",
  onSelectCategory
}: PremiumPortfolioCategoryProps) {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const categories = [
    "Semua",
    "Residensi Privat",
    "Restorasi Sejarah",
    "Ruang Komersial",
    "Paviliun & Lanskap"
  ];

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    if (onSelectCategory) {
      onSelectCategory(category);
    }
  };

  return (
    <section id="premium-portfolio-category" className="py-12 bg-[#FAF9F6] text-[#121212] border-b border-stone-200/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left info label */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold tracking-[0.3em] text-[#649FF6] uppercase">{title}</h4>
            <p className="text-stone-500 text-xs font-sans font-light max-w-sm">
              {description}
            </p>
          </div>

          {/* Interactive Categories Bar */}
          <div className="flex flex-wrap gap-2.5">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`text-[10px] md:text-xs font-semibold tracking-widest uppercase px-5 py-2.5 rounded-none transition-all duration-300 border ${
                    isActive
                      ? 'bg-[#0E0E0F] text-white border-[#0E0E0F]'
                      : 'bg-transparent text-stone-600 border-stone-200 hover:text-stone-900 hover:border-stone-400'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
