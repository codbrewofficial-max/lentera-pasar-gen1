'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Sparkles, Monitor, Flame, Camera, ArrowRight, Layers } from 'lucide-react';
import { defaultServices, ServiceItem } from '../../lib/dummy-data';

interface AbstractHomeServicePreviewProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  services?: ServiceItem[];
}

const iconMap: { [key: string]: React.ElementType } = {
  Sparkles: Sparkles,
  Monitor: Monitor,
  Flame: Flame,
  Camera: Camera,
  Layers: Layers
};

const ACCENTS = ['#649FF6', '#F56B71', '#B283AF'];

export function AbstractHomeServicePreview({
  title = "Layanan kreatif untuk brand yang bosan seragam",
  description = "Kami merancang identitas visual, web art, konten, dan produk kreatif yang dirancang buat brand yang berani tampil beda dan relevan sama audiens muda.",
  ctaLabel = "Pelajari seluruh layanan",
  ctaUrl = "/services",
  services = defaultServices
}: AbstractHomeServicePreviewProps) {
  return (
    <section className="relative bg-[#151515] text-white py-24 px-6 overflow-hidden">
      <div className="absolute right-0 top-1/3 w-80 h-80 bg-[#F56B71] opacity-[0.08] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10">
              <Layers className="w-3.5 h-3.5 text-[#B283AF]" />
              <span className="font-mono text-xs lowercase tracking-wide text-neutral-200">amunisi kreatif</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-[1.1]">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-neutral-400 font-sans text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.iconName] || Sparkles;
            const accent = ACCENTS[index % ACCENTS.length];

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group bg-white/5 hover:bg-white/[0.08] rounded-3xl p-8 transition-colors duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${accent}22` }}
                  >
                    <IconComponent className="w-6 h-6" style={{ color: accent }} />
                  </div>

                  {service.badge && (
                    <span
                      className="font-mono text-[10px] lowercase font-semibold tracking-wide px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: accent }}
                    >
                      {service.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <span className="font-mono text-[10px] lowercase tracking-wide text-neutral-500 block">
                    {service.category}
                  </span>

                  <h3 className="font-sans text-xl font-bold text-white group-hover:text-[#649FF6] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-neutral-400 font-sans text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-1.5 text-neutral-500 group-hover:text-white transition-colors">
                  <span className="font-sans text-xs font-semibold">Eksplorasi</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Link
            href={ctaUrl}
            className="inline-flex items-center px-8 py-4 rounded-full bg-white text-neutral-900 font-sans font-bold text-sm hover:bg-neutral-200 transition-colors"
          >
            {ctaLabel}
          </Link>
        </div>

      </div>
    </section>
  );
}
