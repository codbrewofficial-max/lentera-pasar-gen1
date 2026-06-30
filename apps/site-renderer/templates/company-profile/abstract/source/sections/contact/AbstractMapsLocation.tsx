'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Compass } from 'lucide-react';

interface AbstractMapsLocationProps {
  title?: string;
  description?: string;
  mapEmbedUrl?: string;
}

export function AbstractMapsLocation({
  title = "Peta Koordinat Studio Sinestesia",
  description = "Kami berlokasi di distrik kreatif Kebayoran Baru, Jakarta Selatan. Kunjungi kami untuk berdiskusi langsung sembari melihat-lihat galeri cetak fisik kami.",
  mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1963236253483!2d106.79975767586884!3d-6.237887593750372!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1422731ff73%3A0xe54e60bf7e7fe074!2sGrand%20Wijaya%20Center!5e0!3m2!1sid!2sid!4v1719730000000!5m2!1sid!2sid"
}: AbstractMapsLocationProps) {
  return (
    <section className="relative bg-[#0d0d0d] text-white py-24 px-6 border-b-8 border-white overflow-hidden">
      {/* Decorative colored blobs */}
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-[#B283AF] opacity-5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Intro Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-neutral-800">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#649FF6]">
              <MapPin className="w-4 h-4 text-[#F56B71]" /> {"// KOORDINAT_GEO_SPASIAL"}
            </div>
            <h2 className="text-3xl sm:text-4xl font-mono font-black uppercase tracking-tight text-white leading-none">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-neutral-400 font-sans text-sm leading-relaxed border-l-2 border-[#B283AF] pl-4">
              {description}
            </p>
          </div>
        </div>

        {/* Map Iframe inside Offset Geometric Frame */}
        <div className="relative w-full">
          {/* Background offset colors */}
          <div className="absolute inset-0 bg-[#B283AF] transform -skew-x-1 translate-x-3 translate-y-3 border-2 border-white -z-10" />
          <div className="absolute inset-0 bg-[#F56B71] transform translate-x-4 -translate-y-2 opacity-50 -z-10" />

          {/* Map Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative w-full aspect-[21/9] min-h-[350px] border-4 border-white bg-neutral-900 overflow-hidden shadow-[-12px_12px_0px_#649FF6]"
          >
            {/* Map iframe */}
            <iframe
              title="Studio Sinestesia Google Map Location"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(120%) grayscale(100%)" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            
            {/* Overlay coordinate details */}
            <div className="absolute bottom-4 right-4 bg-black border border-white p-3 font-mono text-[9px] tracking-wider text-neutral-400 z-20 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#649FF6]" />
              <span>{"LAT: -6.2379 // LNG: 106.7998"}</span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
