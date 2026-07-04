'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles, Instagram, Laptop, Camera } from 'lucide-react';
import { servicesData, ServiceItem } from '../../lib/dummy-data';

export interface CasualServicesGridProps {
  title?: string;
  description?: string;
  badge?: string;
  services?: ServiceItem[];
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function CasualServicesGrid({
  title = 'Pilihan Solusi yang Pas Buatmu',
  description = 'Mulai dari bisnis rumahan mikro sampai studio berkembang, kami punya opsi paket jitu yang transparan tanpa biaya siluman. Simak daftar layanan andalan kami di bawah ini.',
  badge = 'DAFTAR LAYANAN',
  services = servicesData,
  imageUrl,
  ctaLabel,
  ctaHref = '/contact',
}: CasualServicesGridProps) {
  
  // Mapping of icons dynamically
  const getIcon = (name: string, color: string) => {
    switch (name) {
      case 'Sparkles':
        return <Sparkles className="w-8 h-8 text-[#649FF6]" />;
      case 'Instagram':
        return <Instagram className="w-8 h-8 text-[#F56B71]" />;
      case 'Laptop':
        return <Laptop className="w-8 h-8 text-[#B283AF]" />;
      case 'Camera':
        return <Camera className="w-8 h-8 text-[#649FF6]" />;
      default:
        return <Sparkles className="w-8 h-8 text-gray-500" />;
    }
  };

  const getBorderColor = (idx: number) => {
    const borders = ['hover:border-[#649FF6]', 'hover:border-[#F56B71]', 'hover:border-[#B283AF]', 'hover:border-[#649FF6]'];
    return borders[idx % borders.length];
  };

  const getCheckColor = (idx: number) => {
    const checkColors = ['text-[#649FF6]', 'text-[#F56B71]', 'text-[#B283AF]', 'text-[#649FF6]'];
    return checkColors[idx % checkColors.length];
  };

  const getDeliverables = (id: string) => {
    switch (id) {
      case 'srv-1':
        return [
          '3 Opsi Desain Logo Utama',
          'Panduan Palet Warna & Font',
          'Desain Kartu Nama & Kop Surat',
          'File Master Komplit (.AI, .SVG, .PNG)'
        ];
      case 'srv-2':
        return [
          '15 Desain Post Feed Bulanan',
          '8 Sesi Story Kreatif / Video Reels',
          'Riset Hashtag & Copywriting Seru',
          'Laporan Analisis Performa Akun'
        ];
      case 'srv-3':
        return [
          'Desain Landing Page Kustom',
          'Integrasi Kontak WA & Formulir',
          'Kecepatan Loading Tinggi',
          'Panduan Edit Mandiri Lewat Video'
        ];
      case 'srv-4':
        return [
          '20 Foto Produk Resolusi Tinggi',
          'Pencahayaan Studio & Properti Alami',
          'Pengeditan Warna Premium',
          'Cocok untuk Shopee, Tokopedia, & IG'
        ];
      default:
        return ['Aset Kualitas Tinggi', 'Revisi 2x', 'Dukungan WhatsApp', 'File Master Lengkap'];
    }
  };

  return (
    <section id="CasualServicesGrid" className="bg-white relative overflow-hidden">
      {imageUrl ? (
        <div className="relative py-16 md:py-20 mb-4 overflow-hidden text-white text-center">
          <div className="absolute inset-0">
            <img src={imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gray-950/70" />
          </div>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
            <span className="text-sm font-bold text-white/80 uppercase tracking-widest block font-mono">{badge}</span>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl tracking-tight">{title}</h2>
            <p className="font-sans text-base text-gray-200 leading-relaxed">{description}</p>
            {ctaLabel && (
              <div className="pt-2">
                <Link href={ctaHref} className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-100 transition-all">
                  <span>{ctaLabel}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-[#649FF6]/5 blur-3xl pointer-events-none" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 md:py-16">
        {!imageUrl && (
          /* Section Heading */
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-sm font-bold text-[#649FF6] uppercase tracking-widest block font-mono">
              {badge}
            </span>
            <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
              {title}
            </h2>
            <p className="font-sans text-base text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
        )}
        {!imageUrl && ctaLabel && (
          <div className="text-center -mt-10 mb-10">
            <Link href={ctaHref} className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-full text-sm font-bold transition-all">
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Detailed Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {services.map((service, idx) => (
            <div
              key={service.id}
              className={`bg-gray-50 rounded-[40px] p-8 sm:p-10 border-2 border-transparent transition-all duration-300 ${getBorderColor(idx)} hover:bg-white hover:shadow-xl flex flex-col justify-between group`}
            >
              <div className="space-y-6">
                
                {/* Header info */}
                <div className="flex items-start justify-between">
                  <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center shadow-sm border border-gray-100 group-hover:rotate-6 transition-transform">
                    {getIcon(service.iconName, service.color)}
                  </div>
                  <span className="text-xs font-mono font-extrabold bg-[#649FF6]/10 text-[#649FF6] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                    REKOMENDASI UMKM
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-sans font-extrabold text-2xl text-gray-950 group-hover:text-[#649FF6] transition-colors leading-tight">
                    {service.title}
                  </h3>
                  <p className="font-sans text-sm text-gray-600 leading-relaxed">
                    {service.shortDesc}
                  </p>
                </div>

                {/* Deliverables Checklist */}
                <div className="pt-4 border-t border-gray-200/50 space-y-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block font-sans">
                    Hasil Yang Kamu Terima:
                  </span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {getDeliverables(service.id).map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm text-gray-700 font-medium">
                        <CheckCircle2 className={`w-5 h-5 ${getCheckColor(idx)} shrink-0 mt-0.5`} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Price & CTA Section */}
              <div className="mt-8 pt-6 border-t border-gray-200/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs text-gray-400 block font-sans">Investasi Terjangkau:</span>
                  <span className="text-lg font-extrabold text-gray-900 font-sans mt-0.5 block">{service.price}</span>
                </div>
                
                <Link
                  id={`srv-cta-order-${service.id}`}
                  href={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F56B71] text-white px-6 py-3 rounded-full text-sm font-bold shadow-md hover:bg-[#F56B71]/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Pesan Paket</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
