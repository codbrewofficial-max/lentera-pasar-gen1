'use client';

import React from 'react';
import { Sparkles, Eye } from 'lucide-react';

interface PremiumAboutVisionMissionProps {
  visionTitle?: string;
  vision?: string;
  missionTitle?: string;
  mission?: string;
}

export function PremiumAboutVisionMission({
  visionTitle = "Visi Agung Spasial",
  vision = "Menjadi episentrum perancangan arsitektur dan ruang dalam tropis modern papan atas di Asia Tenggara, yang dikenal karena kemurnian material, keunggulan teknis, dan harmoni lingkungan hidup.",
  missionTitle = "Misi & Langkah Nyata",
  mission = "1. Merumuskan solusi spasial yang menggabungkan estetika taktil premium dengan analisis termal iklim mikro fungsional.\n2. Mengangkat nilai kriya dan material lokal asli Indonesia ke panggung internasional melalui rancangan kontemporer elegan.\n3. Menjamin transparansi mutlak dalam anggaran proyek demi membangun rasa percaya jangka panjang bersama seluruh mitra klien."
}: PremiumAboutVisionMissionProps) {
  return (
    <section id="premium-about-vision-mission" className="py-24 md:py-32 bg-[#FAF9F6] text-[#121212]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Vision Block */}
          <div className="border border-stone-200 bg-white p-10 md:p-12 space-y-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#649FF6]" />
            <div className="flex items-center space-x-3 text-[#649FF6]">
              <Eye className="w-5 h-5" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase">VISI</span>
            </div>
            <h3 className="text-2xl font-serif font-light text-stone-900">{visionTitle}</h3>
            <p className="text-stone-600 text-sm md:text-base leading-relaxed font-sans font-light whitespace-pre-line">
              {vision}
            </p>
          </div>

          {/* Mission Block */}
          <div className="border border-stone-200 bg-white p-10 md:p-12 space-y-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#B283AF]" />
            <div className="flex items-center space-x-3 text-[#B283AF]">
              <Sparkles className="w-5 h-5" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase">MISI</span>
            </div>
            <h3 className="text-2xl font-serif font-light text-stone-900">{missionTitle}</h3>
            <p className="text-stone-600 text-sm md:text-base leading-relaxed font-sans font-light whitespace-pre-line">
              {mission}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
