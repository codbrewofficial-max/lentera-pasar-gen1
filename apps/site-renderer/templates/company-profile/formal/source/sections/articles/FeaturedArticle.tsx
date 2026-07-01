import React from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { ArticleItem } from "../../lib/types";
import { Badge } from "../../shared/Badge";
import { Button } from "../../shared/Button";

interface FeaturedArticleProps {
  article: ArticleItem;
  articlesHref?: string;
  title?: string;
  subtitle?: string;
  businessLogoUrl?: string;
}

export const FeaturedArticle: React.FC<FeaturedArticleProps> = ({
  article,
  articlesHref = "/articles",
  title,
  subtitle,
  businessLogoUrl,
}) => {
  return (
    <section id="articles-featured" className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="border-b border-slate-100 pb-4 mb-10">
            {title && <h3 className="text-lg font-semibold text-slate-900 tracking-tight">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-slate-500 font-light">{subtitle}</p>}
          </div>
        )}

        {/* Featured Card: full-width horizontal, image takes 40% */}
        <Link href={`${articlesHref}/${article.slug}`} className="group block">
          <div className="border border-slate-100 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-5">

            {/* Cover Image (2 cols) */}
            <div className="relative lg:col-span-2 aspect-video lg:aspect-auto min-h-[240px] bg-slate-100 overflow-hidden">
              {article.coverImageUrl ? (
                <img
                  src={article.coverImageUrl}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                  <span className="text-4xl font-bold text-slate-200 font-mono">{article.category.charAt(0)}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/10" />
              <div className="absolute top-4 left-4">
                <Badge variant="primary" className="bg-slate-900/80 text-white border-transparent backdrop-blur-sm text-xs">
                  Sorotan Utama
                </Badge>
              </div>
            </div>

            {/* Content (3 cols) */}
            <div className="lg:col-span-3 flex flex-col justify-between p-7 md:p-8">
              <div>
                {/* Category + meta */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono mb-4">
                  <Badge variant="primary">{article.category}</Badge>
                  {article.publishDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {article.publishDate}
                    </span>
                  )}
                  {/* {article.readTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {article.readTime}
                    </span>
                  )} */}
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-semibold text-slate-900 leading-tight tracking-tight mb-3 group-hover:text-[#649FF6] transition-colors">
                  {article.title}
                </h2>

                {/* Summary */}
                {article.summary && (
                  <p className="text-sm text-slate-600 font-light leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                )}
              </div>

              {/* Footer: author + CTA */}
              <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-50">
                {/* Author: logo bisnis sebagai avatar */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center">
                    {businessLogoUrl ? (
                      <img src={businessLogoUrl} alt={article.author.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <span className="text-xs font-bold text-slate-400 font-mono">
                        {article.author.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{article.author.name}</p>
                    {article.author.role && (
                      <p className="text-[10px] text-slate-500 font-mono">{article.author.role}</p>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" iconRight={<ArrowRight className="w-4 h-4" />} className="min-h-[36px]">
                  Baca Artikel
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};
export default FeaturedArticle;
