import React from "react";
import { Award, Shield, TrendingUp, Users } from "lucide-react";
import type { ValueItem } from "../../lib/types";
import { SectionHeading } from "../../shared/SectionHeading";
import { Card } from "../../shared/Card";
import { Button } from "../../shared/Button";

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
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export const ValueStatement: React.FC<ValueStatementProps> = ({
  title,
  subtitle,
  badge,
  values = [],
  valueFour,
  imageUrl,
  ctaLabel,
  ctaHref = "/contact",
}) => {
  // Skema section "about.value_statement" cuma punya field "items" (repeater) — kalau
  // owner belum isi sama sekali, section ini tidak menampilkan kartu dummy.
  if (!values.length) return null;

  return (
    <section id="about-value-statement" className="bg-slate-50">
      {imageUrl ? (
        <div className="relative py-16 md:py-20 mb-4 bg-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0">
            <img src={imageUrl} alt="" className="w-full h-full object-cover opacity-30" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950/90" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={title || ""} subtitle={subtitle} badge={badge} badgeVariant="accent" dark />
            {ctaLabel && (
              <div className="text-center -mt-6">
                <Button href={ctaHref} variant="secondary">{ctaLabel}</Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24">
          <SectionHeading title={title || ""} subtitle={subtitle} badge={badge} badgeVariant="accent" />
          {ctaLabel && (
            <div className="text-center -mt-6 mb-6">
              <Button href={ctaHref} variant="outline">{ctaLabel}</Button>
            </div>
          )}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
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
