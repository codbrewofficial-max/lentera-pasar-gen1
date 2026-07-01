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
  showAddress?: boolean;
  showEmail?: boolean;
  showWhatsapp?: boolean;
}

export const ContactInformation: React.FC<ContactInformationProps> = ({
  title = "Saluran Hubung Resmi Kantor Pusat",
  subtitle = "Hubungi koordinator sekretariat atau ajukan janji pertemuan.",
  badge = "Informasi Kontak",
  company = defaultCompanyData,
  showAddress = true,
  showEmail = true,
  showWhatsapp = true,
}) => {
  const cleanPhone = company.contact.phone.replace(/[^0-9+]/g, "");
  const cleanWa = company.contact.whatsapp.replace(/[^0-9]/g, "");

  return (
    <section id="contact-info" className="py-16 md:py-24 bg-slate-50/40 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section dengan alignment formal */}
        <div className="mb-14 text-center md:text-left md:flex md:items-end md:justify-between gap-6 border-b border-slate-100 pb-8">
          <div className="max-w-2xl">
            <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="primary" align="left" />
          </div>
          {/* Jam Operasional sebagai elemen formal tambahan */}
          {/* <div className="mt-4 md:mt-0 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-slate-600 text-xs font-medium tracking-wide">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Senin - Jumat: 08.00 - 17.00 WIB</span>
          </div> */}
        </div>

        {/* Layout Grid Modern Asimetris */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Alamat (Diberi porsi kolom lebih lebar agar mudah dibaca) */}
          {showAddress && (
            <Card className="md:col-span-1 p-8 bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl flex flex-col items-start justify-between group">
              <div className="w-full">
                <div className="bg-slate-900 text-white w-10 h-10 flex items-center justify-center rounded-xl mb-6 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Alamat Korespondensi</h3>
                <p className="text-sm text-slate-600 font-normal leading-relaxed">{company.contact.address}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 w-full flex items-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Lokasi Terverifikasi Resmi</span>
              </div>
            </Card>
          )}

          {/* 2. Email */}
          {showEmail && (
            <Card className="p-8 bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl flex flex-col items-start justify-between group">
              <div className="w-full">
                <div className="bg-slate-900 text-white w-10 h-10 flex items-center justify-center rounded-xl mb-6 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">Surel Resmi</h3>
                <p className="text-sm text-slate-700 font-mono font-medium truncate w-full">
                  <a href={`mailto:${company.contact.email}`} className="hover:text-slate-900 hover:underline transition-colors">
                    {company.contact.email}
                  </a>
                </p>
              </div>
              {/* <p className="mt-6 text-[11px] text-slate-400 font-sans leading-normal">
                Respons surat elektronik dikoordinasikan dalam maksimal 1x24 jam kerja.
              </p> */}
            </Card>
          )}

          {/* 3. Telepon & WhatsApp */}
          <Card className="p-8 bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl flex flex-col items-start justify-between group">
            <div className="w-full">
              <div className="bg-slate-900 text-white w-10 h-10 flex items-center justify-center rounded-xl mb-6 shadow-sm group-hover:scale-105 transition-transform duration-300">
                <Phone className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Komunikasi Digital</h3>
              
              <div className="space-y-3 w-full">
                <div className="flex flex-col pb-2.5 border-b border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Saluran Telepon</span>
                  <a href={`tel:${cleanPhone}`} className="text-sm font-mono text-slate-700 font-medium hover:text-slate-900 transition-colors">
                    {company.contact.phone}
                  </a>
                </div>
                
                {showWhatsapp && (
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Instant Messaging</span>
                    <a 
                      href={`https://wa.me/${cleanWa}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm font-mono text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 transition-colors mt-0.5"
                    >
                      <span>{company.contact.whatsapp}</span>
                      <span className="text-[10px] font-sans font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 scale-90 origin-left">
                        Online
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full mt-4" />
          </Card>

        </div>
      </div>
    </section>
  );
};

export default ContactInformation;