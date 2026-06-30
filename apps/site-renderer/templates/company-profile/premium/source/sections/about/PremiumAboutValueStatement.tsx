'use client';

import React from 'react';
import { Compass, Sparkles, BookOpen } from 'lucide-react';

interface PremiumAboutValueStatementProps {
  title?: string;
  description?: string;
  valueOne?: string;
  valueTwo?: string;
  valueThree?: string;
}

export function PremiumAboutValueStatement({
  title = "Nilai Dasar Keberlanjutan",
  description = "Tiga komitmen yang melandasi setiap helai kertas konsep, simulasi digital, hingga koordinasi fisik tukang kayu di lapangan.",
  valueOne = "Kejujuran Material Tanpa Lapisan Palsu",
  valueTwo = "Kemitraan Komunitas & Pengrajin Lokal",
  valueThree = "Efisiensi Energi Pasif Alami"
}: PremiumAboutValueStatementProps) {
  return (
    <section id="premium-about-value-statement" className="py-24 md:py-32 bg-[#0E0E0F] text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Block */}
        <div className="max-w-3xl mb-20 space-y-4">
          <span className="text-[10px] font-bold tracking-[0.3em] text-[#F56B71] uppercase block">KOMITMEN UTAMA</span>
          <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight">{title}</h2>
          <p className="text-stone-400 text-xs md:text-sm leading-relaxed font-light font-sans">
            {description}
          </p>
        </div>

        {/* 3 Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="border border-white/5 bg-[#121214] p-8 space-y-6 hover:border-[#649FF6]/40 transition-all duration-300">
            <div className="p-3 bg-[#649FF6]/10 w-fit">
              <Compass className="w-5 h-5 text-[#649FF6]" />
            </div>
            <h3 className="text-lg font-serif font-light text-white">{valueOne}</h3>
            <p className="text-xs text-stone-400 leading-relaxed font-light font-sans">
              Kami menolak penggunaan bahan pengganti sintetis yang meniru rupa asli. Jika kami menggunakan kayu, itu merupakan ulin padat reklamasi; jika batu, itu andesit berpori alami asli pegunungan Indonesia.
            </p>
          </div>

          {/* Card 2 */}
          <div className="border border-white/5 bg-[#121214] p-8 space-y-6 hover:border-[#B283AF]/40 transition-all duration-300">
            <div className="p-3 bg-[#B283AF]/10 w-fit">
              <Sparkles className="w-5 h-5 text-[#B283AF]" />
            </div>
            <h3 className="text-lg font-serif font-light text-white">{valueTwo}</h3>
            <p className="text-xs text-stone-400 leading-relaxed font-light font-sans">
              Kami bermitra erat dengan seniman batu di muntilan, pengrajin anyaman rotan di Cirebon, dan ahli kayu ulin di Bali untuk memberdayakan ekonomi lokal sekaligus melestarikan khazanah detail kriya nusantara.
            </p>
          </div>

          {/* Card 3 */}
          <div className="border border-white/5 bg-[#121214] p-8 space-y-6 hover:border-[#F56B71]/40 transition-all duration-300">
            <div className="p-3 bg-[#F56B71]/10 w-fit">
              <BookOpen className="w-5 h-5 text-[#F56B71]" />
            </div>
            <h3 className="text-lg font-serif font-light text-white">{valueThree}</h3>
            <p className="text-xs text-stone-400 leading-relaxed font-light font-sans">
              Kami mendesain bangunan dengan sirkulasi udara pasif untuk meredam pemakaian pendingin ruangan buatan. Kami memastikan setiap ruang mendapatkan pencahayaan tidak langsung alami yang mendinginkan suhu batin.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
