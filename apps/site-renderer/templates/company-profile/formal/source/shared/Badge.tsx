import React from "react";
import { cn } from "../lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent" | "gray";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  className,
}) => {
  // Tema Formal: badge berbentuk kotak tegas dengan garis aksen di kiri (seperti label
  // dokumen resmi/stempel), bukan pil membulat, supaya konsisten dengan Card & Button.
  const styles = {
    primary: "bg-slate-50 text-slate-950 border-slate-950",
    secondary: "bg-slate-50 text-[#1E3A5F] border-[#1E3A5F]",
    accent: "bg-slate-50 text-slate-700 border-slate-500",
    gray: "bg-slate-100 text-slate-700 border-slate-300"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-none border-l-4 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em]",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
