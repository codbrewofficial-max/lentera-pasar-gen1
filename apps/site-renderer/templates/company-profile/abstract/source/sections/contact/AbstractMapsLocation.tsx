'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';

interface AbstractMapsLocationProps {
  title?: string;
  description?: string;
  mapEmbedUrl?: string;
}

export function AbstractMapsLocation({
  title = "Peta lokasi Studio Sinestesia",
  description = "Kami berlokasi di distrik kreatif Kebayoran Baru, Jakarta Selatan. Kunjungi kami untuk berdiskusi langsung.",
  mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1963236253483!2d106.79975767586884!3d-6.237887593750372!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1422731ff73%3A0xe54e60bf7e7fe074!2sGrand%20Wijaya%20Center!5e0!3m2!1sid!2sid!4v1719730000000!5m2!1sid!2sid"
}: AbstractMapsLocationProps) {
  return (
    <section className="relative bg-[#151515] text-white py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-white/10">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10">
              <MapPin className="w-3.5 h-3.5 text-[#F56B71]" />
              <span className="font-mono text-xs lowercase tracking-wide text-neutral-200">lokasi kami</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-sans font-extrabold tracking-tight text-white leading-none">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-neutral-400 font-sans text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full aspect-[21/9] min-h-[350px] rounded-[2rem] bg-neutral-900 overflow-hidden"
        >
          <iframe
            title="Studio Sinestesia Google Map Location"
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

      </div>
    </section>
  );
}
