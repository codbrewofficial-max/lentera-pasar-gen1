import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PortfolioItem } from "../../lib/types";
import { Badge } from "../../shared/Badge";
import { stripHtmlToText } from '@/components/content/RichHtml';

interface PortfolioDetailHeroProps {
  project?: PortfolioItem;
  backHref?: string;
  badge?: string;
}

export const PortfolioDetailHero: React.FC<PortfolioDetailHeroProps> = ({
  project,
  backHref = "/portfolio",
  badge = "Detail Proyek",
}) => {
  if (!project) return null;
  return (
    <section id="portfolio-detail-hero" className="bg-slate-900 text-white py-12 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1E3A5F_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href={backHref} className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#1E3A5F] hover:underline uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Portofolio
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {badge && <Badge variant="primary">{badge}</Badge>}
          {project.category && <Badge variant="accent" className="bg-white/10 text-white border-white/20">{project.category}</Badge>}
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-white mb-4">
          {project.title}
        </h1>
        {project.description && (
          <p className="text-slate-300 font-light leading-relaxed max-w-2xl text-sm md:text-base">
            {stripHtmlToText(project.description, 220)}
          </p>
        )}
      </div>
    </section>
  );
};
export default PortfolioDetailHero;
