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
  return (
    <section id="home-profile-summary" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Visual & Facts Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-none overflow-hidden shadow-lg border border-slate-100">
              <img
                src={imageUrl}
                alt={imageAlt}
                className="w-full h-[350px] md:h-[450px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            </div>
          </div>

          {/* Right Column: Narrative & Stats Grid */}
          <div className="lg:col-span-7 flex flex-col space-y-6 lg:pl-6">
            <SectionHeading
              title={title}
              badge={badge}
              badgeVariant="primary"
              align="left"
              className="mb-6 md:mb-8"
            />

            <p className="text-slate-600 font-light leading-relaxed -mt-4 text-sm md:text-base">
              {description}
            </p>

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
