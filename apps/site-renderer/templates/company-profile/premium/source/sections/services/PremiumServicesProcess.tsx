'use client';

import React from 'react';
import { Compass, Eye, ShieldCheck } from 'lucide-react';

interface PremiumServicesProcessProps {
  title?: string;
  description?: string;
  stepOne?: string;
  stepTwo?: string;
  stepThree?: string;
}

export function PremiumServicesProcess({
  title = "Metodologi Kerja Tiga Fase",
  description = "Setiap proyek eksklusif menuntut kedisiplinan tingkat tinggi. Alur kerja kami dibagi menjadi tiga fase matang demi menjamin kepatuhan konsep hingga realisasi akhir.",
  stepOne = "Fase 1: Dialog Konsep & Studi Tapak",
  stepTwo = "Fase 2: Pemodelan Digital & Visualisasi VR",
  stepThree = "Fase 3: Dokumen Gambar Kerja & Supervisi Fisik"
}: PremiumServicesProcessProps) {
  return (
    <section id="premium-services-process" className="py-24 md:py-32 bg-[#0E0E0F] text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Block */}
        <div className="max-w-3xl mb-20 space-y-4">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#F56B71] uppercase block">FLOW KARYA</span>
          <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight">{title}</h2>
          <p className="text-stone-400 text-xs md:text-sm leading-relaxed font-sans font-light">
            {description}
          </p>
        </div>

        {/* Vertical/Horizontal step tracker */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Subtle connecting line in background */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 hidden md:block z-0" />

          {/* Step 1 */}
          <div className="border border-white/5 bg-[#121214] p-8 space-y-6 relative z-10 hover:border-[#649FF6]/40 transition-colors">
            <span className="text-5xl font-serif font-light text-[#649FF6] block">01</span>
            <h3 className="text-base font-semibold tracking-wider text-white uppercase">{stepOne}</h3>
            <p className="text-xs text-stone-400 leading-relaxed font-sans font-light">
              Menganalisis lintasan matahari, kecepatan angin, kelembapan, serta melakukan wawancara privat mendalam untuk menyelaraskan ritme aktivitas sehari-hari Anda dengan orientasi spasial bangunan.
            </p>
          </div>

          {/* Step 2 */}
          <div className="border border-white/5 bg-[#121214] p-8 space-y-6 relative z-10 hover:border-[#B283AF]/40 transition-colors">
            <span className="text-5xl font-serif font-light text-[#B283AF] block">02</span>
            <h3 className="text-base font-semibold tracking-wider text-white uppercase">{stepTwo}</h3>
            <p className="text-xs text-stone-400 leading-relaxed font-sans font-light">
              Mengubah cetak biru menjadi visualisasi tiga dimensi fotorealistik beresolusi tinggi, dilanjutkan dengan simulasi Virtual Reality (VR) agar Anda dapat merasakan tinggi plafon dan sirkulasi udara secara virtual.
            </p>
          </div>

          {/* Step 3 */}
          <div className="border border-white/5 bg-[#121214] p-8 space-y-6 relative z-10 hover:border-[#F56B71]/40 transition-colors">
            <span className="text-5xl font-serif font-light text-[#F56B71] block">03</span>
            <h3 className="text-base font-semibold tracking-wider text-white uppercase">{stepThree}</h3>
            <p className="text-xs text-stone-400 leading-relaxed font-sans font-light">
              Penerbitan dokumen Detailed Engineering Design (DED) lengkap setebal ratusan halaman sebagai panduan kontraktor, ditambah jadwal kunjungan supervisi rutin mingguan oleh tim arsitek utama kami di lapangan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
