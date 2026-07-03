'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Monitor, Flame, Camera, Layers, CheckSquare } from 'lucide-react';
import { defaultServices, ServiceItem } from '../../lib/dummy-data';

interface AbstractServicesGridProps {
  title?: string;
  description?: string;
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

export function AbstractServicesGrid({
  title = "Layanan lengkap Studio Sinestesia",
  description = "Setiap layanan dirancang dan dijalankan oleh profesional di bidangnya. Kami menjamin proses kreatif yang mengutamakan orisinalitas tinggi.",
  services = defaultServices
}: AbstractServicesGridProps) {
  return (
    <section className="relative bg-white text-neutral-900 py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">

        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#649FF6]/10">
            <CheckSquare className="w-3.5 h-3.5 text-[#649FF6]" />
            <span className="font-mono text-xs lowercase tracking-wide text-[#649FF6]">daftar layanan lengkap</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-tight text-neutral-900">
            {title}
          </h2>
          <p className="text-neutral-500 font-sans text-sm sm:text-base leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.iconName] || Sparkles;
            const accent = ACCENTS[index % ACCENTS.length];

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="rounded-3xl bg-neutral-50 p-8 sm:p-10 flex flex-col justify-between h-full min-h-[280px]"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${accent}1a` }}
                    >
                      <IconComponent className="w-6 h-6" style={{ color: accent }} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="font-mono text-[10px] lowercase tracking-wide text-neutral-400 block">
                      {service.category}
                    </span>
                    <h3 className="font-sans text-2xl font-bold text-neutral-900 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-neutral-500 font-sans text-sm sm:text-base leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-wrap gap-x-5 gap-y-2 font-sans text-xs text-neutral-400">
                  <span>Analisis mendalam</span>
                  <span>Iterasi custom</span>
                  <span>Hak cipta penuh</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
