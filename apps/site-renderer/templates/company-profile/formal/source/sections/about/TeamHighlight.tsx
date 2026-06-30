import React from "react";
import { Linkedin } from "lucide-react";
import { teamData as defaultTeamData } from "../../data/companyProfileData";
import type { TeamItem } from "../../lib/types";
import { SectionHeading } from "../../shared/SectionHeading";
import { Card } from "../../shared/Card";

interface TeamHighlightProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  members?: TeamItem[];
}

export const TeamHighlight: React.FC<TeamHighlightProps> = ({
  title = "Dewan Penasihat & Partner Senior",
  subtitle = "Tim pakar lintas disiplin yang memiliki kompetensi formal tinggi dan pengalaman praktis.",
  badge = "Konsultan Ahli",
  members = defaultTeamData,
}) => {
  return (
    <section id="about-team-highlight" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="accent" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member) => (
            <Card key={member.id} className="flex flex-col h-full bg-white border border-slate-100 overflow-hidden" hoverEffect={true}>
              <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                <img src={member.imageUrl} alt={member.name} className="object-cover w-full h-full hover:scale-102 transition-transform duration-200" referrerPolicy="no-referrer" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-sm md:text-base font-semibold text-slate-900 leading-snug">{member.name}</h3>
                <p className="text-xs text-[#649FF6] font-mono mt-1 uppercase tracking-wider">{member.role}</p>
                <p className="text-xs text-slate-600 font-light leading-relaxed mt-4 flex-grow line-clamp-4">{member.bio}</p>
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center space-x-3">
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded bg-slate-50 text-slate-400 hover:text-[#649FF6] hover:bg-slate-100 transition-colors" aria-label="LinkedIn Profile">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  <span className="text-slate-200">|</span>
                  <span className="text-[10px] text-slate-400 font-mono">Verified Advisor</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export default TeamHighlight;
