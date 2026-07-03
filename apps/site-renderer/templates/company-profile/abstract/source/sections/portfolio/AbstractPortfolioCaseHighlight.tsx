'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Target } from 'lucide-react';

interface AbstractPortfolioCaseHighlightProps {
  title?: string;
  description?: string;
  imageUrl?: string;
}

export function AbstractPortfolioCaseHighlight({
  title = "Studi kasus: Rebranding Nirmala Nusantara",
  description = "Tantangan: bagaimana membawa kain tenun Nusantara tradisional menjangkau audiens muda urban yang dinamis?\n\nSolusi: kami merancang ulang identitas visual Nirmala Nusantara dengan tipografi tebal dan warna-warna kontras. Hasilnya adalah lonjakan interaksi visual hingga 140% dan peningkatan omset penjualan yang signifikan.",
  imageUrl = "https://picsum.photos/seed/casehighlight/1200/800"
}: AbstractPortfolioCaseHighlightProps) {
  return (
    <section className="relative bg-white text-neutral-900 py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-neutral-100"
            >
              <img
                src={imageUrl}
                alt="Case Study Showcase Image"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#F56B71] text-white font-mono text-xs lowercase font-semibold px-3 py-1.5 rounded-full">
                sorotan utama
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#649FF6]/10">
              <Target className="w-3.5 h-3.5 text-[#649FF6]" />
              <span className="font-mono text-xs lowercase tracking-wide text-[#649FF6]">case highlight</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-tight text-neutral-900">
              {title}
            </h2>

            <div className="space-y-5 text-neutral-600 font-sans text-base leading-relaxed whitespace-pre-line">
              {description}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-100">
              <div>
                <span className="block text-neutral-900 font-sans font-semibold text-sm mb-1">Klien</span>
                <span className="text-neutral-500 font-sans text-sm">Nirmala Nusantara</span>
              </div>
              <div>
                <span className="block text-neutral-900 font-sans font-semibold text-sm mb-1">Kategori</span>
                <span className="text-neutral-500 font-sans text-sm">Rebranding kreatif</span>
              </div>
              <div>
                <span className="block text-neutral-900 font-sans font-semibold text-sm mb-1">Durasi</span>
                <span className="text-neutral-500 font-sans text-sm">4 bulan</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
