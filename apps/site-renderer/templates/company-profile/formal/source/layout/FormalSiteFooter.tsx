import React from "react";
import Link from "next/link";
import { Shield, Mail, Phone, MapPin, Clock } from "lucide-react";

export interface FormalSiteFooterProps {
  getHref: (path: string) => string;
  businessName: string;
  taglineLabel?: string;
  logoUrl?: string;
  description: string;
  establishedYear?: string;
  founderName?: string;
  address: string;
  email: string;
  phone: string;
  workingHours: string;
}

const QUICK_LINKS = [
  { label: "Beranda", path: "/" },
  { label: "Tentang Kami", path: "/about" },
  { label: "Layanan Korporasi", path: "/services" },
  { label: "Portofolio Proyek", path: "/portfolio" },
  { label: "Artikel / Pemikiran", path: "/articles" },
  { label: "Kontak Hubung", path: "/contact" },
];

export const FormalSiteFooter: React.FC<FormalSiteFooterProps> = ({
  getHref,
  businessName,
  taglineLabel = "Consulting Group",
  logoUrl,
  description,
  establishedYear,
  founderName,
  address,
  email,
  phone,
  workingHours,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Company Brief */}
          <div className="md:col-span-5 flex flex-col space-y-4">
            <Link href={getHref("/")} className="flex items-center space-x-2.5">
              {logoUrl ? (
                <img src={logoUrl} alt={businessName} className="w-8 h-8 rounded object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="bg-[#649FF6] text-white p-2 rounded">
                  <Shield className="w-5 h-5" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-semibold text-lg text-white leading-tight">{businessName}</span>
                <span className="text-[9px] text-[#649FF6] font-mono tracking-wider uppercase leading-none">{taglineLabel}</span>
              </div>
            </Link>
            <p className="text-sm font-light leading-relaxed text-slate-400">{description}</p>
            {(establishedYear || founderName) && (
              <div className="text-xs text-slate-500 font-mono">
                {establishedYear ? `Didirikan pada tahun ${establishedYear}` : "Didirikan"}
                {founderName ? ` oleh ${founderName}` : ""}
              </div>
            )}
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 flex flex-col space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Navigasi Cepat</h3>
            <ul className="space-y-2 text-sm font-light">
              {QUICK_LINKS.map((link) => (
                <li key={link.path}>
                  <Link href={getHref(link.path)} className="hover:text-[#649FF6] hover:underline transition-all">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 flex flex-col space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Informasi Kontak</h3>
            <div className="space-y-3 text-sm font-light text-slate-400">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#649FF6] mt-0.5 flex-shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#649FF6] flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-[#649FF6] transition-colors">
                  {email}
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#649FF6] flex-shrink-0" />
                <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="hover:text-[#649FF6] transition-colors">
                  {phone}
                </a>
              </div>
              <div className="flex items-start space-x-2.5 pt-1 border-t border-slate-800">
                <Clock className="w-4 h-4 text-[#F56B71] mt-0.5 flex-shrink-0" />
                <span className="text-xs font-mono">{workingHours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="border-t border-slate-800 bg-slate-950 py-6 text-xs text-center text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>
            &copy; {currentYear} {businessName}. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <p className="mt-1 text-[10px] text-slate-600">
            Layanan Korporasi Profesional &middot; Legalitas &middot; Restrukturisasi &middot; Kepatuhan ESG
          </p>
        </div>
      </div>
    </footer>
  );
};
export default FormalSiteFooter;
