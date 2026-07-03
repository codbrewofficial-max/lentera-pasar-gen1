import React from "react";
import Link from "next/link";
import { cn } from "../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "danger" | "text";
  size?: "sm" | "md" | "lg";
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  href,
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  fullWidth = false,
  className,
  ...props
}) => {
  // Tema Formal: sudut tegas (rounded-none), border 2px, huruf kapital berjarak lebar,
  // dan tanpa efek "scale" saat ditekan supaya kesan tetap serius/institusional.
  const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-wider transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-none border-2 cursor-pointer select-none min-h-[44px]";

  const variants = {
    primary: "bg-slate-950 hover:bg-[#1E3A5F] text-white border-slate-950 focus:ring-slate-950",
    secondary: "bg-[#1E3A5F] hover:bg-slate-950 text-white border-[#1E3A5F] focus:ring-[#1E3A5F]",
    outline: "bg-transparent border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-white focus:ring-slate-950",
    danger: "bg-red-700 hover:bg-red-800 text-white border-red-700 focus:ring-red-600",
    text: "bg-transparent border-transparent text-slate-950 hover:underline underline-offset-4 p-0 min-h-0 focus:ring-transparent focus:ring-offset-0"
  };

  const sizes = {
    sm: "px-4 py-1.5 text-[11px]",
    md: "px-6 py-2.5 text-xs",
    lg: "px-8 py-3 text-sm"
  };

  const combinedClasses = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth ? "w-full" : "",
    className
  );

  const content = (
    <>
      {iconLeft && <span className="mr-2 inline-flex items-center">{iconLeft}</span>}
      {children}
      {iconRight && <span className="ml-2 inline-flex items-center">{iconRight}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses} id={props.id}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {content}
    </button>
  );
};
