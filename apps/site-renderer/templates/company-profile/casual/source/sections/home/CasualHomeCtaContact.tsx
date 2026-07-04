'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MessageSquare, Sparkles } from 'lucide-react';

export interface CasualHomeCtaContactProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  imageUrl?: string;
}

export function CasualHomeCtaContact({
  title = 'Yuk, Diskusi Santai Sambil Ngopi!',
  description = 'Punya ide gila tapi bingung visualisasinya? Atau mau curhat soal sosmed jualanmu yang sepi? Tenang, tim kreatif kami siap dengerin curhatanmu gratis.',
  ctaLabel = 'Hubungi Lewat WhatsApp',
  ctaUrl = 'https://wa.me/628123456789',
  imageUrl,
}: CasualHomeCtaContactProps) {
  return (
    <section id="CasualHomeCtaContact" className="py-16 md:py-20 bg-white relative overflow-hidden">
      
      {/* Decorative colored blobs */}
      <div className="absolute top-0 left-10 w-64 h-64 rounded-full bg-[#649FF6]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-64 h-64 rounded-full bg-[#B283AF]/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Playful container card with border dash / organic feel */}
        <div className="bg-gradient-to-tr from-[#649FF6]/20 via-[#B283AF]/10 to-[#F56B71]/10 rounded-[48px] p-8 md:p-14 text-center border-2 border-white/50 shadow-xl relative overflow-hidden">
          
                    
          {imageUrl && (
          
            <div className="absolute inset-0">
          
              <img src={imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          
              <div className="absolute inset-0 bg-gray-950/70" />
          
            </div>
          
          )}
          
          <div className="relative z-10">
{/* Fun elements inside card */}
          <div className="absolute top-6 left-8 text-2xl select-none rotate-[-15deg] hidden sm:block">☕</div>
          <div className="absolute bottom-8 right-8 text-2xl select-none rotate-[15deg] hidden sm:block">💡</div>

          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-gray-800 text-xs font-bold shadow-sm font-sans">
              <Sparkles className="w-3.5 h-3.5 text-[#F56B71] fill-[#F56B71]" />
              <span>GRATIS KONSULTASI 30 MENIT</span>
            </div>

            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-950 tracking-tight leading-tight">
              {title}
            </h2>

            <p className="font-sans text-sm sm:text-base text-gray-700 leading-relaxed">
              {description}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* WhatsApp CTA */}
              <a
                id="cta-whatsapp-link"
                href={ctaUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2.5 bg-[#F56B71] text-white px-8 py-4 rounded-full text-base font-bold shadow-lg shadow-[#F56B71]/20 hover:bg-[#F56B71]/90 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
              >
                <MessageSquare className="w-5 h-5 fill-white/10" />
                <span>{ctaLabel}</span>
              </a>

              {/* Contact Page Link */}
              <Link
                id="cta-contact-form-link"
                href="/contact"
                className="inline-flex items-center gap-1.5 text-gray-800 hover:text-gray-950 font-extrabold text-sm py-2 px-4 transition-all hover:translate-x-1"
              >
                <span>Atau Isi Formulir Kontak</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <p className="text-xs text-gray-500 font-sans">
              *Diskusi bisa tatap muka di Bandung atau online via Google Meet/Zoom
            </p>
          </div>

        </div>

        </div>

      </div>
    </section>
  );
}
