import React from "react";
import Link from "next/link";
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
  portfolioDetailHref?: (id: string) => string;
}

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({
  portfolios,
  activeCategory,
  title,
  subtitle,
  portfolioDetailHref,
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

                {/* {project.clientName && (
                  <div className="text-xs text-slate-500 font-mono mb-4">
                    <span className="font-semibold text-slate-700">{project.clientName}</span>
                  </div>
                )} */}
              </div>
            </div>

            {/* Deep technical details (Challenge, Solution, Result) - right */}
            <div className="lg:col-span-7 bg-slate-50/50 rounded-lg p-6 md:p-8 border border-slate-100 flex flex-col justify-between space-y-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4 tracking-tight leading-snug">
                {project.title}
              </h3>
              
              <p className="text-sm md:text-base text-slate-600 font-light leading-relaxed mb-6">
                {project.description}
              </p>

              <Link
                href={portfolioDetailHref ? portfolioDetailHref(project.id) : `/portfolio/${project.id}`}
                className="inline-flex items-center text-sm font-semibold text-[#649FF6] hover:underline"
              >
                Lihat Detail →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default PortfolioGrid;
