import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";

export const runtime = "edge";
export const alt = `${SITE.name} — ${SITE.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 100px",
            background: "#0b0b0a",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(100,255,218,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 60,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#b7f34a",
              marginRight: 12,
            }}
          />
          <span style={{ color: "#b7f34a", fontSize: 18, letterSpacing: 2 }}>
            {SITE.url.replace("https://", "")}
          </span>
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#f0ede5",
            lineHeight: 1.1,
            marginBottom: 24,
            letterSpacing: "-1px",
          }}
        >
          {SITE.name}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 32,
            color: "#8f8b82",
            fontWeight: 400,
            marginBottom: 48,
            lineHeight: 1.4,
          }}
        >
          {SITE.title}
        </div>

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 3,
            background: "#d6b27c",
            marginBottom: 40,
            borderRadius: 2,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            color: "#c9c5bb",
            maxWidth: 700,
            lineHeight: 1.5,
          }}
        >
          {SITE.location} · {SITE.availability}
        </div>
      </div>
    ),
    { ...size },
  );
}
