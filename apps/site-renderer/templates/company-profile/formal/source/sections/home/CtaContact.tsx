import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../../shared/Button";
import { companyData } from "../../data/companyProfileData";

export interface HomeCtaContactProps {
  title?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  whatsappLabel?: string;
  whatsappHref?: string;
  footnote?: string;
}

export const CtaContact: React.FC<HomeCtaContactProps> = ({
  title = "Siap Mengamankan Aspek Legalitas & Mengoptimalkan Organisasi Bisnis Anda?",
  description = "Hubungi dewan penasihat senior kami hari ini untuk menjadwalkan sesi diskusi awal yang sepenuhnya rahasia (NDA-secured).",
  primaryCtaLabel = "Konsultasi Sekarang",
  primaryCtaHref = "/contact",
  whatsappLabel = "Hubungi via WhatsApp",
  whatsappHref = `https://wa.me/${companyData.contact.whatsapp.replace(/[^0-9]/g, "")}`,
  footnote = "Respons dalam 1x24 jam kerja • Bebas biaya komitmen diagnostik awal",
}) => {
  return (
    <section 
      id="home-cta-contact" 
      className="py-16 md:py-20 bg-slate-900 text-white relative overflow-hidden"
    >
      {/* Subtle patterns */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#F56B71_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#649FF6] rounded-full filter blur-[120px] opacity-10" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight mb-4 text-white max-w-2xl">
          {title}
        </h2>

        <p className="text-slate-300 font-light text-base md:text-lg mb-8 max-w-xl leading-relaxed">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
          <Button 
            href={primaryCtaHref} 
            variant="secondary" 
            size="lg" 
            iconRight={<ArrowRight className="w-5 h-5" />}
          >
            {primaryCtaLabel}
          </Button>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-medium transition-all duration-200 px-8 py-3 text-base rounded border border-white/20 text-white hover:bg-white/5 min-h-[44px]"
          >
            {whatsappLabel}
          </a>
        </div>

        <div className="mt-8 text-xs text-slate-500 font-mono">
          {footnote}
        </div>
      </div>
    </section>
  );
};
export default CtaContact;
