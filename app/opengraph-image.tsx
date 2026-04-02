import { ImageResponse } from "next/og";

export const alt = "Maison Blender — AI-bureau in Zuid-Limburg";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#888888",
            marginBottom: 24,
          }}
        >
          MAISON BLENDER
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#111111",
            lineHeight: 1.1,
            marginBottom: 32,
          }}
        >
          AI-bureau in
          <br />
          Zuid-Limburg
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#444444",
            lineHeight: 1.4,
          }}
        >
          Custom AI-agents · Procesautomatisering · Maatwerksoftware
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 80,
            fontSize: 20,
            color: "#888888",
          }}
        >
          maisonblender.com
        </div>
      </div>
    ),
    { ...size }
  );
}
