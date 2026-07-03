import React from "react";
import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import Link from "next/link";
import type { ArticleItem } from "../../lib/types";
import { RichHtml } from "@/components/content/RichHtml";
import { Badge } from "../../shared/Badge";

// Section "article_detail.article_content" ini menggabungkan apa yang sebelumnya jadi 2
// section terpisah (Hero + Content) — sesuai keputusan penyederhanaan struktur Article
// Detail jadi 3 section saja: Content, Related, CTA.
interface ArticleContentProps {
  article: ArticleItem;
  backHref?: string;
  businessName?: string;
  businessLogoUrl?: string;
  contentMaxWidth?: string;
  showAuthor?: boolean;
  showPublishDate?: boolean;
  showShareLink?: boolean;
}

function maxWidthClass(value?: string) {
  if (value === "wide") return "max-w-6xl";
  if (value === "narrow") return "max-w-3xl";
  return "max-w-4xl";
}

export const ArticleContent: React.FC<ArticleContentProps> = ({
  article,
  backHref = "/articles",
  businessName,
  businessLogoUrl,
  contentMaxWidth = "normal",
  showAuthor = true,
  showPublishDate = true,
  showShareLink = true,
}) => {
  return (
    <section id="article-detail-content-section" className="bg-white">
      {/* Header (dulu section terpisah "Pembuka Detail Artikel") */}
      <div className="bg-slate-900 text-white py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1E3A5F_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className={`relative ${maxWidthClass(contentMaxWidth)} mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className="mb-6">
            <Link href={backHref} className="inline-flex items-center space-x-2 text-xs font-mono font-semibold text-[#1E3A5F] hover:underline uppercase tracking-wider">
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-slate-400 mb-4">
            {article.category && <Badge variant="primary">{article.category}</Badge>}
            {showPublishDate && article.publishDate && (
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>
                  {new Date(article.publishDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Jakarta",
                  })} WIB
                </span>
              </div>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight text-white mb-6">{article.title}</h1>
          {article.coverImageUrl && (
            <div className="relative aspect-[16/8] w-full rounded-none overflow-hidden bg-slate-800 mb-8">
              <img src={article.coverImageUrl} alt={article.title} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          )}
          {showAuthor && businessName && (
            <div className="flex items-center space-x-4 border-t border-slate-800 pt-6">
              {businessLogoUrl && (
                <div className="w-11 h-11 rounded-none overflow-hidden bg-slate-800 border border-slate-700">
                  <img src={businessLogoUrl} alt={businessName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white leading-tight">{businessName}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="py-12">
        <div className={`${maxWidthClass(contentMaxWidth)} mx-auto px-4 sm:px-6 lg:px-8`}>
          {article.summary && (
            <div className="bg-slate-50 border-l-4 border-[#8A6D3B] p-6 rounded-none mb-8">
              <p className="text-slate-700 font-medium text-sm md:text-base leading-relaxed italic">&ldquo;{article.summary}&rdquo;</p>
            </div>
          )}
          <div className="text-slate-800 font-light leading-relaxed text-sm md:text-base space-y-6" style={{ letterSpacing: "0.015em" }}>
            <RichHtml
              html={article.content}
              className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-900 prose-headings:mt-8 prose-headings:mb-4 prose-h3:text-lg prose-h3:md:text-xl prose-p:mb-6 prose-p:leading-relaxed prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:space-y-2 prose-li:text-slate-700 prose-blockquote:border-l-4 prose-blockquote:border-[#1E3A5F] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-6 prose-blockquote:text-slate-800"
              emptyFallback="Konten artikel belum tersedia."
            />
          </div>
          {showShareLink && (
            <div className="mt-10 rounded-none border border-slate-100 bg-slate-50 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Bagikan artikel ini</h3>
                <p className="text-xs text-slate-500 mt-1">Salin tautan halaman ini dari browser untuk membagikannya.</p>
              </div>
              <div className="inline-flex items-center text-xs font-mono text-[#1E3A5F] uppercase tracking-wider"><Share2 className="w-4 h-4 mr-2" /> Share</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
export default ArticleContent;
