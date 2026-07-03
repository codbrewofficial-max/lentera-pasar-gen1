'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Eye, Sparkles } from 'lucide-react';

interface AbstractHomeProfileSummaryProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  imageUrl?: string;
}

export function AbstractHomeProfileSummary({
  title = "Filosofi kami: keberanian di atas konvensi",
  description = "Bagi kami, keindahan sejati tidak lahir dari ketundukan pada standar, melainkan dari eksplorasi ide-ide baru. Kami menyatukan insting seni dengan ketelitian rekayasa kode fungsional.\n\nSitus web, kemasan, atau identitas visual tidak seharusnya pasif. Kami mendesain visual yang hidup, relevan buat audiens muda, dan gampang diingat.",
  ctaLabel = "Temukan filosofi kami",
  ctaUrl = "/about",
  imageUrl = "https://picsum.photos/seed/philosophy/800/800"
}: AbstractHomeProfileSummaryProps) {
  return (
    <section className="relative bg-white text-neutral-900 py-24 px-6 overflow-hidden">
      <div className="absolute left-10 bottom-10 w-64 h-64 bg-[#649FF6] opacity-[0.06] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          <div className="lg:col-span-5 relative order-last lg:order-first">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-neutral-100"
            >
              <img
                src={imageUrl}
                alt="Studio Sinestesia Philosophy Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute right-4 bottom-4 bg-[#649FF6] text-white font-mono text-[11px] lowercase font-semibold px-3 py-1.5 rounded-full">
                studio sinestesia
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F56B71]/10">
              <Sparkles className="w-3.5 h-3.5 text-[#F56B71]" />
              <span className="font-mono text-xs lowercase tracking-wide text-[#F56B71]">manifesto studio</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-[1.1] text-neutral-900">
              {title}
            </h2>

            <div className="space-y-4 text-neutral-600 font-sans text-base leading-relaxed whitespace-pre-line">
              {description}
            </div>

            <div className="pt-2">
              <Link
                href={ctaUrl}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-neutral-900 hover:bg-[#649FF6] text-white font-sans font-bold text-sm transition-colors"
              >
                <span>{ctaLabel}</span>
                <Eye className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
