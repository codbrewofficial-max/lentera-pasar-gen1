'use client';

import React from 'react';
import { ShieldCheck, Palette, LineChart, Sparkles } from 'lucide-react';

export interface CasualValueItem {
  title?: string;
  value?: string;
}

export interface CasualAboutValueStatementProps {
  title?: string;
  description?: string;
  badge?: string;
  items?: CasualValueItem[];
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const ICONS = [ShieldCheck, Palette, LineChart, Sparkles];
const ACCENTS = ['#649FF6', '#F56B71', '#B283AF', '#649FF6'];
const TAGS = ['COLLABORATIVE', 'AUTHENTIC', 'IMPACTFUL', 'CONSISTENT'];

export function CasualAboutValueStatement({
  title,
  description,
  badge = 'NILAI & PRINSIP',
  items = [],
  imageUrl,
  ctaLabel,
  ctaHref = '/contact',
}: CasualAboutValueStatementProps) {
  // "items" adalah field repeater — jumlahnya bebas sesuai isian owner di dashboard,
  // bukan lagi 3-4 slot tetap (valueOne..valueFour). Kalau kosong, section ini tidak
  // menampilkan grid kartu dummy.
  if (!items.length) return null;

  return (
    <section id="CasualAboutValueStatement" className="bg-gray-50 relative overflow-hidden">
      {imageUrl ? (
        <div className="relative py-16 md:py-20 mb-4 overflow-hidden text-white text-center">
          <div className="absolute inset-0">
            <img src={imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gray-950/70" />
          </div>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
            <span className="text-sm font-bold text-white/80 uppercase tracking-widest block font-mono">{badge}</span>
            {title && <h2 className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight">{title}</h2>}
            {description && <p className="font-sans text-base text-gray-200 leading-relaxed">{description}</p>}
            {ctaLabel && (
              <div className="pt-2">
                <a href={ctaHref} className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-100 transition-all">
                  {ctaLabel}
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 rounded-full bg-[#B283AF]/10 blur-3xl pointer-events-none" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 md:py-16">
        {!imageUrl && (title || description || badge) && (
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-sm font-bold text-[#649FF6] uppercase tracking-widest block font-mono">
              {badge}
            </span>
            {title && (
              <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="font-sans text-base text-gray-600 leading-relaxed">
                {description}
              </p>
            )}
            {ctaLabel && (
              <div className="pt-2">
                <a href={ctaHref} className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 px-6 py-3 rounded-full text-sm font-bold transition-all">
                  {ctaLabel}
                </a>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {items.map((item, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            const accent = ACCENTS[idx % ACCENTS.length];
            const tag = TAGS[idx % TAGS.length];
            return (
              <div
                key={idx}
                className="bg-white rounded-[36px] p-8 border-2 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                style={{ borderColor: `${accent}33` }}
              >
                <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-[100px] pointer-events-none" style={{ backgroundColor: `${accent}1A` }} />
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md" style={{ backgroundColor: accent }}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {item.title && (
                    <h3 className="font-sans font-extrabold text-xl text-gray-950">{item.title}</h3>
                  )}
                  {item.value && (
                    <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">{item.value}</p>
                  )}
                </div>
                <div className="pt-6 font-mono text-[10px] font-extrabold tracking-wider uppercase" style={{ color: accent }}>
                  PRINSIP {String(idx + 1).padStart(2, '0')} • {tag}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
