"use client";

import { useMemo } from "react";

interface EnhancedTextareaProps {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minRows?: number;
  maxLength?: number;
  helperText?: string;
  className?: string;
}

export default function EnhancedTextarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  minRows = 4,
  maxLength,
  helperText,
  className = ""
}: EnhancedTextareaProps) {
  const paragraphCount = useMemo(() => {
    const trimmed = value.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\n{2,}|\n/).filter(Boolean).length;
  }, [value]);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wide text-slate-500">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        id={id}
        required={required}
        rows={minRows}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[112px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[#649FF6] focus:outline-none focus:ring-2 focus:ring-[#649FF6]/20"
      />
      <div className="flex flex-col gap-1 text-[11px] leading-relaxed text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>{helperText || "Bisa ditulis beberapa paragraf. Tekan Enter untuk baris baru."}</span>
        <span className="font-mono text-slate-400">
          {maxLength ? `${value.length}/${maxLength}` : `${value.length} karakter`} · {paragraphCount} paragraf
        </span>
      </div>
    </div>
  );
}
