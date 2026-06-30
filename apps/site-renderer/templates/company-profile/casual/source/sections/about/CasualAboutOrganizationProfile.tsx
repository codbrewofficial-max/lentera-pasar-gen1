'use client';

import React from 'react';
import { Sparkles, Laugh, Coffee, Heart } from 'lucide-react';

export interface CasualAboutOrganizationProfileProps {
  title?: string;
  description?: string;
  imageUrl?: string;
}

export function CasualAboutOrganizationProfile({
  title = 'Mengenal Budaya Kerja Studio Kreatif Kami',
  description = 'Di Ruang Karsa, kami tidak menganggap pekerjaan desain sebagai urusan kaku berdasar kontrak semata. Kami percaya kolaborasi kreatif terbaik tumbuh dari kedekatan emosional dan suasana kerja yang menyenangkan. Kami bekerja tanpa sekat, berdiskusi sambil ngemil jajanan pasar, dan selalu melibatkan klien dalam proses eksperimen visual kami.',
  imageUrl = 'https://picsum.photos/seed/org/800/600',
}: CasualAboutOrganizationProfileProps) {
  
  const values = [
    {
      icon: <Coffee className="w-5 h-5 text-[#649FF6]" />,
      title: 'Diskusi Tanpa Jarak',
      desc: 'Bebas curhat ide apa saja tanpa perlu takut terkesan konyol.',
      bgColor: 'bg-[#649FF6]/10'
    },
    {
      icon: <Laugh className="w-5 h-5 text-[#F56B71]" />,
      title: 'Suasana Ceria',
      desc: 'Kami percaya pikiran yang gembira melahirkan visual yang ceria.',
      bgColor: 'bg-[#F56B71]/10'
    },
    {
      icon: <Heart className="w-5 h-5 text-[#B283AF]" />,
      title: 'Peduli UMKM Lokal',
      desc: 'Kami bangga melihat bisnis kecil tetangga bisa tumbuh berkembang.',
      bgColor: 'bg-[#B283AF]/10'
    }
  ];

  return (
    <section id="CasualAboutOrganizationProfile" className="py-20 bg-white relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 w-80 h-80 rounded-full bg-[#F56B71]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text/Content Column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-sm font-bold text-[#B283AF] uppercase tracking-widest block font-mono">
              PROFIL ORGANISASI
            </span>
            
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight leading-tight">
              {title}
            </h2>

            <p className="font-sans text-base text-gray-600 leading-relaxed">
              {description}
            </p>

            {/* List of Culture Items */}
            <div className="space-y-4 pt-2">
              {values.map((val, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${val.bgColor}`}>
                    {val.icon}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-sm text-gray-950">
                      {val.title}
                    </h4>
                    <p className="font-sans text-xs text-gray-500 mt-1">
                      {val.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Column */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative">
              {/* Background solid decoration */}
              <div className="absolute inset-0 rounded-[40px] bg-[#B283AF] -translate-x-4 translate-y-4 rotate-2 -z-10" />
              
              {/* Main Image */}
              <div className="w-full max-w-lg aspect-[4/3] rounded-[40px] overflow-hidden border-4 border-white shadow-xl bg-gray-100">
                <img
                  src={imageUrl}
                  alt="Budaya Kerja Ruang Karsa"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-4 -left-4 bg-[#649FF6] text-white py-2.5 px-4 rounded-2xl shadow-lg -rotate-3 text-xs font-bold font-sans">
                Kreativitas Tanpa Sekat! 🎨
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
