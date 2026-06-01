import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0A0F14",
          color: "#F5F7FA",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px",
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 72% 34%, rgba(79,125,243,.25), transparent 260px), radial-gradient(circle at 20% 70%, rgba(201,169,110,.14), transparent 280px)",
          }}
        />
        <div style={{ position: "relative", fontSize: 30, color: "#C9A96E" }}>
          BG.
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 86, fontWeight: 700, lineHeight: 0.95 }}>
            Bora Girgin
          </div>
          <div style={{ marginTop: 28, fontSize: 36, color: "#A7B1BC" }}>
            Embedded Systems & PCB Design
          </div>
        </div>
        <div
          style={{
            position: "relative",
            height: 2,
            width: "100%",
            background:
              "linear-gradient(90deg, transparent, #C9A96E, #77B6FF, transparent)",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
