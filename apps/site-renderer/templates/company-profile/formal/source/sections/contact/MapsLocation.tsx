import React from "react";
import { Globe, MapPin } from "lucide-react";
import { companyData as defaultCompanyData } from "../../data/companyProfileData";
import type { CompanyData } from "../../lib/types";
import { SectionHeading } from "../../shared/SectionHeading";

interface MapsLocationProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  company?: CompanyData;
  mapsHref?: string;
}

export const MapsLocation: React.FC<MapsLocationProps> = ({
  title = "Lokasi Kantor Pusat Strategis",
  subtitle = "Temukan lokasi bisnis melalui informasi peta berikut.",
  badge = "Akses Fisik",
  company = defaultCompanyData,
  mapsHref = "https://maps.google.com",
}) => {
  return (
    <section id="contact-maps" className="py-12 md:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="secondary" />
        <div className="bg-white p-2 border border-slate-200 rounded-none shadow-md overflow-hidden">
          <div className="aspect-[16/9] w-full min-h-[300px] md:min-h-[450px] relative rounded-none bg-slate-100 overflow-hidden">
            {company.contact.mapEmbedUrl ? (
              <iframe src={company.contact.mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer" title={`${company.name} map`} className="absolute inset-0 w-full h-full" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-center p-8 text-slate-500 text-sm">Embed peta belum diisi di profil bisnis.</div>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-white px-6 py-4 rounded-none border border-slate-150 gap-4">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-[#1E3A5F] flex-shrink-0" />
            <span className="text-xs md:text-sm text-slate-600 font-light leading-snug">{company.contact.address}</span>
          </div>
          <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="text-xs font-mono font-semibold text-[#1E3A5F] hover:underline uppercase tracking-wider inline-flex items-center space-x-1"><Globe className="w-4 h-4" /><span>Buka Google Maps</span></a>
        </div>
      </div>
    </section>
  );
};
export default MapsLocation;
