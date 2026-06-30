import React from "react";
import { Star, Quote } from "lucide-react";
import { testimonialData } from "../../data/companyProfileData";
import { SectionHeading } from "../../shared/SectionHeading";
import { Card } from "../../shared/Card";
import type { TestimonialItem } from "../../lib/types";

export interface HomeTrustProofProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  testimonials?: TestimonialItem[];
}

export const TrustProof: React.FC<HomeTrustProofProps> = ({
  title = "Kepercayaan dari Para Pemimpin Industri",
  subtitle = "Mengapa dewan komisaris, direksi operasional, dan manajer kepatuhan di Indonesia mengandalkan keahlian kami.",
  badge = "Jaminan Mutu",
  testimonials = testimonialData,
}) => {
  // Testimonial/trust proof maksimal 5 item
  const limitedTestimonials = testimonials.slice(0, 5);

  return (
    <section id="home-trust-proof" className="py-16 md:py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeading
          title={title}
          subtitle={subtitle}
          badge={badge}
          badgeVariant="primary"
        />

        {/* Testimonials Grid Layout - 3 columns, then wrapped nicely */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {limitedTestimonials.map((test) => (
            <Card
              key={test.id}
              className="flex flex-col h-full p-8 bg-white border border-slate-100 shadow-sm justify-between relative"
              hoverEffect={true}
            >
              {/* Quote icon watermark */}
              <div className="absolute top-6 right-6 text-[#649FF6]/10">
                <Quote className="w-10 h-10 transform scale-x-[-1]" />
              </div>

              <div className="flex flex-col space-y-4">
                {/* Star rating */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 ${
                        idx < test.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-slate-600 font-light text-sm md:text-base leading-relaxed italic">
                  &ldquo;{test.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center space-x-3.5">
                {/* Standard formal initials as placeholder avatar */}
                <div className="w-10 h-10 rounded bg-[#649FF6]/10 text-[#649FF6] font-mono text-xs font-bold flex items-center justify-center border border-[#649FF6]/20">
                  {test.name.split(" ").slice(0, 2).map(n => n[0]).join("") || "IC"}
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-slate-900 truncate">
                    {test.name}
                  </span>
                  <span className="text-xs text-slate-500 truncate font-mono">
                    {test.role}, <span className="text-[#649FF6] font-medium">{test.company}</span>
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Subtle trust badge list */}
        <div className="mt-16 pt-8 border-t border-slate-100 flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60">
          <span className="text-xs font-mono font-bold text-slate-400 tracking-widest uppercase">Kemitraan Terintegrasi</span>
          <span className="text-sm font-semibold font-sans text-slate-500">KEMENKUMHAM RI</span>
          <span className="text-sm font-semibold font-sans text-slate-500">OJK - PORTAL KEPATUHAN</span>
          <span className="text-sm font-semibold font-sans text-slate-500">BKPM - INVEST INDONESIA</span>
          <span className="text-sm font-semibold font-sans text-slate-500">IKATAN KONSULTAN PAJAK</span>
        </div>

      </div>
    </section>
  );
};
export default TrustProof;
