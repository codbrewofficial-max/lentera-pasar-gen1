'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Monitor, Flame, Camera, Layers, CheckSquare } from 'lucide-react';
import { defaultServices, ServiceItem } from '../../lib/dummy-data';

interface AbstractServicesGridProps {
  title?: string;
  description?: string;
  services?: ServiceItem[];
}

const iconMap: { [key: string]: React.ElementType } = {
  Sparkles: Sparkles,
  Monitor: Monitor,
  Flame: Flame,
  Camera: Camera,
  Layers: Layers
};

export function AbstractServicesGrid({
  title = "Amunisi Utama Studio Sinestesia",
  description = "Setiap layanan dirancang dan dijalankan oleh para profesional di bidangnya. Kami menjamin proses kreatif dekonstruktif yang mengutamakan orisinalitas tinggi.",
  services = defaultServices
}: AbstractServicesGridProps) {
  return (
    <section className="relative bg-[#0d0d0d] text-white py-24 px-6 border-b-8 border-white overflow-hidden">
      {/* Decorative grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#649FF6]">
            <CheckSquare className="w-4 h-4 text-[#F56B71]" /> {"// DAFTAR LAYANAN LENGKAP"}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-mono font-black uppercase tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-neutral-400 font-sans text-sm sm:text-base leading-relaxed max-w-2xl border-l-2 border-[#B283AF] pl-4">
            {description}
          </p>
        </div>

        {/* Services checkerboard or high contrast grid list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.iconName] || Sparkles;
            
            // Alternating shadow accent backgrounds
            const cardAccents = [
              { shadow: "bg-[#649FF6]", border: "hover:border-[#649FF6]", text: "text-[#649FF6]" },
              { shadow: "bg-[#F56B71]", border: "hover:border-[#F56B71]", text: "text-[#F56B71]" },
              { shadow: "bg-[#B283AF]", border: "hover:border-[#B283AF]", text: "text-[#B283AF]" }
            ];
            const accent = cardAccents[index % cardAccents.length];

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative group"
              >
                {/* Back offset frame */}
                <div className={`absolute inset-0 ${accent.shadow} transform translate-x-2.5 translate-y-2.5 border-2 border-white transition-transform duration-300 group-hover:translate-x-4 group-hover:translate-y-4`} />
                
                {/* Main box container */}
                <div className={`relative bg-black border-2 border-white p-8 sm:p-10 flex flex-col justify-between h-full min-h-[300px] transition-colors ${accent.border}`}>
                  <div>
                    {/* Upper row */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-neutral-900 border border-neutral-700 flex items-center justify-center">
                        <IconComponent className={`w-6 h-6 ${accent.text}`} />
                      </div>
                      
                      <span className="font-mono text-xs text-neutral-500 font-bold">
                        [ 0{index + 1}_SPEC ]
                      </span>
                    </div>

                    {/* Main Text */}
                    <div className="space-y-3">
                      <span className="font-mono text-[9px] tracking-widest text-[#B283AF] uppercase block">
                        {"// " + service.category}
                      </span>
                      <h3 className="font-mono text-2xl font-black uppercase text-white tracking-tight leading-none group-hover:text-[#649FF6] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-neutral-400 font-sans text-sm sm:text-base leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Bullet features (statically added for richness) */}
                  <div className="mt-8 pt-6 border-t border-dashed border-neutral-800 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] text-neutral-500">
                    <span>• INPUT ANALYTICS</span>
                    <span>• CUSTOM ITERATION</span>
                    <span>• FULL COPYRIGHT</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
