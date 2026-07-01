'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Settings, Sparkles } from 'lucide-react';

interface AbstractServicesHeroProps {
  title?: string;
  description?: string;
}

export function AbstractServicesHero({
  title = "Arsitektur Layanan Kreatif Non-Linear Kami",
  description = "Kami merancang layanan yang melompati pakem standar industri. Temukan amunisi visual, web, dan kreatif yang dirancang khusus untuk memposisikan bisnis Anda sebagai ikon avant-garde baru."
}: AbstractServicesHeroProps) {
  return (
    <section className="relative min-h-[50vh] bg-[#111111] text-white py-24 px-6 border-b-8 border-white overflow-hidden flex items-center">
      {/* Decorative colored visual blobs */}
      <div className="absolute right-10 bottom-0 w-80 h-80 bg-[#649FF6] opacity-15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute left-10 top-10 w-64 h-64 bg-[#B283AF] opacity-10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Title Area (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#649FF6]"
            >
              <Settings className="w-4 h-4 text-[#F56B71] animate-spin-slow" /> {"// AMUNISI // LAYANAN"}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-mono font-black uppercase tracking-tight leading-none text-white"
            >
              {title.split(" ")[0]} <span className="text-[#F56B71] block sm:inline">{title.split(" ")[1]}</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#649FF6] to-[#B283AF] font-sans italic font-light lowercase tracking-normal">{title.split(" ").slice(2).join(" ")}</span>
            </motion.h1>
          </div>

          {/* Subtitle / Description Area (4 cols) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 border-l-4 border-[#B283AF] pl-6 py-2"
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
