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
        "bg-white border border-slate-100 rounded shadow-sm overflow-hidden",
        hoverEffect && "hover:shadow-md hover:border-slate-200 transition-all duration-200",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};
