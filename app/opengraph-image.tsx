import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "JD Restaurant Menu - Pure Veg, Surat";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#5E0F18", // Binder maroon
          padding: "48px",
          position: "relative",
        }}
      >
        {/* Inner cream page frame */}
        <div
          style={{
            width: "92%",
            height: "88%",
            backgroundColor: "#FBF1EC", // Cream paper
            border: "8px solid #1B6B3A", // Green frame
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "36px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          }}
        >
          {/* Circular badge */}
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#1B6B3A",
              border: "3px solid #C9A24B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: "32px",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            JD
          </div>

          {/* Restaurant Title */}
          <div
            style={{
              fontSize: "56px",
              fontWeight: "bold",
              color: "#1B6B3A",
              letterSpacing: "-1px",
              marginBottom: "12px",
              fontFamily: "serif",
            }}
          >
            JD Restaurant
          </div>

          {/* Tagline Ribbon */}
          <div
            style={{
              backgroundColor: "#8E1B22",
              color: "#FFFFFF",
              padding: "6px 24px",
              borderRadius: "4px",
              fontSize: "20px",
              fontWeight: "600",
              letterSpacing: "1px",
              marginBottom: "24px",
              textTransform: "uppercase",
            }}
          >
            100% Pure Veg • Punjabi • Chinese • South Indian • Gujarati
          </div>

          {/* Address */}
          <div
            style={{
              fontSize: "18px",
              color: "#5E0F18",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            Mini Bazar, Varachha Road, Surat, Gujarat - 395006
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "#1B6B3A",
              marginTop: "8px",
              fontWeight: "bold",
            }}
          >
            Ph: 0261-2556649 • Mo: 94291 65549
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
