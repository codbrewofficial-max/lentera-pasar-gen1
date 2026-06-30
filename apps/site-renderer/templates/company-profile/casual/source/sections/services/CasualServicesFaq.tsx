'use client';

import React, { useState } from 'react';
import { faqData } from '@/lib/dummy-data';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export interface CasualServicesFaqProps {
  title?: string;
  description?: string;
}

export function CasualServicesFaq({
  title = 'Ada Pertanyaan? Kami Punya Jawaban!',
  description = 'Punya ganjalan atau rasa penasaran soal cara kerja, pembayaran, atau detail teknis? Kami kumpulkan beberapa pertanyaan yang paling sering diajukan klien kami di bawah ini.',
}: CasualServicesFaqProps) {
  
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="CasualServicesFaq" className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-[#649FF6]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 rounded-full bg-[#B283AF]/5 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-sm font-bold text-[#649FF6] uppercase tracking-widest block font-mono">
            TANYA JAWAB (FAQ)
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
            {title}
          </h2>
          <p className="font-sans text-base text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Interactive FAQ Accordion List */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqData.map((faq, index) => {
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
