'use client';

import React from 'react';

interface PremiumPortfolioCaseHighlightProps {
  title?: string;
  description?: string;
  imageUrl?: string;
}

export function PremiumPortfolioCaseHighlight({
  title = "Studi Kasus Utama: The Alila Sanctuary",
  description = "Mewujudkan harmoni radikal di tepi tebing Uluwatu, Bali. Tantangan utama proyek ini adalah kecepatan angin laut ekstrem yang membawa korosi garam tinggi, serta kebutuhan untuk meniadakan sekat visual ruangan demi mendapatkan panorama samudera tak berujung.\n\nSolusi kami adalah mendesain struktur rangka baja ringan tersembunyi dengan treatment anti-korosi khusus kapal laut, dikombinasikan dengan pemakaian kaca panel setebal 15mm yang mampu meredam tekanan angin badai secara optimal sembari membiarkan sirkulasi udara alami mengalir lewat koridor kisi-kisi ulin.",
  imageUrl = "https://picsum.photos/seed/sanctuaryhigh/1200/800"
}: PremiumPortfolioCaseHighlightProps) {
  return (
    <section id="premium-portfolio-case-highlight" className="py-24 md:py-32 bg-[#FAF9F6] text-[#121212]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Cover image with elegant framing */}
          <div className="lg:col-span-6 relative">
            <div className="absolute top-4 left-4 w-full h-full border border-stone-300 pointer-events-none z-0" />
            <div className="relative z-10 bg-stone-100 aspect-[3/2] overflow-hidden shadow-2xl">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover filter brightness-95"
              />
            </div>
            {/* Overlay metadata */}
            <div className="absolute bottom-6 left-6 z-20 bg-[#0E0E0F] text-white p-6 shadow-2xl max-w-xs hidden sm:block">
              <span className="text-[9px] tracking-[0.3em] uppercase block text-stone-400 mb-1">PROYEK TERBAIK</span>
              <span className="text-sm font-serif tracking-wide block">Alila Sanctuary</span>
              <span className="text-[10px] text-[#649FF6] tracking-widest uppercase mt-2 block">Pemenang IAI Awards</span>
            </div>
          </div>

          {/* Core case details content */}
          <div className="lg:col-span-6 space-y-8">
            <div className="flex items-center space-x-2">
              <span className="h-[1px] w-8 bg-[#F56B71]" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-[#F56B71] uppercase">MAHAKARYA LANDMARK</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight text-stone-900 leading-tight">
              {title}
            </h2>

            <div className="text-stone-600 text-sm md:text-base leading-relaxed space-y-4 font-sans font-light whitespace-pre-line">
              {description}
            </div>

            <div className="pt-6 grid grid-cols-2 gap-8 border-t border-stone-200">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#649FF6] block mb-2">Tantangan Kultural</span>
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  Menjaga proporsi arsitektur Bali tradisional sembari menerapkan estetika minimalis modern tropis global.
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#B283AF] block mb-2">Penyelesaian Teknis</span>
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  Pemasangan struktur kantilever sepanjang 6 meter untuk menciptakan sensasi melayang di atas tebing samudera Bali.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
