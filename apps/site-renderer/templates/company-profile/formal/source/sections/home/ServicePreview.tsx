import React from "react";
import { ArrowRight, Shield, TrendingUp, Briefcase, Activity, Globe, Award } from "lucide-react";
import { servicesData } from "../../data/companyProfileData";
import { SectionHeading } from "../../shared/SectionHeading";
import { Card } from "../../shared/Card";
import { Button } from "../../shared/Button";
import type { ServiceItem } from "../../lib/types";

// Map string icon names to Lucide icon components
export const serviceIconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-6 h-6 text-[#649FF6]" />,
  TrendingUp: <TrendingUp className="w-6 h-6 text-[#F56B71]" />,
  Briefcase: <Briefcase className="w-6 h-6 text-[#B283AF]" />,
  Activity: <Activity className="w-6 h-6 text-[#649FF6]" />,
  Globe: <Globe className="w-6 h-6 text-[#F56B71]" />,
  Award: <Award className="w-6 h-6 text-[#B283AF]" />,
};

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
              <div className="bg-slate-50 w-12 h-12 flex items-center justify-center rounded mb-6 border border-slate-100">
                {serviceIconMap[service.iconName] || <Shield className="w-6 h-6 text-slate-400" />}
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-3 tracking-tight">
                {service.title}
              </h3>

              <p className="text-sm text-slate-600 font-light leading-relaxed mb-6 flex-grow">
                {service.description}
              </p>

              {/* List of sub features preview */}
              <ul className="space-y-2 mb-6 border-t border-slate-50 pt-4">
                {service.features.slice(0, 2).map((feat, idx) => (
                  <li key={idx} className="text-xs text-slate-500 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#649FF6]" />
                    <span className="truncate">{feat}</span>
                  </li>
                ))}
              </ul>

              <Button
                href={`${allServicesHref}#${service.id}`}
                variant="text"
                size="sm"
                iconRight={<ArrowRight className="w-4 h-4 ml-1" />}
                className="justify-start inline-flex text-xs text-[#649FF6] font-semibold"
              >
                Selengkapnya
              </Button>
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
