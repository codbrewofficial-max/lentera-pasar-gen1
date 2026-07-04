import React from "react";
import { timelineData as defaultTimelineData } from "../../data/companyProfileData";
import type { TimelineItem } from "../../lib/types";
import { SectionHeading } from "../../shared/SectionHeading";
import { Button } from "../../shared/Button";

interface HistoryTimelineProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  items?: TimelineItem[];
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({
  title = "Milestone & Sejarah Perkembangan",
  subtitle = "Mengikuti evolusi korporasi kami dari penyedia perizinan dasar hingga menjadi firma penasihat manajemen strategis komprehensif.",
  badge = "Linimasa",
  items = defaultTimelineData,
  imageUrl,
  ctaLabel,
  ctaHref = "/contact",
}) => {
  return (
    <section id="about-history-timeline" className="bg-slate-50">
      {imageUrl ? (
        <div className="relative py-16 md:py-20 mb-4 bg-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0">
            <img src={imageUrl} alt="" className="w-full h-full object-cover opacity-30" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950/90" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="secondary" dark />
            {ctaLabel && (
              <div className="text-center -mt-6">
                <Button href={ctaHref} variant="secondary">{ctaLabel}</Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24">
          <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="secondary" />
          {ctaLabel && (
            <div className="text-center -mt-6 mb-6">
              <Button href={ctaHref} variant="outline">{ctaLabel}</Button>
            </div>
          )}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="relative border-l border-slate-200 max-w-3xl mx-auto pl-6 sm:pl-8 space-y-12">
          {items.map((item, idx) => (
            <div key={`${item.year}-${idx}`} className="relative group">
              <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 flex items-center justify-center w-4 h-4 rounded-none bg-white border-2 border-[#1E3A5F] ring-4 ring-[#1E3A5F]/10 group-hover:bg-[#1E3A5F] transition-colors duration-200" />
              <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6">
                <div className="text-xl font-bold text-[#1E3A5F] font-mono leading-none mb-2 sm:mb-0 sm:w-20 flex-shrink-0">{item.year}</div>
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
