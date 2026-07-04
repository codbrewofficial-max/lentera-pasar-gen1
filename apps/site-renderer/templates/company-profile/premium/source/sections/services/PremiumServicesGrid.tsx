'use client';

import React from 'react';
import { Compass, Layers, History, Check } from 'lucide-react';
import { defaultServices, ServiceItem } from '../../lib/dummy-data';

interface PremiumServicesGridProps {
  title?: string;
  description?: string;
  badge?: string;
  services?: ServiceItem[];
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function PremiumServicesGrid({
  title = "Spesialisasi Arsitektural Kami",
  description = "Tiga layanan utama yang dirancang untuk klien korporasi, developer resor butik, serta pemilik hunian pribadi berkelas tinggi.",
  badge = "DIVERSITAS SOLUSI",
  services = defaultServices,
  imageUrl,
  ctaLabel,
  ctaHref = "/contact",
}: PremiumServicesGridProps) {
  const getIcon = (name?: string) => {
    switch (name) {
      case 'Compass': return <Compass className="w-5 h-5 text-[#649FF6]" />;
      case 'Layers': return <Layers className="w-5 h-5 text-[#B283AF]" />;
      case 'History': return <History className="w-5 h-5 text-[#F56B71]" />;
      default: return <Compass className="w-5 h-5 text-[#649FF6]" />;
    }
  };

  return (
    <section id="premium-services-grid" className="bg-[#0E0E0F] text-white relative overflow-hidden">
      {imageUrl && (
        <div className="absolute inset-0">
          <img src={imageUrl} alt="" className="w-full h-full object-cover opacity-20" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E0E0F]/90 via-[#0E0E0F]/85 to-[#0E0E0F]" />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6 relative z-10 py-24 md:py-32">
        {/* Header Block */}
        <div className="max-w-3xl mb-20 space-y-4">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#649FF6] uppercase block">{badge}</span>
          <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-white">{title}</h2>
          <p className="text-stone-400 text-xs md:text-sm leading-relaxed font-sans font-light">
            {description}
          </p>
          {ctaLabel && (
            <a href={ctaHref} className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-white hover:text-[#649FF6] transition-colors py-2.5 border-b border-white/20 hover:border-[#649FF6]">
              {ctaLabel}
            </a>
          )}
        </div>

        {/* Detailed services grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="border border-white/5 bg-[#121214] p-8 md:p-10 flex flex-col justify-between space-y-8 relative group hover:border-[#649FF6]/40 transition-all duration-500"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-white/5 border border-white/5 rounded-none group-hover:bg-[#649FF6]/10 transition-colors">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="text-stone-600 font-mono text-xs font-semibold tracking-widest">
                    CONCEPT 0{index + 1}
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-serif font-light tracking-wide group-hover:text-[#649FF6] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-stone-400 text-xs leading-relaxed font-light font-sans">
                    {service.description}
                  </p>
                </div>

                {service.longDescription && (
                  <p className="text-stone-500 text-xs font-sans leading-relaxed border-t border-white/5 pt-4 font-light">
                    {service.longDescription}
                  </p>
                )}
              </div>

              <div className="pt-6 border-t border-white/5 flex flex-col space-y-2">
                <span className="text-[9px] text-stone-500 tracking-wider uppercase font-mono">ESTIMASI BIAYA PERENCANAAN</span>
                <span className="text-sm font-serif font-light text-[#649FF6]">
                  {service.priceRange || "KONSULTASI HARGA"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
