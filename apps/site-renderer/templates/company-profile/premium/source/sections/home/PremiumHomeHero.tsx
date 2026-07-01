'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface PremiumHomeHeroProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  imageUrl?: string;
}

export function PremiumHomeHero({
  eyebrow = "STUDIO DESAIN SPASIAL PREMIUM",
  title = "Mewujudkan Ruang yang Bernyawa & Abadi",
  subtitle = "Niskala Atelier merancang arsitektur, interior, dan lansekap mewah berkonsep tropis modern untuk individu yang menghargai ketenangan spasial, kejujuran material, serta kesempurnaan detail fisik.",
  ctaLabel = "MULAI PROYEK ANDA",
  ctaUrl = "/contact",
  secondaryCtaLabel = "LIHAT PORTOFOLIO",
  secondaryCtaUrl = "/portfolio",
  imageUrl = "https://picsum.photos/seed/luxuryhero/1920/1080"
}: PremiumHomeHeroProps) {
  return (
    <section id="premium-home-hero" className="relative min-h-[90vh] flex items-center bg-[#09090A] text-white overflow-hidden py-16 md:py-24">
      {/* Cinematic background image with dark overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover opacity-35 scale-105 transform transition-transform duration-10000"
        />
        {/* Multilayered radial/linear gradients using brand colors */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090A] via-[#09090A]/85 to-transparent" />
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#649FF6]/5 blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#B283AF]/10 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left main text column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center space-x-3">
            {/* Elegant hairline accent colored dot */}
            <span className="w-1.5 h-1.5 rounded-full bg-[#F56B71]" />
            <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-[#649FF6] uppercase">
              {eyebrow}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-light tracking-tight leading-[1.1] text-white">
            {title.split(' ').map((word, i) => (
              <span key={i} className={i % 3 === 2 ? "text-[#B283AF]" : "text-white"}>
                {word}{' '}
              </span>
            ))}
          </h1>

          <p className="text-stone-300 text-sm md:text-base leading-relaxed max-w-2xl font-sans font-light">
            {subtitle}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a
              id="hero-primary-cta"
              href={ctaUrl}
              className="group relative inline-flex items-center justify-between text-xs font-semibold tracking-[0.25em] uppercase px-8 py-4 bg-gradient-to-r from-[#649FF6] to-[#B283AF] text-white transition-all hover:opacity-90 shadow-lg shadow-black/40"
            >
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4 ml-4 text-white group-hover:translate-x-1.5 transition-transform" />
            </a>

            <a
              id="hero-secondary-cta"
              href={secondaryCtaUrl}
              className="inline-flex items-center justify-center text-xs font-semibold tracking-[0.25em] uppercase px-8 py-4 border border-white/10 hover:border-[#649FF6] hover:bg-white/5 transition-all text-stone-200 hover:text-white"
            >
              {secondaryCtaLabel}
            </a>
          </div>
        </div>

        {/* Right side floating statistics or accent widget */}
        <div className="lg:col-span-4 hidden lg:block">
          <div className="border border-white/5 bg-[#121214]/65 backdrop-blur-md p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#F56B71]" />
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-[0.25em] text-stone-400 font-medium">ESTETIKA BERKELANJUTAN</span>
                <Sparkles className="w-4 h-4 text-[#B283AF]" />
              </div>
              <div className="border-b border-white/5 pb-4">
                <span className="text-3xl font-serif font-light text-white block">100%</span>
                <span className="text-[10px] text-stone-400 tracking-wider">Garansi Keaslian Material Lokal Bersertifikasi</span>
              </div>
              <div>
                <span className="text-3xl font-serif font-light text-[#649FF6] block">50+</span>
                <span className="text-[10px] text-stone-400 tracking-wider">Karya Seni Spasial Tersebar di Indonesia</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom hairline line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
