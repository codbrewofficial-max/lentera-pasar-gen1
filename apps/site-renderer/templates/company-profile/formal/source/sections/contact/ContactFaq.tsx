"use client";

import React, { useState } from "react";
import { CheckCircle, HelpCircle, Send, ShieldCheck } from "lucide-react";
import { submitContact } from "@/lib/api";
import { faqData as defaultFaqData } from "../../data/companyProfileData";
import type { FaqItem } from "../../lib/types";
import { Button } from "../../shared/Button";
import { Card } from "../../shared/Card";
import { FaqList } from "../../shared/FaqList";
import { SectionHeading } from "../../shared/SectionHeading";

interface ContactFaqProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  faqs?: FaqItem[];
  siteSlug: string;
  pageKey: string;
  slotKey?: string;
}

const cleanText = (value: FormDataEntryValue | null) => String(value || "").trim();

function getTrackingContext() {
  return {
    visitorId: window.localStorage.getItem("LP_VISITOR_ID") || null,
    sessionId: window.localStorage.getItem("LP_SESSION_ID") || null,
    referrer: document.referrer || null,
    utm: Object.fromEntries(new URLSearchParams(window.location.search).entries()),
  };
}

export const ContactFaq: React.FC<ContactFaqProps> = ({
  title = "Kirim Pesan dan Pertanyaan Umum",
  subtitle = "Ajukan pertanyaan melalui form kontak dan lihat jawaban cepat yang sering ditanyakan.",
  badge = "FAQ Kontak",
  faqs = defaultFaqData,
  siteSlug,
  pageKey,
  slotKey = "contact.contact_faq",
}) => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setStatus("loading");
    setMessage("");

    try {
      await submitContact(siteSlug, {
        name: cleanText(form.get("name")),
        email: cleanText(form.get("email")) || null,
        phone: cleanText(form.get("phone")) || null,
        interest: cleanText(form.get("interest")) || null,
        message: cleanText(form.get("message")) || null,
        sourcePage: pageKey,
        sourceSection: slotKey,
        tracking: getTrackingContext(),
      });
      formElement.reset();
      setStatus("success");
      setMessage("Pesan berhasil dikirim. Kami akan menghubungi Anda kembali.");
    } catch (error: any) {
      setStatus("error");
      setMessage(error?.message || "Pesan belum berhasil dikirim. Silakan coba lagi.");
    }
  }

  return (
    <section id="contact-faq-form" className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="accent" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-7">
            <Card className="p-6 md:p-8 bg-white border border-slate-100 shadow-lg">
              {status === "success" ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4"><CheckCircle className="w-7 h-7" /></div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Pesan Terkirim</h3>
                  <p className="text-sm text-slate-600 font-light mb-6">{message}</p>
                  <Button type="button" variant="outline" onClick={() => { setStatus("idle"); setMessage(""); }}>Kirim Pesan Lain</Button>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 font-mono">Nama Lengkap</label>
                      <input name="name" required type="text" className="w-full rounded border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#649FF6]" placeholder="Nama Anda" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 font-mono">Nama Perusahaan</label>
                      <input name="company" type="text" className="w-full rounded border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#649FF6]" placeholder="Nama bisnis/perusahaan" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 font-mono">Email</label>
                      <input name="email" type="email" className="w-full rounded border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#649FF6]" placeholder="email@contoh.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 font-mono">Telepon / WhatsApp</label>
                      <input name="phone" type="tel" className="w-full rounded border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#649FF6]" placeholder="08xxxxxxxxxx" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 font-mono">Kebutuhan</label>
                    <input name="interest" className="w-full rounded border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#649FF6]" placeholder="Contoh: konsultasi layanan" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 font-mono">Pesan</label>
                    <textarea name="message" required rows={5} className="w-full rounded border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#649FF6]" placeholder="Ceritakan kebutuhan Anda secara singkat." />
                  </div>
                  <Button type="submit" fullWidth disabled={status === "loading"} iconRight={<Send className="w-4 h-4" />}>{status === "loading" ? "Mengirim..." : "Kirim Pesan"}</Button>
                  {message && status === "error" && <p className="rounded border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p>}
                  <p className="flex items-start gap-2 text-[11px] text-slate-400 font-light leading-relaxed"><ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />Data yang dikirim akan diteruskan ke pengelola website.</p>
                </form>
              )}
            </Card>
          </div>
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="border border-slate-200 rounded-lg p-6 bg-slate-50/20">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 mb-2 font-mono flex items-center space-x-1.5"><HelpCircle className="w-4.5 h-4.5 text-[#F56B71]" /><span>Bantuan Cepat</span></h3>
              <p className="text-xs text-slate-500 font-light leading-relaxed mb-6">Sebelum mengirim pesan, Anda dapat memeriksa pertanyaan umum di bawah ini.</p>
              <FaqList items={faqs.slice(0, 10)} className="max-w-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ContactFaq;
