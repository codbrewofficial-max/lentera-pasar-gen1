'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ListTodo } from 'lucide-react';

interface AbstractStepItem {
  title?: string;
  value?: string;
}

interface AbstractServicesProcessProps {
  title?: string;
  description?: string;
  items?: AbstractStepItem[];
}

const ACCENTS = ['#F56B71', '#649FF6', '#B283AF', '#F56B71'];
const STEP_LABELS = ['deconstruction', 'engineering', 'launch', 'handover'];

export function AbstractServicesProcess({
  title,
  description,
  items = [],
}: AbstractServicesProcessProps) {
  if (!items.length) return null;

  return (
    <section className="relative bg-[#151515] text-white py-24 px-6 overflow-hidden">
      <div className="absolute right-0 top-0 w-80 h-80 bg-[#B283AF] opacity-[0.08] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {(title || description) && (
          <div className="max-w-3xl mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10">
              <ListTodo className="w-3.5 h-3.5 text-[#649FF6]" />
              <span className="font-mono text-xs lowercase tracking-wide text-neutral-200">metode kerja</span>
            </div>
            {title && (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-tight">{title}</h2>
            )}
            {description && (
              <p className="text-neutral-400 font-sans text-sm sm:text-base leading-relaxed max-w-2xl">{description}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => {
            const accent = ACCENTS[index % ACCENTS.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-3xl bg-white/5 p-8 min-h-[280px] flex flex-col justify-between"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="w-10 h-10 rounded-full text-white font-sans font-bold text-sm flex items-center justify-center" style={{ backgroundColor: accent }}>
                    0{index + 1}
                  </div>
                  <span className="font-mono text-[10px] lowercase text-neutral-500">
                    {STEP_LABELS[index % STEP_LABELS.length]}
                  </span>
                </div>
                <div>
                  {item.title && <h3 className="font-sans text-lg font-bold text-white mb-3">{item.title}</h3>}
                  {item.value && <p className="text-neutral-400 font-sans text-sm leading-relaxed">{item.value}</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
