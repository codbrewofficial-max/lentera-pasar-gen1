'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, FolderHeart } from 'lucide-react';
import { defaultPortfolios, PortfolioItem } from '../../lib/dummy-data';
import { stripHtmlToText } from '@/components/content/RichHtml';

interface AbstractPortfolioGridProps {
  title?: string;
  description?: string;
  portfolios?: PortfolioItem[];
}

export function AbstractPortfolioGrid({
  title = "Seluruh Manifesto Karya Studio Sinestesia",
  description = "Jelajahi portofolio lengkap kami. Setiap baris mewakili dekonstruksi bentuk, tabrakan warna berani, dan fungsionalitas yang dikalibrasi secara ketat.",
  portfolios = defaultPortfolios
}: AbstractPortfolioGridProps) {
  return (
    <section className="relative bg-[#0d0d0d] text-white py-24 px-6 border-b-8 border-white overflow-hidden">
      {/* Grid background visual */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#649FF6]">
            <FolderHeart className="w-4 h-4 text-[#F56B71]" /> {"// ARSIP MANIFESTO LENGKAP"}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black uppercase tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-neutral-400 font-sans text-sm sm:text-base leading-relaxed max-w-2xl border-l-2 border-[#B283AF] pl-4">
            {description}
          </p>
        </div>

        {/* Portfolio Cards - 2x2 asymmetric or staggered masonry-like grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {portfolios.map((item, index) => {
            // Apply unique offset color and rotation
            const shadowColors = ["bg-[#649FF6]", "bg-[#F56B71]", "bg-[#B283AF]"];
            const shadowColor = shadowColors[index % shadowColors.length];
            const rotationClass = index % 2 === 0 ? "rotate-0.5" : "-rotate-0.5 md:rotate-1";

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative ${rotationClass}`}
              >
                {/* Back offset shadow block */}
                <div className={`absolute inset-0 ${shadowColor} transform translate-x-3 translate-y-3 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-300 border-2 border-white`} />
                
                {/* Card Container */}
                <div className="relative bg-black border-2 border-white p-6 flex flex-col justify-between h-full min-h-[500px]">
                  
                  {/* Photo with shifted frames */}
                  <div className="relative w-full aspect-[16/10] border border-neutral-700 bg-neutral-900 overflow-hidden mb-6">
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors z-10 duration-300" />
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-102 group-hover:scale-100"
                    />
                    
                    {/* Floating Year Tag */}
                    <div className="absolute top-3 left-3 z-20 bg-black border border-white text-[10px] font-mono tracking-widest px-3 py-1 text-white">
                      [ {item.year} ]
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="space-y-3 flex-grow">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] font-bold tracking-widest text-[#B283AF] uppercase">
                        {"// " + item.category.toUpperCase()}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-500">
                        PROJ_0{index + 1}
                      </span>
                    </div>

                    <h3 className="font-mono text-2xl font-black uppercase tracking-tight text-white group-hover:text-[#649FF6] transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-neutral-400 font-sans text-sm leading-relaxed">
                      {stripHtmlToText(item.description, 140)}
                    </p>
                  </div>

                  {/* Client and CTA Link */}
                  <div className="pt-6 border-t border-neutral-800 flex justify-between items-center mt-8">
                    <div>
                      <span className="font-mono text-[9px] text-neutral-500 block uppercase">
                        Client Partner
                      </span>
                      <span className="font-mono text-xs font-bold text-white uppercase">
                        {item.client}
                      </span>
                    </div>

                    <div className="w-10 h-10 border-2 border-white flex items-center justify-center bg-neutral-900 text-white group-hover:bg-white group-hover:text-black transition-all group-hover:rotate-45">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
