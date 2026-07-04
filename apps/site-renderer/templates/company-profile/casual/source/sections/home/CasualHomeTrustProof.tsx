'use client';

import React from 'react';
import { Star, Quote, ThumbsUp, Heart, Sparkles } from 'lucide-react';

export interface CasualTestimonialItem {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

export interface CasualBrandItem {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface CasualMetricItem {
  label?: string;
  value?: string;
}

export interface CasualHomeTrustProofProps {
  title?: string;
  description?: string;
  badge?: string;
  metrics?: CasualMetricItem[];
  testimonials?: CasualTestimonialItem[];
  brands?: CasualBrandItem[];
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const METRIC_ICONS = [ThumbsUp, Star, Heart, Sparkles];
const METRIC_ACCENTS = ['#649FF6', '#F56B71', '#B283AF', '#649FF6'];

export function CasualHomeTrustProof({
  title,
  description,
  badge = 'PENCAPAIAN KAMI',
  metrics = [],
  testimonials = [],
  brands = [],
  imageUrl,
  ctaLabel,
  ctaHref = '/contact',
}: CasualHomeTrustProofProps) {
  const badgeColors = ['bg-[#F56B71]/10 text-[#F56B71]', 'bg-[#649FF6]/10 text-[#649FF6]', 'bg-[#B283AF]/10 text-[#B283AF]'];

  // Section ini murni menampilkan apa yang ada: metrics dari field repeater section,
  // testimonials & brands dari data CRUD (Testimonial/Brand Partner). Tidak ada lagi
  // testimoni contoh/fiktif sebagai fallback ketika data kosong.
  if (!title && !description && metrics.length === 0 && testimonials.length === 0 && brands.length === 0) {
    return null;
  }

  return (
    <section id="CasualHomeTrustProof" className="bg-gradient-to-b from-white to-[#649FF6]/5 relative overflow-hidden">
      {imageUrl ? (
        <div className="relative py-16 md:py-20 mb-4 overflow-hidden text-white text-center">
          <div className="absolute inset-0">
            <img src={imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gray-950/70" />
          </div>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
            <span className="text-sm font-bold text-white/80 uppercase tracking-widest block font-mono">{badge}</span>
            {title && <h2 className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight">{title}</h2>}
            {description && <p className="font-sans text-base text-gray-200 leading-relaxed">{description}</p>}
            {ctaLabel && (
              <div className="pt-2">
                <a href={ctaHref} className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-100 transition-all">
                  {ctaLabel}
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="absolute top-10 left-1/3 w-32 h-32 rounded-full bg-[#B283AF]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-[#F56B71]/10 blur-3xl pointer-events-none" />
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 md:py-16">
        {!imageUrl && (title || description) && (
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-sm font-bold text-[#649FF6] uppercase tracking-widest block font-mono">
              {badge}
            </span>
            {title && <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">{title}</h2>}
            {description && <p className="font-sans text-base text-gray-600 leading-relaxed">{description}</p>}
            {ctaLabel && (
              <div className="pt-2">
                <a href={ctaHref} className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 px-6 py-3 rounded-full text-sm font-bold transition-all">
                  {ctaLabel}
                </a>
              </div>
            )}
          </div>
        )}

        {metrics.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            {metrics.map((metric, idx) => {
              const Icon = METRIC_ICONS[idx % METRIC_ICONS.length];
              const accent = METRIC_ACCENTS[idx % METRIC_ACCENTS.length];
              return (
                <div key={idx} className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-md flex flex-col items-center justify-center text-center group hover:scale-[1.03] transition-transform duration-300">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${accent}1A`, color: accent }}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-sans font-extrabold text-4xl sm:text-5xl text-gray-950 tracking-tight">{metric.value}</span>
                  <span className="text-sm font-bold mt-2 block font-sans" style={{ color: accent }}>{metric.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {testimonials.length > 0 && (
          <>
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">
                APA KATA MEREKA
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((test, index) => (
                <div key={index} className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm relative flex flex-col justify-between">
                  <div className="absolute top-6 right-8 text-gray-100">
                    <Quote className="w-12 h-12 rotate-180 opacity-40 fill-gray-100" />
                  </div>
                  <p className="font-sans text-sm text-gray-600 leading-relaxed italic relative z-10 mb-6">{`"${test.quote}"`}</p>
                  <div className="flex items-center gap-3.5 pt-4 border-t border-gray-50">
                    <img src={test.avatar} alt={test.author} className="w-11 h-11 rounded-full object-cover border-2 border-gray-100" />
                    <div>
                      <h4 className="font-sans font-bold text-sm text-gray-950 leading-tight">{test.author}</h4>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${badgeColors[index % badgeColors.length]}`}>
                        {test.role}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {brands.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-center grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all">
                {brand.logoUrl ? (
                  <img src={brand.logoUrl} alt={brand.name} className="h-8 md:h-10 w-auto object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-sm font-bold font-sans text-gray-500">{brand.name}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
