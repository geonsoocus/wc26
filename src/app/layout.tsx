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
  description: "PLAB Football World Cup 2026 Event",
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
