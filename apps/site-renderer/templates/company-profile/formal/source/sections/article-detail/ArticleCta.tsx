import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../../shared/Button";

interface ArticleCtaProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export const ArticleCta: React.FC<ArticleCtaProps> = ({
  title = "Butuh Bantuan Lebih Lanjut?",
  description = "Hubungi kami untuk membahas kebutuhan Anda secara langsung.",
  ctaLabel = "Hubungi Kami",
  ctaHref = "/contact",
}) => {
  return (
    <section id="article-detail-cta" className="py-14 md:py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#8A6D3B_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">{title}</h2>
        <p className="text-slate-300 font-light leading-relaxed max-w-2xl mx-auto mb-8">{description}</p>
        <Button href={ctaHref} iconRight={<ArrowRight className="w-4 h-4" />}>{ctaLabel}</Button>
      </div>
    </section>
  );
};
export default ArticleCta;
