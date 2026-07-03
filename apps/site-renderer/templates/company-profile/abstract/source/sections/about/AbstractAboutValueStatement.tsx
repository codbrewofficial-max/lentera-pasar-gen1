'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Lightbulb } from 'lucide-react';

interface AbstractAboutValueStatementProps {
  title?: string;
  description?: string;
  valueOne?: string;
  valueTwo?: string;
  valueThree?: string;
  valueFour?: string;
}

const ACCENTS = ['#F56B71', '#649FF6', '#B283AF', '#F56B71'];

export function AbstractAboutValueStatement({
  title = "Pilar keyakinan yang menggerakkan studio kami",
  description = "Kami tidak bekerja berdasarkan tren musiman. Kami berpegang teguh pada nilai yang memastikan karya kami relevan dan berdampak.",
  valueOne = "Berani bereksplorasi: Menentang bentuk-bentuk seragam yang membosankan demi melepaskan potensi emosi murni sebuah karya.",
  valueTwo = "Estetika bertemu fungsi: Memastikan visual yang berani berjalan selaras dengan performa responsif dan aksesibilitas tinggi.",
  valueThree = "Dampak bisnis nyata: Menyalurkan energi kreatif untuk menggerakkan indikator konversi bisnis secara positif dan terukur.",
  valueFour
}: AbstractAboutValueStatementProps) {
  const values = [valueOne, valueTwo, valueThree, valueFour].filter(Boolean) as string[];

  return (
    <section className="relative bg-white text-neutral-900 py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">

        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F56B71]/10">
            <Lightbulb className="w-3.5 h-3.5 text-[#F56B71]" />
            <span className="font-mono text-xs lowercase tracking-wide text-[#F56B71]">pilar nilai</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-tight text-neutral-900">
            {title}
          </h2>
          <p className="text-neutral-500 font-sans text-sm sm:text-base leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 ${values.length > 3 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
          {values.map((value, index) => {
            const accent = ACCENTS[index % ACCENTS.length];
            const [head, ...rest] = value.split(":");
            const body = rest.join(":").trim();
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-3xl bg-neutral-50 p-8 flex flex-col justify-between min-h-[260px]"
              >
                <span className="font-sans font-extrabold text-4xl block mb-6" style={{ color: accent }}>
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-sans text-lg font-bold text-neutral-900 mb-3">
                    {head}
                  </h3>
                  <p className="text-neutral-500 font-sans text-sm leading-relaxed">
                    {body || value}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
