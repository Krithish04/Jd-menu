"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Download, Printer, LayoutTemplate } from "lucide-react";

type Props = {
  siteUrl: string;
};

type TemplateType = "poster" | "tent" | "sticker";

export default function QrPageClient({ siteUrl }: Props) {
  const [url, setUrl] = useState(`${siteUrl}/menu`);
  const [size, setSize] = useState(512);
  const [fgColor, setFgColor] = useState("#1B6B3A");
  const [template, setTemplate] = useState<TemplateType>("poster");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrSvg, setQrSvg] = useState("");

  useEffect(() => {
    const generate = async () => {
      const dataUrl = await QRCode.toDataURL(url, {
        errorCorrectionLevel: "H",
        width: size,
        color: { dark: fgColor, light: "#ffffff" },
        margin: 2,
      });
      setQrDataUrl(dataUrl);

      const svgStr = await QRCode.toString(url, {
        type: "svg",
        errorCorrectionLevel: "H",
        color: { dark: fgColor, light: "#ffffff" },
        margin: 2,
      });
      setQrSvg(svgStr);
    };
    generate();
  }, [url, size, fgColor]);

  const downloadPng = () => {
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `jd-restaurant-qr-${size}.png`;
    a.click();
  };

  const downloadSvg = () => {
    const blob = new Blob([qrSvg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "jd-restaurant-qr.svg";
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-brand-green">
          QR Code & Table Cards
        </h1>
        <p className="text-xs text-brand-muted mt-0.5">
          Generate live high-error-correction QR codes and printable table cards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="md:col-span-1 bg-white border border-brand-green/20 rounded-xl p-5 space-y-4 shadow-xs">
          <h2 className="font-serif font-bold text-xs uppercase text-brand-green tracking-wider border-b border-brand-cream-dark pb-2">
            Configuration
          </h2>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1">
              Public Menu URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full border border-brand-green/40 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-green bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1">
              Resolution
            </label>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full border border-brand-green/40 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-brand-green bg-white"
            >
              <option value={256}>256 × 256 px (Web)</option>
              <option value={512}>512 × 512 px (Standard Print)</option>
              <option value={1024}>1024 × 1024 px (High Res Print)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1">
              QR Foreground Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="border border-brand-green/40 rounded h-8 w-14 cursor-pointer"
              />
              <span className="text-xs text-brand-muted font-mono">{fgColor}</span>
            </div>
          </div>

          <div className="border-t border-brand-cream-dark pt-3">
            <label className="block text-xs font-semibold text-brand-text mb-1.5">
              Print Template Design
            </label>
            <div className="space-y-1.5">
              {[
                { id: "poster", label: "A5 Table Poster (Standee)" },
                { id: "tent", label: "Folded Table Tent Card" },
                { id: "sticker", label: "Compact Table Sticker" },
              ].map((t) => (
                <label
                  key={t.id}
                  className={`flex items-center gap-2 p-2 rounded border cursor-pointer text-xs ${
                    template === t.id
                      ? "border-brand-green bg-brand-green/10 text-brand-green font-bold"
                      : "border-brand-cream-dark hover:bg-brand-cream text-brand-text"
                  }`}
                >
                  <input
                    type="radio"
                    name="template"
                    checked={template === t.id}
                    onChange={() => setTemplate(t.id as TemplateType)}
                    className="accent-brand-green"
                  />
                  <span>{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 bg-brand-green text-white rounded-lg py-2 text-xs font-bold hover:bg-brand-green-hover transition-colors shadow-xs"
            >
              <Printer size={15} />
              Print Card
            </button>
            <div className="flex gap-2">
              <button
                onClick={downloadPng}
                className="flex-1 flex items-center justify-center gap-1.5 border border-brand-green text-brand-green rounded-lg py-1.5 text-xs font-semibold hover:bg-brand-green/5 transition-colors"
              >
                <Download size={13} />
                PNG
              </button>
              <button
                onClick={downloadSvg}
                className="flex-1 flex items-center justify-center gap-1.5 border border-brand-green text-brand-green rounded-lg py-1.5 text-xs font-semibold hover:bg-brand-green/5 transition-colors"
              >
                <Download size={13} />
                SVG
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="md:col-span-2 flex flex-col items-center justify-center bg-white border border-brand-green/20 rounded-xl p-8 shadow-xs">
          <p className="text-xs text-brand-muted mb-4 uppercase tracking-wider font-semibold">
            Print Preview: {template === "poster" ? "A5 Poster" : template === "tent" ? "Table Tent" : "Compact Sticker"}
          </p>

          {/* Template 1: A5 Poster */}
          {template === "poster" && (
            <div
              id="print-card"
              className="w-full max-w-sm border-4 border-brand-green rounded-2xl p-6 bg-brand-cream text-center shadow-md relative"
              style={{
                boxShadow: "inset 0 0 0 2px #C9A24B, 0 10px 25px rgba(0,0,0,0.1)",
              }}
            >
              {/* Corner Gold Caps */}
              <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-brand-gold" />
              <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-brand-gold" />
              <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-brand-gold" />
              <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-brand-gold" />

              <span className="text-[10px] uppercase font-bold text-brand-maroon tracking-widest">
                Welcome to
              </span>
              <h2 className="font-serif text-2xl font-bold text-brand-green mt-0.5">
                JD Restaurant
              </h2>
              <p className="text-[11px] text-brand-muted">
                Mini Bazar, Varachha Road, Surat • Pure Veg.
              </p>

              {/* QR Image */}
              <div className="my-4 bg-white p-3 rounded-xl border-2 border-brand-green/30 inline-block shadow-inner">
                {qrDataUrl && (
                  <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
                )}
              </div>

              <div className="bg-brand-green text-white py-1.5 px-3 rounded-full inline-block my-1">
                <p className="text-xs font-bold tracking-wide">
                  📱 Scan with your camera to view menu
                </p>
              </div>
              <p className="font-serif text-xs font-bold text-brand-maroon mt-1.5">
                મેનૂ જોવા માટે કેમેરાથી સ્કેન કરો
              </p>
              <p className="text-[10px] text-brand-muted mt-2">
                Ph: 0261-2556649 • Mo: 94291 65549
              </p>
            </div>
          )}

          {/* Template 2: Table Tent */}
          {template === "tent" && (
            <div
              id="print-card"
              className="w-full max-w-sm border-2 border-brand-green rounded-xl p-5 bg-white text-center shadow-md divide-y divide-brand-green/20"
            >
              <div className="pb-3">
                <h3 className="font-serif text-xl font-bold text-brand-green">
                  JD Restaurant
                </h3>
                <p className="text-[10px] text-brand-muted">Enjoy the Taste</p>
                {qrDataUrl && (
                  <img src={qrDataUrl} alt="QR Code" className="w-36 h-36 mx-auto my-2" />
                )}
                <p className="text-xs font-bold text-brand-maroon">
                  Scan to View Menu
                </p>
              </div>
              <div className="pt-3">
                <p className="text-[10px] text-brand-muted">
                  5% GST extra • Parcel charge extra
                </p>
              </div>
            </div>
          )}

          {/* Template 3: Sticker */}
          {template === "sticker" && (
            <div
              id="print-card"
              className="w-44 h-44 rounded-full border-4 border-brand-green bg-brand-cream flex flex-col items-center justify-center p-2 text-center shadow-md relative"
              style={{
                boxShadow: "inset 0 0 0 2px #C9A24B",
              }}
            >
              <span className="font-serif text-[10px] font-bold text-brand-green">
                JD Restaurant
              </span>
              {qrDataUrl && (
                <img src={qrDataUrl} alt="QR Code" className="w-24 h-24 my-0.5" />
              )}
              <span className="text-[9px] font-bold text-brand-maroon">
                Scan for Menu
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Print stylesheet */}
      <style jsx global>{`
        @media print {
          body > * {
            display: none !important;
          }
          #print-card {
            display: block !important;
            margin: 2rem auto !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
