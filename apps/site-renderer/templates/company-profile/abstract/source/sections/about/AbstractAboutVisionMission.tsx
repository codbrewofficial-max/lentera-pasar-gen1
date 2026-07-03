'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Eye, Rocket } from 'lucide-react';
import { RichHtml } from '@/components/content/RichHtml';

interface AbstractAboutVisionMissionProps {
  visionTitle?: string;
  vision?: string;
  missionTitle?: string;
  mission?: string;
}

const defaultVisionHtml = '<p>Menjadi episentrum inovasi desain di Asia Tenggara yang memberdayakan UMKM lokal dengan kepribadian visual yang berani dan berdaya saing global.</p>';
const defaultMissionHtml = '<ul><li>Mendekonstruksi pola pikir branding kaku melalui edukasi visual.</li><li>Melahirkan arsitektur web digital interaktif berkinerja tinggi yang menggabungkan ekspresi seni dengan rekayasa fungsional.</li><li>Menghadirkan identitas visual kelas atas yang dapat diakses dengan mudah oleh pelaku UMKM progresif di Indonesia.</li></ul>';

export function AbstractAboutVisionMission({
  visionTitle = "Visi kreatif kami",
  vision = defaultVisionHtml,
  missionTitle = "Misi berkelanjutan kami",
  mission = defaultMissionHtml
}: AbstractAboutVisionMissionProps) {
  return (
    <section className="relative bg-[#151515] text-white py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-[2.5rem] bg-[#649FF6] text-white p-8 md:p-12 flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 mb-6">
                <Eye className="w-3.5 h-3.5" />
                <span className="font-mono text-xs lowercase tracking-wide">visi utama</span>
              </div>

              <h3 className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight mb-6">
                {visionTitle}
              </h3>

              <RichHtml
                html={vision}
                className="prose prose-sm max-w-none font-sans text-base leading-relaxed text-white/90 prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-invert"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-[2.5rem] bg-white/5 p-8 md:p-12 flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 mb-6">
                <Rocket className="w-3.5 h-3.5 text-[#F56B71]" />
                <span className="font-mono text-xs lowercase tracking-wide text-neutral-200">misi strategis</span>
              </div>

              <h3 className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white mb-6">
                {missionTitle}
              </h3>

              <RichHtml
                html={mission}
                className="prose prose-sm prose-invert max-w-none font-sans text-sm sm:text-base leading-relaxed text-neutral-300 prose-p:my-2 prose-ul:my-2 prose-li:my-1"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
