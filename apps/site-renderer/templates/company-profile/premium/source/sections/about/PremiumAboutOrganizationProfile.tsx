'use client';

import React from 'react';

interface PremiumAboutOrganizationProfileProps {
  title?: string;
  description?: string;
  imageUrl?: string;
}

export function PremiumAboutOrganizationProfile({
  title = "Infrastruktur & Integritas Studio",
  description = "Niskala Atelier dibangun di atas prinsip transparansi penuh dan koordinasi digital mutakhir. Studio utama kami di Jakarta Selatan dilengkapi dengan teknologi simulasi termal bangunan serta perangkat VR (Virtual Reality) interaktif yang memungkinkan klien kami berjalan melintasi ruangan impian mereka jauh sebelum batu pertama diletakkan.\n\nSetiap aspek dari manajemen proyek kami diawasi menggunakan sistem pelacakan digital tersinkronisasi yang menjamin kepatuhan anggaran, ketepatan waktu pengiriman material, serta kontrol kualitas konstruksi harian yang terdokumentasi rapi.",
  imageUrl = "https://picsum.photos/seed/studioorg/1200/800"
}: PremiumAboutOrganizationProfileProps) {
  return (
    <section id="premium-about-organization-profile" className="py-24 md:py-32 bg-[#FAF9F6] text-[#121212]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Content Column */}
          <div className="lg:col-span-6 space-y-8 order-2 lg:order-1">
            <div className="flex items-center space-x-2">
              <span className="h-[1px] w-8 bg-[#649FF6]" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#649FF6] uppercase">TATA KELOLA</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-stone-900 leading-tight">
              {title}
            </h2>

            <div className="text-stone-600 text-sm md:text-base leading-relaxed space-y-4 font-sans font-light whitespace-pre-line">
              {description}
            </div>

            <div className="pt-6 grid grid-cols-2 gap-8 border-t border-stone-200">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#B283AF] block mb-2">Simulasi Iklim</span>
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  Perhitungan arah angin matahari digital untuk kenyamanan termal interior natural.
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#F56B71] block mb-2">Presisi Finansial</span>
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  Laporan anggaran transparan, terperinci tanpa adanya biaya tambahan tak terduga.
                </p>
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="lg:col-span-6 order-1 lg:order-2 relative">
            <div className="absolute -inset-2 border border-[#649FF6]/20 pointer-events-none z-0" />
            <div className="relative z-10 bg-stone-100 aspect-[3/2] overflow-hidden shadow-xl">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover filter brightness-95"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
