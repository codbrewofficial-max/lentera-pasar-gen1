import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ArticleItem } from "../../lib/types";
import { SectionHeading } from "../../shared/SectionHeading";
import { Card } from "../../shared/Card";
import { Badge } from "../../shared/Badge";
import { Button } from "../../shared/Button";

interface RelatedArticlesProps {
  articles: ArticleItem[];
  currentSlug: string;
  baseHref?: string;
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles, currentSlug, baseHref = "/articles" }) => {
  const filtered = articles.filter((a) => a.slug !== currentSlug).slice(0, 3);
  if (filtered.length === 0) return null;
  return (
    <section id="article-detail-related-section" className="py-12 md:py-16 bg-slate-50/50 border-t border-slate-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Analisis & Pemikiran Terkait" subtitle="Baca ulasan lain yang masih relevan dengan topik ini." badge="Artikel Terkait" badgeVariant="primary" align="left" className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <Card key={item.slug} className="flex flex-col h-full bg-white border border-slate-100 shadow-sm">
              <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                <img src={item.coverImageUrl} alt={item.title} className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                <div className="absolute top-3 left-3"><Badge variant="accent" className="bg-slate-900/80 text-white border-transparent backdrop-blur-sm">{item.category}</Badge></div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center space-x-3 text-xs text-slate-500 font-mono mb-2"><span className="truncate">{item.publishDate}</span><span>&bull;</span><span>{item.readTime}</span></div>
                <h4 className="text-sm md:text-base font-semibold text-slate-900 mb-2 leading-snug tracking-tight hover:text-[#649FF6] transition-colors line-clamp-2">
                  <Link href={`${baseHref}/${item.slug}`}>{item.title}</Link>
                </h4>
                <p className="text-xs text-slate-600 font-light leading-relaxed mb-4 line-clamp-2">{item.summary}</p>
                <Button href={`${baseHref}/${item.slug}`} variant="text" size="sm" iconRight={<ArrowRight className="w-3.5 h-3.5 ml-1" />} className="p-0 text-xs font-semibold text-[#649FF6] mt-auto self-start">Selengkapnya</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export default RelatedArticles;
