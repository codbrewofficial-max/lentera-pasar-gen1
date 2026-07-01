'use client';

import React from 'react';
import { Sparkles, Palette, Instagram, Laptop, Camera, Heart } from 'lucide-react';

export interface CasualPortfolioCategoryProps {
  title?: string;
  description?: string;
}

export function CasualPortfolioCategory({
  title = 'Kategori Portofolio Kreatif',
  description = 'Kami membagi portofolio kami menjadi beberapa bidang keahlian utama untuk memudahkan kamu menemukan inspirasi visual yang cocok untuk bidang jualan tokomu.',
}: CasualPortfolioCategoryProps) {
  
  const categories = [
    {
      name: 'Branding & Kemasan',
      desc: 'Desain logo, maskot, serta stiker & box kemasan produk jualan.',
      icon: <Palette className="w-5 h-5 text-[#649FF6]" />,
      color: '#649FF6',
      bg: 'bg-[#649FF6]/10',
      count: '42 Project selesai'
    },
    {
      name: 'Sosial Media',
      desc: 'Desain konten Instagram, video pendek TikTok, & copywriting asyik.',
      icon: <Instagram className="w-5 h-5 text-[#F56B71]" />,
      color: '#F56B71',
      bg: 'bg-[#F56B71]/10',
      count: '88 Akun tumbuh'
    },
    {
      name: 'Website Desain',
      desc: 'Landing page interaktif untuk jualan online, portofolio, dsb.',
      icon: <Laptop className="w-5 h-5 text-[#B283AF]" />,
      color: '#B283AF',
      bg: 'bg-[#B283AF]/10',
      count: '24 Situs meluncur'
    },
    {
      name: 'Foto & Video Produk',
      desc: 'Sesi dokumentasi produk dengan props estetik dan pencahayaan alami.',
      icon: <Camera className="w-5 h-5 text-[#649FF6]" />,
      color: '#649FF6',
      bg: 'bg-[#649FF6]/10',
      count: '54 Sesi foto ceria'
    }
  ];

  return (
    <section id="CasualPortfolioCategory" className="py-16 bg-gray-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-[#649FF6]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-sm font-bold text-[#B283AF] uppercase tracking-widest block font-mono">
            BIDANG SPESIALISASI
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
            {title}
          </h2>
          <p className="font-sans text-base text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* 4 Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {categories.map((cat, index) => (
            <div
              key={cat.name}
              className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.bg}`}>
                  {cat.icon}
                </div>
                <div>
                  <h4 className="font-sans font-extrabold text-base text-gray-950">
                    {cat.name}
                  </h4>
                  <p className="font-sans text-xs text-gray-500 mt-1.5 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider">
                <span>{cat.count}</span>
                <Heart className="w-3.5 h-3.5 text-[#F56B71]/40 hover:text-[#F56B71] cursor-pointer" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
