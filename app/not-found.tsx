import Link from "next/link";
import { Utensils } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-maroon-binder flex items-center justify-center p-4">
      <div className="bg-brand-cream border-4 border-brand-green rounded-xl p-8 max-w-sm w-full text-center shadow-2xl relative">
        <div className="w-16 h-16 rounded-full bg-brand-green/10 border-2 border-brand-green flex items-center justify-center mx-auto mb-4 text-brand-green">
          <Utensils size={28} />
        </div>
        <h1 className="font-serif text-2xl font-bold text-brand-green mb-2">
          Page Not Found
        </h1>
        <p className="text-xs text-brand-muted mb-6 leading-relaxed">
          The dish or page you are looking for is not on our menu. Please return to the main menu.
        </p>
        <Link
          href="/menu"
          className="inline-block bg-brand-green text-white font-bold text-xs px-6 py-2.5 rounded-full hover:bg-brand-green-hover transition-colors shadow-xs"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
}
