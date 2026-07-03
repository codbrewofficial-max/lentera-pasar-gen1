'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { defaultFaqs, FaqItem } from '../../lib/dummy-data';

interface AbstractServicesFaqProps {
  title?: string;
  description?: string;
  faqs?: FaqItem[];
}

const ACCENTS = ['#649FF6', '#F56B71', '#B283AF'];

export function AbstractServicesFaq({
  title = "Pertanyaan yang sering diajukan",
  description = "Temukan jawaban cepat atas pertanyaan umum mengenai proses kerja, implementasi, hingga hak kepemilikan aset kreatif Anda.",
  faqs = defaultFaqs
}: AbstractServicesFaqProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="relative bg-[#151515] text-white py-24 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">

        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 mx-auto">
            <HelpCircle className="w-3.5 h-3.5 text-[#F56B71]" />
            <span className="font-mono text-xs lowercase tracking-wide text-neutral-200">tanya jawab</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-none text-white">
            {title}
          </h2>
          <p className="text-neutral-400 font-sans text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            const accent = ACCENTS[index % ACCENTS.length];

            return (
              <div
                key={faq.id}
                className="rounded-3xl bg-white/5 overflow-hidden transition-colors duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 md:p-7 flex items-center justify-between font-sans font-semibold text-sm sm:text-base focus:outline-none cursor-pointer"
                >
                  <span className="pr-4">{faq.question}</span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors"
                    style={{ backgroundColor: isOpen ? accent : 'rgba(255,255,255,0.1)' }}
                  >
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-white" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-300" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 md:px-7 pb-6 md:pb-7 font-sans text-sm sm:text-base text-neutral-300 leading-relaxed whitespace-pre-line">
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
