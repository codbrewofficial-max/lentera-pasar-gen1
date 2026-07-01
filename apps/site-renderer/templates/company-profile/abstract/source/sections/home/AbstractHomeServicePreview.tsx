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

// Map icon string names to Lucide icons dynamically
const iconMap: { [key: string]: React.ElementType } = {
  Sparkles: Sparkles,
  Monitor: Monitor,
  Flame: Flame,
  Camera: Camera,
  Layers: Layers
};

export function AbstractHomeServicePreview({
  title = "Layanan Kreatif untuk Brand yang Bosan Seragam",
  description = "Kami tidak menawarkan solusi biasa. Kami merancang arsitektur visual spekulatif, web art, konten provokatif, dan produk kreatif yang dirancang untuk meledakkan konvensi visual.",
  ctaLabel = "PELAJARI SELURUH LAYANAN",
  ctaUrl = "/services",
  services = defaultServices
}: AbstractHomeServicePreviewProps) {
  return (
    <section className="relative bg-[#111111] text-white py-24 px-6 border-b-8 border-white overflow-hidden">
      {/* Decorative lines */}
      <div className="absolute right-10 bottom-0 w-2 h-full bg-[#F56B71] opacity-20 transform -skew-x-12" />
      <div className="absolute left-1/4 top-0 w-0.5 h-full bg-neutral-800" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Upper Title Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#B283AF]">
              <Layers className="w-4 h-4" /> {"// AMUNISI KREATIF"}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black uppercase tracking-tight leading-none">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-neutral-400 font-sans text-sm leading-relaxed border-l-2 border-[#F56B71] pl-4">
              {description}
            </p>
          </div>
        </div>

        {/* Services Grid (Asymmetric) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.iconName] || Sparkles;
            
            // Choose color scheme based on index
            const accentColors = {
              border: index % 2 === 0 ? "hover:border-[#649FF6]" : "hover:border-[#F56B71]",
              text: index % 2 === 0 ? "text-[#649FF6]" : "text-[#F56B71]",
              badge: index % 2 === 0 ? "bg-[#B283AF] text-black" : "bg-[#649FF6] text-black"
            };

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative group bg-black border-2 border-white p-8 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[-8px_8px_0px_white] transition-all duration-300 ${accentColors.border}`}
              >
                {/* Diagonal background slice on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="flex justify-between items-start mb-6">
                  {/* Icon container */}
                  <div className="w-14 h-14 bg-neutral-900 border border-neutral-700 flex items-center justify-center relative">
                    <div className="absolute inset-0.5 bg-neutral-900 border border-white opacity-40" />
                    <IconComponent className={`w-7 h-7 relative z-10 ${accentColors.text}`} />
                  </div>

                  {/* Badge */}
                  {service.badge && (
                    <span className={`font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 ${accentColors.badge} uppercase`}>
                      {service.badge}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-3">
                  <span className="font-mono text-[9px] tracking-widest text-neutral-500 uppercase block">
                    0{index + 1} {"//"} {service.category.toUpperCase()}
                  </span>
                  
                  <h3 className="font-mono text-xl font-black uppercase tracking-tight text-white group-hover:text-[#649FF6] transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-neutral-400 font-sans text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Hover arrow indicator */}
                <div className="mt-8 flex items-center justify-end">
                  <span className="font-mono text-[10px] text-neutral-500 mr-2 group-hover:text-white transition-colors">
                    EKPLORASI →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Link */}
        <div className="flex justify-center">
          <Link href={ctaUrl} className="group relative inline-block">
            <div className="absolute -inset-1 bg-[#F56B71] transform skew-x-12 translate-x-1" />
            <div className="absolute -inset-1 bg-[#649FF6] transform -skew-x-12 -translate-y-1 opacity-70" />
            <button className="relative bg-black border-2 border-white px-10 py-5 font-mono font-bold text-xs tracking-widest text-white group-hover:text-black group-hover:bg-white transition-all">
              {ctaLabel.toUpperCase()}
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
