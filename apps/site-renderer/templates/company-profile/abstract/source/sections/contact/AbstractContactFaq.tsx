'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { defaultFaqs, FaqItem } from '../../lib/dummy-data';

interface AbstractContactFaqProps {
  title?: string;
  description?: string;
  faqs?: FaqItem[];
}

export function AbstractContactFaq({
  title = "Pertanyaan Umum Seputar Kolaborasi",
  description = "Sebelum memulai pengerjaan, sila baca jawaban cepat atas prosedur konsultasi awal, penawaran harga, hingga draf asimetris pertama.",
  faqs = defaultFaqs.slice(0, 2) // Slice 2 items for contact
}: AbstractContactFaqProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="relative bg-[#111111] text-white py-24 px-6 border-b-8 border-white overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#B283AF]">
            <HelpCircle className="w-4 h-4 text-[#F56B71]" /> {"// FAQ_KOLABORASI"}
          </div>
          <h2 className="text-3xl sm:text-4xl font-mono font-black uppercase tracking-tight text-white leading-none">
            {title}
          </h2>
          <p className="text-neutral-400 font-sans text-sm max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            const colors = ["border-[#649FF6] bg-[#649FF6]/10", "border-[#B283AF] bg-[#B283AF]/10"];
            const activeColorStyle = colors[index % colors.length];

            return (
              <div 
                key={faq.id}
                className={`border-2 transition-all duration-300 ${
                  isOpen ? `${activeColorStyle} shadow-[-6px_6px_0px_white]` : 'border-neutral-800 bg-neutral-900/40'
                }`}
              >
                {/* Question Row */}
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 flex items-center justify-between font-mono font-bold text-sm sm:text-base tracking-tight uppercase focus:outline-none cursor-pointer"
                >
                  <span className="pr-4">{faq.question}</span>
                  <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center bg-black shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#F56B71]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#649FF6]" />
                    )}
                  </div>
                </button>

                {/* Answer block */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-dashed border-neutral-700"
                    >
                      <div className="p-6 md:p-8 font-sans text-sm sm:text-base text-neutral-300 leading-relaxed whitespace-pre-line bg-black/40">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
