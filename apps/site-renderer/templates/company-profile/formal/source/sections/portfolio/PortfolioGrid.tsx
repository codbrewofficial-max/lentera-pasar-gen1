import React from "react";
import { CheckCircle, HelpCircle, ShieldCheck } from "lucide-react";
import { PortfolioItem } from "../../lib/types";
import { Card } from "../../shared/Card";
import { Badge } from "../../shared/Badge";
import { SectionHeading } from "../../shared/SectionHeading";

interface PortfolioGridProps {
  portfolios: PortfolioItem[];
  activeCategory: string;
  title?: string;
  subtitle?: string;
}

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({
  portfolios,
  activeCategory,
  title,
  subtitle,
}) => {
  // Filter portfolios locally if not already handled
  const filtered = activeCategory === "Semua" 
    ? portfolios 
    : portfolios.filter(p => p.category === activeCategory);

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 font-light">
        Tidak ada studi kasus dalam kategori ini untuk saat ini.
      </div>
    );
  }

  return (
    <section id="portfolio-grid-section" className="py-8 bg-white">
      {(title || subtitle) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <SectionHeading title={title || ""} subtitle={subtitle} badgeVariant="accent" />
        </div>
      )}
      <div className="space-y-16">
        {filtered.map((project) => (
          <div
            key={project.id}
            id={project.id}
            className="scroll-mt-24 border border-slate-100 rounded-lg bg-white p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Visual area - left */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="relative aspect-video rounded overflow-hidden mb-6 bg-slate-50">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="object-cover w-full h-full"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="accent" className="bg-slate-900/80 text-white border-transparent backdrop-blur-sm">
                      {project.category}
                    </Badge>
                  </div>
                </div>

                {project.clientName && (
                  <div className="text-xs text-slate-500 font-mono mb-4">
                    <span className="font-semibold text-slate-700">{project.clientName}</span>
                  </div>
                )}

                <h3 className="text-xl font-semibold text-slate-900 mb-4 tracking-tight leading-snug">
                  {project.title}
                </h3>
                
                <p className="text-sm md:text-base text-slate-600 font-light leading-relaxed mb-6">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Deep technical details (Challenge, Solution, Result) - right */}
            <div className="lg:col-span-7 bg-slate-50/50 rounded-lg p-6 md:p-8 border border-slate-100 flex flex-col justify-between space-y-6">
              
              {/* Challenge block */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-semibold text-[#F56B71] uppercase tracking-wider font-mono">
                  <HelpCircle className="w-4 h-4" />
                  <span>Tantangan Utama Klien:</span>
                </div>
                <p className="text-xs md:text-sm text-slate-600 font-light leading-relaxed">
                  {project.challenge}
                </p>
              </div>

              {/* Solution block */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-2 text-xs font-semibold text-[#649FF6] uppercase tracking-wider font-mono">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Solusi &amp; Intervensi Integra:</span>
                </div>
                <p className="text-xs md:text-sm text-slate-600 font-light leading-relaxed">
                  {project.solution}
                </p>
              </div>

              {/* Result block */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider font-mono">
                  <CheckCircle className="w-4 h-4" />
                  <span>Hasil Terukur (Results):</span>
                </div>
                <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed bg-emerald-50 text-emerald-900 px-4 py-2.5 rounded border border-emerald-100">
                  {project.result}
                </p>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default PortfolioGrid;
