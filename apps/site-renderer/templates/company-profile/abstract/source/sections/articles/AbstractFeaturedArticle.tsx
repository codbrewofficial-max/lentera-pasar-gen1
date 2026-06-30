'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Star, ArrowRight } from 'lucide-react';
import { defaultArticles, ArticleItem } from '../../lib/dummy-data';

interface AbstractFeaturedArticleProps {
  title?: string;
  description?: string;
  article?: ArticleItem;
}

export function AbstractFeaturedArticle({
  title = "Sorotan Editor: Pemikiran Terpanas Bulan Ini",
  description = "Bedah mendalam dekonstruksi visual yang mengobrak-abrik status quo keseragaman digital.",
  article = defaultArticles[0]
}: AbstractFeaturedArticleProps) {
  return (
    <section className="relative bg-[#0d0d0d] text-white py-24 px-6 border-b-8 border-white overflow-hidden">
      {/* Decorative colored blobs */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-[#F56B71] opacity-5 rounded-full blur-[160px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Intro Section Header */}
        <div className="mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#F56B71]">
            <Star className="w-4 h-4 fill-current text-[#F56B71]" /> {"// ARTIKEL UTAMA // FEATURED"}
          </div>
          <h2 className="text-3xl font-mono font-black uppercase tracking-tight text-white leading-none">
            {title}
          </h2>
          <p className="text-neutral-400 font-sans text-sm max-w-2xl border-l-2 border-[#649FF6] pl-4">
            {description}
          </p>
        </div>

        {/* Featured Article Wide Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative group"
        >
          {/* Back offset shadow block */}
          <div className="absolute inset-0 bg-[#649FF6] transform translate-x-4 translate-y-4 border-2 border-white transition-transform group-hover:translate-x-5 group-hover:translate-y-5 duration-300" />
          
          {/* Main Card Grid */}
          <div className="relative bg-black border-2 border-white p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side Image with asymmetric borders (5 cols) */}
            <div className="lg:col-span-6 relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-square bg-neutral-900 overflow-hidden border border-neutral-700">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10 duration-300" />
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-102 group-hover:scale-100"
              />
              <div className="absolute bottom-4 left-4 bg-[#B283AF] text-black font-mono text-[10px] font-bold tracking-widest px-3 py-1 border border-white z-20">
                [ READ TIME: 6 MIN ]
              </div>
            </div>

            {/* Right side Info (7 cols) */}
            <div className="lg:col-span-6 space-y-6 flex flex-col justify-between h-full">
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-bold text-[#F56B71] uppercase tracking-widest">
                    {"// " + article.category.toUpperCase()}
                  </span>
                  <span className="font-mono text-xs text-neutral-500">
                    {article.publishedAt}
                  </span>
                </div>

                <h3 className="font-mono text-2xl sm:text-3xl font-black uppercase tracking-tight text-white group-hover:text-[#649FF6] transition-colors leading-tight">
                  {article.title}
                </h3>

                <p className="text-neutral-400 font-sans text-sm sm:text-base leading-relaxed">
                  {article.description}
                </p>
              </div>

              {/* Author and Read CTA */}
              <div className="pt-8 border-t border-dashed border-neutral-800 flex flex-wrap items-center justify-between gap-6 mt-6">
                {/* Author profile */}
                <div className="flex items-center gap-3">
                  <img 
                    src={article.author.avatarUrl} 
                    alt={article.author.name} 
                    className="w-10 h-10 rounded-full border border-white grayscale"
                  />
                  <div>
                    <span className="block font-mono text-xs font-bold text-white uppercase">{article.author.name}</span>
                    <span className="block font-mono text-[9px] text-neutral-500 uppercase">{article.author.role}</span>
                  </div>
                </div>

                {/* Read Button */}
                <Link href={`/articles/${article.id}`} className="group/btn relative inline-block">
                  <div className="absolute inset-0 bg-[#F56B71] transform translate-x-1 translate-y-1 transition-transform group-hover/btn:translate-x-1.5 group-hover/btn:translate-y-1.5" />
                  <button className="relative bg-black text-white border-2 border-white font-mono font-bold text-xs tracking-widest py-3 px-6 flex items-center gap-2 hover:bg-white hover:text-black transition-colors">
                    <span>BACA ULASAN</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </Link>
              </div>

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
