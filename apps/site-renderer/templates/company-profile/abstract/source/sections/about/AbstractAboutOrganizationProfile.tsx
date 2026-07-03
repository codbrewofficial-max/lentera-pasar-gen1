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
  title = "Struktur kolektif dan ekosistem kerja kami",
  description = "Studio Sinestesia beroperasi sebagai struktur non-hierarkis yang menyatukan desainer, ilustrator, insinyur perangkat lunak, dan pemikir strategis.\n\nKami percaya karya luar biasa lahir ketika batas-batas disiplin ilmu dileburkan. Di studio kami, seorang desainer grafis bekerja berdampingan dengan pengembang kode sejak hari pertama.",
  imageUrl = "https://picsum.photos/seed/orgprofile/800/600"
}: AbstractAboutOrganizationProfileProps) {
  return (
    <section className="relative bg-[#151515] text-white py-24 px-6 overflow-hidden">
      <div className="absolute right-0 top-0 w-80 h-80 bg-[#B283AF] opacity-[0.08] rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10">
              <Network className="w-3.5 h-3.5 text-[#649FF6]" />
              <span className="font-mono text-xs lowercase tracking-wide text-neutral-200">struktur organisasi</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-tight">
              {title}
            </h2>

            <div className="space-y-4 text-neutral-300 font-sans text-base leading-relaxed whitespace-pre-line">
              {description}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="rounded-2xl bg-white/5 p-4">
                <span className="text-neutral-500 font-sans text-xs block mb-1">Kolaborasi</span>
                <span className="text-white font-sans font-semibold text-sm">100% Non-hierarkis</span>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <span className="text-neutral-500 font-sans text-xs block mb-1">Produktivitas</span>
                <span className="text-white font-sans font-semibold text-sm">Iteratif & eksperimental</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-neutral-900"
            >
              <img
                src={imageUrl}
                alt="Studio Sinestesia Organization Culture"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
