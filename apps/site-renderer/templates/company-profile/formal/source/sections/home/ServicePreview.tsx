import React from "react";
import { servicesData } from "../../data/companyProfileData";
import { SectionHeading } from "../../shared/SectionHeading";
import { Card } from "../../shared/Card";
import { Button } from "../../shared/Button";
import type { ServiceItem } from "../../lib/types";

export interface HomeServicePreviewProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  services?: ServiceItem[];
  allServicesHref?: string;
  allServicesLabel?: string;
}

export const ServicePreview: React.FC<HomeServicePreviewProps> = ({
  title = "Layanan Korporat Spesialisasi Kami",
  subtitle = "Menggabungkan kepatuhan aspek legalitas formal dengan strategi operasional yang dirancang matang untuk kemajuan usaha.",
  badge = "Fokus Solusi",
  services = servicesData,
  allServicesHref = "/services",
  allServicesLabel = "Lihat Seluruh Cakupan Layanan",
}) => {
  // Show only 3 items on Home preview
  const previewServices = services.slice(0, 3);

  return (
    <section id="home-service-preview" className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeading
          title={title}
          subtitle={subtitle}
          badge={badge}
          badgeVariant="secondary"
        />

        {/* 3 Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {previewServices.map((service) => (
            <Card key={service.id} className="flex flex-col h-full p-8 bg-white border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-3 tracking-tight">
                {service.title}
              </h3>

              <p className="text-sm text-slate-600 font-light leading-relaxed mb-6 flex-grow">
                {service.description}
              </p>

              {/* <a
                href={`${allServicesHref}#${service.id}`}
                className="inline-flex text-xs text-[#1E3A5F] font-semibold pt-4 border-t border-slate-50 hover:underline"
              >
                Selengkapnya →
              </a> */}
            </Card>
          ))}
        </div>

        {/* Bottom Central Action */}
        <div className="text-center">
          <Button href={allServicesHref} variant="primary">
            {allServicesLabel}
          </Button>
        </div>

      </div>
    </section>
  );
};
export default ServicePreview;
