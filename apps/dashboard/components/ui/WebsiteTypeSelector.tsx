"use client";

import { Briefcase, ShoppingBag, Check } from "lucide-react";

export type WebsiteTypeValue = "company_profile" | "catalog_product";

interface WebsiteTypeOption {
  value: WebsiteTypeValue;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const OPTIONS: WebsiteTypeOption[] = [
  {
    value: "company_profile",
    label: "Company Profile",
    description: "Profil bisnis, layanan, portfolio/hasil kerja, dan testimoni.",
    icon: Briefcase
  },
  {
    value: "catalog_product",
    label: "Katalog Produk",
    description: "Jual produk fisik dengan harga, varian, dan galeri gambar.",
    icon: ShoppingBag
  }
];

interface WebsiteTypeSelectorProps {
  value: WebsiteTypeValue;
  onChange: (value: WebsiteTypeValue) => void;
  disabled?: boolean;
}

export default function WebsiteTypeSelector({ value, onChange, disabled = false }: WebsiteTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Tipe Website">
      {OPTIONS.map((option) => {
        const selected = value === option.value;
        const Icon = option.icon;
        return (
          <label
            key={option.value}
            className={`relative flex cursor-pointer flex-col gap-2 rounded-2xl border p-4 transition ${
              selected
                ? "border-[#649FF6] bg-[#649FF6]/5 ring-1 ring-[#649FF6]/30"
                : "border-slate-200 bg-white hover:border-slate-300"
            } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
          >
            <input
              type="radio"
              name="websiteType"
              className="sr-only"
              checked={selected}
              disabled={disabled}
              onChange={() => onChange(option.value)}
            />
            <div className="flex items-center justify-between">
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${selected ? "bg-[#649FF6] text-white" : "bg-slate-100 text-slate-500"}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              {selected && (
                <span className="h-5 w-5 rounded-full bg-[#649FF6] text-white flex items-center justify-center">
                  <Check className="h-3 w-3" />
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-slate-900">{option.label}</p>
            <p className="text-[11px] leading-relaxed text-slate-500">{option.description}</p>
          </label>
        );
      })}
    </div>
  );
}
