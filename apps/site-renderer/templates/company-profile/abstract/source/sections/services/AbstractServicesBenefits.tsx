'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, HeartHandshake, Award } from 'lucide-react';

interface AbstractBenefitItem {
  title?: string;
  value?: string;
}

interface AbstractServicesBenefitsProps {
  title?: string;
  description?: string;
  items?: AbstractBenefitItem[];
}

const ICONS = [Zap, ShieldCheck, HeartHandshake, Award];
const ACCENTS = ['#B283AF', '#649FF6', '#F56B71', '#B283AF'];

export function AbstractServicesBenefits({
  title,
  description,
  items = [],
}: AbstractServicesBenefitsProps) {
  if (!items.length) return null;

  return (
    <section className="relative bg-white text-neutral-900 py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {(title || description) && (
          <div className="max-w-3xl mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B283AF]/10">
              <Award className="w-3.5 h-3.5 text-[#B283AF]" />
              <span className="font-mono text-xs lowercase tracking-wide text-[#B283AF]">manfaat utama</span>
            </div>
            {title && (
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-tight text-neutral-900">{title}</h2>
            )}
            {description && (
              <p className="text-neutral-500 font-sans text-sm sm:text-base leading-relaxed max-w-2xl">{description}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            const accent = ACCENTS[index % ACCENTS.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-3xl bg-neutral-50 p-8 min-h-[280px] flex flex-col justify-between"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${accent}1a` }}>
                  <Icon className="w-6 h-6" style={{ color: accent }} />
                </div>
                <div>
                  {item.title && <h3 className="font-sans text-lg font-bold text-neutral-900 mb-3">{item.title}</h3>}
                  {item.value && <p className="text-neutral-500 font-sans text-sm leading-relaxed">{item.value}</p>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
