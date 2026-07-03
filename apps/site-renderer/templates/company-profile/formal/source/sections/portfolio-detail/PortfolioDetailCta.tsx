import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../../shared/Button";

interface PortfolioDetailCtaProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export const PortfolioDetailCta: React.FC<PortfolioDetailCtaProps> = ({
  title = "Tertarik dengan Proyek Seperti Ini?",
  description = "Diskusikan kebutuhan Anda bersama tim kami untuk mendapatkan solusi yang tepat.",
  ctaLabel = "Hubungi Kami",
  ctaHref = "/contact",
}) => (
  <section id="portfolio-detail-cta" className="py-16 bg-slate-900 text-white relative overflow-hidden">
    <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#1E3A5F_1px,transparent_1px)] [background-size:24px_24px]" />
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3 text-white">{title}</h2>
      <p className="text-slate-300 font-light leading-relaxed mb-6 max-w-xl mx-auto">{description}</p>
      <Button href={ctaHref} variant="secondary" size="lg" iconRight={<ArrowRight className="w-4 h-4" />}>
        {ctaLabel}
      </Button>
    </div>
  </section>
);
export default PortfolioDetailCta;
