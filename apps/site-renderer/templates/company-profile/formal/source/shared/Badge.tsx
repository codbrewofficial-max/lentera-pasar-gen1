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
  const styles = {
    primary: "bg-[#649FF6]/10 text-[#649FF6] border-[#649FF6]/20",
    secondary: "bg-[#F56B71]/10 text-[#F56B71] border-[#F56B71]/20",
    accent: "bg-[#B283AF]/10 text-[#B283AF] border-[#B283AF]/20",
    gray: "bg-slate-100 text-slate-700 border-slate-200"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border uppercase",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
