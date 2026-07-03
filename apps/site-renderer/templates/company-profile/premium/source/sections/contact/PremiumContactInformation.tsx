'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';
import { submitContact } from '@/lib/api';

interface PremiumContactInformationProps {
  title?: string;
  description?: string;
  showWhatsapp?: string; // "true" / "false"
  showEmail?: string; // "true" / "false"
  showAddress?: string; // "true" / "false"
  siteSlug?: string;
  pageKey?: string;
  slotKey?: string;
  whatsappHref?: string;
  whatsappLabel?: string;
  email?: string;
  address?: string;
}

export function PremiumContactInformation({
  title = "Hubungi Kami Langsung",
  description = "Gunakan saluran di bawah ini untuk terhubung secara instan atau isi formulir di samping untuk mengirimkan brief lengkap mengenai rencana pembangunan Anda.",
  showWhatsapp = "true",
  showEmail = "true",
  showAddress = "true",
  siteSlug,
  pageKey = 'contact',
  slotKey = 'contact.contact_information',
  whatsappHref = 'https://wa.me/628119009900',
  whatsappLabel = '+62 811 900 9900',
  email: businessEmail = 'hello@niskala-atelier.com',
  address: businessAddress = 'Jl. Wijaya II No. 42, Kebayoran Baru, Jakarta Selatan, 12160',
}: PremiumContactInformationProps) {
  // Parse string boolean flags
  const displayWhatsapp = showWhatsapp === "true";
  const displayEmail = showEmail === "true";
  const displayAddress = showAddress === "true";

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState('Residensi Privat');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const getTrackingContext = () => {
    if (typeof window === 'undefined') return undefined;
    return {
      visitorId: window.localStorage.getItem('LP_VISITOR_ID') || null,
      sessionId: window.localStorage.getItem('LP_SESSION_ID') || null,
      referrer: document.referrer || null,
      utm: Object.fromEntries(new URLSearchParams(window.location.search).entries())
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      setErrorMsg('Harap lengkapi semua bidang yang bertanda bintang (*).');
      return;
    }
    if (!siteSlug) {
      setErrorMsg('Formulir belum bisa dipakai: siteSlug tidak ditemukan.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await submitContact(siteSlug, {
        name,
        email,
        phone,
        message,
        interest: projectType,
        sourcePage: pageKey,
        sourceSection: slotKey,
        tracking: getTrackingContext()
      });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      }, 5000);
    } catch (error: any) {
      setErrorMsg(error?.message || 'Pesan belum berhasil dikirim. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="premium-contact-information" className="py-24 md:py-32 bg-[#0E0E0F] text-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Column: Direct contact info */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#649FF6] uppercase block">SALURAN RESPONS CEPAT</span>
            <h2 className="text-3xl md:text-5xl font-serif font-light tracking-tight">{title}</h2>
            <p className="text-stone-400 text-xs md:text-sm leading-relaxed font-sans font-light">
              {description}
            </p>
          </div>

          <div className="space-y-6 pt-6 border-t border-white/5">
            {/* WhatsApp Block */}
            {displayWhatsapp && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-start space-x-4 group -m-2 p-2 rounded transition-colors hover:bg-white/[0.03]"
              >
                <div className="p-3 bg-[#649FF6]/10 border border-white/5 shrink-0">
                  <Phone className="w-5 h-5 text-[#649FF6]" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold tracking-wider text-stone-300 uppercase">WhatsApp / Telepon</h4>
                  <p className="text-sm font-serif font-light text-white mt-1 group-hover:text-[#649FF6] transition-colors">{whatsappLabel}</p>
                  <span className="text-[10px] text-stone-500 font-mono tracking-wider uppercase block mt-1">OPERASIONAL: 09:00 - 18:00 WIB</span>
                </div>
              </a>
            )}

            {/* Email Block */}
            {displayEmail && (
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-[#B283AF]/10 border border-white/5 shrink-0">
                  <Mail className="w-5 h-5 text-[#B283AF]" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold tracking-wider text-stone-300 uppercase">Surat Elektronik (Email)</h4>
                  <p className="text-sm font-serif font-light text-white mt-1">{businessEmail}</p>
                  <span className="text-[10px] text-stone-500 font-mono tracking-wider uppercase block mt-1">ESTIMASI BALASAN: 24 JAM KERJA</span>
                </div>
              </div>
            )}

            {/* Address Block */}
            {displayAddress && (
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-[#F56B71]/10 border border-white/5 shrink-0">
                  <MapPin className="w-5 h-5 text-[#F56B71]" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold tracking-wider text-stone-300 uppercase">Studio Utama (Showroom)</h4>
                  <p className="text-xs md:text-sm leading-relaxed text-stone-300 font-light mt-1">
                    {businessAddress}
                  </p>
                  <span className="text-[10px] text-stone-500 font-mono tracking-wider uppercase block mt-1">HARAP MEMBUAT JANJI TERLEBIH DAHULU</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Custom interactive form */}
        <div className="lg:col-span-7">
          <div className="border border-white/5 bg-[#121214] p-8 md:p-10 relative overflow-hidden shadow-2xl">
            {/* Visual accent border */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#649FF6] via-[#B283AF] to-[#F56B71]" />

            <h3 className="text-xl font-serif font-light text-white mb-6">Formulir Pengajuan Brief & Janji Temu</h3>

            {isSubmitted ? (
              <div className="bg-[#649FF6]/5 border border-[#649FF6]/25 p-8 text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-[#649FF6]/10 flex items-center justify-center text-[#649FF6] border border-[#649FF6]/20">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-serif font-light text-white">Terima Kasih, Pengajuan Terkirim</h4>
                <p className="text-xs text-stone-400 font-light leading-relaxed max-w-md mx-auto">
                  Pesan Anda telah kami simpan di sistem Lentera Pasar. Representatif resmi Niskala Atelier akan menghubungi Anda kembali melalui WhatsApp atau Email dalam 12 jam ke depan.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <p className="text-xs text-[#F56B71] bg-[#F56B71]/5 border border-[#F56B71]/20 p-3">
                    {errorMsg}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[9px] text-stone-400 uppercase tracking-widest block mb-2 font-mono">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Pranata Kesuma"
                      className="w-full bg-[#0E0E0F] border border-white/5 text-xs text-white placeholder-stone-600 px-4 py-3.5 focus:outline-none focus:border-[#649FF6] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-stone-400 uppercase tracking-widest block mb-2 font-mono">Nomor WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Contoh: 08119009900"
                      className="w-full bg-[#0E0E0F] border border-white/5 text-xs text-white placeholder-stone-600 px-4 py-3.5 focus:outline-none focus:border-[#649FF6] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[9px] text-stone-400 uppercase tracking-widest block mb-2 font-mono">Alamat Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Contoh: pranata@holding.com"
                      className="w-full bg-[#0E0E0F] border border-white/5 text-xs text-white placeholder-stone-600 px-4 py-3.5 focus:outline-none focus:border-[#B283AF] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-stone-400 uppercase tracking-widest block mb-2 font-mono">Tipologi Proyek</label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full bg-[#0E0E0F] border border-white/5 text-xs text-white px-4 py-3.5 focus:outline-none focus:border-[#B283AF] transition-colors appearance-none cursor-pointer"
                    >
                      <option value="Residensi Privat">Residensi Privat (Hunian/Vila)</option>
                      <option value="Restorasi Sejarah">Restorasi Cagar Budaya</option>
                      <option value="Ruang Komersial">Ruang Komersial (Kantor/Ritel)</option>
                      <option value="Paviliun & Lanskap">Lanskap & Paviliun</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] text-stone-400 uppercase tracking-widest block mb-2 font-mono">Uraian Ringkas Visi Spasial Anda *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan luas lahan kasar, lokasi pengerjaan, estimasi target konstruksi, serta preferensi estetika Anda..."
                    className="w-full bg-[#0E0E0F] border border-white/5 text-xs text-white placeholder-stone-600 p-4 focus:outline-none focus:border-[#F56B71] transition-colors resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full group relative inline-flex items-center justify-center space-x-3 text-xs font-semibold tracking-[0.25em] uppercase py-4 bg-[#649FF6] hover:bg-[#B283AF] text-white transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span>{submitting ? 'MENGIRIM...' : 'KIRIM BRIEF RANCANGAN'}</span>
                    <Send className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
