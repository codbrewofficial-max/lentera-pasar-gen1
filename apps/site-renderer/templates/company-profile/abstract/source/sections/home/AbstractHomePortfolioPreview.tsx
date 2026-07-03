'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowUpRight, FolderGit } from 'lucide-react';
import { defaultPortfolios, PortfolioItem } from '../../lib/dummy-data';
import { stripHtmlToText } from '@/components/content/RichHtml';

interface AbstractHomePortfolioPreviewProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  portfolios?: PortfolioItem[];
}

export function AbstractHomePortfolioPreview({
  title = "Koleksi Manifesto Eksperimen Visual Kami",
  description = "Intip deretan proyek terpilih kami yang berhasil meretas konvensi pasar. Tiap karya adalah perpaduan asimetri fungsional, komposisi warna berani, dan rekayasa identitas modern.",
  ctaLabel = "LIHAT SEMUA MANIFESTO",
  ctaUrl = "/portfolio",
  portfolios = defaultPortfolios.slice(0, 3) // Default to first 3 items for preview
}: AbstractHomePortfolioPreviewProps) {
  return (
    <section className="relative bg-[#111111] text-white py-24 px-6 border-b-8 border-white overflow-hidden">
      {/* Decorative backdrop typography */}
      <div className="absolute left-10 top-0 text-[12rem] font-mono font-black text-neutral-900 select-none pointer-events-none opacity-20 -mt-10 uppercase">
        PORTFOLIO
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header - Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-neutral-800">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#649FF6]">
              <FolderGit className="w-4 h-4" /> {"// MANIFESTO PROYEK"}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black uppercase tracking-tight leading-tight">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-4 lg:text-right space-y-4">
            <p className="text-neutral-400 font-sans text-sm leading-relaxed text-left lg:text-right">
              {description}
            </p>
          </div>
        </div>

        {/* Portfolio Cards Grid - Asymmetric Layout (Varying column spans and rotations) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {portfolios.map((item, index) => {
            // Apply different offset shadow color and rotation based on index to enforce abstract asymmetry
            const shadowColors = ["bg-[#649FF6]", "bg-[#F56B71]", "bg-[#B283AF]"];
            const shadowColor = shadowColors[index % shadowColors.length];
            const rotationClass = index % 3 === 0 ? "-rotate-1" : index % 3 === 1 ? "rotate-1" : "-rotate-1 lg:rotate-1";
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative ${rotationClass}`}
              >
                {/* Back offset colored shadow */}
                <div className={`absolute inset-0 ${shadowColor} transform translate-x-3 translate-y-3 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-300 border-2 border-white`} />
                
                {/* Main Card Container */}
                <div className="relative bg-black border-2 border-white p-5 flex flex-col justify-between h-full min-h-[420px] transition-transform duration-300 group-hover:-translate-y-1">
                  
                  {/* Card Image inside irregular frame */}
                  <div className="relative w-full aspect-[4/3] border border-neutral-700 bg-neutral-900 overflow-hidden mb-6">
                    {/* Shifted overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10 duration-300" />
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                    />
                    <div className="absolute top-2 left-2 z-20 bg-black border border-white text-[10px] font-mono tracking-widest px-2.5 py-1 text-white">
                      {item.year}
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="space-y-3 flex-grow">
                    <span className="font-mono text-[10px] font-bold tracking-widest text-[#B283AF] uppercase block">
                      {"// " + item.category}
                    </span>
                    <h3 className="font-mono text-lg font-black tracking-tight text-white uppercase group-hover:text-[#649FF6] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-neutral-400 font-sans text-xs line-clamp-3">
                      {stripHtmlToText(item.description, 140)}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-6 border-t border-neutral-800 flex justify-between items-center mt-6">
                    <span className="font-mono text-[10px] text-neutral-500 uppercase">
                      Client: {item.client}
                    </span>
                    <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center bg-neutral-900 text-white group-hover:bg-white group-hover:text-black transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Big Bottom Action Link */}
        <div className="flex justify-center">
          <Link href={ctaUrl} className="group relative inline-block">
            <div className="absolute -inset-1 bg-[#649FF6] transform -skew-x-12 translate-x-1 translate-y-1" />
            <div className="absolute -inset-1 bg-[#B283AF] transform skew-x-6 -translate-x-1 -translate-y-1 opacity-70" />
            <button className="relative bg-black border-2 border-white px-10 py-5 font-mono font-bold text-xs tracking-widest text-white group-hover:text-[#F56B71] transition-colors">
              {ctaLabel.toUpperCase()}
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
