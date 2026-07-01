import React from "react";
import { CheckCircle2, HelpCircle, ShieldCheck } from "lucide-react";
import { PortfolioItem } from "../../lib/types";

interface PortfolioDetailContentProps {
  project?: PortfolioItem;
}

const EMPTY_STATE = (
  <div className="py-20 text-center">
    <p className="text-sm font-semibold text-slate-400">Detail proyek belum tersedia.</p>
  </div>
);

export const PortfolioDetailContent: React.FC<PortfolioDetailContentProps> = ({ project }) => {
  if (!project) return EMPTY_STATE;

  return (
    <section id="portfolio-detail-content" className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Cover Image */}
          {project.imageUrl && (
            <div className="lg:col-span-5">
              <div className="rounded-lg overflow-hidden aspect-video bg-slate-100 shadow-sm border border-slate-100">
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              {project.clientName && (
                <p className="text-xs font-mono text-slate-500 mt-3">
                  <span className="font-semibold text-slate-700">{project.clientName}</span>
                  {project.year && <span className="ml-2 text-slate-400">• {project.year}</span>}
                </p>
              )}
            </div>
          )}

          {/* Detail Content */}
          <div className={`${project.imageUrl ? "lg:col-span-7" : "lg:col-span-12"} space-y-8`}>

            {project.challenge && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#F56B71] uppercase tracking-wider font-mono">
                  <HelpCircle className="w-4 h-4" />
                  Tantangan
                </div>
                <p className="text-sm md:text-base text-slate-600 font-light leading-relaxed bg-slate-50 p-5 rounded border border-slate-100">
                  {project.challenge}
                </p>
              </div>
            )}

            {project.solution && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#649FF6] uppercase tracking-wider font-mono">
                  <ShieldCheck className="w-4 h-4" />
                  Solusi
                </div>
                <p className="text-sm md:text-base text-slate-600 font-light leading-relaxed bg-slate-50 p-5 rounded border border-slate-100">
                  {project.solution}
                </p>
              </div>
            )}

            {project.result && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  Hasil
                </div>
                <p className="text-sm md:text-base text-emerald-900 font-medium leading-relaxed bg-emerald-50 p-5 rounded border border-emerald-100">
                  {project.result}
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};
export default PortfolioDetailContent;
