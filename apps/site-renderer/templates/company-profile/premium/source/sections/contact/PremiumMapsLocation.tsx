'use client';

import React from 'react';
import { Compass } from 'lucide-react';

interface PremiumMapsLocationProps {
  title?: string;
  description?: string;
  mapEmbedUrl?: string;
}

export function PremiumMapsLocation({
  title = "Peta Presisi Lokasi Studio Kami",
  description = "Temukan rute tercepat menuju showroom dan studio utama Niskala Atelier di jantung Kebayoran Baru, Jakarta Selatan.",
  mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.16858567117!2d106.80410427457497!3d-6.241513993746974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1437190db71%3A0x6b194bf0047b7498!2sJl.%20Wijaya%20II%2C%20Kebayoran%20Baru%2C%20Kota%20Jakarta%20Selatan%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1711200000000!5m2!1sid!2sid"
}: PremiumMapsLocationProps) {
  return (
    <section id="premium-maps-location" className="py-24 md:py-32 bg-[#FAF9F6] text-[#121212] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-16">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#649FF6] uppercase block">NAVIGASI PETA</span>
            <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-stone-900">{title}</h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-stone-600 text-xs md:text-sm leading-relaxed font-sans font-light">
              {description}
            </p>
          </div>
        </div>

        {/* Elegant Iframe Container */}
        <div className="relative border border-stone-200 bg-stone-100 shadow-2xl aspect-[21/9] min-h-[350px] overflow-hidden">
          {/* Subtle brand outline overlay on map borders */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#B283AF] z-10" />

          {mapEmbedUrl ? (
            <iframe
              title="Niskala Atelier Location Map"
              src={mapEmbedUrl}
              className="w-full h-full border-none grayscale-[20%] contrast-[110%] filter opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-3 p-12 bg-stone-100 text-stone-400">
              <Compass className="w-8 h-8 text-[#B283AF] animate-spin" />
              <span className="text-xs font-mono tracking-widest uppercase">Memuat Peta Lokasi...</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
