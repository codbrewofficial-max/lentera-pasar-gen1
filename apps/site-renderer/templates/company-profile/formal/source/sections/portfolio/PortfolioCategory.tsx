"use client";

import React from "react";
import { SectionHeading } from "../../shared/SectionHeading";

interface PortfolioCategoryProps {
  categories: string[];
  className?: string;
  title?: string;
  subtitle?: string;
}

export const PortfolioCategory: React.FC<PortfolioCategoryProps> = ({
  categories = [],
  className = "",
  title,
  subtitle,
}) => {
  if (categories.length === 0) return null;

  // Palet warna yang lebih redup, elegan, dan profesional (Formal Modern)
  const colors = [
    "bg-slate-50 text-slate-700 border-slate-200/80 token-blue",
    "bg-slate-50 text-slate-700 border-slate-200/80 token-red",
    "bg-slate-50 text-slate-700 border-slate-200/80 token-purple",
  ];

  return (
    <section id="portfolio-category-filter" className={`py-16 md:py-20 bg-slate-50/50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading Section */}
        <div className="text-center mb-10">
          <SectionHeading title={title || "Kategori Portofolio"} subtitle={subtitle} badgeVariant="accent" />
        </div>

        {/* Container Flex: Otomatis ke tengah, membungkus rapi jika data banyak */}
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 max-w-4xl mx-auto">
          {categories.map((category, idx) => {
            const colorClass = colors[idx % colors.length];
            const initial = category.trim().charAt(0).toUpperCase();
            
            return (
              <div
                key={`${category}-${idx}`}
                className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-none border bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 font-sans text-sm font-semibold tracking-wide select-none ${colorClass}`}
              >
                {/* Badge Inisial: Dibuat tegas, minimalis, dan presisi */}
                <span className="w-6 h-6 rounded-none flex items-center justify-center font-mono font-bold text-xs bg-slate-100 text-slate-500 border border-slate-200">
                  {initial}
                </span>
                <span className="text-slate-800 font-medium">{category}</span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default PortfolioCategory;