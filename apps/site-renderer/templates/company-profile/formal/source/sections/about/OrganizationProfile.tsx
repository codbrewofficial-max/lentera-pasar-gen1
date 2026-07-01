import React from "react";
import { companyData as defaultCompanyData } from "../../data/companyProfileData";
import type { CompanyData } from "../../lib/types";
import { SectionHeading } from "../../shared/SectionHeading";
// Pastikan Award di-import dari library icon Anda (misal: lucide-react)
import { Award } from "lucide-react"; 

interface OrganizationProfileProps {
  company?: CompanyData;
  title?: string;
  badge?: string;
  paragraphs?: string[];
  imageUrl?: string;
  imageAlt?: string;
  certificationTitle?: string;
  certificationValue?: string;
}

export const OrganizationProfile: React.FC<OrganizationProfileProps> = ({
  company = defaultCompanyData,
  title = "Membangun Tata Kelola B2B Sejak 2012",
  badge = "Profil Organisasi",
  paragraphs,
  imageUrl = "https://picsum.photos/seed/integra-office-hall/800/800",
  imageAlt = "Integra Corporate Organization",
  certificationTitle = "Sertifikasi Resmi",
  certificationValue = "ISO 27001:2022 Certified",
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
          
          {/* Kolom Kiri: Teks & Sertifikat */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <SectionHeading title={title} badge={badge} badgeVariant="primary" align="left" className="mb-6" />

            <div className="space-y-4 text-slate-600 font-light leading-relaxed text-sm md:text-base">
              {bodyParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Bagian Sertifikasi */}
            <div className="flex items-start space-x-3 pt-4">
              <div className="bg-[#F56B71]/10 text-[#F56B71] p-2.5 rounded flex-shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">{certificationTitle}</h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{certificationValue}</p>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Gambar */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-lg overflow-hidden shadow-xl border border-slate-100 bg-slate-50 p-2">
              <img src={imageUrl} alt={imageAlt} className="w-full h-[400px] object-cover rounded" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default OrganizationProfile;