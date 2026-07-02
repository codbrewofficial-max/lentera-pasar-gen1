import React from "react";
import { ArrowRight } from "lucide-react";
import { portfolioData } from "../../data/companyProfileData";
import { SectionHeading } from "../../shared/SectionHeading";
import { Card } from "../../shared/Card";
import { Badge } from "../../shared/Badge";
import { Button } from "../../shared/Button";
import type { PortfolioItem } from "../../lib/types";

export interface HomePortfolioPreviewProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  portfolios?: PortfolioItem[];
  allPortfolioHref?: string;
  allPortfolioLabel?: string;
  portfolioDetailHref?: (id: string) => string;
}

export const PortfolioPreview: React.FC<HomePortfolioPreviewProps> = ({
  title = "Studi Kasus & Portofolio Sukses",
  subtitle = "Bukti nyata bagaimana kami membantu korporasi menavigasi kepatuhan regulasi, sengketa pajak, dan restrukturisasi organisasi.",
  badge = "Rekam Jejak",
  portfolios = portfolioData,
  allPortfolioHref = "/portfolio",
  allPortfolioLabel = "Eksplorasi Semua Kasus Klien",
  portfolioDetailHref
}) => {
  // Show only 3 items on Home preview
  const previewPortfolios = portfolios.slice(0, 3);

  return (
    <section id="home-portfolio-preview" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeading
          title={title}
          subtitle={subtitle}
          badge={badge}
          badgeVariant="accent"
        />

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
                  {project.description}
                </p>

                <Button
                  href={portfolioDetailHref ? portfolioDetailHref(project.id) : `/portfolio/${project.id}`}
                  variant="text"
                  size="sm"
                  iconRight={<ArrowRight className="w-4 h-4 ml-1" />}
                  className="justify-start inline-flex text-xs font-semibold text-[#649FF6] mt-auto"
                >
                  Lihat Studi Kasus
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Central Action */}
        <div className="text-center">
          <Button href={allPortfolioHref} variant="primary">
            {allPortfolioLabel}
          </Button>
        </div>

      </div>
    </section>
  );
};
export default PortfolioPreview;
