import React from "react";
import { companyData, statsData } from "../../data/companyProfileData";
import { SectionHeading } from "../../shared/SectionHeading";
import { Button } from "../../shared/Button";
import type { StatItem } from "../../lib/types";

export interface HomeProfileSummaryProps {
  imageUrl?: string;
  imageAlt?: string;
  establishedYear?: string;
  historyLabel?: string;
  historyText?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  stats?: StatItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

export const ProfileSummary: React.FC<HomeProfileSummaryProps> = ({
  imageUrl = companyData.aboutImage,
  imageAlt = "Integra Office",
  establishedYear = companyData.establishedYear,
  historyLabel = "Sejarah Kami",
  historyText,
  title = "Profesionalitas Tanpa Kompromi untuk Kelangsungan Bisnis Anda",
  subtitle = "Menyatukan kapabilitas analisis risiko hukum yang tajam dengan strategi pengembangan manajemen korporat yang praktis.",
  badge = "Profil Singkat",
  description = "Kami percaya bahwa kepatuhan hukum dan keunggulan tata kelola adalah landasan utama pertumbuhan bisnis yang aman dan berkelanjutan. Dengan tim ahli lintas disiplin (hukum, pajak, manajemen), Integra hadir meminimalkan gesekan operasional klien di tengah arus regulasi Indonesia yang dinamis.",
  stats = statsData,
  ctaLabel = "Pelajari Filosofi & Tim Kami",
  ctaHref = "/about",
}) => {
  const finalHistoryText = historyText || `Dipercaya sejak tahun ${establishedYear} membantu kelancaran bisnis multinasional di Indonesia.`;

  return (
    <section id="home-profile-summary" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Visual & Facts Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-lg overflow-hidden shadow-lg border border-slate-100">
              <img
                src={imageUrl}
                alt={imageAlt}
                className="w-full h-[350px] md:h-[450px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            </div>

            {/* Overlay trust card */}
            <div className="absolute -bottom-6 -right-4 md:right-6 bg-slate-900 text-white p-6 rounded-lg shadow-xl max-w-xs border border-slate-800">
              <p className="text-xs font-mono text-[#649FF6] uppercase tracking-wider">{historyLabel}</p>
              <p className="text-sm font-light mt-2 leading-relaxed">
                {finalHistoryText}
              </p>
            </div>
          </div>

          {/* Right Column: Narrative & Stats Grid */}
          <div className="lg:col-span-7 flex flex-col space-y-6 lg:pl-6">
            <SectionHeading
              title={title}
              subtitle={subtitle}
              badge={badge}
              badgeVariant="primary"
              align="left"
              className="mb-6 md:mb-8"
            />

            <p className="text-slate-600 font-light leading-relaxed -mt-4 text-sm md:text-base">
              {description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              {stats.slice(0, 4).map((stat, idx) => (
                <div key={`${stat.label}-${idx}`} className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-bold text-[#649FF6] tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs md:text-sm text-slate-500 font-mono mt-1 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <Button href={ctaHref} variant="outline" size="md">
                {ctaLabel}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
export default ProfileSummary;
