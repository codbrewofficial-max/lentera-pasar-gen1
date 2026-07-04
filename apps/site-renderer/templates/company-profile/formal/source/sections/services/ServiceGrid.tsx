import React from "react";
import { servicesData as defaultServicesData } from "../../data/companyProfileData";
import type { ServiceItem } from "../../lib/types";
import { SectionHeading } from "../../shared/SectionHeading";
import { Card } from "../../shared/Card";
import { Button } from "../../shared/Button";

interface ServiceGridProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  services?: ServiceItem[];
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({
  title = "Layanan Terintegrasi Sesuai Kebutuhan Bisnis",
  subtitle = "Setiap unit layanan ditangani dengan pendekatan profesional dan mudah dipahami pelanggan.",
  badge = "Portofolio Layanan",
  services = defaultServicesData,
  imageUrl,
  ctaLabel,
  ctaHref = "/contact",
}) => {
  return (
    <section id="services-grid" className="bg-white">
      {imageUrl ? (
        <div className="relative py-16 md:py-20 bg-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0">
            <img src={imageUrl} alt="" className="w-full h-full object-cover opacity-30" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950/90" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="primary" dark />
            {ctaLabel && (
              <div className="text-center -mt-6">
                <Button href={ctaHref} variant="secondary">{ctaLabel}</Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24">
          <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="primary" />
          {ctaLabel && (
            <div className="text-center -mt-6 mb-6">
              <Button href={ctaHref} variant="outline">{ctaLabel}</Button>
            </div>
          )}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} id={service.id} className="p-8 bg-white border border-slate-100 flex flex-col h-full hover:border-slate-200 hover:shadow-md transition-all duration-200 scroll-mt-24" hoverEffect={true}>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 tracking-tight leading-snug">{service.title}</h3>
              <p className="text-sm text-slate-600 font-light leading-relaxed mb-6 flex-grow">{service.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ServiceGrid;
