import React from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { ArticleItem } from "../../lib/types";
import { Card } from "../../shared/Card";
import { Badge } from "../../shared/Badge";
import { Button } from "../../shared/Button";

interface ArticlePreviewProps {
  articles: ArticleItem[];
  articlesHref?: string;
  title?: string;
}

export const ArticlePreview: React.FC<ArticlePreviewProps> = ({ articles, articlesHref = "/articles", title = "Semua Publikasi Kami" }) => {
  return (
    <section id="articles-list-section" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="border-b border-slate-100 pb-4 mb-10">
          <h3 className="text-lg font-semibold text-slate-900 tracking-tight">{title}</h3>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((item) => (
            <Card key={item.slug} className="flex flex-col h-full bg-white border border-slate-100">
              {/* Cover Image */}
              <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                <img
                  src={item.coverImageUrl}
                  alt={item.title}
                  className="object-cover w-full h-full hover:scale-103 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="accent" className="bg-slate-900/80 text-white border-transparent backdrop-blur-sm">
                    {item.category}
                  </Badge>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Meta details */}
                <div className="flex items-center space-x-4 text-xs text-slate-500 font-mono mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.publishDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.readTime}</span>
                  </div>
                </div>

                {/* Title and abstract */}
                <h4 className="text-base font-semibold text-slate-900 mb-2 leading-snug tracking-tight hover:text-[#649FF6] transition-colors">
                  <Link href={`${articlesHref}/${item.slug}`}>
                    {item.title}
                  </Link>
                </h4>
                
                <p className="text-xs md:text-sm text-slate-600 font-light leading-relaxed mb-6 flex-grow line-clamp-3">
                  {item.summary}
                </p>

                {/* Footer details */}
                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono">By {item.author.name.split(",")[0]}</span>
                  <Button
                    href={`${articlesHref}/${item.slug}`}
                    variant="text"
                    size="sm"
                    iconRight={<ArrowRight className="w-4 h-4 ml-1" />}
                    className="p-0 text-xs font-semibold text-[#649FF6]"
                  >
                    Selengkapnya
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
export default ArticlePreview;
