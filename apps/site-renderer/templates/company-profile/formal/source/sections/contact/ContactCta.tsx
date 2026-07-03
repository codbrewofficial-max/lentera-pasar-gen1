import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "../../shared/Button";

interface ContactCtaProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export const ContactCta: React.FC<ContactCtaProps> = ({
  title = "Siap Menghubungi Kami?",
  description = "Gunakan tombol berikut untuk menuju saluran kontak utama bisnis.",
  ctaLabel = "Hubungi Sekarang",
  ctaHref = "/contact",
}) => {
  return (
    <section id="contact-cta" className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#1E3A5F_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">{title}</h2>
        <p className="text-slate-300 font-light leading-relaxed max-w-2xl mx-auto mb-8">{description}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button href={ctaHref} size="lg" iconRight={<ArrowRight className="w-4 h-4" />}>{ctaLabel}</Button>
        </div>
      </div>
    </section>
  );
};
export default ContactCta;
