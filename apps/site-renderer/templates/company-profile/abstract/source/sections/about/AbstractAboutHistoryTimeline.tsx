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

const ACCENTS = ['#649FF6', '#F56B71', '#B283AF'];

export function AbstractAboutHistoryTimeline({
  title = "Lini masa eksperimen dan pertumbuhan kami",
  description = "Tiap tahun mewakili lompatan pemikiran, eksperimen visual baru, dan kemitraan yang membentuk kepribadian kami hari ini.",
  items = defaultTimeline
}: AbstractAboutHistoryTimelineProps) {
  return (
    <section className="relative bg-white text-neutral-900 py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">

        <div className="max-w-3xl mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B283AF]/10">
            <Calendar className="w-3.5 h-3.5 text-[#B283AF]" />
            <span className="font-mono text-xs lowercase tracking-wide text-[#B283AF]">perjalanan waktu</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-tight text-neutral-900">
            {title}
          </h2>
          <p className="text-neutral-500 font-sans text-sm sm:text-base leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>

        <div className="relative border-l-2 border-neutral-100 ml-4 md:ml-32 space-y-12">
          {items.map((item, index) => {
            const accent = ACCENTS[index % ACCENTS.length];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-8 md:pl-12"
              >
                <div className="absolute top-0 md:-left-32 left-[-14px] flex items-center justify-center">
                  <span
                    className="block text-white font-sans font-bold text-sm rounded-full px-4 py-1.5 min-w-[80px] text-center"
                    style={{ backgroundColor: accent }}
                  >
                    {item.year}
                  </span>
                </div>

                <div className="absolute left-[-7px] top-3 w-3.5 h-3.5 rounded-full bg-white border-2" style={{ borderColor: accent }} />

                <div className="rounded-3xl bg-neutral-50 p-6 max-w-3xl">
                  <h3 className="font-sans text-lg font-bold text-neutral-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 font-sans text-sm leading-relaxed">
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
