"use client";

interface BooleanRadioProps {
  id: string;
  label?: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  trueLabel?: string;
  falseLabel?: string;
  disabled?: boolean;
}

export default function BooleanRadio({
  id,
  label,
  description,
  value,
  onChange,
  trueLabel = "Ya",
  falseLabel = "Tidak",
  disabled = false
}: BooleanRadioProps) {
  const options = [
    { value: true, label: trueLabel },
    { value: false, label: falseLabel }
  ];

  return (
    <fieldset className="space-y-2" aria-describedby={description ? `${id}-help` : undefined} disabled={disabled}>
      {label && <legend className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</legend>}
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-1.5 ring-1 ring-slate-200">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={`${id}-${option.label}`}
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition ${
                selected
                  ? "bg-white text-[#649FF6] shadow-sm ring-1 ring-[#649FF6]/30"
                  : "text-slate-500 hover:bg-white/70 hover:text-slate-800"
              } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <input
                type="radio"
                name={id}
                className="sr-only"
                checked={selected}
                disabled={disabled}
                onChange={() => onChange(option.value)}
              />
              <span className={`h-2.5 w-2.5 rounded-full ${selected ? "bg-[#649FF6]" : "bg-slate-300"}`} />
              {option.label}
            </label>
          );
        })}
      </div>
      {description && <p id={`${id}-help`} className="text-[11px] leading-relaxed text-slate-500">{description}</p>}
    </fieldset>
  );
}
