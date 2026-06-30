'use client';

import React from 'react';
import { teamMembers, TeamMember } from '@/lib/dummy-data';
import { Mail, ArrowUpRight, Github, Heart } from 'lucide-react';

export interface CasualAboutTeamHighlightProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  members?: TeamMember[];
}

export function CasualAboutTeamHighlight({
  title = 'Para Pembuat Keajaiban Visual Kami',
  description = 'Di balik setiap logo yang lucu, caption sosmed yang menarik, dan situs web yang responsif, ada tim desainer, copywriter, dan fotografer yang mencurahkan seluruh energi kreatifnya untuk kemajuan bisnismu.',
  imageUrl = 'https://picsum.photos/seed/team-hero/1200/600',
  members = teamMembers,
}: CasualAboutTeamHighlightProps) {
  
  const getBorderColor = (idx: number) => {
    const borders = ['hover:border-[#649FF6]', 'hover:border-[#F56B71]', 'hover:border-[#B283AF]'];
    return borders[idx % borders.length];
  };

  const getBgColor = (idx: number) => {
    const bgs = ['bg-[#649FF6]/10 text-[#649FF6]', 'bg-[#F56B71]/10 text-[#F56B71]', 'bg-[#B283AF]/10 text-[#B283AF]'];
    return bgs[idx % bgs.length];
  };

  return (
    <section id="CasualAboutTeamHighlight" className="py-20 bg-white relative overflow-hidden">
      
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-10 w-96 h-96 rounded-full bg-[#649FF6]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-[#B283AF]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-sm font-bold text-[#F56B71] uppercase tracking-widest block font-mono">
            TIM KREATIF
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
            {title}
          </h2>
          <p className="font-sans text-base text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Hero Banner / Team Banner Image (As requested: "sediakan satu image banner/hero image di section selain foto per-item") */}
        <div className="mb-16 rounded-[40px] overflow-hidden border-4 border-white shadow-xl aspect-[16/9] md:aspect-[21/9] bg-gray-100 max-w-5xl mx-auto">
          <img
            src={imageUrl}
            alt="Ruang Karsa Team Banner"
            className="w-full h-full object-cover filter brightness-[0.95]"
          />
        </div>

        {/* Sub-heading for cards */}
        <div className="text-center mb-10">
          <h3 className="font-sans font-extrabold text-2xl text-gray-900">
            Kreator di Balik Layar
          </h3>
          <p className="text-xs text-gray-500 font-sans mt-1">
            Siap mendampingi dan mewujudkan mimpi jualan digitalmu
          </p>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {members.map((member, idx) => (
            <div
              key={member.id}
              className={`bg-gray-50 rounded-[32px] p-6 border-2 border-transparent transition-all duration-300 ${getBorderColor(idx)} group hover:bg-white hover:shadow-lg`}
            >
              <div className="space-y-4">
                {/* Image Frame with playful blob background */}
                <div className="relative aspect-square rounded-[24px] overflow-hidden bg-gray-200">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Floating role badge */}
                  <div className={`absolute bottom-4 left-4 text-xs font-bold font-sans px-3 py-1 rounded-full shadow-sm ${getBgColor(idx)} bg-white/95 backdrop-blur-sm`}>
                    {member.role}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="font-sans font-extrabold text-lg text-gray-950 group-hover:text-[#649FF6] transition-colors">
                    {member.name}
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider">
                    Ruang Karsa Bandung
                  </span>
                  <div className="flex items-center gap-2">
                    <a href="mailto:tim@ruangkarsa.id" className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 hover:text-[#649FF6] transition-colors shadow-sm">
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                    <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer shadow-sm">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
