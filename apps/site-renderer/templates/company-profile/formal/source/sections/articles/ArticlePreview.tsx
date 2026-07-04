import React from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { SectionHeading } from "../../shared/SectionHeading";
import { ArticleItem } from "../../lib/types";
import { Card } from "../../shared/Card";
import { Badge } from "../../shared/Badge";
import { Button } from "../../shared/Button";

interface ArticlePreviewProps {
  articles: ArticleItem[];
  articlesHref?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  businessLogoUrl?: string;
  imageUrl?: string;
  ctaLabel?: string;
}

const EMPTY_STATE = (
  <div className="py-16 text-center">
    <div className="w-14 h-14 mx-auto rounded-none bg-slate-100 flex items-center justify-center mb-4">
      <span className="text-2xl text-slate-300">✦</span>
    </div>
    <p className="text-sm font-semibold text-slate-500">Belum Ada Artikel</p>
    <p className="text-xs text-slate-400 mt-1">Artikel akan tampil di sini setelah dipublikasikan.</p>
  </div>
);

export const ArticlePreview: React.FC<ArticlePreviewProps> = ({
  articles,
  articlesHref = "/articles",
  title = "Semua Publikasi Kami",
  subtitle,
  badge,
  businessLogoUrl,
  imageUrl,
  ctaLabel,
}) => {
  return (
    <section id="articles-list-section" className="bg-white">
      {imageUrl ? (
        <div className="relative py-16 md:py-20 mb-10 bg-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0">
            <img src={imageUrl} alt="" className="w-full h-full object-cover opacity-30" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950/90" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="accent" dark />
            {ctaLabel && (
              <div className="text-center -mt-6">
                <Button href="/contact" variant="secondary">{ctaLabel}</Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <SectionHeading title={title} subtitle={subtitle} badge={badge} badgeVariant="accent" />
          {ctaLabel && (
            <div className="text-center -mt-6 mb-6">
              <Button href="/contact" variant="outline">{ctaLabel}</Button>
            </div>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {articles.length === 0 ? EMPTY_STATE : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((item) => (
              <Card key={item.slug} className="flex flex-col h-full bg-white border border-slate-100">
                {/* Cover Image */}
                <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                  {item.coverImageUrl ? (
                    <img
                      src={item.coverImageUrl}
                      alt={item.title}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50">
                      <span className="text-3xl font-bold text-slate-200 font-mono">{item.category.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge variant="accent" className="bg-slate-900/80 text-white border-transparent backdrop-blur-sm">
                      {item.category}
                    </Badge>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-mono mb-3 flex-wrap">
                    {item.publishDate && (
                      <span className="flex items-center gap-1 text-sm text-slate-500">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(item.publishDate).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "Asia/Jakarta", // Mengunci zona waktu ke WIB
                        })} WIB
                      </span>
                    )}
                    {/* {item.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {item.readTime}
                      </span>
                    )} */}
                  </div>

                  {/* Title */}
                  <h4 className="text-base font-semibold text-slate-900 mb-2 leading-snug tracking-tight hover:text-[#1E3A5F] transition-colors">
                    <Link href={`${articlesHref}/${item.slug}`}>{item.title}</Link>
                  </h4>

                  {/* Summary */}
                  {item.summary && (
                    <p className="text-xs md:text-sm text-slate-600 font-light leading-relaxed mb-6 flex-grow line-clamp-3">
                      {item.summary}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    {item.author.name && (
                      <span className="text-xs text-slate-500 font-mono">
                        {item.author.name.split(",")[0]}
                      </span>
                    )}
                    <Button
                      href={`${articlesHref}/${item.slug}`}
                      variant="text"
                      size="sm"
                      iconRight={<ArrowRight className="w-4 h-4 ml-1" />}
                      className="p-0 text-xs font-semibold text-[#1E3A5F]"
                    >
                      Selengkapnya
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
export default ArticlePreview;
