import React from "react";
import { ArrowRight } from "lucide-react";
import { portfolioData } from "../../data/companyProfileData";
import { SectionHeading } from "../../shared/SectionHeading";
import { Card } from "../../shared/Card";
import { Badge } from "../../shared/Badge";
import { Button } from "../../shared/Button";
import type { PortfolioItem } from "../../lib/types";
import { stripHtmlToText } from '@/components/content/RichHtml';

export interface HomePortfolioPreviewProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  portfolios?: PortfolioItem[];
  allPortfolioHref?: string;
  allPortfolioLabel?: string;
  portfolioDetailHref?: (id: string) => string;
  imageUrl?: string;
}

export const PortfolioPreview: React.FC<HomePortfolioPreviewProps> = ({
  title = "Studi Kasus & Portofolio Sukses",
  subtitle = "Bukti nyata bagaimana kami membantu korporasi menavigasi kepatuhan regulasi, sengketa pajak, dan restrukturisasi organisasi.",
  badge = "Rekam Jejak",
  portfolios = portfolioData,
  allPortfolioHref = "/portfolio",
  allPortfolioLabel = "Eksplorasi Semua Kasus Klien",
  portfolioDetailHref,
  imageUrl,
}) => {
  // Show only 3 items on Home preview
  const previewPortfolios = portfolios.slice(0, 3);

  return (
    <section id="home-portfolio-preview" className="bg-white">
      {imageUrl ? (
        <div className="relative py-16 md:py-20 bg-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0">
            <img src={imageUrl} alt="" className="w-full h-full object-cover opacity-30" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950/90" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="accent" dark />
            {allPortfolioLabel && (
              <div className="text-center -mt-6">
                <Button href={allPortfolioHref} variant="secondary">
                  {allPortfolioLabel}
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24">
          <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="accent" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* 3 Portfolios Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {previewPortfolios.map((project) => (
            <Card key={project.id} className="flex flex-col h-full bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              {/* Image Container */}
              <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="accent" className="bg-slate-900/80 text-white border-transparent backdrop-blur-sm">
                    {project.category}
                  </Badge>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-3 leading-snug tracking-tight">
                  {project.title}
                </h3>

                <p className="text-sm text-slate-600 font-light leading-relaxed mb-6 flex-grow line-clamp-3">
                  {stripHtmlToText(project.description, 140)}
                </p>

                <Button
                  href={portfolioDetailHref ? portfolioDetailHref(project.id) : `/portfolio/${project.id}`}
                  variant="text"
                  size="sm"
                  iconRight={<ArrowRight className="w-4 h-4 ml-1" />}
                  className="justify-start inline-flex text-xs font-semibold text-[#1E3A5F] mt-auto"
                >
                  Selengkapnya
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {!imageUrl && allPortfolioLabel && (
          <div className="text-center">
            <Button href={allPortfolioHref} variant="primary">
              {allPortfolioLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
export default PortfolioPreview;
