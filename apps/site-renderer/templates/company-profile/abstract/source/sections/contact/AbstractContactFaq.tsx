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

const ACCENTS = ['#649FF6', '#B283AF'];

export function AbstractContactFaq({
  title = "Pertanyaan umum seputar kolaborasi",
  description = "Sebelum memulai pengerjaan, baca dulu jawaban cepat atas prosedur konsultasi awal, penawaran harga, hingga draf pertama.",
  faqs = defaultFaqs.slice(0, 2)
}: AbstractContactFaqProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="relative bg-white text-neutral-900 py-24 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">

        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B283AF]/10 mx-auto">
            <HelpCircle className="w-3.5 h-3.5 text-[#B283AF]" />
            <span className="font-mono text-xs lowercase tracking-wide text-[#B283AF]">faq kolaborasi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-extrabold tracking-tight text-neutral-900 leading-none">
            {title}
          </h2>
          <p className="text-neutral-500 font-sans text-sm max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            const accent = ACCENTS[index % ACCENTS.length];

            return (
              <div key={faq.id} className="rounded-3xl bg-neutral-50 overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 flex items-center justify-between font-sans font-semibold text-sm sm:text-base focus:outline-none cursor-pointer"
                >
                  <span className="pr-4">{faq.question}</span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors"
                    style={{ backgroundColor: isOpen ? accent : '#e5e5e5' }}
                  >
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-white" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-600" />
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
                      <div className="px-6 pb-6 font-sans text-sm sm:text-base text-neutral-500 leading-relaxed whitespace-pre-line">
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
