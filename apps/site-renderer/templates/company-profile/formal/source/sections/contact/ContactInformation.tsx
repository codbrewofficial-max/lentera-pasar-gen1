import React from "react";
import { Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { companyData as defaultCompanyData } from "../../data/companyProfileData";
import type { CompanyData } from "../../lib/types";
import { SectionHeading } from "../../shared/SectionHeading";
import { Card } from "../../shared/Card";

interface ContactInformationProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  company?: CompanyData;
}

export const ContactInformation: React.FC<ContactInformationProps> = ({
  title = "Saluran Hubung Resmi Kantor Pusat",
  subtitle = "Hubungi koordinator sekretariat atau ajukan janji pertemuan.",
  badge = "Informasi Kontak",
  company = defaultCompanyData,
}) => {
  const cleanPhone = company.contact.phone.replace(/[^0-9+]/g, "");
  const cleanWa = company.contact.whatsapp.replace(/[^0-9]/g, "");
  return (
    <section id="contact-info" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="primary" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Card className="p-8 bg-slate-50/50 border border-slate-100 flex flex-col items-start h-full">
            <div className="bg-[#649FF6]/10 text-[#649FF6] w-12 h-12 flex items-center justify-center rounded mb-6 border border-[#649FF6]/20"><MapPin className="w-5 h-5" /></div>
            <h3 className="text-sm md:text-base font-semibold text-slate-900 mb-3 tracking-tight">Alamat Korespondensi</h3>
            <p className="text-xs md:text-sm text-slate-600 font-light leading-relaxed">{company.contact.address}</p>
          </Card>
          <Card className="p-8 bg-slate-50/50 border border-slate-100 flex flex-col items-start h-full">
            <div className="bg-[#649FF6]/10 text-[#649FF6] w-12 h-12 flex items-center justify-center rounded mb-6 border border-[#649FF6]/20"><Mail className="w-5 h-5" /></div>
            <h3 className="text-sm md:text-base font-semibold text-slate-900 mb-3 tracking-tight">Surel / Email Resmi</h3>
            <p className="text-xs md:text-sm text-slate-600 font-mono mb-2"><a href={`mailto:${company.contact.email}`} className="hover:text-[#649FF6] transition-colors">{company.contact.email}</a></p>
            <p className="text-[10px] text-slate-400 font-sans mt-auto leading-none">Respons surat resmi dikoordinasikan sesuai jam operasional.</p>
          </Card>
          <Card className="p-8 bg-slate-50/50 border border-slate-100 flex flex-col items-start h-full">
            <div className="bg-[#649FF6]/10 text-[#649FF6] w-12 h-12 flex items-center justify-center rounded mb-6 border border-[#649FF6]/20"><Phone className="w-5 h-5" /></div>
            <h3 className="text-sm md:text-base font-semibold text-slate-900 mb-3 tracking-tight">Telepon & WhatsApp</h3>
            <div className="space-y-1">
              <p className="text-xs md:text-sm text-slate-600 font-mono">Tel: <a href={`tel:${cleanPhone}`} className="hover:text-[#649FF6] transition-colors">{company.contact.phone}</a></p>
              <p className="text-xs md:text-sm text-slate-600 font-mono">WA: <a href={`https://wa.me/${cleanWa}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline transition-colors font-semibold">{company.contact.whatsapp}</a></p>
            </div>
          </Card>
          <Card className="p-8 bg-slate-50/50 border border-slate-100 flex flex-col items-start h-full">
            <div className="bg-[#F56B71]/10 text-[#F56B71] w-12 h-12 flex items-center justify-center rounded mb-6 border border-[#F56B71]/20"><Clock className="w-5 h-5" /></div>
            <h3 className="text-sm md:text-base font-semibold text-slate-900 mb-3 tracking-tight">Waktu Operasional</h3>
            <p className="text-xs md:text-sm text-slate-600 font-light leading-relaxed">{company.contact.workingHours}</p>
            <div className="mt-4 flex items-center space-x-1 bg-emerald-50 text-emerald-900 text-[10px] font-mono px-2 py-1 rounded border border-emerald-100"><ShieldCheck className="w-3 h-3 text-emerald-600 flex-shrink-0" /><span>Informasi resmi bisnis</span></div>
          </Card>
        </div>
      </div>
    </section>
  );
};
export default ContactInformation;
