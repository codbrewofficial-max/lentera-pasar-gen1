'use client';

import React, { useState } from 'react';
import { faqData, FaqItem } from '../../lib/dummy-data';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export interface CasualServicesFaqProps {
  title?: string;
  description?: string;
  badge?: string;
  faqs?: FaqItem[];
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function CasualServicesFaq({
  title = 'Ada Pertanyaan? Kami Punya Jawaban!',
  description = 'Punya ganjalan atau rasa penasaran soal cara kerja, pembayaran, atau detail teknis? Kami kumpulkan beberapa pertanyaan yang paling sering diajukan klien kami di bawah ini.',
  badge = 'TANYA JAWAB (FAQ)',
  faqs = faqData,
  imageUrl,
  ctaLabel,
  ctaHref = '/contact',
}: CasualServicesFaqProps) {
  
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="CasualServicesFaq" className="bg-gray-50 relative overflow-hidden">
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
          <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-[#649FF6]/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-96 h-96 rounded-full bg-[#B283AF]/5 blur-3xl pointer-events-none" />
        </>
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
            {ctaLabel && (
              <div className="pt-2">
                <a href={ctaHref} className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 px-6 py-3 rounded-full text-sm font-bold transition-all">
                  {ctaLabel}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Interactive FAQ Accordion List */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  id={`faq-toggle-${index}`}
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 sm:p-7 flex justify-between items-center gap-4 hover:bg-gray-50/50 transition-colors focus:outline-none"
                >
                  <div className="flex gap-3.5 items-start">
                    <HelpCircle className="w-5.5 h-5.5 text-[#649FF6] shrink-0 mt-0.5" />
                    <span className="font-sans font-bold text-base text-gray-900 leading-tight">
                      {faq.question}
                    </span>
                  </div>
                  <div className="shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#649FF6]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${index}`}
                    className="px-6 pb-7 sm:px-7 sm:pb-8 text-sm text-gray-600 leading-relaxed font-sans border-t border-gray-50 pt-4 animate-in fade-in duration-200"
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
