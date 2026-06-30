'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Mail, MessageCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitContact } from '@/lib/api';

interface AbstractContactInformationProps {
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

export function AbstractContactInformation({
  title = "Koordinat Resmi & Formulir Dekonstruksi",
  description = "Gunakan formulir di bawah untuk melayangkan pesan instan kepada tim kreatif kami, atau hubungi langsung saluran spesifik kami di samping.",
  showWhatsapp = "true",
  showEmail = "true",
  showAddress = "true",
  siteSlug,
  pageKey = 'contact',
  slotKey = 'contact.contact_information',
  whatsappHref = 'https://wa.me/6281234567890',
  whatsappLabel = '+62 812-3456-7890',
  email: businessEmail = 'hello@studiosinestesia.id',
  address: businessAddress = 'Grand Wijaya Center Blok F-8, Jl. Wijaya II, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12160',
}: AbstractContactInformationProps) {
  const isShowWhatsapp = showWhatsapp === "true";
  const isShowEmail = showEmail === "true";
  const isShowAddress = showAddress === "true";

  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
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
    if (!siteSlug) {
      setErrorMsg('Formulir belum bisa dipakai: siteSlug tidak ditemukan.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      await submitContact(siteSlug, {
        name: formState.name,
        email: formState.email,
        message: formState.message,
        interest: formState.subject,
        sourcePage: pageKey,
        sourceSection: slotKey,
        tracking: getTrackingContext()
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormState({ name: '', email: '', subject: '', message: '' });
      }, 4000);
    } catch (error: any) {
      setErrorMsg(error?.message || 'Pesan belum berhasil dikirim. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative bg-[#0d0d0d] text-white py-24 px-6 border-b-8 border-white overflow-hidden">
      {/* Background graphics */}
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-[#649FF6] opacity-5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Intro */}
        <div className="max-w-3xl mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-mono font-black uppercase tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-neutral-400 font-sans text-sm sm:text-base leading-relaxed max-w-2xl border-l-2 border-[#F56B71] pl-4">
            {description}
          </p>
        </div>

        {/* Form and Contacts Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column - Contact Form (7 cols) */}
          <div className="lg:col-span-7 relative">
            <div className="absolute inset-0 bg-[#649FF6] transform -skew-x-3 translate-x-2.5 translate-y-2.5 border-2 border-white" />
            
            <div className="relative bg-black border-2 border-white p-8 sm:p-10">
              
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#F56B71]/20 text-[#F56B71] flex items-center justify-center mx-auto border-2 border-[#F56B71]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-mono text-xl font-black uppercase text-white tracking-tight">
                    Pesan Dekonstruksi Terkirim!
                  </h3>
                  <p className="text-neutral-400 font-sans text-sm max-w-sm mx-auto">
                    Terima kasih telah memulai koneksi. Tim kurator kami akan merespons dalam waktu kurang dari 24 jam.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="font-mono text-xs text-neutral-500 uppercase tracking-widest mb-4">
                    {"// SUBMIT_FORM_026"}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label htmlFor="form-name" className="block font-mono text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        Nama Lengkap *
                      </label>
                      <input 
                        id="form-name"
                        type="text" 
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="e.g. Rian Gunawan" 
                        className="w-full bg-neutral-900 border-2 border-neutral-800 focus:border-[#F56B71] px-4 py-3 text-sm text-white font-sans focus:outline-none transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label htmlFor="form-email" className="block font-mono text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                        Alamat Email *
                      </label>
                      <input 
                        id="form-email"
                        type="email" 
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="e.g. rian@bisnis.com" 
                        className="w-full bg-neutral-900 border-2 border-neutral-800 focus:border-[#649FF6] px-4 py-3 text-sm text-white font-sans focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label htmlFor="form-subject" className="block font-mono text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      Subjek Proyek / Pesan *
                    </label>
                    <input 
                      id="form-subject"
                      type="text" 
                      required
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      placeholder="e.g. Rencana Rebranding / Pembuatan Website" 
                      className="w-full bg-neutral-900 border-2 border-neutral-800 focus:border-[#B283AF] px-4 py-3 text-sm text-white font-sans focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="form-message" className="block font-mono text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      Uraian Rincian Kebutuhan Anda *
                    </label>
                    <textarea 
                      id="form-message"
                      rows={5}
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Uraikan dengan bebas visi gila Anda di sini..." 
                      className="w-full bg-neutral-900 border-2 border-neutral-800 focus:border-white px-4 py-3 text-sm text-white font-sans focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="group relative inline-block cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-[#F56B71] transform translate-x-1.5 translate-y-1.5 transition-transform group-hover:translate-x-2.5 group-hover:translate-y-2.5" />
                      <span className="relative block bg-white text-black border-2 border-black font-mono font-bold text-xs tracking-widest py-4 px-8 uppercase flex items-center gap-2 hover:bg-black hover:text-white transition-colors">
                        <span>{submitting ? 'MENGIRIM...' : 'KIRIM PESAN SEKARANG'}</span>
                        <Send className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  </div>

                  {errorMsg && (
                    <div className="flex items-start gap-2 bg-[#F56B71]/10 border-2 border-[#F56B71] text-[#F56B71] text-xs font-mono font-semibold p-4">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                </form>
              )}

            </div>
          </div>

          {/* Right Column - Contact Blocks (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Address Block */}
            {isShowAddress && (
              <div className="relative group">
                <div className="absolute inset-0 bg-[#B283AF] transform translate-x-2 translate-y-2 border-2 border-white transition-transform duration-200" />
                <div className="relative bg-black border-2 border-white p-6 flex gap-4 items-start">
                  <div className="w-10 h-10 bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#B283AF]" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider block">{"// ALAMAT_STUDIO"}</span>
                    <h3 className="font-mono text-sm font-bold text-white uppercase">JAKARTA HEADQUARTERS</h3>
                    <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                      {businessAddress}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Email Block */}
            {isShowEmail && (
              <div className="relative group">
                <div className="absolute inset-0 bg-[#F56B71] transform -translate-x-2 translate-y-2 border-2 border-white transition-transform duration-200" />
                <div className="relative bg-black border-2 border-white p-6 flex gap-4 items-start">
                  <div className="w-10 h-10 bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#F56B71]" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider block">{"// DUKUNGAN_EMAIL"}</span>
                    <h3 className="font-mono text-sm font-bold text-white uppercase">SURAT ELEKTRONIK</h3>
                    <a href={`mailto:${businessEmail}`} className="font-mono text-xs text-[#649FF6] hover:underline block pt-1 font-bold">
                      {businessEmail.toUpperCase()}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Whatsapp Block */}
            {isShowWhatsapp && (
              <div className="relative group">
                <div className="absolute inset-0 bg-[#649FF6] transform translate-x-2 -translate-y-2 border-2 border-white transition-transform duration-200" />
                <div className="relative bg-black border-2 border-white p-6 flex gap-4 items-start">
                  <div className="w-10 h-10 bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-[#649FF6]" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wider block">{"// RESPONS_CEPAT"}</span>
                    <h3 className="font-mono text-sm font-bold text-white uppercase">SALURAN WHATSAPP</h3>
                    <a href={whatsappHref} target="_blank" rel="noreferrer" className="font-mono text-xs text-[#F56B71] hover:underline block pt-1 font-bold">
                      {whatsappLabel}
                    </a>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
