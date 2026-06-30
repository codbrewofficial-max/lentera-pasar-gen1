import React from "react";
import { Share2 } from "lucide-react";
import type { ArticleItem } from "../../lib/types";

interface ArticleContentProps {
  article: ArticleItem;
  maxWidth?: string;
  showShareCta?: boolean;
  showCoverImage?: boolean;
}

function maxWidthClass(value?: string) {
  if (value === "wide") return "max-w-6xl";
  if (value === "narrow") return "max-w-3xl";
  return "max-w-4xl";
}

export const ArticleContent: React.FC<ArticleContentProps> = ({ article, maxWidth = "normal", showShareCta = false, showCoverImage = true }) => {
  return (
    <section id="article-detail-content-section" className="py-12 bg-white">
      <div className={`${maxWidthClass(maxWidth)} mx-auto px-4 sm:px-6 lg:px-8`}>
        {showCoverImage && (
          <div className="rounded-lg overflow-hidden bg-slate-50 border border-slate-100 shadow-sm mb-10 max-h-[480px]">
            <img src={article.coverImageUrl} alt={article.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        )}
        <div className="bg-slate-50 border-l-4 border-[#F56B71] p-6 rounded-r mb-8">
          <p className="text-slate-700 font-medium text-sm md:text-base leading-relaxed italic">&ldquo;{article.summary}&rdquo;</p>
        </div>
        <div className="text-slate-800 font-light leading-relaxed text-sm md:text-base space-y-6" style={{ letterSpacing: "0.015em" }}>
          <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-900 prose-headings:mt-8 prose-headings:mb-4 prose-h3:text-lg prose-h3:md:text-xl prose-p:mb-6 prose-p:leading-relaxed prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:space-y-2 prose-li:text-slate-700 prose-blockquote:border-l-4 prose-blockquote:border-[#649FF6] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-6 prose-blockquote:text-slate-800" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
        {showShareCta && (
          <div className="mt-10 rounded-lg border border-slate-100 bg-slate-50 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Bagikan artikel ini</h3>
              <p className="text-xs text-slate-500 mt-1">Salin tautan halaman ini dari browser untuk membagikannya.</p>
            </div>
            <div className="inline-flex items-center text-xs font-mono text-[#649FF6] uppercase tracking-wider"><Share2 className="w-4 h-4 mr-2" /> Share</div>
          </div>
        )}
      </div>
    </section>
  );
};
export default ArticleContent;
