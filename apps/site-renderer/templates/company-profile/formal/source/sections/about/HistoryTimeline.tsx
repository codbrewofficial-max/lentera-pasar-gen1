import React from "react";
import { timelineData as defaultTimelineData } from "../../data/companyProfileData";
import type { TimelineItem } from "../../lib/types";
import { SectionHeading } from "../../shared/SectionHeading";

interface HistoryTimelineProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  items?: TimelineItem[];
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({
  title = "Milestone & Sejarah Perkembangan",
  subtitle = "Mengikuti evolusi korporasi kami dari penyedia perizinan dasar hingga menjadi firma penasihat manajemen strategis komprehensif.",
  badge = "Linimasa",
  items = defaultTimelineData,
}) => {
  return (
    <section id="about-history-timeline" className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="secondary" />
        <div className="relative border-l border-slate-200 max-w-3xl mx-auto pl-6 sm:pl-8 space-y-12">
          {items.map((item, idx) => (
            <div key={`${item.year}-${idx}`} className="relative group">
              <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-white border-2 border-[#649FF6] ring-4 ring-[#649FF6]/10 group-hover:bg-[#649FF6] transition-colors duration-200" />
              <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6">
                <div className="text-xl font-bold text-[#649FF6] font-mono leading-none mb-2 sm:mb-0 sm:w-20 flex-shrink-0">{item.year}</div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-1 tracking-tight">{item.title}</h3>
                  <p className="text-slate-600 font-light text-sm md:text-base leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default HistoryTimeline;
