'use client';

import React from 'react';
import { Quote, Sparkles } from 'lucide-react';
import { defaultTestimonials, TestimonialItem } from '../../lib/dummy-data';

interface BrandItem {
  id: string;
  name: string;
  logoUrl?: string;
}

interface PremiumHomeTrustProofProps {
  title?: string;
  description?: string;
  metricOneLabel?: string;
  metricOneValue?: string;
  metricTwoLabel?: string;
  metricTwoValue?: string;
  metricThreeLabel?: string;
  metricThreeValue?: string;
  testimonials?: TestimonialItem[];
  brands?: BrandItem[];
}

export function PremiumHomeTrustProof({
  title = "Bukti Dedikasi & Kualitas",
  description = "Selama lebih dari satu dekade, kami dipercaya oleh para pemimpin industri dan keluarga terpandu di Indonesia untuk mewujudkan impian spasial mereka tanpa kompromi.",
  metricOneLabel = "Proyek Terselesaikan",
  metricOneValue = "50+",
  metricTwoLabel = "Penghargaan Nasional",
  metricTwoValue = "12",
  metricThreeLabel = "Tingkat Retensi Klien",
  metricThreeValue = "98%",
  testimonials = defaultTestimonials,
  brands = []
}: PremiumHomeTrustProofProps) {
  return (
    <section id="premium-home-trust-proof" className="py-24 md:py-32 bg-[#0E0E0F] text-white relative">
      {/* Background Decorative Accent */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-[#B283AF]/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Core Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-24">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#F56B71] uppercase block">PRESTASI & MATRIKS</span>
            <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-white">{title}</h2>
            <p className="text-stone-400 text-xs md:text-sm leading-relaxed font-light">
              {description}
            </p>
          </div>

          {/* Three columns metrics */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="border border-white/5 bg-[#121214] p-8 text-center relative group hover:border-[#649FF6]/30 transition-all duration-300">
              <span className="text-4xl md:text-5xl font-serif font-light text-[#649FF6] block mb-2">{metricOneValue}</span>
              <span className="text-[10px] tracking-widest text-stone-400 uppercase font-sans font-light">{metricOneLabel}</span>
            </div>

            <div className="border border-white/5 bg-[#121214] p-8 text-center relative group hover:border-[#B283AF]/30 transition-all duration-300">
              <span className="text-4xl md:text-5xl font-serif font-light text-[#B283AF] block mb-2">{metricTwoValue}</span>
              <span className="text-[10px] tracking-widest text-stone-400 uppercase font-sans font-light">{metricTwoLabel}</span>
            </div>

            <div className="border border-white/5 bg-[#121214] p-8 text-center relative group hover:border-[#F56B71]/30 transition-all duration-300">
              <span className="text-4xl md:text-5xl font-serif font-light text-[#F56B71] block mb-2">{metricThreeValue}</span>
              <span className="text-[10px] tracking-widest text-stone-400 uppercase font-sans font-light">{metricThreeLabel}</span>
            </div>
          </div>
        </div>

        {/* Testimonials Block */}
        <div className="space-y-12">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <span className="text-[10px] font-bold tracking-[0.3em] text-stone-400 uppercase">APA KATA MEREKA</span>
            <Sparkles className="w-4 h-4 text-[#649FF6]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="border border-white/5 bg-[#121214]/40 p-8 relative flex flex-col justify-between"
              >
                <div className="absolute top-6 right-6 text-stone-700 pointer-events-none">
                  <Quote className="w-10 h-10 transform scale-x-[-1] opacity-20" />
                </div>

                <p className="text-stone-300 text-sm leading-relaxed font-sans font-light italic mb-8 relative z-10">
                  &quot;{test.feedback}&quot;
                </p>

                <div className="flex items-center space-x-4">
                  {test.avatarUrl && (
                    <img
                      src={test.avatarUrl}
                      alt={test.name}
                      className="w-12 h-12 rounded-full object-cover border border-white/10"
                    />
                  )}
                  <div>
                    <h4 className="text-xs font-serif font-light tracking-wide text-white">{test.name}</h4>
                    <p className="text-[9px] text-stone-500 tracking-wider uppercase font-sans">
                      {test.role}, {test.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand / Client logos dari data CRUD, hanya tampil kalau ada datanya */}
        {brands.length > 0 && (
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-wrap justify-center items-center gap-x-14 gap-y-8">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-center grayscale opacity-50 hover:opacity-90 hover:grayscale-0 transition-all duration-300">
                {brand.logoUrl ? (
                  <img src={brand.logoUrl} alt={brand.name} className="h-7 md:h-9 w-auto object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-xs font-serif font-light tracking-wide text-stone-400">{brand.name}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
