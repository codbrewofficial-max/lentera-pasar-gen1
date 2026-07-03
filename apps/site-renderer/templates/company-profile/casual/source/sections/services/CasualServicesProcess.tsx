'use client';

import React from 'react';
import { MessageSquare, Hammer, Gift, ArrowRight } from 'lucide-react';

export interface CasualServicesProcessProps {
  title?: string;
  description?: string;
  stepOne?: string;
  stepTwo?: string;
  stepThree?: string;
  stepFour?: string;
}

export function CasualServicesProcess({
  title = '3 Langkah Mudah Kolaborasi',
  description = 'Tidak ada prosedur birokrasi yang rumit dan kaku. Proses kolaborasi bersama kami dirancang sesederhana mungkin agar kamu merasa nyaman dari awal hingga akhir.',
  stepOne = 'Saling Curhat Ide — Sesi obrolan santai via WhatsApp atau Zoom untuk menggali impian visual dan target tokomu.',
  stepTwo = 'Eksperimen Studio — Tim kami mulai meracik sketsa, warna, dan konsep untuk diajukan padamu.',
  stepThree = 'Serah Terima Beres — Revisi disepakati, file master diserahkan utuh, dan brand barumu siap dilaunching ke dunia luar!',
  stepFour,
}: CasualServicesProcessProps) {
  
  const parseStep = (stepText: string) => {
    const parts = stepText.split(' — ');
    if (parts.length > 1) {
      return { head: parts[0], body: parts[1] };
    }
    return { head: stepText, body: '' };
  };

  const s1 = parseStep(stepOne);
  const s2 = parseStep(stepTwo);
  const s3 = parseStep(stepThree);
  const s4 = stepFour ? parseStep(stepFour) : null;

  return (
    <section id="CasualServicesProcess" className="py-20 bg-white relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-[#B283AF]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-64 h-64 rounded-full bg-[#649FF6]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-sm font-bold text-[#B283AF] uppercase tracking-widest block font-mono">
            ALUR KERJA
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
            {title}
          </h2>
          <p className="font-sans text-base text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Step Process Grid: 3 atau 4 kolom tergantung apakah stepFour diisi */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${s4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-8 max-w-5xl mx-auto relative`}>
          
          {/* Step 1 */}
          <div className="bg-gray-50 rounded-[36px] p-8 border border-gray-100 relative group hover:bg-white hover:shadow-lg transition-all duration-300">
            <span className="absolute -top-4 left-8 bg-[#649FF6] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md shadow-[#649FF6]/20">
              1
            </span>
            <div className="pt-4 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#649FF6]/10 flex items-center justify-center text-[#649FF6]">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-extrabold text-lg text-gray-950">
                {s1.head}
              </h3>
              {s1.body && (
                <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {s1.body}
                </p>
              )}
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-50 rounded-[36px] p-8 border border-gray-100 relative group hover:bg-white hover:shadow-lg transition-all duration-300">
            <span className="absolute -top-4 left-8 bg-[#F56B71] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md shadow-[#F56B71]/20">
              2
            </span>
            <div className="pt-4 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F56B71]/10 flex items-center justify-center text-[#F56B71]">
                <Hammer className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-extrabold text-lg text-gray-950">
                {s2.head}
              </h3>
              {s2.body && (
                <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {s2.body}
                </p>
              )}
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-50 rounded-[36px] p-8 border border-gray-100 relative group hover:bg-white hover:shadow-lg transition-all duration-300">
            <span className="absolute -top-4 left-8 bg-[#B283AF] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md shadow-[#B283AF]/20">
              3
            </span>
            <div className="pt-4 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#B283AF]/10 flex items-center justify-center text-[#B283AF]">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-extrabold text-lg text-gray-950">
                {s3.head}
              </h3>
              {s3.body && (
                <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {s3.body}
                </p>
              )}
            </div>
          </div>

          {/* Step 4 (opsional) */}
          {s4 && (
            <div className="bg-gray-50 rounded-[36px] p-8 border border-gray-100 relative group hover:bg-white hover:shadow-lg transition-all duration-300">
              <span className="absolute -top-4 left-8 bg-[#649FF6] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md shadow-[#649FF6]/20">
                4
              </span>
              <div className="pt-4 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#649FF6]/10 flex items-center justify-center text-[#649FF6]">
                  <ArrowRight className="w-6 h-6" />
                </div>
                <h3 className="font-sans font-extrabold text-lg text-gray-950">
                  {s4.head}
                </h3>
                {s4.body && (
                  <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {s4.body}
                  </p>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
