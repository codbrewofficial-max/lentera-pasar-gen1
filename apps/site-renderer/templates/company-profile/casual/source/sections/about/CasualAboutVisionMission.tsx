'use client';

import React from 'react';
import { Target, Compass } from 'lucide-react';
import { RichHtml } from '@/components/content/RichHtml';

export interface CasualAboutVisionMissionProps {
  title?: string;
  description?: string;
  badge?: string;
  visionTitle?: string;
  vision?: string;
  missionTitle?: string;
  mission?: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const defaultVisionHtml = '<p>Menjadi wadah kolaborasi kreatif nomor satu di Indonesia yang mendemokratisasikan akses branding kelas dunia untuk seluruh lapisan UMKM dan bisnis lokal.</p>';
const defaultMissionHtml = '<ul><li>Menyediakan solusi branding dan pemasaran digital yang terjangkau, transparan, serta bebas dari jargon teknis yang membingungkan.</li><li>Melatih dan membimbing pemilik bisnis mandiri agar berdaya secara digital secara mandiri.</li><li>Menciptakan standar visual baru yang segar, ramah, dan autentik bagi lanskap UMKM lokal.</li></ul>';

export function CasualAboutVisionMission({
  title,
  description,
  badge,
  visionTitle = 'Visi Kami',
  vision = defaultVisionHtml,
  missionTitle = 'Misi Kami',
  mission = defaultMissionHtml,
  imageUrl,
  ctaLabel,
  ctaHref = '/contact',
}: CasualAboutVisionMissionProps) {
  return (
    <section id="CasualAboutVisionMission" className="bg-white relative overflow-hidden">
      {imageUrl ? (
        <div className="relative py-16 md:py-20 mb-4 overflow-hidden text-white text-center">
          <div className="absolute inset-0">
            <img src={imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gray-950/70" />
          </div>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
            {badge && <span className="text-sm font-bold text-white/80 uppercase tracking-widest block font-mono">{badge}</span>}
            {title && <h2 className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight">{title}</h2>}
            {description && <p className="font-sans text-base text-gray-200 leading-relaxed">{description}</p>}
            {ctaLabel && (
              <div className="pt-2">
                <a href={ctaHref} className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-100 transition-all">
                  {ctaLabel}
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="absolute top-0 left-10 w-64 h-64 rounded-full bg-[#649FF6]/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-64 h-64 rounded-full bg-[#F56B71]/5 blur-3xl pointer-events-none" />
        </>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 md:py-16">
        {!imageUrl && (title || description || badge) && (
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            {badge && <span className="text-sm font-bold text-[#B283AF] uppercase tracking-widest block font-mono">{badge}</span>}
            {title && <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">{title}</h2>}
            {description && <p className="font-sans text-base text-gray-600 leading-relaxed">{description}</p>}
          </div>
        )}
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

              <RichHtml
                html={vision}
                className="prose prose-sm max-w-none font-sans text-base text-gray-700 leading-relaxed prose-p:my-2 prose-ul:my-2 prose-li:my-1"
              />
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

              <RichHtml
                html={mission}
                className="prose prose-sm max-w-none font-sans text-base text-gray-700 leading-relaxed prose-p:my-2 prose-ul:my-2 prose-li:my-1"
              />
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
