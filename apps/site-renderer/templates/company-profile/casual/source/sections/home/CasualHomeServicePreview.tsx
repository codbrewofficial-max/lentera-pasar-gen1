'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Instagram, Laptop, Camera } from 'lucide-react';
import { servicesData, ServiceItem } from '@/lib/dummy-data';

export interface CasualHomeServicePreviewProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  services?: ServiceItem[];
}

export function CasualHomeServicePreview({
  title = 'Layanan Seru untuk Majuin Bisnismu',
  description = 'Pilih paket layanan yang paling sesuai dengan kebutuhan tokomu saat ini. Mulai dari bikin identitas brand dari nol, rapihin sosmed, sampai bangun website jualan.',
  ctaLabel = 'Lihat Semua Layanan',
  ctaUrl = '/services',
  services = servicesData,
}: CasualHomeServicePreviewProps) {
  
  // Mapping of icons dynamically
  const getIcon = (name: string, color: string) => {
    switch (name) {
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" style={{ color }} />;
      case 'Instagram':
        return <Instagram className="w-6 h-6" style={{ color }} />;
      case 'Laptop':
        return <Laptop className="w-6 h-6" style={{ color }} />;
      case 'Camera':
        return <Camera className="w-6 h-6" style={{ color }} />;
      default:
        return <Sparkles className="w-6 h-6" style={{ color }} />;
    }
  };

  const getBgLight = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return 'bg-[#649FF6]/10 hover:bg-[#649FF6]/15';
      case 'Instagram':
        return 'bg-[#F56B71]/10 hover:bg-[#F56B71]/15';
      case 'Laptop':
        return 'bg-[#B283AF]/10 hover:bg-[#B283AF]/15';
      case 'Camera':
        return 'bg-[#649FF6]/10 hover:bg-[#649FF6]/15';
      default:
        return 'bg-gray-100 hover:bg-gray-200';
    }
  };

  return (
    <section id="CasualHomeServicePreview" className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Decorative ambient bubble */}
      <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-[#649FF6]/5 blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-sm font-bold text-[#B283AF] uppercase tracking-widest block font-mono">
            APA YANG KAMI BISA
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
            {title}
          </h2>
          <p className="font-sans text-base text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, idx) => (
            <div
              key={service.id}
              className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm hover:shadow-md hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Icon Wrapper with Custom Dynamic Rounded Corner */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 duration-300 ${getBgLight(service.iconName)}`}>
                  {getIcon(service.iconName, service.color)}
                </div>

                <h3 className="font-sans font-extrabold text-lg text-gray-950 group-hover:text-[#649FF6] transition-colors">
                  {service.title}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {service.shortDesc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-gray-400 group-hover:text-gray-500 transition-colors">
                  {service.price}
                </span>
                <span className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#649FF6]/10 flex items-center justify-center text-gray-400 group-hover:text-[#649FF6] transition-all">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Link */}
        <div className="text-center">
          <Link
            id="service-preview-all-cta"
            href={ctaUrl}
            className="inline-flex items-center gap-2 bg-[#B283AF] text-white px-7 py-3.5 rounded-full text-sm font-bold shadow-md shadow-[#B283AF]/10 hover:bg-[#B283AF]/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
