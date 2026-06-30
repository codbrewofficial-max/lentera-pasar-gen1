import React from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "../../shared/Button";
import { companyData } from "../../data/companyProfileData";

export interface HomeHeroProps {
  eyebrow?: string;
  headingLine1?: string;
  headingHighlight?: string;
  headingLine3?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  imageUrl?: string;
  imageAlt?: string;
  visualLabel?: string;
  visualText?: string;
}

export const Hero: React.FC<HomeHeroProps> = ({
  eyebrow = "Mitra Korporat Terpercaya Indonesia",
  headingLine1 = "Navigasi Hukum &",
  headingHighlight = "Manajemen Strategis",
  headingLine3 = "Bisnis Anda",
  description = `${companyData.description} Kami mendampingi pertumbuhan korporasi Anda melalui layanan kepatuhan hukum terpercaya dan tata kelola berstandar dunia.`,
  primaryCtaLabel = "Layanan Korporat",
  primaryCtaHref = "/services",
  secondaryCtaLabel = "Konsultasi Gratis",
  secondaryCtaHref = "/contact",
  imageUrl = "https://picsum.photos/seed/integra-hero/600/600",
  imageAlt = "Integra Corporate Consulting",
  visualLabel = "Kantor Pusat Kami",
  visualText = "Sudirman Central Business District, Jakarta",
}) => {
  return (
    <section 
      id="home-hero"
      className="relative bg-slate-900 text-white overflow-hidden py-20 md:py-32 lg:py-40"
    >
      {/* Decorative vector background */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#649FF6_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#649FF6] rounded-full filter blur-[150px] opacity-20" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#F56B71] rounded-full filter blur-[150px] opacity-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Column */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 text-xs md:text-sm text-[#649FF6] font-medium tracking-wide w-fit">
              <ShieldCheck className="w-4 h-4 text-[#F56B71]" />
              <span>{eyebrow}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight text-white">
              {headingLine1} <br />
              <span className="text-[#649FF6]">{headingHighlight}</span> <br />
              {headingLine3}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-xl">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button href={primaryCtaHref} variant="primary" iconRight={<ArrowRight className="w-4 h-4" />}>
                {primaryCtaLabel}
              </Button>
              <Button href={secondaryCtaHref} variant="outline" className="border-white/20 text-white hover:bg-white/5">
                {secondaryCtaLabel}
              </Button>
            </div>
          </div>

          {/* Visual Highlight Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-lg overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 p-2">
              <div className="aspect-video lg:aspect-square relative rounded bg-slate-900 overflow-hidden flex items-center justify-center">
                {/* Simulated high-quality placeholder image with corporate stats overlay */}
                <img 
                  src={imageUrl} 
                  alt={imageAlt} 
                  className="object-cover w-full h-full opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-slate-950/80 backdrop-blur-md rounded border border-slate-800">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">{visualLabel}</p>
                  <p className="text-sm font-semibold text-white mt-1">{visualText}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
