'use client';

import React from 'react';
import { Compass, Eye, ShieldCheck, Sparkles } from 'lucide-react';

interface PremiumStepItem {
  title?: string;
  value?: string;
}

interface PremiumServicesProcessProps {
  title?: string;
  description?: string;
  items?: PremiumStepItem[];
}

const ICONS = [Compass, Eye, ShieldCheck, Sparkles];

export function PremiumServicesProcess({
  title,
  description,
  items = [],
}: PremiumServicesProcessProps) {
  if (!items.length) return null;

  return (
    <section id="premium-services-process" className="py-24 md:py-32 bg-[#0E0E0F] text-white">
      <div className="max-w-7xl mx-auto px-6">
        {(title || description) && (
          <div className="max-w-3xl mb-20 space-y-4">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#F56B71] uppercase block">FLOW KARYA</span>
            {title && <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight">{title}</h2>}
            {description && (
              <p className="text-stone-400 text-xs md:text-sm leading-relaxed font-sans font-light">{description}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 hidden md:block z-0" />
          {items.map((item, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            return (
              <div key={idx} className="relative z-10 border border-white/5 bg-[#121214] p-8 space-y-4">
                <span className="text-[10px] font-mono text-[#649FF6] tracking-widest uppercase">Fase {idx + 1}</span>
                <div className="p-3 bg-white/5 w-fit">
                  <Icon className="w-5 h-5 text-[#649FF6]" />
                </div>
                {item.title && <h3 className="font-serif text-lg font-light text-white leading-snug">{item.title}</h3>}
                {item.value && (
                  <p className="text-stone-400 text-xs leading-relaxed font-sans font-light">{item.value}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
