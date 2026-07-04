'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FaqItem } from '../../lib/dummy-data';

export interface CasualContactFaqProps {
  title?: string;
  description?: string;
  badge?: string;
  faqs?: FaqItem[];
  imageUrl?: string;
}

export function CasualContactFaq({
  title = 'Tanya Jawab Seputar Pemesanan & Kontak',
  description = 'Punya kebingungan sebelum memencet tombol sapa kami? Bacalah beberapa rangkuman penjelasan singkat tentang sistem diskusi dan pemesanan di studio kami.',
  badge = 'KONSULTASI FAQ',
  faqs = [],
  imageUrl,
}: CasualContactFaqProps) {
  
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // FAQ sekarang murni dari data FAQ asli yang owner input di dashboard — tidak ada lagi
  // 3 pertanyaan contoh yang dipakai sebagai fallback kalau datanya kosong.
  if (faqs.length === 0) return null;

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="CasualContactFaq" className="bg-white relative overflow-hidden">
      {imageUrl ? (
        <div className="relative py-16 md:py-20 mb-4 overflow-hidden text-white text-center">
          <div className="absolute inset-0">
            <img src={imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gray-950/70" />
          </div>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
            <span className="text-sm font-bold text-white/80 uppercase tracking-widest block font-mono">{badge}</span>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight">{title}</h2>
            <p className="font-sans text-base text-gray-200 leading-relaxed">{description}</p>
          </div>
        </div>
      ) : (
        <div className="absolute top-0 left-10 w-80 h-80 rounded-full bg-[#B283AF]/5 blur-3xl pointer-events-none" />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 md:py-16">
        {!imageUrl && (
          /* Section Heading */
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-sm font-bold text-[#649FF6] uppercase tracking-widest block font-mono">
              {badge}
            </span>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
              {title}
            </h2>
            <p className="font-sans text-base text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {/* Accordion list */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-gray-50 rounded-[24px] border border-gray-100 shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  id={`contact-faq-toggle-${index}`}
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 sm:p-7 flex justify-between items-center gap-4 hover:bg-gray-100/50 transition-colors focus:outline-none"
                >
                  <div className="flex gap-3.5 items-start">
                    <HelpCircle className="w-5.5 h-5.5 text-[#B283AF] shrink-0 mt-0.5" />
                    <span className="font-sans font-bold text-base text-gray-900 leading-tight">
                      {faq.question}
                    </span>
                  </div>
                  <div className="shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#B283AF]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`contact-faq-answer-${index}`}
                    className="px-6 pb-7 sm:px-7 sm:pb-8 text-sm text-gray-600 leading-relaxed font-sans border-t border-gray-150 pt-4 bg-white/50 animate-in fade-in duration-200"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
