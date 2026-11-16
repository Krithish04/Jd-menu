"use client";

import React from "react";

type Props = {
  language: "en" | "gu";
  onChange: (lang: "en" | "gu") => void;
};

export default function LangSwitch({ language, onChange }: Props) {
  const isGu = language === "gu";

  const handleToggle = () => {
    const nextLang = isGu ? "en" : "gu";
    onChange(nextLang);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div
      role="switch"
      aria-checked={isGu}
      aria-label="Gujarati Language"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      className="relative flex items-center justify-between w-[72px] h-[32px] bg-[#E8DDD5] rounded-full p-0.5 cursor-pointer select-none border border-brand-green/30 focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-colors"
      style={{ minHeight: "32px" }}
    >
      {/* Sliding Knob */}
      <div
        className={`absolute top-0.5 bottom-0.5 w-[34px] bg-brand-green rounded-full shadow-md transition-transform duration-200 ease-out ${
          isGu ? "translate-x-[36px]" : "translate-x-0"
        }`}
      />

      {/* EN label */}
      <span
        className={`relative z-10 w-[34px] text-center text-[11px] font-bold transition-colors ${
          !isGu ? "text-white" : "text-brand-text/70"
        }`}
      >
        EN
      </span>

      {/* ગુજ label */}
      <span
        className={`relative z-10 w-[34px] text-center text-[11px] font-bold transition-colors ${
          isGu ? "text-white" : "text-brand-text/70"
        }`}
      >
        ગુજ
      </span>
    </div>
  );
}
