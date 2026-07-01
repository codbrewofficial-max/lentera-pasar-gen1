'use client';

import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

export interface CasualMapsLocationProps {
  title?: string;
  description?: string;
  mapEmbedUrl?: string;
}

export function CasualMapsLocation({
  title = 'Lokasi Studio Ruang Karsa',
  description = 'Gunakan peta interaktif di bawah ini untuk melihat rute perjalanan menuju kantor pusat kami di Bandung. Studio kami berada di kawasan rimbun dekat kampus ITB Dipati Ukur, sangat mudah dicari.',
  mapEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.985923985172!2d107.61453007421162!3d-6.892284993106886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e65005b87123%3A0xc3cf8912e753b708!2sJl.%20Dipati%20Ukur%2C%20Coblong%2C%20Kota%20Bandung%2C%20Jawa%20Barat!5e0!3m2!1sid!2sid!4v1719234800000!5m2!1sid!2sid',
}: CasualMapsLocationProps) {
  return (
    <section id="CasualMapsLocation" className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-[#B283AF]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-sm font-bold text-[#B283AF] uppercase tracking-widest block font-mono">
            PETA PETUNJUK RUTE
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
            {title}
          </h2>
          <p className="font-sans text-base text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Maps Card Wrapper */}
        <div className="max-w-5xl mx-auto bg-white rounded-[44px] p-4 sm:p-6 border border-gray-100 shadow-xl relative">
          
          {/* Map Iframe */}
          <div className="w-full h-[400px] sm:h-[480px] rounded-[32px] overflow-hidden bg-gray-100 relative">
            <iframe
              src={mapEmbedUrl}
              className="w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ruang Karsa Studio Map Location"
            />
          </div>

          {/* Quick info float bar */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 py-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#649FF6]/10 flex items-center justify-center text-[#649FF6] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-900 block">Kantor Bandung</span>
                <span className="text-xs text-gray-500 block">Jl. Dipati Ukur No. 102, Bandung, Jawa Barat</span>
              </div>
            </div>

            <a
              id="google-maps-directions-link"
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold font-mono text-[#F56B71] hover:text-[#F56B71]/80 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100"
            >
              <Navigation className="w-4 h-4 text-[#F56B71] fill-[#F56B71]/10" />
              <span>Buka di Google Maps</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
