'use client';

import React from 'react';
import { ShieldCheck, Palette, LineChart, Sparkles } from 'lucide-react';

export interface CasualAboutValueStatementProps {
  title?: string;
  description?: string;
  valueOne?: string;
  valueTwo?: string;
  valueThree?: string;
}

export function CasualAboutValueStatement({
  title = 'Prinsip Utama yang Kami Pegang Teguh',
  description = 'Dalam bekerja, ada 3 nilai mendasar yang selalu menjadi acuan kami untuk memastikan setiap karya yang dihasilkan tidak hanya indah dilihat, tetapi juga membawa dampak nyata dan disukai pelanggan.',
  valueOne = 'Keterbukaan Tanpa Batas — Berkomunikasi ramah layaknya sahabat karib',
  valueTwo = 'Autentisitas Sejati — Mendesain sesuai esensi unik brand jualanmu',
  valueThree = 'Dampak yang Terukur — Fokus mendongkrak omset & keterlibatan pembeli',
}: CasualAboutValueStatementProps) {
  
  // Parse the values to split label and explanation if separated by " — "
  const parseVal = (val: string) => {
    const parts = val.split(' — ');
    if (parts.length > 1) {
      return { main: parts[0], sub: parts[1] };
    }
    return { main: val, sub: '' };
  };

  const v1 = parseVal(valueOne);
  const v2 = parseVal(valueTwo);
  const v3 = parseVal(valueThree);

  return (
    <section id="CasualAboutValueStatement" className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 rounded-full bg-[#B283AF]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-sm font-bold text-[#649FF6] uppercase tracking-widest block font-mono">
            NILAI & PRINSIP
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
            {title}
          </h2>
          <p className="font-sans text-base text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* 3 Large Playful Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Value One Card */}
          <div className="bg-white rounded-[36px] p-8 border-2 border-[#649FF6]/20 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#649FF6]/10 rounded-bl-[100px] pointer-events-none" />
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#649FF6] flex items-center justify-center text-white shadow-md shadow-[#649FF6]/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-extrabold text-xl text-gray-950">
                {v1.main}
              </h3>
              {v1.sub && (
                <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {v1.sub}
                </p>
              )}
            </div>
            <div className="pt-6 font-mono text-[10px] font-extrabold text-[#649FF6] tracking-wider uppercase">
              PRINSIP 01 • COLLABORATIVE
            </div>
          </div>

          {/* Value Two Card */}
          <div className="bg-white rounded-[36px] p-8 border-2 border-[#F56B71]/20 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#F56B71]/10 rounded-bl-[100px] pointer-events-none" />
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F56B71] flex items-center justify-center text-white shadow-md shadow-[#F56B71]/20">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-extrabold text-xl text-gray-950">
                {v2.main}
              </h3>
              {v2.sub && (
                <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {v2.sub}
                </p>
              )}
            </div>
            <div className="pt-6 font-mono text-[10px] font-extrabold text-[#F56B71] tracking-wider uppercase">
              PRINSIP 02 • AUTHENTIC
            </div>
          </div>

          {/* Value Three Card */}
          <div className="bg-white rounded-[36px] p-8 border-2 border-[#B283AF]/20 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#B283AF]/10 rounded-bl-[100px] pointer-events-none" />
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#B283AF] flex items-center justify-center text-white shadow-md shadow-[#B283AF]/20">
                <LineChart className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-extrabold text-xl text-gray-950">
                {v3.main}
              </h3>
              {v3.sub && (
                <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {v3.sub}
                </p>
              )}
            </div>
            <div className="pt-6 font-mono text-[10px] font-extrabold text-[#B283AF] tracking-wider uppercase">
              PRINSIP 03 • IMPACTFUL
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
