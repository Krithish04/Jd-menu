import React from "react";

export function VegSymbol({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-3 h-3 border-[1.5px] border-emerald-700 p-[1px] flex-shrink-0 bg-white rounded-[2px] ${className}`}
      title="Pure Vegetarian"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
    </span>
  );
}

export function StampBadge({ type }: { type: string }) {
  let label = "SPECIAL";
  if (type === "POPULAR") label = "POPULAR";
  else if (type === "NEW") label = "NEW";
  else if (type === "SPECIAL") label = "CHEF'S SPECIAL";

  return (
    <span
      className="inline-block px-1 py-0.2 border border-dashed border-brand-maroon text-brand-maroon text-[8px] font-bold uppercase tracking-wider rounded rotate-[-6deg] bg-brand-maroon/5 leading-tight select-none shadow-xs"
      style={{
        textShadow: "0.2px 0.2px 0 rgba(142,27,34,0.3)",
      }}
    >
      {label}
    </span>
  );
}
