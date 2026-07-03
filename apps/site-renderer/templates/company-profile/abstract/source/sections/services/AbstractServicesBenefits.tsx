'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, HeartHandshake, Award } from 'lucide-react';

interface AbstractServicesBenefitsProps {
  title?: string;
  description?: string;
  benefitOne?: string;
  benefitTwo?: string;
  benefitThree?: string;
  benefitFour?: string;
}

export function AbstractServicesBenefits({
  title = "Mengapa Bermitra dengan Studio Sinestesia?",
  description = "Kami meyakini bahwa hasil karya luar biasa dilahirkan dari komitmen visual tanpa kompromi. Berikut nilai unggul yang Anda peroleh ketika mendesain bersama kami.",
  benefitOne = "Kekuatan Pembeda Eksklusif: Desain Anda tidak akan mirip dengan kompetitor mana pun di pasar. Kami menjamin keunikan 100% yang mendominasi perhatian.",
  benefitTwo = "Kecepatan & Optimasi Kode: Di balik tampilan seni asimetris kami, tersimpan arsitektur kode Next.js super cepat, SEO-friendly, dan sangat ramah seluler.",
  benefitThree = "Dukungan Kemitraan Abadi: Kami tidak melepaskan Anda setelah proyek usai. Kami memberikan panduan aset, lisensi legal penuh, dan dukungan jangka panjang.",
  benefitFour
}: AbstractServicesBenefitsProps) {
  return (
    <section className="relative bg-[#0d0d0d] text-white py-24 px-6 border-b-8 border-white overflow-hidden">
      {/* Decorative lines in bg */}
      <div className="absolute right-0 top-0 w-1/4 h-full bg-[#F56B71] opacity-5 transform skew-x-12 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#649FF6]">
            <Award className="w-4 h-4 text-[#B283AF]" /> {"// MANFAAT UTAMA"}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black uppercase tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-neutral-400 font-sans text-sm sm:text-base leading-relaxed max-w-2xl border-l-2 border-[#B283AF] pl-4">
            {description}
          </p>
        </div>

        {/* Benefits Cards: staggered 3-kolom, atau grid rata 4-kolom kalau benefitFour diisi */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${benefitFour ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-8`}>
          
          {/* Benefit 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#B283AF] transform -skew-x-3 translate-x-2 translate-y-2 border-2 border-white" />
            <div className="relative bg-black border-2 border-white p-8 min-h-[300px] flex flex-col justify-between">
              <div className="w-12 h-12 bg-neutral-900 border border-neutral-700 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-[#B283AF]" />
              </div>
              <div>
                <h3 className="font-mono text-lg font-black uppercase tracking-tight text-white mb-3">
                  {benefitOne.split(":")[0]}
                </h3>
                <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                  {benefitOne.split(":").slice(1).join(":") || benefitOne}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Benefit 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={benefitFour ? 'relative' : 'relative md:translate-y-6'}
          >
            <div className="absolute inset-0 bg-[#649FF6] transform skew-y-1 translate-y-3 border-2 border-white" />
            <div className="relative bg-black border-2 border-white p-8 min-h-[300px] flex flex-col justify-between">
              <div className="w-12 h-12 bg-neutral-900 border border-neutral-700 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-[#649FF6]" />
              </div>
              <div>
                <h3 className="font-mono text-lg font-black uppercase tracking-tight text-white mb-3">
                  {benefitTwo.split(":")[0]}
                </h3>
                <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                  {benefitTwo.split(":").slice(1).join(":") || benefitTwo}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Benefit 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={benefitFour ? 'relative' : 'relative md:translate-y-12'}
          >
            <div className="absolute inset-0 bg-[#F56B71] transform rotate-1 translate-x-2 translate-y-2 border-2 border-white" />
            <div className="relative bg-black border-2 border-white p-8 min-h-[300px] flex flex-col justify-between">
              <div className="w-12 h-12 bg-neutral-900 border border-neutral-700 flex items-center justify-center mb-6">
                <HeartHandshake className="w-6 h-6 text-[#F56B71]" />
              </div>
              <div>
                <h3 className="font-mono text-lg font-black uppercase tracking-tight text-white mb-3">
                  {benefitThree.split(":")[0]}
                </h3>
                <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                  {benefitThree.split(":").slice(1).join(":") || benefitThree}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Benefit 4 (opsional) */}
          {benefitFour && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-[#649FF6] transform -rotate-1 translate-x-2 translate-y-2 border-2 border-white" />
              <div className="relative bg-black border-2 border-white p-8 min-h-[300px] flex flex-col justify-between">
                <div className="w-12 h-12 bg-neutral-900 border border-neutral-700 flex items-center justify-center mb-6">
                  <Award className="w-6 h-6 text-[#649FF6]" />
                </div>
                <div>
                  <h3 className="font-mono text-lg font-black uppercase tracking-tight text-white mb-3">
                    {benefitFour.split(":")[0]}
                  </h3>
                  <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                    {benefitFour.split(":").slice(1).join(":") || benefitFour}
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
