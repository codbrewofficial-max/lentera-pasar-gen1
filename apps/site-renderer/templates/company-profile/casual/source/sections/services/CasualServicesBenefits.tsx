'use client';

import React from 'react';
import { Sparkles, MessageCircle, FileCode, Shield } from 'lucide-react';

export interface CasualServicesBenefitsProps {
  title?: string;
  description?: string;
  benefitOne?: string;
  benefitTwo?: string;
  benefitThree?: string;
  benefitFour?: string;
}

export function CasualServicesBenefits({
  title = 'Mengapa Mempercayakan Visual Brand Pada Kami?',
  description = 'Bekerja sama dengan Ruang Karsa berarti kamu menghemat waktu dan tenaga berharga, sekaligus mendapatkan kualitas terbaik yang didukung oleh pilar-pilar manfaat utama.',
  benefitOne = 'Tanpa Jargon Teknis — Komunikasi yang membumi, bersahabat, dan gampang dimengerti oleh pemula sekalipun.',
  benefitTwo = 'Bimbingan Sesi Diskusi — Kamu dilibatkan penuh dalam proses penentuan konsep, bukan sekadar terima jadi.',
  benefitThree = 'Aset Hak Milik Penuh — Seluruh file master kami serahkan utuh tanpa ada biaya tambahan lisensi di kemudian hari.',
  benefitFour,
}: CasualServicesBenefitsProps) {
  
  const parseBenefit = (benefit: string) => {
    const parts = benefit.split(' — ');
    if (parts.length > 1) {
      return { headline: parts[0], body: parts[1] };
    }
    return { headline: benefit, body: '' };
  };

  const b1 = parseBenefit(benefitOne);
  const b2 = parseBenefit(benefitTwo);
  const b3 = parseBenefit(benefitThree);
  const b4 = benefitFour ? parseBenefit(benefitFour) : null;

  return (
    <section id="CasualServicesBenefits" className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#F56B71]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-sm font-bold text-[#F56B71] uppercase tracking-widest block font-mono">
            MANFAAT UTAMA
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
            {title}
          </h2>
          <p className="font-sans text-base text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Playful columns of benefits: 3 atau 4 tergantung apakah benefitFour diisi */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${b4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-8 max-w-5xl mx-auto`}>
          
          {/* Benefit One */}
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-2xl bg-[#649FF6]/10 flex items-center justify-center text-[#649FF6] mb-6">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-extrabold text-lg text-gray-950 mb-3">
              {b1.headline}
            </h3>
            {b1.body && (
              <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
                {b1.body}
              </p>
            )}
          </div>

          {/* Benefit Two */}
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-2xl bg-[#F56B71]/10 flex items-center justify-center text-[#F56B71] mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-extrabold text-lg text-gray-950 mb-3">
              {b2.headline}
            </h3>
            {b2.body && (
              <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
                {b2.body}
              </p>
            )}
          </div>

          {/* Benefit Three */}
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-2xl bg-[#B283AF]/10 flex items-center justify-center text-[#B283AF] mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-extrabold text-lg text-gray-950 mb-3">
              {b3.headline}
            </h3>
            {b3.body && (
              <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
                {b3.body}
              </p>
            )}
          </div>

          {/* Benefit Four (opsional) */}
          {b4 && (
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-2xl bg-[#649FF6]/10 flex items-center justify-center text-[#649FF6] mb-6">
                <FileCode className="w-6 h-6" />
              </div>
              <h3 className="font-sans font-extrabold text-lg text-gray-950 mb-3">
                {b4.headline}
              </h3>
              {b4.body && (
                <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {b4.body}
                </p>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
