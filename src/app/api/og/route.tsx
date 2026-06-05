import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const profileUrl = new URL("/img/profile_me_netherland.png", req.nextUrl.origin).toString();
  const symbolUrl = new URL("/img/symbol.svg", req.nextUrl.origin).toString();

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          background: "#5fc0e1",
          position: "relative",
        }}
      >
        {/* Left: Flag + Symbol */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "absolute",
            left: 40,
            top: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              background: "#22252a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
            }}
          >
            🇳🇱
          </div>
          <div
            style={{
              width: 80,
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={symbolUrl} alt="" width={60} height={60} />
          </div>
        </div>

        {/* Right: Profile image */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            position: "absolute",
            right: 0,
            bottom: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profileUrl}
            alt=""
            width={580}
            height={580}
            style={{ objectFit: "contain", objectPosition: "bottom right" }}
          />
        </div>

        {/* Bottom stat bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 70,
            background: "#1570ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "0 60px",
            color: "white",
          }}
        >
          {[
            { label: "MATCH", value: "7" },
            { label: "LEVEL", value: "7" },
            { label: "보낸 칭찬", value: "72" },
            { label: "받은 칭찬", value: "48" },
            { label: "POM", value: "3" },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span style={{ fontSize: 13, opacity: 0.8, textTransform: "uppercase", letterSpacing: 1 }}>{s.label}</span>
              <span style={{ fontSize: 28, fontWeight: 700 }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
