import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

export const alt =
  "Trustmailtoday — Land in the inbox, not the spam folder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          backgroundImage:
            "radial-gradient(circle at 18% 22%, rgba(34,197,94,0.22), transparent 45%), radial-gradient(circle at 85% 85%, rgba(10,100,188,0.18), transparent 45%)",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#22c55e",
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)",
            }}
          />
          Trustmailtoday
        </div>

        <div
          style={{
            marginTop: 40,
            display: "flex",
            flexDirection: "column",
            color: "white",
            fontSize: 72,
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          <span>Land in the inbox,</span>
          <span style={{ color: "#4ade80" }}>not the spam folder</span>
        </div>

        <div
          style={{
            marginTop: 32,
            color: "#cbd5e1",
            fontSize: 32,
            maxWidth: 900,
          }}
        >
          AI-powered email warmup that builds real sender reputation — secured
          by OAuth 2.0.
        </div>
      </div>
    ),
    { ...size }
  );
}
