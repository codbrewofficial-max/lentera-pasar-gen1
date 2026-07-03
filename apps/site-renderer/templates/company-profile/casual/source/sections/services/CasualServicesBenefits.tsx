'use client';

import React from 'react';
import { Sparkles, MessageCircle, FileCode, Shield } from 'lucide-react';

export interface CasualBenefitItem {
  title?: string;
  value?: string;
}

export interface CasualServicesBenefitsProps {
  title?: string;
  description?: string;
  items?: CasualBenefitItem[];
}

const ICONS = [Sparkles, MessageCircle, FileCode, Shield];
const ACCENTS = ['#649FF6', '#F56B71', '#B283AF', '#649FF6'];

export function CasualServicesBenefits({
  title,
  description,
  items = [],
}: CasualServicesBenefitsProps) {
  if (!items.length) return null;

  return (
    <section id="CasualServicesBenefits" className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {(title || description) && (
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-sm font-bold text-[#F56B71] uppercase tracking-widest block font-mono">
              KENAPA KAMI
            </span>
            {title && (
              <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">{title}</h2>
            )}
            {description && (
              <p className="font-sans text-base text-gray-600 leading-relaxed">{description}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {items.map((item, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            const accent = ACCENTS[idx % ACCENTS.length];
            return (
              <div
                key={idx}
                className="bg-white rounded-[32px] p-8 border-2 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col space-y-4"
                style={{ borderColor: `${accent}33` }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md" style={{ backgroundColor: accent }}>
                  <Icon className="w-6 h-6" />
                </div>
                {item.title && <h3 className="font-sans font-extrabold text-lg text-gray-950">{item.title}</h3>}
                {item.value && (
                  <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">{item.value}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
