import React from "react";
import { PortfolioItem } from "../../lib/types";
import { Card } from "../../shared/Card";
import { Badge } from "../../shared/Badge";
import { Button } from "../../shared/Button";
import { SectionHeading } from "../../shared/SectionHeading";

interface RelatedPortfoliosProps {
  portfolios: PortfolioItem[];
  currentSlug?: string;
  title?: string;
  subtitle?: string;
  portfolioDetailHref?: (id: string) => string;
  baseHref?: string;
}

// Gaya visual mengikuti pola Card yang sudah dipakai di PortfolioPreview.tsx (Home)
// dan PortfolioGrid.tsx (Portfolio) — image aspect-video, badge kategori di pojok kiri
// atas, judul, deskripsi ringkas, tombol "Lihat Detail Proyek". Ini menjaga konsistensi
// visual dengan section Formal lain, bukan pakai tampilan generik Clean.
export const RelatedPortfolios: React.FC<RelatedPortfoliosProps> = ({
  portfolios,
  currentSlug,
  title = "Portofolio Terkait",
  subtitle = "Lihat proyek lain yang mungkin menarik untuk Anda.",
  portfolioDetailHref,
  baseHref = "/portfolio",
}) => {
  const filtered = portfolios.filter((item) => item.slug !== currentSlug && item.id !== currentSlug).slice(0, 3);

  if (filtered.length === 0) {
    return null;
  }

  return (
    <section id="portfolio-detail-related" className="py-16 md:py-24 bg-slate-50/50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} badge="Proyek Lainnya" badgeVariant="accent" />

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col h-full bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
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

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-3 leading-snug tracking-tight">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-600 font-light leading-relaxed mb-6 flex-grow line-clamp-3">
                  {project.description}
                </p>
                <Button href={portfolioDetailHref ? portfolioDetailHref(project.id) : `${baseHref}/${project.id}`}>
                  Lihat Detail Proyek
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedPortfolios;
