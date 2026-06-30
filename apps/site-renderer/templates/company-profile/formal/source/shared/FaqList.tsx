"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FaqItem } from "../lib/types";
import { cn } from "../lib/utils";

interface FaqListProps {
  items: FaqItem[];
  className?: string;
}

export const FaqList: React.FC<FaqListProps> = ({ items, className }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={cn("space-y-4 max-w-3xl mx-auto", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border border-slate-200 rounded bg-white overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => toggleIndex(index)}
              className="w-full flex justify-between items-center px-6 py-4 text-left font-medium text-slate-800 hover:text-slate-900 hover:bg-slate-50 transition-colors focus:outline-none min-h-[44px]"
              aria-expanded={isOpen}
            >
              <span className="text-sm md:text-base pr-4">{item.question}</span>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-[#649FF6] flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
              )}
            </button>
            <div
              className={cn(
                "transition-all duration-300 ease-in-out",
                isOpen ? "max-h-[500px] border-t border-slate-100" : "max-h-0 pointer-events-none"
              )}
            >
              <div className="px-6 py-4 text-slate-600 text-sm md:text-base leading-relaxed font-light">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
