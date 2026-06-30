'use client';

import React from 'react';
import { timelineData } from '@/lib/dummy-data';
import { Award, Milestone, Calendar, Sparkles } from 'lucide-react';

export interface CasualAboutHistoryTimelineProps {
  title?: string;
  description?: string;
}

export function CasualAboutHistoryTimeline({
  title = 'Perjalanan Seru Kami',
  description = 'Mulai dari ngumpul santai di kedai kopi hingga menjadi partner resmi pertumbuhan ratusan UMKM di tanah air. Berikut adalah babak-babak penting dalam kisah kami.',
}: CasualAboutHistoryTimelineProps) {
  
  const getYearColor = (index: number) => {
    const colors = ['bg-[#649FF6] text-white shadow-[#649FF6]/20', 'bg-[#F56B71] text-white shadow-[#F56B71]/20', 'bg-[#B283AF] text-white shadow-[#B283AF]/20', 'bg-teal-400 text-white shadow-teal-400/20'];
    return colors[index % colors.length];
  };

  const getBorderColor = (index: number) => {
    const borderColors = ['border-[#649FF6]/30', 'border-[#F56B71]/30', 'border-[#B283AF]/30', 'border-teal-400/30'];
    return borderColors[index % borderColors.length];
  };

  return (
    <section id="CasualAboutHistoryTimeline" className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-10 w-80 h-80 rounded-full bg-[#649FF6]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-[#B283AF]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-sm font-bold text-[#649FF6] uppercase tracking-widest block font-mono">
            KRONOLOGI STUDIO
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
            {title}
          </h2>
          <p className="font-sans text-base text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical central line for desktop */}
          <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-4 bottom-4 w-1 bg-gray-200/80 rounded-full" />

          <div className="space-y-12">
            {timelineData.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={item.year}
                  className={`relative flex flex-col md:flex-row items-start ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Badge/Dot */}
                  <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-1.5 z-20 flex items-center justify-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${getYearColor(index)}`}>
                      {item.year.substring(2)}
                    </div>
                  </div>

                  {/* Empty space for alignment in desktop */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Content Card */}
                  <div className={`w-full pl-16 md:pl-0 md:w-1/2 md:px-8`}>
                    <div className={`bg-white rounded-[28px] p-6 md:p-8 border-2 ${getBorderColor(index)} shadow-sm hover:shadow-md transition-shadow`}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold font-mono text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
                          {item.year}
                        </span>
                        <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                      </div>
                      
                      <h3 className="font-sans font-extrabold text-lg sm:text-xl text-gray-950">
                        {item.title}
                      </h3>
                      
                      <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed mt-3">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
