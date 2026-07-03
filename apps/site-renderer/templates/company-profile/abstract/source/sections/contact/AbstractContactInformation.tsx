'use client';

import React, { useState } from 'react';
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
  title = "Kirim pesan ke tim kami",
  description = "Gunakan formulir di bawah untuk mengirim pesan ke tim kreatif kami, atau hubungi langsung saluran spesifik kami di samping.",
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
    <section className="relative bg-white text-neutral-900 py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">

        <div className="max-w-3xl mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-sans font-extrabold tracking-tight leading-tight text-neutral-900">
            {title}
          </h2>
          <p className="text-neutral-500 font-sans text-sm sm:text-base leading-relaxed max-w-2xl">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          <div className="lg:col-span-7">
            <div className="rounded-[2.5rem] bg-neutral-50 p-8 sm:p-10">

              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#F56B71]/10 text-[#F56B71] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-sans text-xl font-bold text-neutral-900">
                    Pesan terkirim!
                  </h3>
                  <p className="text-neutral-500 font-sans text-sm max-w-sm mx-auto">
                    Terima kasih telah menghubungi kami. Tim kami akan merespons dalam waktu kurang dari 24 jam.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="form-name" className="block font-sans text-xs font-semibold text-neutral-500">
                        Nama lengkap *
                      </label>
                      <input
                        id="form-name"
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="Rian Gunawan"
                        className="w-full bg-white border border-neutral-200 focus:border-[#649FF6] rounded-2xl px-4 py-3 text-sm text-neutral-900 font-sans focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="form-email" className="block font-sans text-xs font-semibold text-neutral-500">
                        Alamat email *
                      </label>
                      <input
                        id="form-email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="rian@bisnis.com"
                        className="w-full bg-white border border-neutral-200 focus:border-[#649FF6] rounded-2xl px-4 py-3 text-sm text-neutral-900 font-sans focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="form-subject" className="block font-sans text-xs font-semibold text-neutral-500">
                      Subjek proyek / pesan *
                    </label>
                    <input
                      id="form-subject"
                      type="text"
                      required
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      placeholder="Rencana rebranding / pembuatan website"
                      className="w-full bg-white border border-neutral-200 focus:border-[#649FF6] rounded-2xl px-4 py-3 text-sm text-neutral-900 font-sans focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="form-message" className="block font-sans text-xs font-semibold text-neutral-500">
                      Ceritakan kebutuhan Anda *
                    </label>
                    <textarea
                      id="form-message"
                      rows={5}
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Uraikan visi Anda di sini..."
                      className="w-full bg-white border border-neutral-200 focus:border-[#649FF6] rounded-2xl px-4 py-3 text-sm text-neutral-900 font-sans focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-neutral-900 hover:bg-[#649FF6] text-white font-sans font-bold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <span>{submitting ? 'Mengirim...' : 'Kirim pesan sekarang'}</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  {errorMsg && (
                    <div className="flex items-start gap-2 bg-[#F56B71]/10 text-[#F56B71] text-xs font-sans font-medium p-4 rounded-2xl">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                </form>
              )}

            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">

            {isShowAddress && (
              <div className="rounded-3xl bg-neutral-50 p-6 flex gap-4 items-start">
                <div className="w-11 h-11 rounded-2xl bg-[#B283AF]/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#B283AF]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-sans text-sm font-semibold text-neutral-900">Alamat studio</h3>
                  <p className="font-sans text-xs text-neutral-500 leading-relaxed">
                    {businessAddress}
                  </p>
                </div>
              </div>
            )}

            {isShowEmail && (
              <div className="rounded-3xl bg-neutral-50 p-6 flex gap-4 items-start">
                <div className="w-11 h-11 rounded-2xl bg-[#F56B71]/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#F56B71]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-sans text-sm font-semibold text-neutral-900">Surat elektronik</h3>
                  <a href={`mailto:${businessEmail}`} className="font-sans text-sm text-[#649FF6] hover:underline block font-medium">
                    {businessEmail}
                  </a>
                </div>
              </div>
            )}

            {isShowWhatsapp && (
              <div className="rounded-3xl bg-neutral-50 p-6 flex gap-4 items-start">
                <div className="w-11 h-11 rounded-2xl bg-[#649FF6]/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-[#649FF6]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-sans text-sm font-semibold text-neutral-900">Saluran WhatsApp</h3>
                  <a href={whatsappHref} target="_blank" rel="noreferrer" className="font-sans text-sm text-[#649FF6] hover:underline block font-medium">
                    {whatsappLabel}
                  </a>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
