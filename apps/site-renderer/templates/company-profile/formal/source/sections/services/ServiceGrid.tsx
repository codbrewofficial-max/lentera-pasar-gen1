import React from "react";
import { Activity, Award, Briefcase, Check, Globe, Shield, TrendingUp } from "lucide-react";
import { servicesData as defaultServicesData } from "../../data/companyProfileData";
import type { ServiceItem } from "../../lib/types";
import { SectionHeading } from "../../shared/SectionHeading";
import { Card } from "../../shared/Card";

const gridIconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-6 h-6 text-[#649FF6]" />,
  TrendingUp: <TrendingUp className="w-6 h-6 text-[#F56B71]" />,
  Briefcase: <Briefcase className="w-6 h-6 text-[#B283AF]" />,
  Activity: <Activity className="w-6 h-6 text-[#649FF6]" />,
  Globe: <Globe className="w-6 h-6 text-[#F56B71]" />,
  Award: <Award className="w-6 h-6 text-[#B283AF]" />,
};

interface ServiceGridProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  services?: ServiceItem[];
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({
  title = "Layanan Terintegrasi Sesuai Kebutuhan Bisnis",
  subtitle = "Setiap unit layanan ditangani dengan pendekatan profesional dan mudah dipahami pelanggan.",
  badge = "Portofolio Layanan",
  services = defaultServicesData,
}) => {
  return (
    <section id="services-grid" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="primary" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Card key={service.id} id={service.id} className="p-8 bg-white border border-slate-100 flex flex-col h-full hover:border-slate-200 hover:shadow-md transition-all duration-200 scroll-mt-24" hoverEffect={true}>
              <div className="bg-slate-50 w-12 h-12 flex items-center justify-center rounded mb-6 border border-slate-100 flex-shrink-0">
                {gridIconMap[service.iconName] || <Shield className="w-6 h-6 text-slate-400" />}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 tracking-tight leading-snug">{service.title}</h3>
              <p className="text-sm text-slate-600 font-light leading-relaxed mb-6 flex-grow">{service.description}</p>
              <div className="border-t border-slate-100 pt-5 mt-auto">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 font-mono">Cakupan Teknis:</h4>
                <ul className="space-y-2.5">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-600 font-light">
                      <Check className="w-4 h-4 text-[#649FF6] mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ServiceGrid;
