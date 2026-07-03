'use client';

import React from 'react';
import { Sparkles, Eye } from 'lucide-react';
import { RichHtml } from '@/components/content/RichHtml';

interface PremiumAboutVisionMissionProps {
  visionTitle?: string;
  vision?: string;
  missionTitle?: string;
  mission?: string;
}

const defaultVisionHtml = '<p>Menjadi episentrum perancangan arsitektur dan ruang dalam tropis modern papan atas di Asia Tenggara, yang dikenal karena kemurnian material, keunggulan teknis, dan harmoni lingkungan hidup.</p>';
const defaultMissionHtml = '<ul><li>Merumuskan solusi spasial yang menggabungkan estetika taktil premium dengan analisis termal iklim mikro fungsional.</li><li>Mengangkat nilai kriya dan material lokal asli Indonesia ke panggung internasional melalui rancangan kontemporer elegan.</li><li>Menjamin transparansi mutlak dalam anggaran proyek demi membangun rasa percaya jangka panjang bersama seluruh mitra klien.</li></ul>';

export function PremiumAboutVisionMission({
  visionTitle = "Visi Agung Spasial",
  vision = defaultVisionHtml,
  missionTitle = "Misi & Langkah Nyata",
  mission = defaultMissionHtml
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
            <RichHtml
              html={vision}
              className="prose prose-sm max-w-none text-stone-600 text-sm md:text-base leading-relaxed font-sans font-light prose-p:my-2 prose-ul:my-2 prose-li:my-1"
            />
          </div>

          {/* Mission Block */}
          <div className="border border-stone-200 bg-white p-10 md:p-12 space-y-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#B283AF]" />
            <div className="flex items-center space-x-3 text-[#B283AF]">
              <Sparkles className="w-5 h-5" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase">MISI</span>
            </div>
            <h3 className="text-2xl font-serif font-light text-stone-900">{missionTitle}</h3>
            <RichHtml
              html={mission}
              className="prose prose-sm max-w-none text-stone-600 text-sm md:text-base leading-relaxed font-sans font-light prose-p:my-2 prose-ul:my-2 prose-li:my-1"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
