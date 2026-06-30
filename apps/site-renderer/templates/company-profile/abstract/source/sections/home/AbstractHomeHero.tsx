'use client';

import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Play, Compass } from 'lucide-react';

interface AbstractHomeHeroProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  imageUrl?: string;
}

export function AbstractHomeHero({
  eyebrow = "STUDIO DESAIN AVANT-GARDE",
  title = "Mendobrak Batas Visual Menjadi Karya Seni Digital",
  subtitle = "Kami adalah Studio Sinestesia. Kolektif desainer, artis digital, dan tech-innovator yang mengubah representasi brand membosankan menjadi petualangan visual asimetris yang berani, ekspresif, dan berdaya sengat tinggi.",
  ctaLabel = "MULAI EKSPLORASI",
  ctaUrl = "/portfolio",
  secondaryCtaLabel = "KONSULTASI GRATIS",
  secondaryCtaUrl = "/contact",
  imageUrl = "https://picsum.photos/seed/sinestesiamain/900/650"
}: AbstractHomeHeroProps) {
  return (
    <section className="relative min-h-[90vh] bg-[#111111] text-white overflow-hidden flex items-center py-20 border-b-8 border-white">
      {/* Abstract Background Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#649FF6] rounded-full filter blur-[120px] opacity-25 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#B283AF] rounded-full filter blur-[150px] opacity-25 pointer-events-none" />
      
      {/* Massive decorative grid stripes */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column - Big Asymmetric Text Content (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Eyebrow with slanted background */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block relative"
          >
            <div className="absolute inset-0 bg-[#B283AF] transform -skew-x-12 translate-x-1 translate-y-1" />
            <span className="relative block bg-black border border-white px-4 py-1.5 font-mono text-xs font-bold tracking-[0.25em] text-[#649FF6]">
              {eyebrow.toUpperCase()}
            </span>
          </motion.div>

          {/* Heading - Massive, Bold, Asymmetric */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-mono font-black tracking-tight leading-none text-white uppercase relative"
          >
            {/* Split title highlight simulation */}
            <span className="block relative z-10">{title.split(" ")[0]} <span className="text-[#F56B71] underline decoration-wavy decoration-[#B283AF]">{title.split(" ")[1]}</span></span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#649FF6] via-white to-[#B283AF] font-sans italic font-light lowercase tracking-normal">
              {title.split(" ").slice(2).join(" ")}
            </span>
          </motion.h1>

          {/* Subtitle - Left thick bar in Purple */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="border-l-4 border-[#B283AF] pl-6 py-2 max-w-2xl"
          >
            <p className="text-neutral-300 font-sans text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {subtitle}
            </p>
          </motion.div>

          {/* Call to Actions - Geometric Shifts */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-5 pt-4"
          >
            {/* Primary CTA (Slanted Box) */}
            <Link href={ctaUrl} className="group relative inline-block">
              <div className="absolute -inset-1 bg-[#649FF6] transform -skew-x-6 transition-transform group-hover:scale-105 duration-200" />
              <div className="absolute -inset-1 bg-[#F56B71] transform skew-x-6 translate-x-1 translate-y-1 opacity-70 transition-transform group-hover:translate-x-2 group-hover:translate-y-2 duration-200" />
              <button className="relative bg-black border-2 border-white px-8 py-4 font-mono font-bold text-xs tracking-widest text-white group-hover:text-[#649FF6] transition-colors flex items-center gap-3">
                <span>{ctaLabel.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4 text-[#F56B71] group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            {/* Secondary CTA */}
            <Link href={secondaryCtaUrl} className="group relative inline-block">
              <button className="bg-neutral-900 border-2 border-dashed border-neutral-600 hover:border-white px-8 py-4 font-mono font-bold text-xs tracking-widest text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all flex items-center gap-3">
                <Compass className="w-4 h-4 text-[#B283AF]" />
                <span>{secondaryCtaLabel.toUpperCase()}</span>
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Right Column - Non-conventional cropped picture frame (5 cols) */}
        <div className="lg:col-span-5 relative mt-10 lg:mt-0">
          
          {/* Outer floating geometric shapes */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-[#F56B71] -rotate-12 border-2 border-white flex items-center justify-center font-mono font-bold text-black text-sm z-20 shadow-[4px_4px_0px_white]">
            SINE //
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-10 bg-[#649FF6] rotate-6 border-2 border-white flex items-center justify-center font-mono font-bold text-black text-xs z-20">
            *CREATIVE ART*
          </div>
          
          {/* Framed Image - Double offset borders */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: -1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full aspect-[4/3] sm:aspect-square bg-neutral-900 border-4 border-white overflow-hidden shadow-[-16px_16px_0px_#B283AF] transform -rotate-1 hover:rotate-0 transition-transform duration-500"
          >
            {/* Color Overlay Filter */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#111111]/80 via-transparent to-[#F56B71]/20 mix-blend-color-dodge z-10 pointer-events-none" />
            
            <img 
              src={imageUrl} 
              alt="Studio Sinestesia Creative Workspace" 
              className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
          
          {/* Behind Shadow Frame */}
          <div className="absolute inset-0 border-4 border-dashed border-[#649FF6] transform translate-x-4 -translate-y-4 pointer-events-none -z-10" />
        </div>
        
      </div>
    </section>
  );
}
