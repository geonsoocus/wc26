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

      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
