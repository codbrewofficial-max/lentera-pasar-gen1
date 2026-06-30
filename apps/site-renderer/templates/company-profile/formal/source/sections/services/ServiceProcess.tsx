import React from "react";
import { processSteps as defaultProcessSteps } from "../../data/companyProfileData";
import type { ProcessStep } from "../../lib/types";
import { SectionHeading } from "../../shared/SectionHeading";

interface ServiceProcessProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  steps?: ProcessStep[];
}

export const ServiceProcess: React.FC<ServiceProcessProps> = ({
  title = "Alur Kerja yang Jelas dan Terukur",
  subtitle = "Setiap pekerjaan dijalankan melalui tahapan yang rapi agar pelanggan memahami proses sejak awal.",
  badge = "Proses Kerja",
  steps = defaultProcessSteps,
}) => {
  return (
    <section id="services-process" className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="secondary" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((stepItem, idx) => (
            <div key={`${stepItem.step}-${idx}`} className="bg-white border border-slate-100 rounded-lg p-7 shadow-sm relative overflow-hidden">
              <div className="absolute top-4 right-4 text-4xl font-bold text-slate-100 font-mono">{stepItem.step}</div>
              <div className="relative">
                <div className="w-10 h-10 rounded bg-[#649FF6]/10 text-[#649FF6] flex items-center justify-center text-sm font-bold font-mono mb-5 border border-[#649FF6]/20">{idx + 1}</div>
                <h3 className="text-base font-semibold text-slate-900 mb-3 tracking-tight">{stepItem.title}</h3>
                <p className="text-sm text-slate-600 font-light leading-relaxed">{stepItem.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ServiceProcess;
