'use client';

import React from 'react';
import { MessageSquare, Hammer, Gift, ArrowRight } from 'lucide-react';

export interface CasualProcessItem {
  title?: string;
  value?: string;
}

export interface CasualServicesProcessProps {
  title?: string;
  description?: string;
  items?: CasualProcessItem[];
}

const ICONS = [MessageSquare, Hammer, Gift, ArrowRight];
const ACCENTS = ['#649FF6', '#F56B71', '#B283AF', '#649FF6'];

export function CasualServicesProcess({
  title,
  description,
  items = [],
}: CasualServicesProcessProps) {
  if (!items.length) return null;

  return (
    <section id="CasualServicesProcess" className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-[#B283AF]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-64 h-64 rounded-full bg-[#649FF6]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {(title || description) && (
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-sm font-bold text-[#B283AF] uppercase tracking-widest block font-mono">
              ALUR KERJA
            </span>
            {title && (
              <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">{title}</h2>
            )}
            {description && (
              <p className="font-sans text-base text-gray-600 leading-relaxed">{description}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {items.map((item, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            const accent = ACCENTS[idx % ACCENTS.length];
            return (
              <div key={idx} className="bg-gray-50 rounded-[36px] p-8 border border-gray-100 relative group hover:bg-white hover:shadow-lg transition-all duration-300">
                <span
                  className="absolute -top-4 left-8 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md"
                  style={{ backgroundColor: accent }}
                >
                  {idx + 1}
                </span>
                <div className="pt-4 space-y-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${accent}1A`, color: accent }}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {item.title && <h3 className="font-sans font-extrabold text-lg text-gray-950">{item.title}</h3>}
                  {item.value && (
                    <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">{item.value}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
