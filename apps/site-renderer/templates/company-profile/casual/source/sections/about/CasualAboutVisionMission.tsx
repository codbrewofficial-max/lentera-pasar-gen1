'use client';

import React from 'react';
import { Target, Compass, Sparkles } from 'lucide-react';

export interface CasualAboutVisionMissionProps {
  visionTitle?: string;
  vision?: string;
  missionTitle?: string;
  mission?: string;
}

export function CasualAboutVisionMission({
  visionTitle = 'Visi Kami',
  vision = 'Menjadi wadah kolaborasi kreatif nomor satu di Indonesia yang mendemokratisasikan akses branding kelas dunia untuk seluruh lapisan UMKM dan bisnis lokal.',
  missionTitle = 'Misi Kami',
  mission = '1. Menyediakan solusi branding dan pemasaran digital yang terjangkau, transparan, serta bebas dari jargon teknis yang membingungkan.\n2. Melatih dan membimbing pemilik bisnis mandiri agar berdaya secara digital secara mandiri.\n3. Menciptakan standar visual baru yang segar, ramah, dan autentik bagi lanskap UMKM lokal.',
}: CasualAboutVisionMissionProps) {
  
  // Split missions by newline if multi-line
  const missionItems = mission.split('\n').filter(item => item.trim() !== '');

  return (
    <section id="CasualAboutVisionMission" className="py-20 bg-white relative overflow-hidden">
      {/* Decorative colored blobs */}
      <div className="absolute top-0 left-10 w-64 h-64 rounded-full bg-[#649FF6]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-64 h-64 rounded-full bg-[#F56B71]/5 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Vision Card - Sky Blue Accented */}
          <div className="bg-gradient-to-tr from-[#649FF6]/5 to-[#649FF6]/15 rounded-[36px] p-8 md:p-12 border-2 border-[#649FF6]/25 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-6 -right-6 text-9xl text-[#649FF6]/10 font-bold select-none">V</div>
            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#649FF6] text-xs font-bold shadow-sm">
                <Compass className="w-4 h-4" />
                <span>ARAH UTAMA</span>
              </div>
              
              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-gray-950">
                {visionTitle}
              </h3>

              <p className="font-sans text-base text-gray-700 leading-relaxed">
                {vision}
              </p>
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-200/40 text-xs font-mono text-gray-400">
              Menjaga fokus masa depan Indonesia 🇮🇩
            </div>
          </div>

          {/* Mission Card - Coral Accented */}
          <div className="bg-gradient-to-tr from-[#F56B71]/5 to-[#F56B71]/15 rounded-[36px] p-8 md:p-12 border-2 border-[#F56B71]/25 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -top-6 -right-6 text-9xl text-[#F56B71]/10 font-bold select-none">M</div>
            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#F56B71] text-xs font-bold shadow-sm">
                <Target className="w-4 h-4" />
                <span>AKSI NYATA</span>
              </div>

              <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-gray-950">
                {missionTitle}
              </h3>

              {/* Missions Checklist */}
              <div className="space-y-3">
                {missionItems.map((item, idx) => {
                  // Strip numbering if exists like "1. "
                  const cleanText = item.replace(/^\d+[\.\s]*/, '');
                  return (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#F56B71] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 shadow-sm shadow-[#F56B71]/25">
                        {idx + 1}
                      </span>
                      <p className="font-sans text-sm text-gray-700 leading-relaxed">
                        {cleanText}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200/40 text-xs font-mono text-gray-400">
              Langkah demi langkah, hari demi hari 🚀
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
