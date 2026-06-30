'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Compass, Filter } from 'lucide-react';

interface AbstractPortfolioCategoryProps {
  title?: string;
  description?: string;
}

const staticCategories = [
  "ALL_WORKS",
  "BRANDING",
  "WEB_ART",
  "CREATIVE_PRODUCTION",
  "SOCIAL_MEDIA",
  "INDUSTRIAL_ART"
];

export function AbstractPortfolioCategory({
  title = "Kategorisasi Karya Berdasarkan Disiplin",
  description = "Filter galeri portfolio kami berdasarkan rumpun disiplin eksperimen kreatif. Pilih satu kategori untuk menyaring visualisasi manifesto kami."
}: AbstractPortfolioCategoryProps) {
  const [selectedCategory, setSelectedCategory] = useState("ALL_WORKS");

  return (
    <section className="relative bg-[#111111] text-white py-16 px-6 border-b-8 border-white overflow-hidden">
      {/* Decorative grids */}
      <div className="absolute right-1/3 top-0 w-0.5 h-full bg-neutral-800" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Upper Layout Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#B283AF]">
              <Filter className="w-4 h-4 text-[#F56B71]" /> {"// FILTER MANIFESTO"}
            </div>
            <h2 className="text-2xl sm:text-3xl font-mono font-black uppercase tracking-tight leading-none text-white">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-neutral-400 font-sans text-xs sm:text-sm leading-relaxed border-l-2 border-[#649FF6] pl-4">
              {description}
            </p>
          </div>
        </div>

        {/* Categories Flex / Grid of Blocks (Asymmetric) */}
        <div className="flex flex-wrap gap-4 pt-4">
          {staticCategories.map((cat, index) => {
            const isSelected = selectedCategory === cat;
            
            // Alternating active background colors
            const activeBgs = ["bg-[#649FF6]", "bg-[#F56B71]", "bg-[#B283AF]"];
            const activeBg = activeBgs[index % activeBgs.length];

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="relative group focus:outline-none cursor-pointer"
              >
                {/* Back offset frame */}
                <div 
                  className={`absolute inset-0 border-2 border-white transform translate-x-1 translate-y-1 transition-transform group-hover:translate-x-2 group-hover:translate-y-2 duration-200 ${
                    isSelected ? activeBg : 'bg-transparent'
                  }`} 
                />
                
                {/* Main button box */}
                <span className={`relative block border-2 border-white px-5 py-3 font-mono text-xs font-bold tracking-widest transition-colors ${
                  isSelected ? 'bg-black text-white border-white' : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-white'
                }`}>
                  {cat.replace("_", " ")}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Category Display badge */}
        <div className="mt-8 font-mono text-[10px] text-neutral-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-[#F56B71]" />
          <span>Viewing: <strong className="text-white">{selectedCategory.replace("_", " ")}</strong></span>
        </div>

      </div>
    </section>
  );
}
