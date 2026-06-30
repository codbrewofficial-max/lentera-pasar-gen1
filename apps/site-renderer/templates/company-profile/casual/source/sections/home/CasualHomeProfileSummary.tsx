'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export interface CasualHomeProfileSummaryProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  imageUrl?: string;
}

export function CasualHomeProfileSummary({
  title = 'Kenalan Lebih Dekat dengan Ruang Karsa Studio!',
  description = 'Kami adalah sekelompok praktisi kreatif yang percaya bahwa brand lokal Indonesia punya kualitas yang sangat bersaing. Melalui pendekatan visual yang bersahabat, kami membantu menyederhanakan proses branding dan pemasaran digital agar para pemilik UMKM bisa fokus mengembangkan kualitas produk terbaik mereka tanpa pusing urusan desain.',
  ctaLabel = 'Selengkapnya Tentang Kami',
  ctaUrl = '/about',
  imageUrl = 'https://picsum.photos/seed/summary/800/600',
}: CasualHomeProfileSummaryProps) {
  const points = [
    'Komunikasi santai, tanpa bahasa teknis yang bikin pusing',
    'Desain yang autentik & disesuaikan karakter produk unikmu',
    'Harga transparan & ramah untuk kantong usaha rintisan',
    'Pengerjaan tepat waktu & dibimbing hingga siap rilis',
  ];

  return (
    <section id="CasualHomeProfileSummary" className="py-20 bg-white relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 w-80 h-80 rounded-full bg-[#B283AF]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Image Column */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
            <div className="relative">
              {/* Background solid decoration */}
              <div className="absolute inset-0 rounded-[36px] bg-[#649FF6] translate-x-4 translate-y-4 -rotate-2 -z-10" />
              
              {/* Main Image in profile summary */}
              <div className="w-full max-w-md aspect-[4/3] sm:aspect-square md:aspect-[4/3] rounded-[36px] overflow-hidden border-4 border-white shadow-xl bg-gray-100">
                <img
                  src={imageUrl}
                  alt="Tentang Tim Ruang Karsa"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Float Badge */}
              <div className="absolute -top-4 -right-4 bg-[#B283AF] text-white py-2.5 px-4 rounded-2xl shadow-lg rotate-6 text-xs font-bold font-sans">
                Sejak 2022 di Bandung 🚀
              </div>
            </div>
          </div>

          {/* Text/Content Column */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <span className="text-sm font-bold text-[#F56B71] uppercase tracking-widest block font-mono">
              SIAPA KAMI
            </span>
            
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight leading-tight">
              {title}
            </h2>

            <p className="font-sans text-base text-gray-600 leading-relaxed">
              {description}
            </p>

            {/* Unique casual checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {points.map((point, index) => (
                <div key={index} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#649FF6] shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 font-medium">{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link
                id="profile-summary-cta"
                href={ctaUrl}
                className="inline-flex items-center gap-2 bg-[#649FF6] text-white px-7 py-3.5 rounded-full text-sm font-bold shadow-md hover:bg-[#649FF6]/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
