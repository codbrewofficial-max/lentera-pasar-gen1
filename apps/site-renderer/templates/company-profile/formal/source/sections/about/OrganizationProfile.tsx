import React from "react";
import { Award, Building2 } from "lucide-react";
import { companyData as defaultCompanyData } from "../../data/companyProfileData";
import type { CompanyData } from "../../lib/types";
import { SectionHeading } from "../../shared/SectionHeading";

interface OrganizationProfileProps {
  company?: CompanyData;
  title?: string;
  subtitle?: string;
  badge?: string;
  paragraphs?: string[];
  imageUrl?: string;
  imageAlt?: string;
  locationTitle?: string;
  locationValue?: string;
  certificationTitle?: string;
  certificationValue?: string;
  accentLabel?: string;
}

export const OrganizationProfile: React.FC<OrganizationProfileProps> = ({
  company = defaultCompanyData,
  title = "Membangun Tata Kelola B2B Sejak 2012",
  subtitle = "Berdedikasi tinggi memperkokoh pondasi hukum investasi serta efisiensi manajemen fungsional korporasi tanah air.",
  badge = "Profil Organisasi",
  paragraphs,
  imageUrl = "https://picsum.photos/seed/integra-office-hall/800/800",
  imageAlt = "Integra Corporate Organization",
  locationTitle = "Alamat Kantor Resmi",
  locationValue = "Sudirman CBD, Jakarta",
  certificationTitle = "Lisensi & Sertifikasi",
  certificationValue = "Berlisensi Pajak & Hukum Resmi",
  accentLabel = "Profesor-Led Firm",
}) => {
  const bodyParagraphs = paragraphs?.length
    ? paragraphs
    : [
        `${company.name} didirikan dengan visi melahirkan layanan audit tata kelola yang tangguh dan selaras dengan regulasi nasional.`,
        company.description,
        "Kami berkomitmen pada transparansi, akuntabilitas, dan etika profesi demi mengawal kebutuhan bisnis pelanggan agar berjalan aman dan berkembang optimal.",
      ];

  return (
    <section id="about-organization-profile" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="primary" align="left" className="mb-6" />

            <div className="space-y-4 text-slate-600 font-light leading-relaxed text-sm md:text-base -mt-4">
              {bodyParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start space-x-3">
                <div className="bg-[#649FF6]/10 text-[#649FF6] p-2.5 rounded flex-shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{locationTitle}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5 line-clamp-2">{locationValue}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-[#F56B71]/10 text-[#F56B71] p-2.5 rounded flex-shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{certificationTitle}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{certificationValue}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-lg overflow-hidden shadow-xl border border-slate-100 bg-slate-50 p-2">
              <img src={imageUrl} alt={imageAlt} className="w-full h-[400px] object-cover rounded" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
            </div>
            <div className="absolute -top-4 -left-4 bg-[#F56B71] text-white px-4 py-2 text-xs font-mono font-bold rounded shadow-lg uppercase tracking-wider">
              {accentLabel}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default OrganizationProfile;
