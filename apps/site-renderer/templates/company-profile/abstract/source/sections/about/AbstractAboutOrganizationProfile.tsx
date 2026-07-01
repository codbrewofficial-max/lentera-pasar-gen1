'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Network } from 'lucide-react';

interface AbstractAboutOrganizationProfileProps {
  title?: string;
  description?: string;
  imageUrl?: string;
}

export function AbstractAboutOrganizationProfile({
  title = "Arsitektur Kolektif & Ekosistem Kerja Kami",
  description = "Studio Sinestesia beroperasi sebagai struktur non-hierarkis yang menyatukan desainer, ilustrator, insinyur perangkat lunak, dan pemikir strategis.\n\nKami percaya karya luar biasa lahir ketika batas-batas disiplin ilmu dileburkan. Di studio kami, seorang desainer grafis bekerja berdampingan dengan pengembang kode sejak hari pertama untuk memastikan bahwa estetika visual tingkat tinggi menyatu dengan kegunaan web yang andal.",
  imageUrl = "https://picsum.photos/seed/orgprofile/800/600"
}: AbstractAboutOrganizationProfileProps) {
  return (
    <section className="relative bg-[#080808] text-white py-24 px-6 border-b-8 border-white overflow-hidden">
      {/* Decorative backdrop shapes */}
      <div className="absolute left-1/3 top-0 w-1 bg-gradient-to-b from-[#B283AF] to-transparent h-full transform -skew-x-12 opacity-10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column - Large Typography & Info (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#649FF6]">
              <Network className="w-4 h-4 text-[#649FF6]" /> {"// STRUKTUR ORGANISASI"}
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black uppercase tracking-tight leading-tight">
              {title}
            </h2>
            
            <div className="space-y-4 text-neutral-300 font-sans text-base leading-relaxed whitespace-pre-line border-l-4 border-[#F56B71] pl-6">
              {description}
            </div>
            
            {/* Embedded details block */}
            <div className="grid grid-cols-2 gap-6 pt-4 font-mono text-xs">
              <div className="border border-neutral-800 p-4 bg-neutral-900/40 hover:border-[#649FF6] transition-colors">
                <span className="text-neutral-500 block mb-1">KOLABORASI //</span>
                <span className="text-white font-bold">100% Non-Hierarkis</span>
              </div>
              <div className="border border-neutral-800 p-4 bg-neutral-900/40 hover:border-[#B283AF] transition-colors">
                <span className="text-neutral-500 block mb-1">PRODUKTIVITAS //</span>
                <span className="text-white font-bold">Iteratif & Eksperimental</span>
              </div>
            </div>
          </div>

          {/* Right Column - Image with shifted border blocks (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-[#B283AF] transform translate-x-3 translate-y-3 border-2 border-white" />
            <div className="absolute inset-0 bg-[#649FF6] transform -translate-x-2 -translate-y-2 opacity-50" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] border-4 border-white bg-black overflow-hidden"
            >
              <img 
                src={imageUrl} 
                alt="Studio Sinestesia Organization Culture" 
                className="w-full h-full object-cover grayscale contrast-110 hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
