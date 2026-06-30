'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Compass, GitMerge, ListTodo } from 'lucide-react';

interface AbstractServicesProcessProps {
  title?: string;
  description?: string;
  stepOne?: string;
  stepTwo?: string;
  stepThree?: string;
}

export function AbstractServicesProcess({
  title = "Alur Kerja Kreatif Non-Linear Kami",
  description = "Kami meyakini kebebasan berpikir tapi tetap menjaga kedisiplinan eksekusi. Berikut tiga tahapan terstruktur bagaimana kami mewujudkan mahakarya Anda.",
  stepOne = "Tahap Dekonstruksi & Riset Semiotika: Kami membedah visi brand Anda, mempelajari medan kompetitor, lalu meluncurkan draf konsep asimetris eksperimental pertama.",
  stepTwo = "Tahap Rekayasa Visual & Coding Berkinerja Tinggi: Tim desainer dan developer kami bekerja sinkron untuk mematangkan visual layout berani serta mengoptimasi performa situs web.",
  stepThree = "Tahap Kalibrasi & Peluncuran Pasar: Kami melakukan uji performa, penyesuaian detail tipografi, dan menyerahkan kendali penuh situs web kepada Anda."
}: AbstractServicesProcessProps) {
  return (
    <section className="relative bg-[#111111] text-white py-24 px-6 border-b-8 border-white overflow-hidden">
      {/* Decorative backdrop graphics */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-[#B283AF] opacity-5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute left-10 bottom-0 w-96 h-96 bg-[#649FF6] opacity-5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="max-w-3xl mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#F56B71]">
            <ListTodo className="w-4 h-4 text-[#649FF6]" /> {"// METODE KERJA"}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black uppercase tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-neutral-400 font-sans text-sm sm:text-base leading-relaxed max-w-2xl border-l-2 border-[#B283AF] pl-4">
            {description}
          </p>
        </div>

        {/* Steps Layout (3 cards stacked or row with line connection) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-800 hidden lg:block -z-10 transform -translate-y-1/2" />

          {/* Step 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative group"
          >
            {/* Background block offset */}
            <div className="absolute inset-0 bg-[#F56B71] transform -skew-x-6 translate-x-2 translate-y-2 border-2 border-white transition-transform group-hover:translate-x-3 group-hover:translate-y-3" />
            
            <div className="relative bg-black border-2 border-white p-8 min-h-[320px] flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <div className="w-10 h-10 bg-[#F56B71] text-black font-mono font-black text-sm flex items-center justify-center border border-white">
                  01
                </div>
                <span className="font-mono text-[9px] text-neutral-500 uppercase">
                  {"// DECONSTRUCTION"}
                </span>
              </div>

              <div>
                <h3 className="font-mono text-lg font-black uppercase tracking-tight text-white mb-3 group-hover:text-[#F56B71] transition-colors">
                  {stepOne.split(":")[0]}
                </h3>
                <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                  {stepOne.split(":").slice(1).join(":") || stepOne}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative group"
          >
            {/* Background block offset */}
            <div className="absolute inset-0 bg-[#649FF6] transform skew-y-1 -translate-x-2 translate-y-2 border-2 border-white transition-transform group-hover:translate-x-3 group-hover:translate-y-3" />
            
            <div className="relative bg-black border-2 border-white p-8 min-h-[320px] flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <div className="w-10 h-10 bg-[#649FF6] text-black font-mono font-black text-sm flex items-center justify-center border border-white">
                  02
                </div>
                <span className="font-mono text-[9px] text-neutral-500 uppercase">
                  {"// ENGINEERING"}
                </span>
              </div>

              <div>
                <h3 className="font-mono text-lg font-black uppercase tracking-tight text-white mb-3 group-hover:text-[#649FF6] transition-colors">
                  {stepTwo.split(":")[0]}
                </h3>
                <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                  {stepTwo.split(":").slice(1).join(":") || stepTwo}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative group"
          >
            {/* Background block offset */}
            <div className="absolute inset-0 bg-[#B283AF] transform rotate-1 translate-x-2 -translate-y-2 border-2 border-white transition-transform group-hover:translate-x-3 group-hover:translate-y-3" />
            
            <div className="relative bg-black border-2 border-white p-8 min-h-[320px] flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <div className="w-10 h-10 bg-[#B283AF] text-black font-mono font-black text-sm flex items-center justify-center border border-white">
                  03
                </div>
                <span className="font-mono text-[9px] text-neutral-500 uppercase">
                  {"// LAUNCH"}
                </span>
              </div>

              <div>
                <h3 className="font-mono text-lg font-black uppercase tracking-tight text-white mb-3 group-hover:text-[#B283AF] transition-colors">
                  {stepThree.split(":")[0]}
                </h3>
                <p className="text-neutral-400 font-sans text-xs leading-relaxed">
                  {stepThree.split(":").slice(1).join(":") || stepThree}
                </p>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
