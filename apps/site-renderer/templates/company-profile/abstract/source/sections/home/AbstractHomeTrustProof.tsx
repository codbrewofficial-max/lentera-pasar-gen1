'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, ShieldAlert, Quote } from 'lucide-react';
import type { TestimonialItem } from '../../lib/dummy-data';

interface AbstractBrandItem {
  id: string;
  name: string;
  logoUrl?: string;
}

interface AbstractHomeTrustProofProps {
  title?: string;
  description?: string;
  metricOneLabel?: string;
  metricOneValue?: string;
  metricTwoLabel?: string;
  metricTwoValue?: string;
  metricThreeLabel?: string;
  metricThreeValue?: string;
  testimonials?: TestimonialItem[];
  brands?: AbstractBrandItem[];
}

export function AbstractHomeTrustProof({
  title = "Bukti Nyata Karya Kami Diakui Industri",
  description = "Kami tidak sekadar berteori. Angka-angka ini merepresentasikan dekonstruksi visual yang sukses memberikan dampak bisnis terukur bagi para mitra berani kami.",
  metricOneLabel = "Mitra UMKM & Korporasi Aktif",
  metricOneValue = "120+",
  metricTwoLabel = "Karya Visual Terselesaikan",
  metricTwoValue = "450+",
  metricThreeLabel = "Penghargaan Eksperimen Desain",
  metricThreeValue = "12",
  testimonials,
  brands = []
}: AbstractHomeTrustProofProps) {
  const testimonialColors = ["#649FF6", "#F56B71", "#B283AF"];
  return (
    <section className="relative bg-[#000000] text-white py-24 px-6 border-b-8 border-white overflow-hidden">
      {/* Background neon dots or color bursts */}
      <div className="absolute right-1/4 top-1/4 w-96 h-96 bg-[#F56B71] opacity-5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute left-1/3 bottom-10 w-80 h-80 bg-[#649FF6] opacity-5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Upper intro text block */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#649FF6]">
            <Trophy className="w-4 h-4 text-[#F56B71]" /> {"// REKAM JEJAK"}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black uppercase tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-neutral-400 font-sans text-sm sm:text-base leading-relaxed max-w-2xl border-l-2 border-[#B283AF] pl-4">
            {description}
          </p>
        </div>

        {/* Giant Metric Figures with Offset Color Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Metric 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            {/* Background block offset */}
            <div className="absolute inset-0 bg-[#649FF6] transform -skew-x-6 translate-x-2 translate-y-2 border-2 border-white" />
            
            <div className="relative bg-black border-2 border-white p-8 flex flex-col justify-between min-h-[220px]">
              <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
                {"// METRIC_01"}
              </span>
              
              <div className="my-6">
                <span className="block font-mono font-black text-5xl sm:text-6xl text-white tracking-tighter uppercase relative">
                  <span className="absolute -inset-1 text-[#649FF6] translate-x-1 translate-y-0.5 opacity-50 select-none">
                    {metricOneValue}
                  </span>
                  <span className="relative">{metricOneValue}</span>
                </span>
              </div>
              
              <p className="font-mono text-xs font-bold text-[#F56B71] uppercase tracking-wider">
                {metricOneLabel}
              </p>
            </div>
          </motion.div>

          {/* Metric 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            {/* Background block offset */}
            <div className="absolute inset-0 bg-[#F56B71] transform skew-y-1 -translate-x-2 translate-y-2 border-2 border-white" />
            
            <div className="relative bg-black border-2 border-white p-8 flex flex-col justify-between min-h-[220px]">
              <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
                {"// METRIC_02"}
              </span>
              
              <div className="my-6">
                <span className="block font-mono font-black text-5xl sm:text-6xl text-white tracking-tighter uppercase relative">
                  <span className="absolute -inset-1 text-[#F56B71] -translate-x-1 translate-y-0.5 opacity-50 select-none">
                    {metricTwoValue}
                  </span>
                  <span className="relative">{metricTwoValue}</span>
                </span>
              </div>
              
              <p className="font-mono text-xs font-bold text-[#649FF6] uppercase tracking-wider">
                {metricTwoLabel}
              </p>
            </div>
          </motion.div>

          {/* Metric 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            {/* Background block offset */}
            <div className="absolute inset-0 bg-[#B283AF] transform -rotate-1 translate-x-2 -translate-y-2 border-2 border-white" />
            
            <div className="relative bg-black border-2 border-white p-8 flex flex-col justify-between min-h-[220px]">
              <span className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
                {"// METRIC_03"}
              </span>
              
              <div className="my-6">
                <span className="block font-mono font-black text-5xl sm:text-6xl text-white tracking-tighter uppercase relative">
                  <span className="absolute -inset-1 text-[#B283AF] translate-x-1.5 -translate-y-0.5 opacity-50 select-none">
                    {metricThreeValue}
                  </span>
                  <span className="relative">{metricThreeValue}</span>
                </span>
              </div>
              
              <p className="font-mono text-xs font-bold text-[#B283AF] uppercase tracking-wider">
                {metricThreeLabel}
              </p>
            </div>
          </motion.div>

        </div>

        {/* Testimonials */}
        {testimonials && testimonials.length > 0 && (
          <div className="mt-20 pt-16 border-t-2 border-white/10">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#F56B71] mb-10">
              <Quote className="w-4 h-4 text-[#649FF6]" /> {"// SUARA MITRA"}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((item, index) => {
                const accent = testimonialColors[index % testimonialColors.length];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative"
                  >
                    <div
                      className="absolute inset-0 border-2 border-white translate-x-1.5 translate-y-1.5"
                      style={{ backgroundColor: accent, opacity: 0.15 }}
                    />
                    <div className="relative bg-black border-2 border-white p-6 flex flex-col h-full">
                      <Quote className="w-5 h-5 mb-4" style={{ color: accent }} />
                      <p className="font-sans text-sm text-neutral-300 leading-relaxed flex-1">
                        {item.content}
                      </p>
                      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/10">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shrink-0"
                        />
                        <div>
                          <p className="font-mono text-xs font-bold text-white uppercase tracking-wide">
                            {item.name}
                          </p>
                          <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider">
                            {[item.role, item.company].filter(Boolean).join(" — ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Brand / Client logos dari data CRUD, hanya tampil kalau ada datanya */}
        {brands.length > 0 && (
          <div className="mt-16 pt-10 border-t-2 border-white/10 flex flex-wrap justify-center items-center gap-x-14 gap-y-8">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-center grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all">
                {brand.logoUrl ? (
                  <img src={brand.logoUrl} alt={brand.name} className="h-8 md:h-9 w-auto object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-400">{brand.name}</span>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
