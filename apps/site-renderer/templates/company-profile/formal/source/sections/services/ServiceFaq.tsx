import React from "react";
import { faqData as defaultFaqData } from "../../data/companyProfileData";
import type { FaqItem } from "../../lib/types";
import { SectionHeading } from "../../shared/SectionHeading";
import { FaqList } from "../../shared/FaqList";
import { Button } from "../../shared/Button";

interface ServiceFaqProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  faqs?: FaqItem[];
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export const ServiceFaq: React.FC<ServiceFaqProps> = ({
  title = "Tanya Jawab Seputar Layanan",
  subtitle = "Temukan jawaban cepat atas pertanyaan umum seputar layanan.",
  badge = "Pertanyaan Umum",
  faqs = defaultFaqData,
  imageUrl,
  ctaLabel,
  ctaHref = "/contact",
}) => {
  return (
    <section id="services-faq" className="bg-slate-50">
      {imageUrl ? (
        <div className="relative py-16 md:py-20 mb-4 bg-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0">
            <img src={imageUrl} alt="" className="w-full h-full object-cover opacity-30" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950/90" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="primary" dark />
            {ctaLabel && (
              <div className="text-center -mt-6">
                <Button href={ctaHref} variant="secondary">{ctaLabel}</Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24">
          <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="primary" />
          {ctaLabel && (
            <div className="text-center -mt-6 mb-6">
              <Button href={ctaHref} variant="outline">{ctaLabel}</Button>
            </div>
          )}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <FaqList items={faqs.slice(0, 10)} />
      </div>
    </section>
  );
};
export default ServiceFaq;
