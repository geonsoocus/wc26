import type { Metadata } from "next";
import { Geist, Geist_Mono, Russo_One } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const russoOne = Russo_One({
  variable: "--font-russo",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PLAB x WC26",
  description: "플랩 월드 — 월드컵의 열기를 플랩에서!",
  openGraph: {
    title: "쿠스님이 플랩월드에 초대했어요",
    description: "내 글로벌 프로필을 만들고 글로벌 축구 대축제에 참여해보세요",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "쿠스님이 플랩월드에 초대했어요",
    description: "내 글로벌 프로필을 만들고 글로벌 축구 대축제에 참여해보세요",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${russoOne.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <div>{children}</div>
        <BottomNav />
      </body>
    </html>
  );
}
