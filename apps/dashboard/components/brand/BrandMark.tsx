import { Sparkles } from "lucide-react";

interface BrandMarkProps {
  compact?: boolean;
  className?: string;
}

export default function BrandMark({ compact = false, className = "" }: BrandMarkProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[#649FF6] via-[#B283AF] to-[#F56B71] text-white shadow-sm shadow-[#649FF6]/20">
        <Sparkles className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="leading-tight">
        <p className="font-black tracking-tight text-slate-900">Lentera Pasar</p>
        {!compact && <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">by LabKerKomIT Community</p>}
      </div>
    </div>
  );
}
