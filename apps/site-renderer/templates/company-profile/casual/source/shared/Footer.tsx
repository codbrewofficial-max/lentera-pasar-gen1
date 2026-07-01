import React from "react";
import Link from "next/link";
import { Sparkles, Mail, Phone, MapPin, Clock, Instagram, Facebook, Linkedin, Twitter, Globe, MessageSquare } from "lucide-react";

export interface FooterNavItem { pageKey: string; label: string; path: string; }

export interface FooterProps {
  navItems?: FooterNavItem[];
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
  instagramUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({
  getHref,
  businessName,
  taglineLabel = "Bisnis Lokal",
  logoUrl,
  description,
  establishedYear,
  founderName,
  address,
  email,
  phone,
  workingHours,
  instagramUrl,
  facebookUrl,
  linkedinUrl,
  twitterUrl,
  websiteUrl,
  navItems,
}) => {
  const currentYear = new Date().getFullYear();
  const DEFAULT_LINKS: FooterNavItem[] = [
    { pageKey: "home", label: "Beranda", path: "/" },
    { pageKey: "about", label: "Tentang Kami", path: "/about" },
    { pageKey: "services", label: "Layanan", path: "/services" },
    { pageKey: "portfolio", label: "Portofolio", path: "/portfolio" },
    { pageKey: "articles", label: "Artikel", path: "/articles" },
    { pageKey: "contact", label: "Hubungi Kami", path: "/contact" },
  ];
  const resolvedLinks = navItems && navItems.length > 0 ? navItems : DEFAULT_LINKS;

  const hasSocial = instagramUrl || facebookUrl || linkedinUrl || twitterUrl || websiteUrl;

  const socialBtn = "w-9 h-9 rounded-full bg-gray-100 hover:bg-[#649FF6] flex items-center justify-center text-gray-500 hover:text-white transition-all hover:scale-110 border border-gray-200 hover:border-transparent";

  return (
    <footer className="bg-white border-t-2 border-dashed border-gray-100 font-sans">
      {/* Top section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Col 1 — Brand */}
          <div className="space-y-4">
            <Link href={getHref("/")} className="flex items-center gap-2.5 group">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={businessName}
                  className="w-10 h-10 rounded-2xl object-cover shadow-sm"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#649FF6] to-[#B283AF] flex items-center justify-center shadow-md group-hover:rotate-6 transition-transform duration-300">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <p className="font-bold text-base text-gray-900 leading-tight">{businessName}</p>
                <p className="text-[10px] text-gray-400 font-medium">{taglineLabel}</p>
              </div>
            </Link>

            <p className="text-sm text-gray-500 leading-relaxed">{description}</p>

            {(establishedYear || founderName) && (
              <p className="text-xs text-gray-400">
                {establishedYear ? `Berdiri ${establishedYear}` : ""}
                {founderName ? ` · ${founderName}` : ""}
              </p>
            )}

            {/* Social icons */}
            {hasSocial && (
              <div className="flex items-center flex-wrap gap-2 pt-1">
                {instagramUrl && (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={socialBtn}>
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {facebookUrl && (
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={socialBtn}>
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {linkedinUrl && (
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={socialBtn}>
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {twitterUrl && (
                  <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter/X" className={socialBtn}>
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {websiteUrl && (
                  <a href={websiteUrl} target="_blank" rel="noopener noreferrer" aria-label="Website" className={socialBtn}>
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Col 2 — Navigation */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#649FF6]">Jelajahi</h3>
            <ul className="space-y-2.5">
              {resolvedLinks.map((link) => (
                <li key={link.pageKey}>
                  <Link
                    href={getHref(link.path)}
                    className="text-sm text-gray-600 hover:text-[#649FF6] transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-[#F56B71] transition-colors flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#F56B71]">Kontak</h3>
            <div className="space-y-3 text-sm text-gray-600">
              {address && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#649FF6] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{address}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#B283AF] shrink-0" />
                  <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="hover:text-[#649FF6] transition-colors">{phone}</a>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#F56B71] shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-[#649FF6] transition-colors break-all">{email}</a>
                </div>
              )}
              {workingHours && (
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#649FF6] shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-500 leading-relaxed">{workingHours}</span>
                </div>
              )}
            </div>

            {/* WhatsApp CTA */}
            {phone && (
              <a
                href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold bg-[#F56B71]/10 text-[#F56B71] hover:bg-[#F56B71] hover:text-white px-3 py-2 rounded-xl transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Chat WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="bg-gray-50 border-t border-gray-100 py-5 text-center space-y-1">
        <p className="text-xs text-gray-400">
          &copy; {currentYear} <span className="font-semibold text-gray-600">{businessName}</span> &mdash; Powered by{" "}
          <span className="font-semibold text-[#649FF6]">Lentera Pasar</span>
        </p>
        <p className="text-[10px] text-gray-300">
          Developed by the LabKerKomIT Community Team
        </p>
      </div>
    </footer>
  );
};
export default Footer;
