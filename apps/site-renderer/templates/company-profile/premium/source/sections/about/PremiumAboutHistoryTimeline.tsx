'use client';

import React from 'react';
import { defaultTimeline, TimelineItem } from '../../lib/dummy-data';

interface PremiumAboutHistoryTimelineProps {
  title?: string;
  description?: string;
  items?: TimelineItem[];
}

export function PremiumAboutHistoryTimeline({
  title = "Lintasan Karya & Sejarah",
  description = "Melangkah mantap sejak awal berdiri, kami terus mengasah keahlian spasial untuk merumuskan karya seni fungsional yang bertahan melampaui tren zaman.",
  items = defaultTimeline
}: PremiumAboutHistoryTimelineProps) {
  return (
    <section id="premium-about-history-timeline" className="py-24 md:py-32 bg-[#0E0E0F] text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="max-w-3xl mb-20 space-y-4">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#649FF6] uppercase block">KRONOLOGI ATELIER</span>
          <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight">{title}</h2>
          <p className="text-stone-400 text-xs md:text-sm leading-relaxed font-light">
            {description}
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative border-l border-white/5 pl-8 md:pl-12 max-w-4xl mx-auto space-y-16">
          {items.map((item, index) => (
            <div key={item.id} className="relative group">
              {/* Timeline Bullet Accent */}
              <div className="absolute -left-[37px] md:-left-[53px] top-1.5 w-4 h-4 bg-[#0E0E0F] border border-stone-700 rounded-full flex items-center justify-center group-hover:border-[#649FF6] transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B283AF] group-hover:bg-[#649FF6]" />
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                <div className="md:col-span-1">
                  <span className="text-3xl font-serif font-light text-[#F56B71] block tracking-tight">
                    {item.year}
                  </span>
                  <span className="text-[9px] tracking-widest text-stone-500 font-mono uppercase">
                    MILESTONE 0{index + 1}
                  </span>
                </div>
                <div className="md:col-span-3 space-y-2">
                  <h3 className="text-lg font-serif font-light tracking-wide text-white group-hover:text-[#649FF6] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-stone-400 text-xs md:text-sm leading-relaxed font-sans font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
