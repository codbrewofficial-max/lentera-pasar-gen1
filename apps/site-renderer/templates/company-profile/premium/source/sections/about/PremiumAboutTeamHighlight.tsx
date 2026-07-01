'use client';

import React from 'react';
import { Linkedin } from 'lucide-react';
import { defaultTeam, TeamMember } from '../../lib/dummy-data';

interface PremiumAboutTeamHighlightProps {
  title?: string;
  description?: string;
  imageUrl?: string; // We can use this as an optional backdrop or banner, but primarily we display team cards
  members?: TeamMember[];
}

export function PremiumAboutTeamHighlight({
  title = "Pilar Kreatif & Pendiri",
  description = "Niskala Atelier dinakhodai oleh para profesional berprestasi akademik global dengan hasrat mendalam pada pelestarian tradisi nusantara dan integrasi sains modern.",
  imageUrl, // Standardized prop, unused or used as simple accent line
  members = defaultTeam
}: PremiumAboutTeamHighlightProps) {
  return (
    <section id="premium-about-team-highlight" className="py-24 md:py-32 bg-[#FAF9F6] text-[#121212]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-20">
          <div className="lg:col-span-8 space-y-4">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#B283AF] uppercase block">PRESTASI GLOBAL</span>
            <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-stone-900">{title}</h2>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <p className="text-stone-600 text-xs md:text-sm leading-relaxed font-light">
              {description}
            </p>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white border border-stone-200/80 p-6 flex flex-col justify-between group hover:shadow-xl hover:border-[#649FF6]/35 transition-all duration-500"
            >
              <div className="space-y-6">
                {/* Member Avatar */}
                <div className="relative aspect-square overflow-hidden bg-stone-100 mb-6">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover filter brightness-[97%] group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#0E0E0F]/10 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Info block */}
                <div className="space-y-2">
                  <span className="text-[9px] tracking-widest text-[#B283AF] font-mono uppercase block">
                    {member.role}
                  </span>
                  <h3 className="text-lg font-serif font-light text-stone-950 group-hover:text-[#649FF6] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-stone-600 text-xs leading-relaxed font-sans font-light">
                    {member.bio}
                  </p>
                </div>
              </div>

              {/* Footer row with social contact */}
              {member.linkedinUrl && (
                <div className="pt-6 mt-6 border-t border-stone-100 flex justify-end">
                  <a
                    href={member.linkedinUrl}
                    className="text-stone-400 hover:text-[#649FF6] transition-all p-1.5 border border-stone-100 hover:border-[#649FF6]/40"
                    aria-label={`${member.name} LinkedIn Profile`}
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
