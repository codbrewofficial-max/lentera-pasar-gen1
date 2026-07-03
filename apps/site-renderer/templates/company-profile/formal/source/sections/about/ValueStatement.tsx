import React from "react";
import { Award, Shield, TrendingUp, Users } from "lucide-react";
import { valuesData as defaultValuesData } from "../../data/companyProfileData";
import type { ValueItem } from "../../lib/types";
import { SectionHeading } from "../../shared/SectionHeading";
import { Card } from "../../shared/Card";

const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-6 h-6 text-[#1E3A5F]" />,
  Award: <Award className="w-6 h-6 text-[#8A6D3B]" />,
  Users: <Users className="w-6 h-6 text-[#475569]" />,
  TrendingUp: <TrendingUp className="w-6 h-6 text-[#1E3A5F]" />,
};

interface ValueStatementProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  values?: ValueItem[];
  valueFour?: string;
}

export const ValueStatement: React.FC<ValueStatementProps> = ({
  title = "Nilai yang Kami Pegang",
  subtitle = "Prinsip kerja yang menjaga kualitas layanan dan kepercayaan pelanggan.",
  badge = "Nilai Inti",
  values = defaultValuesData,
  valueFour,
}) => {
  return (
    <section id="about-value-statement" className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="accent" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => (
            <Card key={`${val.title}-${idx}`} className="p-8 bg-white border border-slate-100 h-full" hoverEffect={true}>
              <div className="bg-slate-50 w-12 h-12 flex items-center justify-center rounded-none mb-6 border border-slate-100">
                {idx+1}
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-3 tracking-tight">{val.title}</h3>
              <p className="text-sm text-slate-600 font-light leading-relaxed">{val.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ValueStatement;
