import React from "react";
import { benefitData as defaultBenefitData } from "../../data/companyProfileData";
import type { BenefitItem } from "../../lib/types";
import { SectionHeading } from "../../shared/SectionHeading";
import { Card } from "../../shared/Card";

interface ServiceBenefitsProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  benefits?: BenefitItem[];
  benefitFour?: string;
}

export const ServiceBenefits: React.FC<ServiceBenefitsProps> = ({
  title = "Manfaat Menggunakan Layanan Kami",
  subtitle = "Keunggulan yang membantu pelanggan mengambil keputusan dengan lebih yakin.",
  badge = "Manfaat Layanan",
  benefits = defaultBenefitData,
  benefitFour,
}) => {
  return (
    <section id="services-benefits" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="accent" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, idx) => (
            <Card key={`${benefit.title}-${idx}`} className="p-8 bg-slate-50/40 border border-slate-100 h-full" hoverEffect={true}>
              <div className="w-10 h-10 flex items-center justify-center rounded bg-[#649FF6]/10 text-[#649FF6] font-mono font-bold text-base mb-6 border border-[#649FF6]/20">
                {idx + 1}
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-3 tracking-tight">{benefit.title}</h3>
              <p className="text-sm text-slate-600 font-light leading-relaxed">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ServiceBenefits;
