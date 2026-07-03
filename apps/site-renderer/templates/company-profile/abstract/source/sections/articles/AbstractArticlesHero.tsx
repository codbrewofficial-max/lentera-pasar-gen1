'use client';

import React from 'react';
import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';

interface AbstractArticlesHeroProps {
  title?: string;
  description?: string;
}

export function AbstractArticlesHero({
  title = "Jurnal pemikiran dan cerita desain kami",
  description = "Eksplorasi wawasan teori warna, eksperimen kreatif, dan cerita di balik proses kerja kami buat brand-brand muda."
}: AbstractArticlesHeroProps) {
  return (
    <section className="relative bg-[#151515] text-white py-24 px-6 overflow-hidden">
      <div className="absolute right-10 top-10 w-80 h-80 bg-[#649FF6] opacity-[0.08] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute left-1/4 bottom-0 w-96 h-96 bg-[#B283AF] opacity-[0.08] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <div className="lg:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#F56B71]" />
              <span className="font-mono text-xs lowercase tracking-wide text-neutral-200">jurnal kreatif</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-sans font-extrabold tracking-tight leading-[1.05] text-white"
            >
              {title}
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4"
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
