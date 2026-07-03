import React from "react";
import { cn } from "../lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
  id?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = true,
  onClick,
  id,
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={cn(
        // Tema Formal: sudut tegas, garis aksen tebal di atas (kesan dokumen/sertifikat
        // resmi), tanpa shadow membulat — border warna yang berubah dipakai sebagai
        // penanda hover, bukan bayangan lembut.
        "bg-white border border-slate-200 border-t-4 border-t-slate-950 rounded-none overflow-hidden",
        hoverEffect && "hover:border-t-[#1E3A5F] hover:border-slate-300 transition-colors duration-150",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};
