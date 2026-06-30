import React from "react";
import Link from "next/link";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { ArticleItem } from "../../lib/types";
import { Badge } from "../../shared/Badge";
import { Button } from "../../shared/Button";

interface FeaturedArticleProps {
  article: ArticleItem;
  articlesHref?: string;
  title?: string;
  subtitle?: string;
}

export const FeaturedArticle: React.FC<FeaturedArticleProps> = ({ article, articlesHref = "/articles", title, subtitle }) => {
  return (
    <section id="articles-featured" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="border-b border-slate-100 pb-4 mb-10">
            {title && <h3 className="text-lg font-semibold text-slate-900 tracking-tight">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-slate-500 font-light">{subtitle}</p>}
          </div>
        )}
        
        {/* Large Featured Card Block */}
        <div className="border border-slate-100 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-8">
          
          {/* Cover image area - left */}
          <div className="lg:col-span-6 relative aspect-video lg:aspect-auto rounded overflow-hidden bg-slate-50 min-h-[250px] lg:min-h-[380px]">
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover hover:scale-102 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4">
              <Badge variant="primary" className="bg-slate-900/80 text-white border-transparent backdrop-blur-sm">
                Analisis Sorotan (Featured)
              </Badge>
            </div>
          </div>

          {/* Text block - right */}
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div>
              {/* Meta information lines */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 font-mono mb-4">
                <Badge variant="primary">{article.category}</Badge>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{article.publishDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{article.readTime}</span>
                </div>
              </div>

              {/* Title and Summary */}
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900 leading-tight tracking-tight mb-4 hover:text-[#649FF6] transition-colors">
                <Link href={`${articlesHref}/${article.slug}`}>
                  {article.title}
                </Link>
              </h2>
              
              <p className="text-sm md:text-base text-slate-600 font-light leading-relaxed mb-6">
                {article.summary}
              </p>
            </div>

            {/* Author info & Button */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
                  <img
                    src={article.author.avatarUrl}
                    alt={article.author.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">{article.author.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono leading-none mt-0.5">{article.author.role}</p>
                </div>
              </div>

              <Button
                href={`${articlesHref}/${article.slug}`}
                variant="outline"
                size="sm"
                iconRight={<ArrowRight className="w-4 h-4" />}
                className="min-h-[38px]"
              >
                Baca Artikel
              </Button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
export default FeaturedArticle;
