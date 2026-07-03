'use client';

import React from 'react';
import { Compass, Sparkles, BookOpen, Gem } from 'lucide-react';

interface PremiumValueItem {
  title?: string;
  value?: string;
}

interface PremiumAboutValueStatementProps {
  title?: string;
  description?: string;
  items?: PremiumValueItem[];
}

const ICONS = [Compass, Sparkles, BookOpen, Gem];
const ACCENTS = ['#649FF6', '#B283AF', '#F56B71', '#649FF6'];

export function PremiumAboutValueStatement({
  title,
  description,
  items = [],
}: PremiumAboutValueStatementProps) {
  if (!items.length) return null;

  return (
    <section id="premium-about-value-statement" className="py-24 md:py-32 bg-[#0E0E0F] text-white">
      <div className="max-w-7xl mx-auto px-6">
        {(title || description) && (
          <div className="max-w-3xl mb-20 space-y-4">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#F56B71] uppercase block">KOMITMEN UTAMA</span>
            {title && <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight">{title}</h2>}
            {description && (
              <p className="text-stone-400 text-xs md:text-sm leading-relaxed font-light font-sans">{description}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            const accent = ACCENTS[idx % ACCENTS.length];
            return (
              <div key={idx} className="border border-white/5 bg-[#121214] p-8 space-y-6 transition-all duration-300" style={{ borderColor: undefined }}>
                <div className="p-3 w-fit" style={{ backgroundColor: `${accent}1A` }}>
                  <Icon className="w-5 h-5" style={{ color: accent }} />
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
