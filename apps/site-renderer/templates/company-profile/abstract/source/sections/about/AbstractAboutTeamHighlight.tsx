'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Users2 } from 'lucide-react';
import { defaultTeamMembers, TeamMember } from '../../lib/dummy-data';

interface AbstractAboutTeamHighlightProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  members?: TeamMember[];
}

const ACCENTS = ['#649FF6', '#F56B71', '#B283AF'];

export function AbstractAboutTeamHighlight({
  title = "Orang-orang di balik karya kami",
  description = "Di balik setiap karya visual yang mengesankan, terdapat kolektif individu yang mendedikasikan diri untuk melampaui batas kebiasaan.",
  imageUrl = "https://picsum.photos/seed/teamgroup/1200/800",
  members = defaultTeamMembers
}: AbstractAboutTeamHighlightProps) {
  return (
    <section className="relative bg-[#151515] text-white py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-8 border-b border-white/10">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10">
              <Users2 className="w-3.5 h-3.5 text-[#F56B71]" />
              <span className="font-mono text-xs lowercase tracking-wide text-neutral-200">kolektif utama</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight leading-none">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-neutral-400 font-sans text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, index) => {
            const accent = ACCENTS[index % ACCENTS.length];

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-3xl bg-white/5 p-5 flex flex-col justify-between h-full min-h-[440px]"
              >
                <div className="relative aspect-[3/4] rounded-2xl bg-neutral-900 overflow-hidden mb-6">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2 flex-grow">
                  <span className="font-mono text-[11px] lowercase tracking-wide" style={{ color: accent }}>
                    {member.role}
                  </span>

                  <h3 className="font-sans text-xl font-bold text-white">
                    {member.name}
                  </h3>

                  <p className="text-neutral-400 font-sans text-xs leading-relaxed line-clamp-3">
                    {member.bio}
                  </p>
                </div>

                {member.signature && (
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <span className="font-sans italic text-sm text-neutral-500">
                      {member.signature}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
