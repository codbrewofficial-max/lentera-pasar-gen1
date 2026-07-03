'use client';

import React from 'react';
import { Star, MessageSquare, Quote, ThumbsUp, Heart } from 'lucide-react';

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

export interface CasualHomeTrustProofProps {
  title?: string;
  description?: string;
  metricOneLabel?: string;
  metricOneValue?: string;
  metricTwoLabel?: string;
  metricTwoValue?: string;
  metricThreeLabel?: string;
  metricThreeValue?: string;
  testimonials?: CasualTestimonialItem[];
  brands?: CasualBrandItem[];
}

export function CasualHomeTrustProof({
  title = 'Bukti Nyata Hasil Kolaborasi',
  description = 'Kami mengukur kesuksesan kami dari kebahagiaan para pemilik usaha yang kami bantu. Berikut adalah beberapa pencapaian tim Ruang Karsa bersama klien kami.',
  metricOneLabel = 'UMKM Terbantu',
  metricOneValue = '200+',
  metricTwoLabel = 'Rating Kepuasan',
  metricTwoValue = '4.9/5',
  metricThreeLabel = 'Rata-rata Kenaikan Omset',
  metricThreeValue = '35%+',
  testimonials: testimonialsProp,
  brands = [],
}: CasualHomeTrustProofProps) {
  
  const badgeColors = ['bg-[#F56B71]/10 text-[#F56B71]', 'bg-[#649FF6]/10 text-[#649FF6]', 'bg-[#B283AF]/10 text-[#B283AF]'];
  const defaultTestimonials = [
    {
      quote: 'Semenjak feed Instagram dirapihin sama Ruang Karsa, DM pesanan catering Dapur Mama Selera melonjak tajam! Pelanggan bilang fotonya menggugah selera banget.',
      author: 'Ibu Ratna',
      role: 'Owner Dapur Mama Selera',
      avatar: 'https://picsum.photos/seed/ratna/100/100',
    },
    {
      quote: 'Desain logo dan botol kopi susu kami disukai anak-anak muda Bandung. Sangat casual, friendly, dan khas anak nongkrong banget! Sukses terus Ruang Karsa.',
      author: 'Mas Budi',
      role: 'Founder Kopi Kenangan Senja',
      avatar: 'https://picsum.photos/seed/budi/100/100',
    },
    {
      quote: 'Jasa pembuatan website-nya gercep dan edukatif. Dibimbing dari nol sampai paham cara upload katalog tenun sendiri. Sangat recommended buat UMKM gaptek!',
      author: 'Mbak Dewi',
      role: 'Pemilik Tenun Karsa Jaya',
      avatar: 'https://picsum.photos/seed/dewi/100/100',
    }
  ];

  const testimonials = (testimonialsProp && testimonialsProp.length > 0 ? testimonialsProp : defaultTestimonials);

  return (
    <section id="CasualHomeTrustProof" className="py-20 bg-gradient-to-b from-white to-[#649FF6]/5 relative overflow-hidden">
      {/* Decorative organic accents */}
      <div className="absolute top-10 left-1/3 w-32 h-32 rounded-full bg-[#B283AF]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-[#F56B71]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-sm font-bold text-[#649FF6] uppercase tracking-widest block font-mono">
            PENCAPAIAN KAMI
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
            {title}
          </h2>
          <p className="font-sans text-base text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Metrics Section: 3 playful bubble stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-md flex flex-col items-center justify-center text-center group hover:scale-[1.03] transition-transform duration-300">
            <div className="w-14 h-14 rounded-full bg-[#649FF6]/10 flex items-center justify-center text-[#649FF6] mb-4">
              <ThumbsUp className="w-6 h-6" />
            </div>
            <span className="font-sans font-extrabold text-4xl sm:text-5xl text-gray-950 tracking-tight">
              {metricOneValue}
            </span>
            <span className="text-sm font-bold text-[#649FF6] mt-2 block font-sans">
              {metricOneLabel}
            </span>
          </div>

          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-md flex flex-col items-center justify-center text-center group hover:scale-[1.03] transition-transform duration-300">
            <div className="w-14 h-14 rounded-full bg-[#F56B71]/10 flex items-center justify-center text-[#F56B71] mb-4">
              <Star className="w-6 h-6 fill-[#F56B71]" />
            </div>
            <span className="font-sans font-extrabold text-4xl sm:text-5xl text-gray-950 tracking-tight">
              {metricTwoValue}
            </span>
            <span className="text-sm font-bold text-[#F56B71] mt-2 block font-sans">
              {metricTwoLabel}
            </span>
          </div>

          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-md flex flex-col items-center justify-center text-center group hover:scale-[1.03] transition-transform duration-300">
            <div className="w-14 h-14 rounded-full bg-[#B283AF]/10 flex items-center justify-center text-[#B283AF] mb-4">
              <Heart className="w-6 h-6 fill-[#B283AF]" />
            </div>
            <span className="font-sans font-extrabold text-4xl sm:text-5xl text-gray-950 tracking-tight">
              {metricThreeValue}
            </span>
            <span className="text-sm font-bold text-[#B283AF] mt-2 block font-sans">
              {metricThreeLabel}
            </span>
          </div>

        </div>

        {/* Testimonials Title Banner */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">
            APA KATA MEREKA
          </span>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, index) => (
            <div
              key={index}
              className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm relative flex flex-col justify-between"
            >
              <div className="absolute top-6 right-8 text-gray-100">
                <Quote className="w-12 h-12 rotate-180 opacity-40 fill-gray-100" />
              </div>

              <p className="font-sans text-sm text-gray-600 leading-relaxed italic relative z-10 mb-6">
                {`"${test.quote}"`}
              </p>

              <div className="flex items-center gap-3.5 pt-4 border-t border-gray-50">
                <img
                  src={test.avatar}
                  alt={test.author}
                  className="w-11 h-11 rounded-full object-cover border-2 border-gray-100"
                />
                <div>
                  <h4 className="font-sans font-bold text-sm text-gray-950 leading-tight">
                    {test.author}
                  </h4>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${badgeColors[index % badgeColors.length]}`}>
                    {test.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Brand / Client logos dari data CRUD, hanya tampil kalau ada datanya */}
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
