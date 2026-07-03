'use client';

import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

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
  eyebrow = "studio desain avant-garde",
  title = "Mendobrak batas visual jadi karya seni digital",
  subtitle = "Kami adalah Studio Sinestesia. Kolektif desainer, artis digital, dan tech-innovator yang mengubah brand yang biasa-biasa saja jadi identitas visual yang berani, ekspresif, dan gampang diingat.",
  ctaLabel = "Mulai eksplorasi",
  ctaUrl = "/portfolio",
  secondaryCtaLabel = "Konsultasi gratis",
  secondaryCtaUrl = "/contact",
  imageUrl = "https://picsum.photos/seed/sinestesiamain/900/650"
}: AbstractHomeHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#151515] text-white py-24 md:py-28">
      {/* Warm gradient blobs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-[#649FF6] rounded-full filter blur-[130px] opacity-25 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#F56B71] rounded-full filter blur-[140px] opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-[#B283AF] rounded-full filter blur-[120px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

        <div className="lg:col-span-7 space-y-7">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#649FF6]" />
            <span className="font-mono text-xs lowercase tracking-wide text-neutral-200">{eyebrow}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-sans font-extrabold tracking-tight leading-[1.05] text-white"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-neutral-300 font-sans text-base sm:text-lg leading-relaxed max-w-2xl"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#649FF6] hover:bg-[#5389e0] text-white font-sans font-bold text-sm transition-colors"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={secondaryCtaUrl}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-sans font-bold text-sm transition-colors"
            >
              <Play className="w-4 h-4 text-[#B283AF]" />
              <span>{secondaryCtaLabel}</span>
            </Link>
          </motion.div>
        </div>

        <div className="lg:col-span-5 relative mt-10 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full aspect-[4/3] sm:aspect-square rounded-[2.5rem] overflow-hidden bg-neutral-900"
          >
            <img
              src={imageUrl}
              alt="Studio Sinestesia Creative Workspace"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#151515]/40 via-transparent to-[#649FF6]/10 pointer-events-none" />
          </motion.div>

          <div className="absolute -bottom-5 -left-5 px-4 py-2.5 rounded-2xl bg-[#F56B71] text-white font-sans font-bold text-xs shadow-lg shadow-[#F56B71]/20">
            creative + energetic
          </div>
        </div>

      </div>
    </section>
  );
}
