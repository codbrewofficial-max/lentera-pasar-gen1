'use client';

import React from 'react';
import { ArrowRight, Compass, Layers, History, ShieldAlert } from 'lucide-react';
import { defaultServices, ServiceItem } from '../../lib/dummy-data';

interface PremiumHomeServicePreviewProps {
  title?: string;
  description?: string;
  badge?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  services?: ServiceItem[];
  imageUrl?: string;
}

export function PremiumHomeServicePreview({
  title = "Layanan Eksklusif Kami",
  description = "Kami mendampingi Anda di setiap tahap siklus pembangunan properti premium, mulai dari perancangan visi awal hingga pengawasan detail finishing terkecil di lapangan.",
  badge = "DIVERSITAS KEAHLIAN",
  ctaLabel = "EKSPLORASI SELURUH LAYANAN",
  ctaUrl = "/services",
  services = defaultServices,
  imageUrl,
}: PremiumHomeServicePreviewProps) {
  // Simple map to match icon string to Lucide component
  const getIcon = (name?: string) => {
    switch (name) {
      case 'Compass': return <Compass className="w-5 h-5 text-[#649FF6]" />;
      case 'Layers': return <Layers className="w-5 h-5 text-[#B283AF]" />;
      case 'History': return <History className="w-5 h-5 text-[#F56B71]" />;
      default: return <Compass className="w-5 h-5 text-[#649FF6]" />;
    }
  };

  return (
    <section id="premium-home-service-preview" className="py-24 md:py-32 bg-[#0E0E0F] text-white relative overflow-hidden">
      {imageUrl && (
        <div className="absolute inset-0">
          <img src={imageUrl} alt="" className="w-full h-full object-cover opacity-25" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E0E0F]/90 via-[#0E0E0F]/85 to-[#0E0E0F]" />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-20">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#649FF6] uppercase block">{badge}</span>
            <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight">{title}</h2>
          </div>
          <div className="lg:col-span-4 lg:text-right space-y-4">
            <p className="text-stone-400 text-xs md:text-sm leading-relaxed font-light">
              {description}
            </p>
            {imageUrl && ctaLabel && (
              <a
                href={ctaUrl}
                className="inline-flex items-center space-x-3 text-xs font-semibold tracking-[0.25em] text-white hover:text-[#649FF6] transition-colors py-2.5 border-b border-white/10 hover:border-[#649FF6]"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F56B71]" />
              </a>
            )}
          </div>
        </div>

        {/* Services List / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="border border-white/5 bg-[#121214] p-8 relative hover:border-[#649FF6]/40 transition-all duration-500 group flex flex-col justify-between min-h-[320px]"
            >
              {/* Card Header */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-white/5 border border-white/5 rounded-none group-hover:bg-[#649FF6]/10 transition-colors">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="text-[10px] text-stone-500 font-mono tracking-widest uppercase">
                    0{index + 1} SPATIAL
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-serif font-light group-hover:text-[#649FF6] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-stone-400 text-xs leading-relaxed font-light font-sans">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-wider text-stone-500">
                  {service.priceRange || "KONSULTASI HARGA"}
                </span>
                <span className="text-xs font-semibold text-[#649FF6] group-hover:translate-x-1.5 transition-transform">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Section CTA Link */}
        {!imageUrl && ctaLabel && (
          <div className="text-center pt-4">
            <a
              id="services-preview-cta"
              href={ctaUrl}
              className="inline-flex items-center space-x-3 text-xs font-semibold tracking-[0.25em] text-white hover:text-[#649FF6] transition-colors py-2.5 border-b border-white/10 hover:border-[#649FF6]"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#F56B71]" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
