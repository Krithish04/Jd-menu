import React from "react";

type IconProps = {
  className?: string;
  size?: number;
};

export function CategoryIcon({ name, size = 28, className = "" }: { name: string; size?: number; className?: string }) {
  switch (name) {
    case "starter":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <ellipse cx="16" cy="22" rx="13" ry="5" stroke="#1B6B3A" strokeWidth="1.5" />
          <path d="M7 16 C9 12, 14 11, 17 14 C20 17, 23 16, 25 14" stroke="#8E1B22" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="11" cy="18" r="1.5" fill="#8E1B22" />
          <circle cx="16" cy="17" r="1.5" fill="#1B6B3A" />
          <circle cx="21" cy="19" r="1.5" fill="#8E1B22" />
        </svg>
      );
    case "soup":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M6 14 C6 22, 11 25, 16 25 C21 25, 26 22, 26 14 Z" stroke="#1B6B3A" strokeWidth="1.5" />
          <line x1="4" y1="14" x2="28" y2="14" stroke="#1B6B3A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 10 C12 7, 14 6, 13 4" stroke="#8E1B22" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M16 10 C16 7, 18 6, 17 4" stroke="#8E1B22" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M20 10 C20 7, 22 6, 21 4" stroke="#8E1B22" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "salad":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M6 16 C6 23, 11 26, 16 26 C21 26, 26 23, 26 16 Z" stroke="#1B6B3A" strokeWidth="1.5" />
          <path d="M9 14 Q13 8 16 13 Q19 7 23 13" stroke="#1B6B3A" strokeWidth="1.5" fill="#1B6B3A" fillOpacity="0.1" />
          <circle cx="14" cy="12" r="2" fill="#8E1B22" />
          <circle cx="19" cy="14" r="1.5" fill="#8E1B22" />
        </svg>
      );
    case "chinese":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M7 16 C7 24, 11 26, 16 26 C21 26, 25 24, 25 16 Z" stroke="#1B6B3A" strokeWidth="1.5" />
          <line x1="5" y1="16" x2="27" y2="16" stroke="#1B6B3A" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="9" y1="6" x2="22" y2="21" stroke="#8E1B22" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="14" y1="5" x2="24" y2="18" stroke="#8E1B22" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "curry":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M7 14 C7 22, 10 25, 16 25 C22 25, 25 22, 25 14" stroke="#1B6B3A" strokeWidth="1.5" />
          <ellipse cx="16" cy="14" rx="9" ry="3" stroke="#1B6B3A" strokeWidth="1.5" />
          <path d="M4 14 C4 11, 7 11, 7 14" stroke="#8E1B22" strokeWidth="1.5" />
          <path d="M28 14 C28 11, 25 11, 25 14" stroke="#8E1B22" strokeWidth="1.5" />
          <path d="M14 9 C15 7, 17 7, 18 9" stroke="#8E1B22" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "special":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <line x1="5" y1="23" x2="27" y2="23" stroke="#1B6B3A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M7 21 C7 13, 11 11, 16 11 C21 11, 25 13, 25 21 Z" stroke="#1B6B3A" strokeWidth="1.5" />
          <circle cx="16" cy="8.5" r="2" stroke="#8E1B22" strokeWidth="1.5" />
          <polygon points="16,3 17,6 20,6 17.5,8 18.5,11 16,9.5 13.5,11 14.5,8 12,6 15,6" fill="#8E1B22" transform="scale(0.5) translate(16, -2)" />
        </svg>
      );
    case "roti":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <ellipse cx="16" cy="17" rx="12" ry="7" stroke="#1B6B3A" strokeWidth="1.5" />
          <ellipse cx="16" cy="15" rx="10" ry="5.5" stroke="#8E1B22" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="13" cy="15" r="1" fill="#8E1B22" />
          <circle cx="18" cy="14" r="1.2" fill="#8E1B22" />
          <circle cx="16" cy="18" r="0.9" fill="#8E1B22" />
        </svg>
      );
    case "rice":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M6 17 C6 24, 11 26, 16 26 C21 26, 26 24, 26 17 Z" stroke="#1B6B3A" strokeWidth="1.5" />
          <path d="M7 16 Q16 9 25 16" stroke="#8E1B22" strokeWidth="1.5" fill="#8E1B22" fillOpacity="0.1" />
          <path d="M13 8 C14 6, 15 6, 14 4" stroke="#1B6B3A" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M17 9 C18 7, 19 7, 18 5" stroke="#1B6B3A" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "dosa":
    case "dosa-fancy":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <ellipse cx="16" cy="22" rx="13" ry="5" stroke="#1B6B3A" strokeWidth="1.5" />
          <path d="M5 20 C8 11, 24 11, 27 20" stroke="#8E1B22" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="11" cy="22" r="2.5" stroke="#1B6B3A" strokeWidth="1" />
          <circle cx="21" cy="22" r="2.5" stroke="#8E1B22" strokeWidth="1" />
        </svg>
      );
    case "fries":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M9 14 L11 26 L21 26 L23 14 Z" stroke="#1B6B3A" strokeWidth="1.5" />
          <line x1="12" y1="14" x2="11" y2="7" stroke="#8E1B22" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="15" y1="14" x2="15" y2="5" stroke="#8E1B22" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="18" y1="14" x2="19" y2="6" stroke="#8E1B22" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20" y1="14" x2="22" y2="9" stroke="#8E1B22" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "pizza":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M7 9 L25 9 L16 26 Z" stroke="#1B6B3A" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M6 9 Q16 6 26 9" stroke="#8E1B22" strokeWidth="2" strokeLinecap="round" />
          <circle cx="14" cy="14" r="1.5" fill="#8E1B22" />
          <circle cx="18" cy="17" r="1.5" fill="#8E1B22" />
          <circle cx="15" cy="20" r="1" fill="#1B6B3A" />
        </svg>
      );
    case "beverage":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M10 10 L12 26 L20 26 L22 10 Z" stroke="#1B6B3A" strokeWidth="1.5" />
          <line x1="9" y1="10" x2="23" y2="10" stroke="#1B6B3A" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="16" y1="12" x2="19" y2="4" stroke="#8E1B22" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="18" x2="20" y2="18" stroke="#8E1B22" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      );
    case "shake":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <path d="M10 11 L13 26 L19 26 L22 11 Z" stroke="#1B6B3A" strokeWidth="1.5" />
          <path d="M9 11 Q16 7 23 11" stroke="#8E1B22" strokeWidth="1.5" fill="#8E1B22" fillOpacity="0.1" />
          <line x1="15" y1="13" x2="20" y2="3" stroke="#1B6B3A" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="16" cy="7" r="2" fill="#8E1B22" />
        </svg>
      );
    case "icecream":
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <polygon points="11,15 21,15 16,27" stroke="#8E1B22" strokeWidth="1.5" />
          <circle cx="16" cy="11" r="5" stroke="#1B6B3A" strokeWidth="1.5" />
          <path d="M16 6 L16 4 C16 3, 18 3, 18 4" stroke="#8E1B22" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "thali":
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <circle cx="16" cy="16" r="12" stroke="#1B6B3A" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" stroke="#8E1B22" strokeWidth="1" />
          <circle cx="20" cy="12" r="3" stroke="#8E1B22" strokeWidth="1" />
          <circle cx="12" cy="20" r="3" stroke="#8E1B22" strokeWidth="1" />
          <circle cx="20" cy="20" r="3" stroke="#8E1B22" strokeWidth="1" />
          <circle cx="16" cy="16" r="2" stroke="#1B6B3A" strokeWidth="1" />
        </svg>
      );
  }
}
