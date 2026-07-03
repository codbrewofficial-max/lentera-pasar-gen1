'use client';

import React from 'react';
import { ShieldCheck, Target, Eye, Award } from 'lucide-react';

interface PremiumBenefitItem {
  title?: string;
  value?: string;
}

interface PremiumServicesBenefitsProps {
  title?: string;
  description?: string;
  items?: PremiumBenefitItem[];
}

const ICONS = [ShieldCheck, Target, Eye, Award];

export function PremiumServicesBenefits({
  title,
  description,
  items = [],
}: PremiumServicesBenefitsProps) {
  if (!items.length) return null;

  return (
    <section id="premium-services-benefits" className="py-24 md:py-32 bg-[#FAF9F6] text-[#121212]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {(title || description) && (
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#B283AF] uppercase block">KOMITMEN NILAI</span>
              {title && (
                <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-stone-900 leading-tight">{title}</h2>
              )}
              {description && (
                <p className="text-stone-600 text-sm md:text-base leading-relaxed font-sans font-light">{description}</p>
              )}
            </div>
          )}

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {items.map((item, idx) => {
              const Icon = ICONS[idx % ICONS.length];
              return (
                <div key={idx} className="border border-stone-200 bg-white p-6 space-y-3">
                  <div className="p-2.5 bg-[#B283AF]/10 w-fit">
                    <Icon className="w-4 h-4 text-[#B283AF]" />
                  </div>
                  {item.title && <h3 className="font-serif text-base font-light text-stone-900 leading-snug">{item.title}</h3>}
                  {item.value && (
                    <p className="text-stone-500 text-xs leading-relaxed font-sans font-light">{item.value}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
