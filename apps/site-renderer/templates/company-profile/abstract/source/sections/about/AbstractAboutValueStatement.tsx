'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Eye, Compass, Lightbulb } from 'lucide-react';

interface AbstractAboutValueStatementProps {
  title?: string;
  description?: string;
  valueOne?: string;
  valueTwo?: string;
  valueThree?: string;
  valueFour?: string;
}

export function AbstractAboutValueStatement({
  title = "Pilar Keyakinan yang Menggerakkan Studio Kami",
  description = "Kami tidak bekerja berdasarkan tren musiman. Kami berpegang teguh pada kredo visual yang memastikan karya kami abadi dan berdampak.",
  valueOne = "Dekonstruksi Tanpa Takut: Menentang bentuk-bentuk simetris yang membosankan demi melepaskan potensi emosi murni sebuah karya seni.",
  valueTwo = "Kemanunggalan Kode & Estetika: Memastikan visual avant-garde berjalan selaras dengan performa responsif, ramah seluler, dan aksesibilitas tinggi.",
  valueThree = "Semiotika Dampak Bisnis: Menyalurkan keliaran artistik untuk menggerakkan indikator konversi bisnis secara positif dan terukur.",
  valueFour
}: AbstractAboutValueStatementProps) {
  return (
    <section className="relative bg-[#0d0d0d] text-white py-24 px-6 border-b-8 border-white overflow-hidden">
      {/* Decorative colored blobs in background */}
      <div className="absolute left-10 top-1/3 w-80 h-80 bg-[#B283AF] opacity-5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute right-10 bottom-10 w-96 h-96 bg-[#F56B71] opacity-5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Intro */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#B283AF]">
            <Lightbulb className="w-4 h-4 text-[#649FF6]" /> {"// PILAR NILAI"}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black uppercase tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-neutral-400 font-sans text-sm sm:text-base leading-relaxed max-w-2xl border-l-2 border-[#F56B71] pl-4">
            {description}
          </p>
        </div>

        {/* Pillars Layout: 3 atau 4 kolom tergantung apakah valueFour diisi */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${valueFour ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-8`}>
          
          {/* Pillar 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#F56B71] transform -skew-x-3 translate-x-2 translate-y-2 border-2 border-white" />
            <div className="relative bg-black border-2 border-white p-8 flex flex-col justify-between min-h-[280px]">
              <span className="font-mono text-5xl font-black text-[#F56B71] block mb-6">01/</span>
              <div>
                <h3 className="font-mono text-lg font-black uppercase tracking-tight text-white mb-3">
                  {valueOne.split(":")[0]}
                </h3>
                <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                  {valueOne.split(":").slice(1).join(":") || valueOne}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Pillar 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#649FF6] transform skew-y-1 translate-y-3 border-2 border-white" />
            <div className="relative bg-black border-2 border-white p-8 flex flex-col justify-between min-h-[280px]">
              <span className="font-mono text-5xl font-black text-[#649FF6] block mb-6">02/</span>
              <div>
                <h3 className="font-mono text-lg font-black uppercase tracking-tight text-white mb-3">
                  {valueTwo.split(":")[0]}
                </h3>
                <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                  {valueTwo.split(":").slice(1).join(":") || valueTwo}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Pillar 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#B283AF] transform rotate-1 translate-x-2 translate-y-2 border-2 border-white" />
            <div className="relative bg-black border-2 border-white p-8 flex flex-col justify-between min-h-[280px]">
              <span className="font-mono text-5xl font-black text-[#B283AF] block mb-6">03/</span>
              <div>
                <h3 className="font-mono text-lg font-black uppercase tracking-tight text-white mb-3">
                  {valueThree.split(":")[0]}
                </h3>
                <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                  {valueThree.split(":").slice(1).join(":") || valueThree}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Pillar 4 (opsional) */}
          {valueFour && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-[#F56B71] transform -rotate-1 -translate-x-2 translate-y-2 border-2 border-white" />
              <div className="relative bg-black border-2 border-white p-8 flex flex-col justify-between min-h-[280px]">
                <span className="font-mono text-5xl font-black text-[#F56B71] block mb-6">04/</span>
                <div>
                  <h3 className="font-mono text-lg font-black uppercase tracking-tight text-white mb-3">
                    {valueFour.split(":")[0]}
                  </h3>
                  <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                    {valueFour.split(":").slice(1).join(":") || valueFour}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        </div>

      </div>
    </section>
  );
}
