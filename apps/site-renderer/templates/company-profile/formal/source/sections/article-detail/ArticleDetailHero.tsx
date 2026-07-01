import React from "react";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import type { ArticleItem } from "../../lib/types";
import { Badge } from "../../shared/Badge";

interface ArticleDetailHeroProps {
  article: ArticleItem;
  backHref?: string;
  showPublishedDate?: boolean;
  showCoverImage?: boolean;
}

export const ArticleDetailHero: React.FC<ArticleDetailHeroProps> = ({ article, backHref = "/articles", showPublishedDate = true, showCoverImage = false }) => {
  return (
    <section id="article-detail-hero-section" className="bg-slate-900 text-white py-12 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#649FF6_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href={backHref} className="inline-flex items-center space-x-2 text-xs font-mono font-semibold text-[#649FF6] hover:underline uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Artikel</span>
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-slate-400 mb-4">
          <Badge variant="primary">{article.category}</Badge>
          {showPublishedDate && (
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>
                {new Date(article.publishDate).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Asia/Jakarta", // Mengunci zona waktu ke WIB
                })} WIB
              </span>
            </div>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-white mb-6">{article.title}</h1>
        {showCoverImage && article.coverImageUrl && (
          <div className="relative aspect-[16/8] w-full rounded-lg overflow-hidden bg-slate-800 mb-8">
            <img src={article.coverImageUrl} alt={article.title} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        )}
        <div className="flex items-center space-x-4 border-t border-slate-800 pt-6">
          <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-800 border border-slate-700">
            <img src={article.author.avatarUrl} alt={article.author.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white leading-tight">{article.author.name}</span>
            <span className="text-xs text-[#649FF6] font-mono leading-none mt-1">{article.author.role}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ArticleDetailHero;
