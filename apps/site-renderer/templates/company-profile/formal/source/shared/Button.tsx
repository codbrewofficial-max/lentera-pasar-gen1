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
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded border cursor-pointer select-none active:scale-98 min-h-[44px]";
  
  const variants = {
    primary: "bg-[#649FF6] hover:bg-[#4d8be4] text-white border-transparent focus:ring-[#649FF6]",
    secondary: "bg-[#F56B71] hover:bg-[#e0545b] text-white border-transparent focus:ring-[#F56B71]",
    outline: "bg-transparent border-[#649FF6] text-[#649FF6] hover:bg-slate-50 focus:ring-[#649FF6]",
    danger: "bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500",
    text: "bg-transparent border-transparent text-[#649FF6] hover:underline p-0 min-h-0 focus:ring-transparent focus:ring-offset-0"
  };

  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base"
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
