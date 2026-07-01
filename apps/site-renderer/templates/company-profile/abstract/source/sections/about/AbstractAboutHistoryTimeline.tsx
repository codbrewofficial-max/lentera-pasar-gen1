'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';
import { defaultTimeline, TimelineItem } from '../../lib/dummy-data';

interface AbstractAboutHistoryTimelineProps {
  title?: string;
  description?: string;
  items?: TimelineItem[];
}

export function AbstractAboutHistoryTimeline({
  title = "Lini Masa Eksperimen & Pertumbuhan Kami",
  description = "Tiap tahun mewakili lompatan pemikiran, eksperimen visual baru, dan kemitraan berani yang membentuk kepribadian kami hari ini.",
  items = defaultTimeline
}: AbstractAboutHistoryTimelineProps) {
  return (
    <section className="relative bg-[#111111] text-white py-24 px-6 border-b-8 border-white overflow-hidden">
      {/* Background visual graphics */}
      <div className="absolute right-0 top-0 w-1/3 h-full bg-[#649FF6] opacity-5 transform -skew-x-12 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="max-w-3xl mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#B283AF]">
            <Calendar className="w-4 h-4 text-[#F56B71]" /> {"// PERJALANAN WAKTU"}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black uppercase tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-neutral-400 font-sans text-sm sm:text-base leading-relaxed max-w-2xl border-l-2 border-[#649FF6] pl-4">
            {description}
          </p>
        </div>

        {/* Timeline Layout (Asymmetric staggered list) */}
        <div className="relative border-l-4 border-white ml-4 md:ml-32 space-y-16">
          {items.map((item, index) => {
            // Cycle colors for timeline node years
            const colors = ["bg-[#649FF6]", "bg-[#F56B71]", "bg-[#B283AF]"];
            const yearBg = colors[index % colors.length];

            return (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-8 md:pl-12 group"
              >
                {/* Year Badge (Floating far left in desktop) */}
                <div className="absolute top-0 md:-left-32 left-[-18px] flex items-center justify-center">
                  <div className="relative">
                    {/* Shadow block */}
                    <div className="absolute inset-0 bg-white transform translate-x-1 translate-y-1" />
                    
                    <span className={`relative block ${yearBg} text-black font-mono font-black text-sm tracking-widest border-2 border-white px-4 py-1.5 min-w-[80px] text-center`}>
                      {item.year}
                    </span>
                  </div>
                </div>

                {/* Timeline node dot on the main line */}
                <div className="absolute left-[-10px] top-3.5 w-4 h-4 rounded-full border-2 border-white bg-black group-hover:bg-[#F56B71] transition-colors duration-200 z-10" />

                {/* Timeline Card */}
                <div className="bg-neutral-900/60 border border-neutral-800 p-6 max-w-3xl hover:border-white transition-colors duration-200 shadow-[4px_4px_0px_rgba(255,255,255,0.05)]">
                  <h3 className="font-mono text-lg font-black uppercase text-white tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-neutral-400 font-sans text-sm leading-relaxed">
                    {item.description}
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
