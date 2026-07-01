"use client";

import React from "react";

interface PortfolioCategoryProps {
  categories: string[];
  className?: string;
  title?: string;
  subtitle?: string;
}

export const PortfolioCategory: React.FC<PortfolioCategoryProps> = ({ categories, className, title, subtitle }) => {
  // Kategori murni informatif: tidak ada state aktif/nonaktif karena portfolio grid
  // pada tema ini menampilkan semua portofolio sekaligus tanpa filter interaktif.
  // Tampilkan inisial huruf pertama setiap kategori sebagai elemen visual dekoratif.
  if (categories.length === 0) return null;

  const colors = [
    "bg-[#649FF6]/10 text-[#649FF6] border-[#649FF6]/20",
    "bg-[#F56B71]/10 text-[#F56B71] border-[#F56B71]/20",
    "bg-[#B283AF]/10 text-[#B283AF] border-[#B283AF]/20",
  ];

  return (
    <section id="portfolio-category-filter" className="bg-white pt-10 pb-2">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="mb-6">
            {title && <h3 className="text-base font-semibold text-slate-900 tracking-tight">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-slate-500 font-light">{subtitle}</p>}
          </div>
        )}
        <div className={`flex flex-wrap gap-4 mb-8 ${className ?? ""}`}>
          {categories.map((category, idx) => {
            const colorClass = colors[idx % colors.length];
            const initial = category.trim().charAt(0).toUpperCase();
            return (
              <div
                key={category}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded border font-sans text-sm font-medium select-none ${colorClass}`}
              >
                <span className="w-7 h-7 rounded-sm flex items-center justify-center font-mono font-bold text-xs border border-current/30">
                  {initial}
                </span>
                <span>{category}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default PortfolioCategory;
