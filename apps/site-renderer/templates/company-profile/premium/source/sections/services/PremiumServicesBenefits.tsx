'use client';

import React from 'react';
import { ShieldCheck, Target, Eye, Award } from 'lucide-react';

interface PremiumServicesBenefitsProps {
  title?: string;
  description?: string;
  benefitOne?: string;
  benefitTwo?: string;
  benefitThree?: string;
  benefitFour?: string;
}

export function PremiumServicesBenefits({
  title = "Keuntungan Layanan Premium",
  description = "Bukan sekadar menggambar, kami melestarikan ketenangan spasial jangka panjang melalui manajemen kendali mutu yang ketat.",
  benefitOne = "Pengawasan Lapangan Berlapis",
  benefitTwo = "Material Kategori Langka (Exotic)",
  benefitThree = "Garansi Struktur Seumur Hidup",
  benefitFour
}: PremiumServicesBenefitsProps) {
  return (
    <section id="premium-services-benefits" className="py-24 md:py-32 bg-[#FAF9F6] text-[#121212]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Text block */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#B283AF] uppercase block">KOMITMEN NILAI</span>
            <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-stone-900 leading-tight">
              {title}
            </h2>
            <p className="text-stone-600 text-sm md:text-base leading-relaxed font-sans font-light">
              {description}
            </p>
          </div>

          {/* Benefits Cards: 3 kolom, atau 2x2 kalau benefitFour diisi */}
          <div className={`lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 ${benefitFour ? '' : 'lg:grid-cols-3'} gap-6`}>
            {/* Benefit 1 */}
            <div className="bg-white border border-stone-200 p-8 space-y-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-2.5 bg-[#649FF6]/10 w-fit">
                <Target className="w-5 h-5 text-[#649FF6]" />
              </div>
              <h3 className="text-sm font-semibold tracking-wide text-stone-900 uppercase">
                {benefitOne}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed font-sans font-light">
                Principal Architect kami melakukan tinjauan fisik langsung ke lapangan minimal satu kali seminggu untuk memitigasi kesalahan tukang.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white border border-stone-200 p-8 space-y-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-2.5 bg-[#B283AF]/10 w-fit">
                <Eye className="w-5 h-5 text-[#B283AF]" />
              </div>
              <h3 className="text-sm font-semibold tracking-wide text-stone-900 uppercase">
                {benefitTwo}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed font-sans font-light">
                Akses kurasi batu alam slab besar impor, kayu ulin langka berizin resmi, serta pengrajin kriya anyaman khusus lokal.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white border border-stone-200 p-8 space-y-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="p-2.5 bg-[#F56B71]/10 w-fit">
                <ShieldCheck className="w-5 h-5 text-[#F56B71]" />
              </div>
              <h3 className="text-sm font-semibold tracking-wide text-stone-900 uppercase">
                {benefitThree}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed font-sans font-light">
                Kami memberikan garansi kelaikan struktur jangka panjang didukung oleh laporan perhitungan kekuatan dinamis Chief Structural Engineer.
              </p>
            </div>

            {/* Benefit 4 (opsional) */}
            {benefitFour && (
              <div className="bg-white border border-stone-200 p-8 space-y-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="p-2.5 bg-[#649FF6]/10 w-fit">
                  <Award className="w-5 h-5 text-[#649FF6]" />
                </div>
                <h3 className="text-sm font-semibold tracking-wide text-stone-900 uppercase">
                  {benefitFour}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed font-sans font-light">
                  Layanan purna jual dan pendampingan berkelanjutan setelah proyek selesai diserahterimakan kepada klien.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
