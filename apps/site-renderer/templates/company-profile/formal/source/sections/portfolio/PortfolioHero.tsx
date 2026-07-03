import React from "react";

interface PortfolioHeroProps {
  title?: string;
  subtitle?: string;
  badge?: string;
}

export const PortfolioHero: React.FC<PortfolioHeroProps> = ({
  title = "Portofolio dan Studi Kasus",
  subtitle = "Lihat contoh pekerjaan, pengalaman, dan hasil yang pernah kami tangani.",
  badge = "Portofolio Kami",
}) => {
  return (
    <section id="portfolio-hero" className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1E3A5F_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <span className="text-xs font-mono font-bold text-[#1E3A5F] uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded-none mb-4">{badge}</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-white mb-6">{title}</h1>
        <p className="text-slate-300 font-light text-base md:text-lg max-w-2xl leading-relaxed">{subtitle}</p>
      </div>
    </section>
  );
};
export default PortfolioHero;
