import React from "react";

export default function Watermark({ kind = "curry" }: { kind?: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.06] select-none z-0">
      {kind === "starter" || kind === "fries" ? (
        <svg width="280" height="280" viewBox="0 0 100 100" fill="none" stroke="#1B6B3A" strokeWidth="2">
          {/* Burger / Sandwich doodle */}
          <path d="M20 40 C20 20, 80 20, 80 40 Z" />
          <path d="M15 45 C25 42, 35 48, 50 44 C65 48, 75 42, 85 45" />
          <rect x="18" y="50" width="64" height="8" rx="2" stroke="#8E1B22" />
          <path d="M15 62 C25 60, 35 64, 50 61 C65 64, 75 60, 85 62" />
          <path d="M20 68 C20 80, 80 80, 80 68 Z" />
          <circle cx="35" cy="30" r="1.5" fill="#1B6B3A" />
          <circle cx="50" cy="27" r="1.5" fill="#1B6B3A" />
          <circle cx="65" cy="32" r="1.5" fill="#1B6B3A" />
        </svg>
      ) : kind === "soup" || kind === "chinese" ? (
        <svg width="280" height="280" viewBox="0 0 100 100" fill="none" stroke="#1B6B3A" strokeWidth="2">
          {/* Steaming Bowl doodle */}
          <path d="M15 45 C15 78, 30 85, 50 85 C70 85, 85 78, 85 45 Z" />
          <line x1="10" y1="45" x2="90" y2="45" strokeWidth="3" />
          <path d="M35 35 Q40 25 35 15" stroke="#8E1B22" strokeLinecap="round" />
          <path d="M50 35 Q55 25 50 15" stroke="#8E1B22" strokeLinecap="round" />
          <path d="M65 35 Q70 25 65 15" stroke="#8E1B22" strokeLinecap="round" />
        </svg>
      ) : kind === "dosa" || kind === "dosa-fancy" || kind === "south-indian" ? (
        <svg width="280" height="280" viewBox="0 0 100 100" fill="none" stroke="#1B6B3A" strokeWidth="2">
          {/* Dosa roll doodle */}
          <ellipse cx="50" cy="70" rx="42" ry="16" />
          <path d="M15 65 C25 35, 75 35, 85 65" stroke="#8E1B22" strokeWidth="2.5" />
          <circle cx="35" cy="70" r="7" stroke="#1B6B3A" />
          <circle cx="65" cy="70" r="7" stroke="#8E1B22" />
        </svg>
      ) : kind === "pizza" || kind === "grilled-pizza-brownie" ? (
        <svg width="280" height="280" viewBox="0 0 100 100" fill="none" stroke="#1B6B3A" strokeWidth="2">
          {/* Pizza slice doodle */}
          <polygon points="20,25 80,25 50,85" strokeWidth="2.5" />
          <path d="M18 25 Q50 15 82 25" stroke="#8E1B22" strokeWidth="4" />
          <circle cx="45" cy="40" r="5" stroke="#8E1B22" />
          <circle cx="58" cy="52" r="5" stroke="#8E1B22" />
          <circle cx="48" cy="65" r="4" stroke="#1B6B3A" />
        </svg>
      ) : (
        <svg width="280" height="280" viewBox="0 0 100 100" fill="none" stroke="#1B6B3A" strokeWidth="2">
          {/* Handi / Indian Thali doodle */}
          <circle cx="50" cy="50" r="42" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="36" stroke="#8E1B22" strokeDasharray="3 3" />
          <circle cx="36" cy="36" r="10" stroke="#1B6B3A" />
          <circle cx="64" cy="36" r="10" stroke="#1B6B3A" />
          <circle cx="36" cy="64" r="10" stroke="#8E1B22" />
          <circle cx="64" cy="64" r="10" stroke="#8E1B22" />
          <circle cx="50" cy="50" r="6" stroke="#1B6B3A" fill="#1B6B3A" fillOpacity="0.2" />
        </svg>
      )}
    </div>
  );
}
