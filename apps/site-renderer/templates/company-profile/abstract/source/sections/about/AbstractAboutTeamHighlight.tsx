'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Users2, ArrowUpRight } from 'lucide-react';
import { defaultTeamMembers, TeamMember } from '../../lib/dummy-data';

interface AbstractAboutTeamHighlightProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  members?: TeamMember[];
}

export function AbstractAboutTeamHighlight({
  title = "Para Pemikir Liar & Perusak Grid Kami",
  description = "Di balik setiap karya visual yang mengguncang audiens Anda, terdapat kolektif individu eksentrik yang mendedikasikan hidupnya untuk melampaui batas kebiasaan.",
  imageUrl = "https://picsum.photos/seed/teamgroup/1200/800",
  members = defaultTeamMembers
}: AbstractAboutTeamHighlightProps) {
  return (
    <section className="relative bg-[#111111] text-white py-24 px-6 border-b-8 border-white overflow-hidden">
      {/* Decorative large font outline */}
      <div className="absolute right-0 top-0 text-[10rem] font-mono font-black text-neutral-900 select-none pointer-events-none opacity-20 -mt-10 uppercase">
        TEAM
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Title Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-neutral-800">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#F56B71]">
              <Users2 className="w-4 h-4 text-[#F56B71]" /> {"// KOLEKTIF UTAMA"}
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black uppercase tracking-tight leading-none">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-neutral-400 font-sans text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Members Grid (Asymmetric) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, index) => {
            // Apply different offset shadow colors to emphasize abstract individuality
            const colors = ["bg-[#649FF6]", "bg-[#F56B71]", "bg-[#B283AF]"];
            const cardAccent = colors[index % colors.length];

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                {/* Back offset colored box */}
                <div className={`absolute inset-0 ${cardAccent} transform translate-x-3 translate-y-3 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-200 border-2 border-white`} />
                
                {/* Main Card */}
                <div className="relative bg-black border-2 border-white p-5 flex flex-col justify-between h-full min-h-[480px]">
                  
                  {/* Portrait photo inside high contrast frame */}
                  <div className="relative aspect-[3/4] bg-neutral-900 border border-neutral-800 overflow-hidden mb-6">
                    <img 
                      src={member.imageUrl} 
                      alt={member.name} 
                      className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                    {/* Shifted brand color overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                  </div>

                  {/* Profile info */}
                  <div className="space-y-3 flex-grow">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-[10px] tracking-widest text-[#649FF6] uppercase">
                        {"// " + member.role.toUpperCase()}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-500">
                        0{index + 1}/
                      </span>
                    </div>

                    <h3 className="font-mono text-xl font-black uppercase tracking-tight text-white group-hover:text-[#F56B71] transition-colors">
                      {member.name}
                    </h3>

                    <p className="text-neutral-400 font-sans text-xs leading-relaxed line-clamp-3">
                      {member.bio}
                    </p>
                  </div>

                  {/* Signature or unique element */}
                  {member.signature && (
                    <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-between items-center">
                      <span className="font-sans italic text-sm text-neutral-500 font-light tracking-wide">
                        {member.signature}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500 hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                        VIEW CV <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  )}

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
