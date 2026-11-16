"use client";

import { X, Clock, ShieldCheck, Phone, MapPin } from "lucide-react";
import { Restaurant } from "@/types/menu";

type Props = {
  restaurant: Restaurant | null;
  language: "en" | "gu";
  onClose: () => void;
};

export default function InfoSheet({ restaurant, language, onClose }: Props) {
  const notices = restaurant?.notices || [];
  const isGu = language === "gu";

  return (
    <div
      className="absolute inset-0 z-50 bg-black/60 flex items-end select-none animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full bg-[#FAF3ED] rounded-t-2xl overflow-hidden max-h-[85vh] flex flex-col shadow-2xl border-t-2 border-brand-green"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-brand-green text-white flex items-center justify-between px-4 py-3">
          <h2 className="font-serif font-bold text-base tracking-wide">
            {isGu ? "રેસ્ટોરન્ટ માહિતી" : "Restaurant Information"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 min-w-[36px] min-h-[36px] flex items-center justify-center hover:bg-white/10 rounded-full"
            aria-label="Close information"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Pure Milk Paneer / Quality Banner */}
          {restaurant?.banner && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3 flex items-start gap-2.5">
              <ShieldCheck size={20} className="text-brand-green flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-brand-green">
                  {isGu ? "ગુણવત્તાની ખાતરી" : "Quality Promise"}
                </h4>
                <p className="text-xs text-emerald-900 font-medium mt-0.5">
                  {restaurant.banner}
                </p>
              </div>
            </div>
          )}

          {/* Notices */}
          {notices.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Clock size={16} className="text-brand-maroon" />
                <h3 className="font-serif text-sm font-bold text-brand-maroon">
                  {isGu ? "મહત્વપૂર્ણ સૂચનાઓ" : "Important Notices"}
                </h3>
              </div>
              <ul className="space-y-1.5 bg-white p-3 rounded-lg border border-brand-green/20">
                {notices.map((n) => (
                  <li key={n.id} className="text-xs text-brand-text flex items-start gap-2">
                    <span className="text-brand-green font-bold">•</span>
                    <span>{isGu && n.textGu ? n.textGu : n.textEn}</span>
                  </li>
                ))}
                <li className="text-xs text-brand-text flex items-start gap-2">
                  <span className="text-brand-green font-bold">•</span>
                  <span>
                    {isGu
                      ? "૫% જીએસટી તથા પાર્સલ ચાર્જ અલગથી રહેશે."
                      : "5% GST and Parcel charges are extra."}
                  </span>
                </li>
              </ul>
            </div>
          )}

          {/* Contact & Location */}
          <div className="border-t border-brand-green/20 pt-3 text-xs text-brand-text space-y-2">
            {restaurant?.address && (
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-brand-green flex-shrink-0 mt-0.5" />
                <span>{restaurant.address}</span>
              </div>
            )}
            {(restaurant?.phone || restaurant?.mobile) && (
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-brand-green flex-shrink-0" />
                <span>
                  {restaurant.phone} {restaurant.mobile ? ` / ${restaurant.mobile}` : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
