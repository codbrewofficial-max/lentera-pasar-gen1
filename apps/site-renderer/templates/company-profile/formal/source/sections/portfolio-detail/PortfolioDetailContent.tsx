import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import { PortfolioItem } from "../../lib/types";
import { RichHtml } from "@/components/content/RichHtml";
import { Badge } from "../../shared/Badge";

// Section "portfolio_detail.portfolio_detail_content" ini menggabungkan apa yang
// sebelumnya jadi 2 section terpisah (Hero + Content) — sesuai penyederhanaan struktur
// Portfolio Detail jadi 3 section: Content, Related, CTA.
interface PortfolioDetailContentProps {
  project?: PortfolioItem;
  badge?: string;
  backHref?: string;
  businessName?: string;
  businessLogoUrl?: string;
  contentMaxWidth?: string;
  showAuthor?: boolean;
  showPublishDate?: boolean;
  showShareLink?: boolean;
}

const EMPTY_STATE = (
  <div className="py-20 text-center">
    <p className="text-sm font-semibold text-slate-400">Detail proyek belum tersedia.</p>
  </div>
);

export const PortfolioDetailContent: React.FC<PortfolioDetailContentProps> = ({
  project,
  badge,
  backHref = "/portfolio",
  businessName,
  businessLogoUrl,
  showAuthor = true,
  showPublishDate = true,
  showShareLink = true,
}) => {
  if (!project) return EMPTY_STATE;

  return (
    <section id="portfolio-detail-content" className="bg-white">
      {/* Header (dulu section terpisah "Pembuka Detail Portfolio") */}
      <div className="bg-slate-900 text-white py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1E3A5F_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link href={backHref} className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#1E3A5F] hover:underline uppercase tracking-wider">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {badge && <Badge variant="primary">{badge}</Badge>}
            {project.category && <Badge variant="accent" className="bg-white/10 text-white border-white/20">{project.category}</Badge>}
            {showPublishDate && project.year && (
              <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-400">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>{project.year}</span>
              </div>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-white mb-6">
            {project.title}
          </h1>
          {showAuthor && businessName && (
            <div className="flex items-center space-x-4 border-t border-slate-800 pt-6">
              {businessLogoUrl && (
                <div className="w-11 h-11 rounded-none overflow-hidden bg-slate-800 border border-slate-700">
                  <img src={businessLogoUrl} alt={businessName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
              <span className="text-sm font-semibold text-white leading-tight">{businessName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {project.imageUrl && (
              <div className="lg:col-span-5">
                <div className="rounded-none overflow-hidden aspect-video bg-slate-100 shadow-sm border border-slate-100">
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
            )}
            <div className={`${project.imageUrl ? "lg:col-span-7" : "lg:col-span-12"} space-y-8`}>
              <RichHtml
                html={project.description}
                className="prose prose-slate max-w-none prose-p:mb-4 prose-p:leading-relaxed prose-headings:font-semibold prose-headings:text-slate-900 prose-ul:list-disc prose-ul:pl-6 text-sm md:text-base text-slate-700 font-light"
                emptyFallback="Detail proyek belum tersedia."
              />
              {showShareLink && (
                <div className="rounded-none border border-slate-100 bg-slate-50 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Bagikan proyek ini</h3>
                    <p className="text-xs text-slate-500 mt-1">Salin tautan halaman ini dari browser untuk membagikannya.</p>
                  </div>
                  <div className="inline-flex items-center text-xs font-mono text-[#1E3A5F] uppercase tracking-wider"><Share2 className="w-4 h-4 mr-2" /> Share</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default PortfolioDetailContent;
