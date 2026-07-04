'use client';

import React, { useState } from 'react';

interface PremiumPortfolioCategoryProps {
  title?: string;
  description?: string;
  badge?: string;
  categories?: string[];
  onSelectCategory?: (category: string) => void;
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function PremiumPortfolioCategory({
  title = "Kategori Proyek",
  description = "Filter karya kami berdasarkan tipologi bangunan untuk mempermudah penelusuran portofolio Anda.",
  badge,
  categories = [],
  onSelectCategory,
  imageUrl,
  ctaLabel,
  ctaHref = "/contact",
}: PremiumPortfolioCategoryProps) {
  const [activeCategory, setActiveCategory] = useState("Semua");

  // Kategori sekarang murni dari data Kategori Portfolio asli yang owner input di
  // dashboard (bukan lagi 4 nama kategori contoh yang di-hardcode).
  const allCategories = categories.length ? ["Semua", ...categories] : [];
  if (allCategories.length === 0) return null;

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    if (onSelectCategory) {
      onSelectCategory(category);
    }
  };

  return (
    <section id="premium-portfolio-category" className="bg-[#FAF9F6] text-[#121212] border-b border-stone-200/50 relative overflow-hidden">
      {imageUrl && (
        <div className="absolute inset-0">
          <img src={imageUrl} alt="" className="w-full h-full object-cover opacity-15" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-[#FAF9F6]/85" />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6 relative z-10 py-12">
        {badge && (
          <span className="block text-[10px] font-bold tracking-[0.3em] text-[#B283AF] uppercase mb-4">{badge}</span>
        )}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left info label */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold tracking-[0.3em] text-[#649FF6] uppercase">{title}</h4>
            <p className="text-stone-500 text-xs font-sans font-light max-w-sm">
              {description}
            </p>
            {ctaLabel && (
              <a href={ctaHref} className="inline-flex text-[10px] font-bold tracking-widest uppercase text-stone-700 hover:text-[#649FF6] transition-colors pt-2">
                {ctaLabel} →
              </a>
            )}
          </div>

          {/* Interactive Categories Bar */}
          <div className="flex flex-wrap gap-2.5">
            {allCategories.map((category) => {
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
