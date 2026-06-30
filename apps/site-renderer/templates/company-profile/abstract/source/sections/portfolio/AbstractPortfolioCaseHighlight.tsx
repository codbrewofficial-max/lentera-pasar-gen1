'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Target, Compass } from 'lucide-react';

interface AbstractPortfolioCaseHighlightProps {
  title?: string;
  description?: string;
  imageUrl?: string;
}

export function AbstractPortfolioCaseHighlight({
  title = "Studi Kasus Utama: Rebranding Spekulatif Nirmala Nusantara",
  description = "Tantangan: Bagaimana membawa kain tenun Nusantara tradisional menjangkau audiens muda urban yang dinamis?\n\nSolusi: Kami merancang ulang identitas visual Nirmala Nusantara dengan dekonstruksi asimetris radikal, tipografi tebal, dan warna-warna neon yang kontras. Hasilnya adalah lonjakan interaksi visual hingga 140% dan peningkatan omset penjualan secara signifikan.",
  imageUrl = "https://picsum.photos/seed/casehighlight/1200/800"
}: AbstractPortfolioCaseHighlightProps) {
  return (
    <section className="relative bg-[#0d0d0d] text-white py-24 px-6 border-b-8 border-white overflow-hidden">
      {/* Decorative accent stripes */}
      <div className="absolute left-0 top-0 w-3 h-full bg-[#B283AF] opacity-20 transform -skew-x-12" />
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#F56B71] opacity-5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column - Image with shifted overlapping borders (6 cols) */}
          <div className="lg:col-span-6 relative">
            {/* Background solid offset cards */}
            <div className="absolute inset-0 bg-[#649FF6] transform translate-x-4 translate-y-4 border-2 border-white" />
            <div className="absolute inset-0 bg-[#B283AF] transform -translate-x-3 -translate-y-3 opacity-60 pointer-events-none" />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] border-4 border-white bg-black overflow-hidden"
            >
              <img 
                src={imageUrl} 
                alt="Case Study Showcase Image" 
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute top-4 left-4 bg-[#F56B71] text-black font-mono text-xs font-bold px-3 py-1.5 border border-white">
                {"// SOROTAN UTAMA"}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Text Details (6 cols) */}
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#649FF6]">
              <Target className="w-4 h-4 text-[#F56B71]" /> {"// CASE_HIGHLIGHT_2026"}
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black uppercase tracking-tight leading-none text-white">
              {title}
            </h2>
            
            <div className="space-y-6 text-neutral-300 font-sans text-base leading-relaxed whitespace-pre-line border-l-4 border-[#B283AF] pl-6">
              {description}
            </div>

            {/* Quick meta list */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-dashed border-neutral-800 font-mono text-xs text-neutral-500">
              <div>
                <span className="block text-white font-bold">CLIENT</span>
                <span>Nirmala Nusantara</span>
              </div>
              <div>
                <span className="block text-white font-bold">CATEGORY</span>
                <span>Creative Rebranding</span>
              </div>
              <div>
                <span className="block text-white font-bold">TIMELINE</span>
                <span>4 Months</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
