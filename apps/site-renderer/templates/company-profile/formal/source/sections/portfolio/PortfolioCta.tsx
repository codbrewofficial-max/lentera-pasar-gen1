import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../../shared/Button";

interface PortfolioCtaProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
}

export const PortfolioCta: React.FC<PortfolioCtaProps> = ({
  title = "Ingin Mendiskusikan Kebutuhan Anda?",
  description = "Hubungi kami untuk membahas kebutuhan dan rencana pekerjaan Anda.",
  ctaLabel = "Hubungi Kami",
  ctaHref = "/contact",
  imageUrl,
}) => {
  return (
    <section id="portfolio-cta" className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
      {imageUrl && (
        <div className="absolute inset-0">
          <img src={imageUrl} alt="" className="w-full h-full object-cover opacity-25" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-slate-950/80" />
        </div>
      )}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#8A6D3B_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">{title}</h2>
        <p className="text-slate-300 font-light leading-relaxed max-w-2xl mx-auto mb-8">{description}</p>
        <Button href={ctaHref} size="lg" iconRight={<ArrowRight className="w-4 h-4" />}>{ctaLabel}</Button>
      </div>
    </section>
  );
};
export default PortfolioCta;
