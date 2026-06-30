import React from "react";
import { CheckCircle2 } from "lucide-react";
import { portfolioData } from "../../data/companyProfileData";
import type { PortfolioItem } from "../../lib/types";
import { SectionHeading } from "../../shared/SectionHeading";
import { Badge } from "../../shared/Badge";

interface CaseHighlightProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  project?: PortfolioItem;
  imageUrl?: string;
}

export const CaseHighlight: React.FC<CaseHighlightProps> = ({
  title = "Studi Kasus Pilihan",
  subtitle = "Sorotan pekerjaan yang menunjukkan pendekatan dan hasil layanan kami.",
  badge = "Case Highlight",
  project = portfolioData[0],
  imageUrl,
}) => {
  if (!project) return null;
  return (
    <section id="portfolio-case-highlight" className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="secondary" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white border border-slate-100 rounded-lg shadow-sm overflow-hidden">
          <div className="relative h-full min-h-[360px] bg-slate-100">
            <img src={imageUrl || project.imageUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute top-4 left-4"><Badge variant="accent" className="bg-slate-900/80 text-white border-transparent backdrop-blur-sm">{project.category}</Badge></div>
          </div>
          <div className="p-8 md:p-10">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">{project.clientName} &bull; {project.year}</p>
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight mb-4">{project.title}</h3>
            <p className="text-sm text-slate-600 font-light leading-relaxed mb-8">{project.description}</p>
            <div className="space-y-5">
              {[
                ["Tantangan", project.challenge],
                ["Solusi", project.solution],
                ["Hasil", project.result],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#649FF6] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">{label}</h4>
                    <p className="text-sm text-slate-600 font-light leading-relaxed">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CaseHighlight;
