'use client';

import React, { useState } from 'react';
import { MessageSquare, Mail, MapPin, Send, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { submitContact } from '@/lib/api';

export interface CasualContactInformationProps {
  title?: string;
  description?: string;
  showWhatsapp?: string;
  showEmail?: string;
  showAddress?: string;
  siteSlug?: string;
  pageKey?: string;
  slotKey?: string;
  whatsappHref?: string;
  whatsappLabel?: string;
  email?: string;
  address?: string;
}

export function CasualContactInformation({
  title = 'Saluran Komunikasi Cepat & Formulir Kontak',
  description = 'Kami senang terhubung dengan pemilik usaha kreatif. Silakan hubungi kami lewat saluran mana saja yang paling membuatmu nyaman, atau kirimkan pesan langsung melalui formulir di bawah ini.',
  showWhatsapp = 'true',
  showEmail = 'true',
  showAddress = 'true',
  siteSlug,
  pageKey = 'contact',
  slotKey = 'contact.contact_information',
  whatsappHref = 'https://wa.me/628123456789',
  whatsappLabel = '+62 812-3456-7890',
  email = 'halo@ruangkarsa.id',
  address = 'Jl. Dipati Ukur No. 102, Coblong, Bandung, Jawa Barat 40132',
}: CasualContactInformationProps) {
  
  const isShowWhatsapp = showWhatsapp === 'true' || showWhatsapp === 'Boolean(true)' || showWhatsapp === 'TRUE';
  const isShowEmail = showEmail === 'true' || showEmail === 'Boolean(true)' || showEmail === 'TRUE';
  const isShowAddress = showAddress === 'true' || showAddress === 'Boolean(true)' || showAddress === 'TRUE';

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Identitas Brand',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
    if (!formData.name || !formData.email || !formData.message) {
      alert('Mohon isi semua kolom bertanda bintang (*) ya Kak!');
      return;
    }
    if (!siteSlug) {
      setErrorMessage('Formulir belum bisa dipakai: siteSlug tidak ditemukan.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      await submitContact(siteSlug, {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        interest: formData.service,
        sourcePage: pageKey,
        sourceSection: slotKey,
        tracking: getTrackingContext()
      });
      setSubmitted(true);
    } catch (error: any) {
      setErrorMessage(error?.message || 'Pesan belum berhasil dikirim. Silakan coba lagi ya.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="CasualContactInformation" className="py-20 bg-white relative overflow-hidden">
      
      {/* Decorative Blob */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 w-96 h-96 rounded-full bg-[#649FF6]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-sm font-bold text-[#F56B71] uppercase tracking-widest block font-mono">
            KOMUNIKASI & FORMULIR
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
            {title}
          </h2>
          <p className="font-sans text-base text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto items-start">
          
          {/* Info Details Column */}
          <div className="lg:col-span-5 space-y-8">
            <h3 className="font-sans font-extrabold text-2xl text-gray-900">
              Hubungi Kami Langsung
            </h3>
            <p className="font-sans text-sm text-gray-600 leading-relaxed">
              Tim admin ceria kami siap membalas pesan kamu di jam kerja operasional kami (Senin - Jumat, pukul 09.00 - 17.00 WIB).
            </p>

            <div className="space-y-4">
              {/* WhatsApp Row */}
              {isShowWhatsapp && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-4 p-5 rounded-3xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-[#649FF6]/40 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <MessageSquare className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold block uppercase font-mono tracking-wider">Fast Response</span>
                    <h4 className="font-sans font-extrabold text-base text-gray-950 mt-0.5 group-hover:text-[#649FF6] transition-colors">
                      WhatsApp Chat
                    </h4>
                    <p className="font-sans text-xs sm:text-sm text-gray-600 mt-1">
                      {whatsappLabel}
                    </p>
                  </div>
                </a>
              )}

              {/* Email Row */}
              {isShowEmail && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-4 p-5 rounded-3xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-[#F56B71]/40 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-[#F56B71] shrink-0">
                    <Mail className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold block uppercase font-mono tracking-wider">E-Mail Resmi</span>
                    <h4 className="font-sans font-extrabold text-base text-gray-950 mt-0.5 group-hover:text-[#F56B71] transition-colors">
                      Kirim Surat Elektronik
                    </h4>
                    <p className="font-sans text-xs sm:text-sm text-gray-600 mt-1">
                      {email}
                    </p>
                  </div>
                </a>
              )}

              {/* Address Row */}
              {isShowAddress && (
                <div className="flex items-start gap-4 p-5 rounded-3xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-[#B283AF]/40 hover:shadow-md transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-[#B283AF] shrink-0">
                    <MapPin className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 font-bold block uppercase font-mono tracking-wider">Lokasi Studio</span>
                    <h4 className="font-sans font-extrabold text-base text-gray-950 mt-0.5 group-hover:text-[#B283AF] transition-colors">
                      Mampir Ngopi
                    </h4>
                    <p className="font-sans text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                      {address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-gray-50 rounded-[40px] p-8 md:p-10 border border-gray-150 shadow-sm relative">
              
              {submitted ? (
                <div className="text-center py-12 space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-sans font-extrabold text-2xl text-gray-950">
                    Pesan Terkirim dengan Sukses!
                  </h3>
                  <p className="font-sans text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                    Terima kasih banyak, <strong>{formData.name}</strong>! Pesan kamu sudah mendarat di inbox studio kami. Tim admin kami akan segera menghubungi kamu kembali ke email <strong>{formData.email}</strong> dalam waktu maksimal 24 jam.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', service: 'Identitas Brand', message: '' });
                    }}
                    className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold font-mono text-[#649FF6] bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm hover:bg-gray-50"
                  >
                    Kirim Pesan Baru Lagi
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#649FF6] text-[10px] font-bold shadow-sm font-sans mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#649FF6] fill-[#649FF6]/10" />
                      <span>TINGGALKAN PESAN DIGITAL</span>
                    </div>
                    <h3 className="font-sans font-extrabold text-xl text-gray-950">
                      Formulir Sapa Kreatif
                    </h3>
                    <p className="text-xs text-gray-500 font-sans">
                      Semua data terkirim langsung ke dashboard Lentera Pasar kamu secara instan.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="flex items-start gap-2 bg-red-50 text-red-700 text-xs font-sans font-semibold p-4 rounded-2xl">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block font-sans">
                        Nama Lengkap kamu *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Misal: Kak Laras"
                        className="w-full bg-white border border-gray-200 focus:border-[#649FF6] focus:ring-1 focus:ring-[#649FF6] rounded-2xl p-3.5 text-sm outline-none transition-all placeholder:text-gray-400 font-sans"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 block font-sans">
                        Alamat E-mail aktif *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Misal: laras@brandku.com"
                        className="w-full bg-white border border-gray-200 focus:border-[#649FF6] focus:ring-1 focus:ring-[#649FF6] rounded-2xl p-3.5 text-sm outline-none transition-all placeholder:text-gray-400 font-sans"
                      />
                    </div>
                  </div>

                  {/* Services dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block font-sans">
                      Kebutuhan Layanan Terbesar
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-200 focus:border-[#649FF6] focus:ring-1 focus:ring-[#649FF6] rounded-2xl p-3.5 text-sm outline-none transition-all font-sans cursor-pointer"
                    >
                      <option value="Identitas Brand">Identitas Brand & Logo</option>
                      <option value="Sosial Media">Sosial Media Management</option>
                      <option value="Website UMKM">Website Builder Jualan</option>
                      <option value="Foto & Video">Foto & Video Katalog Produk</option>
                      <option value="Lainnya">Lainnya / Diskusi Lepas</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block font-sans">
                      Ceritakan rencana bisnismu di sini... *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Kak, aku punya usaha keripik pisang rumahan dan ingin re-branding stiker kemasannya biar terlihat lucu..."
                      className="w-full bg-white border border-gray-200 focus:border-[#649FF6] focus:ring-1 focus:ring-[#649FF6] rounded-2xl p-3.5 text-sm outline-none transition-all placeholder:text-gray-400 font-sans resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#649FF6] text-white py-4 px-6 rounded-2xl text-sm font-bold shadow-md shadow-[#649FF6]/10 hover:bg-[#649FF6]/90 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <Send className="w-4 h-4" />
                      <span>{submitting ? 'Mengirim Pesan...' : 'Kirim Pesan Sekarang'}</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
