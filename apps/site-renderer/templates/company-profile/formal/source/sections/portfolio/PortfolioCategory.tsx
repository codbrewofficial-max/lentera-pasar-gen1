import React from "react";
import { cn } from "../../lib/utils";

interface PortfolioCategoryProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange?: (category: string) => void;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const PortfolioCategory: React.FC<PortfolioCategoryProps> = ({ categories, activeCategory, onCategoryChange, className, title, subtitle }) => {
  return (
    <section id="portfolio-category-filter" className="bg-white pt-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="mb-6 text-center">
            {title && <h3 className="text-base md:text-lg font-semibold text-slate-900 tracking-tight">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-slate-500 font-light">{subtitle}</p>}
          </div>
        )}
        <div className={cn("mb-10 flex flex-wrap justify-center gap-3", className)}>
          {categories.map((category) => {
            const selected = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange?.(category)}
                className={selected
                  ? "select-none rounded border border-transparent bg-[#649FF6] px-5 py-2.5 text-xs font-medium text-white shadow-sm md:text-sm"
                  : "select-none rounded border border-slate-200 bg-white px-5 py-2.5 text-xs font-medium text-slate-600 md:text-sm"
                }
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default PortfolioCategory;
