'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { defaultFaqs, FaqItem } from '../../lib/dummy-data';

interface PremiumContactFaqProps {
  title?: string;
  description?: string;
  faqs?: FaqItem[];
}

export function PremiumContactFaq({
  title = "FAQ Pertemuan & Konsultasi",
  description = "Tinjau beberapa informasi penting mengenai tata tertib kunjungan, waktu operasional studio, serta kesiapan koordinasi survei tanah awal.",
  faqs = defaultFaqs.slice(0, 3)
}: PremiumContactFaqProps) {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="premium-contact-faq" className="py-24 md:py-32 bg-[#FAF9F6] text-[#121212] border-t border-stone-200">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header Block */}
        <div className="text-center space-y-4 mb-20">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#B283AF] uppercase block">PANDUAN PROSEDURAL</span>
          <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-stone-900">{title}</h2>
          <p className="text-stone-600 text-xs md:text-sm leading-relaxed max-w-2xl mx-auto font-sans font-light">
            {description}
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white border border-stone-200 shadow-sm transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left px-8 py-6 flex items-center justify-between space-x-4 focus:outline-none"
                >
                  <div className="flex items-center space-x-4">
                    <HelpCircle className="w-4 h-4 text-[#649FF6] shrink-0" />
                    <span className="text-sm md:text-base font-serif font-light text-stone-900 leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#F56B71] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>

                {/* Smooth collapsible content panel */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-[300px] border-t border-stone-100' : 'max-h-0'
                  }`}
                >
                  <div className="p-8 text-xs md:text-sm text-stone-600 leading-relaxed font-sans font-light bg-stone-50/50">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
