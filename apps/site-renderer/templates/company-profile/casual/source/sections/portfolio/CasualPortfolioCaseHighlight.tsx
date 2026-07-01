'use client';

import React from 'react';
import { Award, CheckCircle2, TrendingUp, Sparkles, MessageSquare } from 'lucide-react';

export interface CasualPortfolioCaseHighlightProps {
  title?: string;
  description?: string;
  imageUrl?: string;
}

export function CasualPortfolioCaseHighlight({
  title = 'Sorotan Kasus: Sukses Re-branding Kopi Kenangan Senja',
  description = 'Kopi Kenangan Senja datang pada kami dengan tantangan: bagaimana menonjolkan diri di antara ratusan kedai kopi di Bandung. Kami merancang ulang seluruh logo, kemasan botol take-away, serta skema visual sosial media mereka dengan konsep retro-casual yang bersahabat. Hasilnya? Pengikut sosial media tumbuh 40% dan jualan botolan meningkat drastis!',
  imageUrl = 'https://picsum.photos/seed/case-highlight/1200/600',
}: CasualPortfolioCaseHighlightProps) {
  
  const results = [
    { label: 'Kenaikan Pengikut IG', value: '+42%', icon: <TrendingUp className="w-5 h-5 text-[#F56B71]" /> },
    { label: 'Omset Penjualan Botol', value: '+35%', icon: <Award className="w-5 h-5 text-[#649FF6]" /> },
    { label: 'Kepuasan Ulasan Online', value: '4.9/5', icon: <Sparkles className="w-5 h-5 text-[#B283AF]" /> }
  ];

  return (
    <section id="CasualPortfolioCaseHighlight" className="py-20 bg-white relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 w-80 h-80 rounded-full bg-[#B283AF]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-sm font-bold text-[#F56B71] uppercase tracking-widest block font-mono">
            KASUS TERBAIK (STUDI KASUS)
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
            {title}
          </h2>
          <p className="font-sans text-base text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Big Showcase Image (as requested: sediakan satu image banner/hero image di section selain foto per-item) */}
        <div className="max-w-5xl mx-auto mb-16 rounded-[44px] overflow-hidden border-4 border-white shadow-2xl relative aspect-[16/9] bg-gray-100">
          <img
            src={imageUrl}
            alt="Studi Kasus Kopi Kenangan Senja"
            className="w-full h-full object-cover filter brightness-[0.95]"
          />
          <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-[32px] border border-white/50 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 max-w-3xl">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#F56B71] uppercase tracking-widest">Kolaborasi Terbaik</span>
              <h4 className="font-sans font-extrabold text-lg text-gray-950 mt-1">Re-design Kemasan & Sosmed Modern</h4>
            </div>
            <div className="flex gap-2">
              <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#649FF6]/10 text-[#649FF6]">Brand Identity</span>
              <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#B283AF]/10 text-[#B283AF]">Packaging</span>
            </div>
          </div>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {results.map((res, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-[32px] p-6 border-2 border-gray-100 shadow-sm flex items-center gap-4 hover:bg-white hover:border-[#649FF6]/20 hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                {res.icon}
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-sans">{res.label}</span>
                <span className="text-2xl font-extrabold text-gray-950 mt-0.5 block font-sans">{res.value}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
