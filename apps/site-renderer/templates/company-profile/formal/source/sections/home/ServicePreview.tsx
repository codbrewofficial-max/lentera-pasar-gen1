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
  imageUrl?: string;
}

export const ServicePreview: React.FC<HomeServicePreviewProps> = ({
  title = "Layanan Korporat Spesialisasi Kami",
  subtitle = "Menggabungkan kepatuhan aspek legalitas formal dengan strategi operasional yang dirancang matang untuk kemajuan usaha.",
  badge = "Fokus Solusi",
  services = servicesData,
  allServicesHref = "/services",
  allServicesLabel = "Lihat Seluruh Cakupan Layanan",
  imageUrl,
}) => {
  // Show only 3 items on Home preview
  const previewServices = services.slice(0, 3);

  return (
    <section id="home-service-preview" className="bg-slate-50">
      {/* Kalau imageUrl diisi, heading + CTA dipindah ke "header band" bergambar di atas
          grid (bukan CTA polos di bawah lagi) — kalau kosong, tampilan tetap seperti
          semula supaya tidak ada regresi untuk section yang belum diisi gambar. */}
      {imageUrl ? (
        <div className="relative py-16 md:py-20 bg-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0">
            <img src={imageUrl} alt="" className="w-full h-full object-cover opacity-30" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950/90" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="secondary" dark />
            {allServicesLabel && (
              <div className="text-center -mt-6">
                <Button href={allServicesHref} variant="secondary">
                  {allServicesLabel}
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24">
          <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="secondary" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
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
            </Card>
          ))}
        </div>

        {!imageUrl && allServicesLabel && (
          <div className="text-center">
            <Button href={allServicesHref} variant="primary">
              {allServicesLabel}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
export default ServicePreview;
