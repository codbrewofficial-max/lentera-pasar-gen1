'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Quote } from 'lucide-react';
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

const ACCENTS = ['#649FF6', '#F56B71', '#B283AF'];

export function AbstractHomeTrustProof({
  title = "Bukti nyata karya kami diakui industri",
  description = "Kami tidak sekadar berteori. Angka-angka ini merepresentasikan hasil kerja yang memberi dampak bisnis terukur bagi para mitra kami.",
  metricOneLabel = "Mitra UMKM & Korporasi Aktif",
  metricOneValue = "120+",
  metricTwoLabel = "Karya Visual Terselesaikan",
  metricTwoValue = "450+",
  metricThreeLabel = "Penghargaan Eksperimen Desain",
  metricThreeValue = "12",
  testimonials,
  brands = []
}: AbstractHomeTrustProofProps) {
  return (
    <section className="relative bg-[#151515] text-white py-24 px-6 overflow-hidden">
      <div className="absolute right-1/4 top-1/4 w-96 h-96 bg-[#F56B71] opacity-[0.08] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute left-1/3 bottom-10 w-80 h-80 bg-[#649FF6] opacity-[0.08] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10">
            <Trophy className="w-3.5 h-3.5 text-[#649FF6]" />
            <span className="font-mono text-xs lowercase tracking-wide text-neutral-200">rekam jejak</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-neutral-400 font-sans text-sm sm:text-base leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: metricOneLabel, value: metricOneValue },
            { label: metricTwoLabel, value: metricTwoValue },
            { label: metricThreeLabel, value: metricThreeValue },
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-3xl bg-white/5 p-8 flex flex-col justify-between min-h-[200px]"
            >
              <span
                className="font-sans font-extrabold text-5xl sm:text-6xl tracking-tight"
                style={{ color: ACCENTS[index % ACCENTS.length] }}
              >
                {metric.value}
              </span>
              <p className="font-sans text-sm font-semibold text-neutral-300 mt-6">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>

        {testimonials && testimonials.length > 0 && (
          <div className="mt-20 pt-16 border-t border-white/10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 mb-10">
              <Quote className="w-3.5 h-3.5 text-[#F56B71]" />
              <span className="font-mono text-xs lowercase tracking-wide text-neutral-200">suara mitra</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((item, index) => {
                const accent = ACCENTS[index % ACCENTS.length];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="rounded-3xl bg-white/5 p-7 flex flex-col h-full"
                  >
                    <Quote className="w-5 h-5 mb-4" style={{ color: accent }} />
                    <p className="font-sans text-sm text-neutral-300 leading-relaxed flex-1">
                      {item.content}
                    </p>
                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/10">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                      <div>
                        <p className="font-sans text-sm font-semibold text-white">
                          {item.name}
                        </p>
                        <p className="font-sans text-xs text-neutral-500">
                          {[item.role, item.company].filter(Boolean).join(" — ")}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {brands.length > 0 && (
          <div className="mt-16 pt-10 border-t border-white/10 flex flex-wrap justify-center items-center gap-x-14 gap-y-8">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity">
                {brand.logoUrl ? (
                  <img src={brand.logoUrl} alt={brand.name} className="h-8 md:h-9 w-auto object-contain grayscale" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-xs font-sans font-semibold text-neutral-400">{brand.name}</span>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
