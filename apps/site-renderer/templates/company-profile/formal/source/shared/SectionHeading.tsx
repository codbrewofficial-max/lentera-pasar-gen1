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
          "text-3xl md:text-4xl font-semibold tracking-tight leading-tight",
          dark ? "text-white" : "text-slate-900"
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          "h-1 w-16 my-4 rounded",
          badgeVariant === "primary" ? "bg-[#649FF6]" :
          badgeVariant === "secondary" ? "bg-[#F56B71]" :
          badgeVariant === "accent" ? "bg-[#B283AF]" : "bg-slate-400"
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
