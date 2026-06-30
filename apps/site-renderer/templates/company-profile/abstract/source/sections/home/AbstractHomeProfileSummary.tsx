'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Eye, Terminal } from 'lucide-react';

interface AbstractHomeProfileSummaryProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  imageUrl?: string;
}

export function AbstractHomeProfileSummary({
  title = "Filosofi Desain Kami: Keberanian Di Atas Konvensi",
  description = "Bagi kami, keindahan sejati tidak lahir dari ketundukan pada standar, melainkan dari dekonstruksi ide-ide lama. Kami menyatukan insting seni mentah dengan ketelitian rekayasa kode fungsional.\n\nSitus web, kemasan, atau identitas visual tidak seharusnya pasif. Kami mendesain visual yang mendesak, menuntut interaksi, dan menolak diabaikan oleh siapa pun yang memandangnya.",
  ctaLabel = "TEMUKAN FILOSOFI KAMI",
  ctaUrl = "/about",
  imageUrl = "https://picsum.photos/seed/philosophy/800/800"
}: AbstractHomeProfileSummaryProps) {
  return (
    <section className="relative bg-[#0d0d0d] text-white py-24 px-6 border-b-8 border-white overflow-hidden">
      {/* Decorative Grid Stripes */}
      <div className="absolute right-0 top-0 w-1/3 h-full bg-[#B283AF] opacity-5 transform skew-x-12 pointer-events-none" />
      <div className="absolute left-10 bottom-10 w-48 h-48 bg-[#649FF6] opacity-10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column - Graphic Photo Grid Frame (5 cols) */}
          <div className="lg:col-span-5 relative order-last lg:order-first">
            
            {/* Behind Offset solid blocks */}
            <div className="absolute inset-0 bg-[#F56B71] transform translate-x-4 translate-y-4 border-2 border-white -z-10" />
            <div className="absolute inset-0 bg-[#B283AF] transform -translate-x-3 -translate-y-3 opacity-60 pointer-events-none -z-10" />

            {/* Photo Container */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square border-4 border-white bg-black overflow-hidden"
            >
              <img 
                src={imageUrl} 
                alt="Studio Sinestesia Philosophy Cover" 
                className="w-full h-full object-cover grayscale contrast-125 saturate-50 hover:grayscale-0 transition-all duration-700"
              />
              {/* Overlay accent strip */}
              <div className="absolute right-4 bottom-4 bg-[#649FF6] text-black font-mono text-xs font-bold px-3 py-1 border border-white z-20">
                [ STUDIO_SINE_2026 ]
              </div>
            </motion.div>
            
          </div>

          {/* Right Column - Text Block (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#F56B71]">
              <Terminal className="w-4 h-4" /> {"// MANIFESTO STUDI"}
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black uppercase tracking-tight leading-none">
              {title}
            </h2>
            
            <div className="space-y-4 text-neutral-300 font-sans text-base leading-relaxed whitespace-pre-line border-l-4 border-[#649FF6] pl-6">
              {description}
            </div>

            {/* Asymmetric CTA link */}
            <div className="pt-4">
              <Link href={ctaUrl} className="group relative inline-block">
                <div className="absolute inset-0 bg-white transform translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-2.5 group-hover:translate-y-2.5 duration-200" />
                <button className="relative bg-black text-white border-2 border-white font-mono font-bold text-xs tracking-widest px-8 py-4 flex items-center gap-3 transition-colors group-hover:bg-[#B283AF] group-hover:text-black">
                  <span>{ctaLabel.toUpperCase()}</span>
                  <Eye className="w-4 h-4 text-[#649FF6] group-hover:text-black" />
                </button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
