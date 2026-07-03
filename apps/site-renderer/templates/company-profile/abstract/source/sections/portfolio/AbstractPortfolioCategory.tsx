'use client';

import React, { useState } from 'react';
import { Filter } from 'lucide-react';

interface AbstractPortfolioCategoryProps {
  title?: string;
  description?: string;
}

const staticCategories = [
  "Semua Karya",
  "Branding",
  "Web Art",
  "Produksi Kreatif",
  "Media Sosial",
  "Industrial Art"
];

export function AbstractPortfolioCategory({
  title = "Kategori karya berdasarkan disiplin",
  description = "Filter galeri portfolio kami berdasarkan rumpun disiplin kreatif. Pilih satu kategori untuk menyaring karya kami."
}: AbstractPortfolioCategoryProps) {
  const [selectedCategory, setSelectedCategory] = useState("Semua Karya");

  return (
    <section className="relative bg-white text-neutral-900 py-16 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B283AF]/10">
              <Filter className="w-3.5 h-3.5 text-[#B283AF]" />
              <span className="font-mono text-xs lowercase tracking-wide text-[#B283AF]">filter karya</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-sans font-extrabold tracking-tight leading-none text-neutral-900">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-neutral-500 font-sans text-xs sm:text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          {staticCategories.map((cat) => {
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full font-sans text-sm font-semibold transition-colors focus:outline-none cursor-pointer ${
                  isSelected ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
