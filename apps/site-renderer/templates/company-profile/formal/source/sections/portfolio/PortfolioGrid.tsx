import React from "react";
import Link from "next/link";
import { CheckCircle, HelpCircle, ShieldCheck } from "lucide-react";
import { PortfolioItem } from "../../lib/types";
import { Card } from "../../shared/Card";
import { Badge } from "../../shared/Badge";
import { SectionHeading } from "../../shared/SectionHeading";
import { Button } from "../../shared/Button";
import { stripHtmlToText } from '@/components/content/RichHtml';

interface PortfolioGridProps {
  portfolios: PortfolioItem[];
  activeCategory: string;
  title?: string;
  subtitle?: string;
  portfolioDetailHref?: (id: string) => string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({
  portfolios,
  activeCategory,
  title,
  subtitle,
  portfolioDetailHref,
  imageUrl,
  ctaLabel,
  ctaHref = "/contact",
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
    <section id="portfolio-grid-section" className="bg-white">
      {imageUrl ? (
        <div className="relative py-16 md:py-20 mb-10 bg-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0">
            <img src={imageUrl} alt="" className="w-full h-full object-cover opacity-30" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950/90" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {(title || subtitle) && <SectionHeading title={title || ""} subtitle={subtitle} badgeVariant="accent" dark />}
            {ctaLabel && (
              <div className="text-center -mt-6">
                <Button href={ctaHref} variant="secondary">{ctaLabel}</Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        (title || subtitle || ctaLabel) && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
            {(title || subtitle) && <SectionHeading title={title || ""} subtitle={subtitle} badgeVariant="accent" />}
            {ctaLabel && (
              <div className="text-center -mt-6">
                <Button href={ctaHref} variant="outline">{ctaLabel}</Button>
              </div>
            )}
          </div>
        )
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-8">
        {filtered.map((project) => (
          <div
            key={project.id}
            id={project.id}
            className="scroll-mt-24 border border-slate-100 rounded-none bg-white p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Visual area - left */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="relative aspect-video rounded-none overflow-hidden mb-6 bg-slate-50">
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
              </div>
            </div>

            {/* Deep technical details (Challenge, Solution, Result) - right */}
            <div className="lg:col-span-7 bg-slate-50/50 rounded-none p-6 md:p-8 border border-slate-100 flex flex-col justify-between space-y-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4 tracking-tight leading-snug">
                {project.title}
              </h3>
              
              <p className="text-sm md:text-base text-slate-600 font-light leading-relaxed mb-6">
                {stripHtmlToText(project.description, 140)}
              </p>

              <Link
                href={portfolioDetailHref ? portfolioDetailHref(project.id) : `/portfolio/${project.id}`}
                className="inline-flex items-center text-sm font-semibold text-[#1E3A5F] hover:underline"
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
