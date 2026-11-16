"use client";

import React, { useState } from "react";
import { ChevronUp, Utensils } from "lucide-react";

type Props = {
  restaurantName?: string;
  tagline?: string;
  address?: string;
  phone?: string;
  onOpen: () => void;
};

export default function CoverScreen({
  restaurantName = "JD Restaurant",
  tagline = "Enjoy the Taste",
  address = "Mini Bazar, Varachha Road, Surat",
  phone = "0261-2556649",
  onOpen,
}: Props) {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    setOpening(true);
    setTimeout(() => {
      onOpen();
    }, 350);
  };

  return (
    <div
      onClick={handleOpen}
      className={`absolute inset-0 z-40 bg-brand-maroon-binder flex flex-col justify-between p-6 select-none cursor-pointer transition-all duration-350 ease-out ${
        opening ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      }`}
      style={{
        backgroundImage: `radial-gradient(circle at 50% 30%, #7a1520 0%, #430a10 100%)`,
        boxShadow: "inset 0 0 40px rgba(0,0,0,0.6)",
      }}
    >
      {/* Gold metallic stitched border */}
      <div className="absolute inset-4 border-2 border-brand-gold/60 rounded-xl pointer-events-none flex flex-col justify-between p-4"
        style={{
          boxShadow: "inset 0 0 0 2px rgba(94, 15, 24, 0.8), 0 0 10px rgba(201, 162, 75, 0.3)",
        }}
      >
        {/* Four Gold Corner Ornaments */}
        <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-brand-gold" />
        <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-brand-gold" />
        <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-brand-gold" />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-brand-gold" />
      </div>

      {/* Top Tagline */}
      <div className="relative text-center mt-6">
        <p className="font-serif italic text-brand-gold text-sm tracking-wider uppercase">
          Welcome
        </p>
        <div className="w-16 h-0.5 bg-brand-gold/50 mx-auto my-2" />
        <h2 className="font-serif text-white/90 text-xs tracking-widest uppercase">
          {tagline}
        </h2>
      </div>

      {/* Center JD Circular Badge */}
      <div className="relative flex flex-col items-center my-auto">
        <div className="w-36 h-36 rounded-full border-2 border-brand-gold bg-[#4A0A12] flex flex-col items-center justify-center p-3 shadow-2xl relative"
          style={{
            boxShadow: "0 0 25px rgba(0,0,0,0.5), inset 0 0 15px rgba(201, 162, 75, 0.3)",
          }}
        >
          {/* Circular inner dotted ring */}
          <div className="absolute inset-2 rounded-full border border-dashed border-brand-gold/60" />
          
          {/* Monogram JD */}
          <span className="font-serif text-3xl font-extrabold text-brand-gold tracking-tight">
            J.D.
          </span>
          <span className="text-[10px] uppercase font-bold text-white tracking-widest mt-0.5">
            Restaurant
          </span>
          <div className="w-8 h-0.5 bg-brand-gold/60 mt-1 mb-0.5" />
          <span className="text-[8px] text-brand-gold/80 uppercase tracking-tighter">
            Pure Veg.
          </span>
        </div>

        <h1 className="font-serif text-2xl font-bold text-white tracking-wide mt-5 text-center drop-shadow-md">
          {restaurantName}
        </h1>
        <p className="text-xs text-brand-gold/80 mt-1 text-center font-sans">
          {address}
        </p>
        <p className="text-[11px] text-white/60 mt-0.5 text-center">
          Ph: {phone}
        </p>
      </div>

      {/* Bottom Swipe up / Tap hint */}
      <div className="relative text-center pb-2 animate-bounce flex flex-col items-center">
        <ChevronUp size={20} className="text-brand-gold mb-0.5" />
        <span className="text-xs font-serif text-brand-gold tracking-widest uppercase border border-brand-gold/40 px-3 py-1 rounded-full bg-black/20">
          Tap to Open Menu
        </span>
      </div>
    </div>
  );
}
