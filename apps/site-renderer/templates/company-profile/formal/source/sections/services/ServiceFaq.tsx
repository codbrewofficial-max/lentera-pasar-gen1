import React from "react";
import { faqData as defaultFaqData } from "../../data/companyProfileData";
import type { FaqItem } from "../../lib/types";
import { SectionHeading } from "../../shared/SectionHeading";
import { FaqList } from "../../shared/FaqList";

interface ServiceFaqProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  faqs?: FaqItem[];
}

export const ServiceFaq: React.FC<ServiceFaqProps> = ({
  title = "Tanya Jawab Seputar Layanan",
  subtitle = "Temukan jawaban cepat atas pertanyaan umum seputar layanan.",
  badge = "Pertanyaan Umum",
  faqs = defaultFaqData,
}) => {
  return (
    <section id="services-faq" className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="primary" />
        <FaqList items={faqs.slice(0, 10)} />
      </div>
    </section>
  );
};
export default ServiceFaq;
