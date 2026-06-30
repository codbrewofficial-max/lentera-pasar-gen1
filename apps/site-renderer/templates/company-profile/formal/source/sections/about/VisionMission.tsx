import React from "react";
import { CheckCircle2, Eye, Target } from "lucide-react";
import { companyData as defaultCompanyData } from "../../data/companyProfileData";
import { SectionHeading } from "../../shared/SectionHeading";

interface VisionMissionProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  vision?: string;
  mission?: string[];
}

export const VisionMission: React.FC<VisionMissionProps> = ({
  title = "Visi & Misi Korporasi",
  subtitle = "Prinsip strategis yang menjadi landasan kami dalam mendampingi kebutuhan pelanggan.",
  badge = "Arah Strategis",
  vision = defaultCompanyData.vision,
  mission = defaultCompanyData.mission,
}) => {
  return (
    <section id="about-vision-mission" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="primary" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="border border-slate-100 rounded-lg bg-slate-50/50 p-8 md:p-10 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded bg-[#649FF6]/10 text-[#649FF6] flex items-center justify-center border border-[#649FF6]/20">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Visi</h3>
            </div>
            <p className="text-slate-600 font-light leading-relaxed text-sm md:text-base">{vision}</p>
          </div>

          <div className="border border-slate-100 rounded-lg bg-white p-8 md:p-10 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded bg-[#F56B71]/10 text-[#F56B71] flex items-center justify-center border border-[#F56B71]/20">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Misi</h3>
            </div>
            <ul className="space-y-4">
              {mission.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-sm md:text-base text-slate-600 font-light leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-[#649FF6] mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
export default VisionMission;
