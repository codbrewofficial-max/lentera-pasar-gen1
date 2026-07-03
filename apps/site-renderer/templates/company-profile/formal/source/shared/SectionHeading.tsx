import React from "react";
import { cn } from "../lib/utils";
import { Badge } from "./Badge";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: "primary" | "secondary" | "accent" | "gray";
  align?: "left" | "center" | "right";
  className?: string;
  dark?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  badge,
  badgeVariant = "primary",
  align = "center",
  className,
  dark = false,
}) => {
  const alignmentClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <div className={cn("flex flex-col mb-12 md:mb-16", alignmentClass[align], className)}>
      {badge && (
        <Badge variant={badgeVariant} className="mb-3">
          {badge}
        </Badge>
      )}
      <h2
        className={cn(
          "text-3xl md:text-4xl font-bold tracking-tight leading-tight",
          dark ? "text-white" : "text-slate-950"
        )}
      >
        {title}
      </h2>
      {/* Garis aksen tegas (bukan pil membulat) — kesan garis bawah dokumen formal */}
      <div
        className={cn(
          "my-4 h-[3px] w-16",
          badgeVariant === "primary" ? "bg-slate-950" :
          badgeVariant === "secondary" ? "bg-[#1E3A5F]" :
          badgeVariant === "accent" ? "bg-slate-500" : "bg-slate-400"
        )}
      />
      {subtitle && (
        <p
          className={cn(
            "text-base md:text-lg max-w-2xl font-light leading-relaxed",
            dark ? "text-slate-300" : "text-slate-600"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
