'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Eye, Rocket } from 'lucide-react';

interface AbstractAboutVisionMissionProps {
  visionTitle?: string;
  vision?: string;
  missionTitle?: string;
  mission?: string;
}

export function AbstractAboutVisionMission({
  visionTitle = "Visi Kreatif Spekulatif Kami",
  vision = "Menjadi episentrum inovasi desain avant-garde di Asia Tenggara yang membongkar standardisasi korporat membosankan, memberdayakan UMKM lokal dengan kepribadian visual yang legendaris, tak kenal takut, dan berdaya saing global.",
  missionTitle = "Misi Dekonstruksi Berkelanjutan",
  mission = "1. Mendekonstruksi pola pikir branding kaku melalui edukasi visual eksperimental.\n2. Melahirkan arsitektur web digital interaktif berkinerja tinggi yang menggabungkan ekspresi seni murni dengan rekayasa fungsional.\n3. Menghadirkan identitas visual eksklusif kelas atas yang dapat diakses dengan mudah oleh para pelaku UMKM progresif di Indonesia."
}: AbstractAboutVisionMissionProps) {
  return (
    <section className="relative bg-[#111111] text-white py-24 px-6 border-b-8 border-white overflow-hidden">
      {/* Decorative vertical divider line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-neutral-800 hidden lg:block" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Left Panel - VISION (Light purple background, Black text for contrasting color block) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Shadow border offset */}
            <div className="absolute inset-0 bg-[#649FF6] transform translate-x-3 translate-y-3 border-2 border-white" />
            
            <div className="relative bg-[#B283AF] text-black border-2 border-black p-8 md:p-12 h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest bg-black text-white px-3 py-1 mb-6">
                  <Eye className="w-3.5 h-3.5" /> {"// VISI UTAMA"}
                </div>
                
                <h3 className="font-mono text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none mb-6">
                  {visionTitle}
                </h3>
                
                <p className="font-sans text-base sm:text-lg leading-relaxed font-medium">
                  {vision}
                </p>
              </div>
              
              <div className="mt-12 font-mono text-xs font-bold tracking-wider text-black/60">
                {"SINESTESIA // VISION STATEMENT"}
              </div>
            </div>
          </motion.div>

          {/* Right Panel - MISSION (Dark background, white text) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Shadow border offset */}
            <div className="absolute inset-0 bg-[#F56B71] transform -translate-x-3 translate-y-3 border-2 border-white" />
            
            <div className="relative bg-black border-2 border-white p-8 md:p-12 h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#F56B71] mb-6">
                  <Rocket className="w-3.5 h-3.5" /> {"// MISI STRATEGIS"}
                </div>
                
                <h3 className="font-mono text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none text-white mb-6">
                  {missionTitle}
                </h3>
                
                <div className="font-sans text-sm sm:text-base leading-relaxed text-neutral-300 whitespace-pre-line space-y-4">
                  {mission}
                </div>
              </div>
              
              <div className="mt-12 font-mono text-xs font-bold tracking-wider text-neutral-600">
                {"SINESTESIA // ACTION PLAN"}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
