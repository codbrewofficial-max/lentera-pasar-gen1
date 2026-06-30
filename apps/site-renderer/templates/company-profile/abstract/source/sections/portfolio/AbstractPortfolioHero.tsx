'use client';

import React from 'react';
import { motion } from 'motion/react';
import { FolderHeart } from 'lucide-react';

interface AbstractPortfolioHeroProps {
  title?: string;
  description?: string;
}

export function AbstractPortfolioHero({
  title = "Galeri Manifesto Visual & Digital Kami",
  description = "Setiap karya visual adalah manifesto pembangkangan artistik terhadap keseragaman pasar. Jelajahi kolaborasi terpilih kami bersama para mitra berani."
}: AbstractPortfolioHeroProps) {
  return (
    <section className="relative min-h-[50vh] bg-[#111111] text-white py-24 px-6 border-b-8 border-white overflow-hidden flex items-center">
      {/* Decorative colored blobs */}
      <div className="absolute right-1/4 top-10 w-96 h-96 bg-[#F56B71] opacity-10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute left-1/4 bottom-0 w-80 h-80 bg-[#B283AF] opacity-10 rounded-full blur-[130px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Title Area (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#B283AF]"
            >
              <FolderHeart className="w-4 h-4 text-[#649FF6]" /> {"// REKREASI // MANIFESTO"}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-mono font-black uppercase tracking-tight leading-none text-white"
            >
              {title.split(" ")[0]} <span className="text-[#649FF6] block sm:inline">{title.split(" ")[1]}</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F56B71] to-[#B283AF] font-sans italic font-light lowercase tracking-normal">{title.split(" ").slice(2).join(" ")}</span>
            </motion.h1>
          </div>

          {/* Subtitle Area (4 cols) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 border-l-4 border-[#F56B71] pl-6 py-2"
          >
            <p className="text-neutral-300 font-sans text-sm sm:text-base leading-relaxed">
              {description}
            </p>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
