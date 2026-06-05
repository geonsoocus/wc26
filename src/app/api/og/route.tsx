import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #22252a 0%, #393d46 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(150,255,98,0.08)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: -120, left: -60, width: 500, height: 500, borderRadius: "50%", background: "rgba(21,112,255,0.06)", display: "flex" }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Globe emoji as logo */}
          <div style={{ fontSize: 80, display: "flex" }}>🌍</div>

          {/* Title */}
          <div
            style={{
              marginTop: 24,
              fontSize: 52,
              fontWeight: 800,
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span style={{ color: "#96ff62" }}>PLAB</span>
            <span>WORLD</span>
          </div>

          {/* Subtitle */}
          <div
            style={{
              marginTop: 16,
              fontSize: 28,
              color: "rgba(255,255,255,0.9)",
              display: "flex",
            }}
          >
            쿠스님이 플랩월드에 초대했어요
          </div>

          {/* Description */}
          <div
            style={{
              marginTop: 12,
              fontSize: 20,
              color: "rgba(255,255,255,0.5)",
              display: "flex",
            }}
          >
            내 글로벌 프로필을 만들고 글로벌 축구 대축제에 참여해보세요
          </div>

          {/* Country flags row */}
          <div
            style={{
              marginTop: 32,
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            {["🇰🇷", "🇧🇷", "🇩🇪", "🇫🇷", "🇯🇵", "🇳🇱", "🇦🇷", "🇪🇸"].map((flag) => (
              <div
                key={flag}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                }}
              >
                {flag}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            style={{
              marginTop: 32,
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#96ff62",
              padding: "14px 32px",
              borderRadius: 16,
              fontSize: 20,
              fontWeight: 700,
              color: "#22252a",
            }}
          >
            지금 참여하기
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
