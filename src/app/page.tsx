"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-surface-dark px-6 pt-16 pb-12 text-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-accent-green to-accent-blue blur-[120px]" />
        </div>
        <div className="relative z-10">
          <p className="mb-2 text-sm font-semibold tracking-widest uppercase text-accent-green">
            2026 FIFA World Cup
          </p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white">
            PLAB <span className="text-accent-green">FOOTBALL</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-gray-400">
            월드컵의 열기를 플랩에서!
            <br />
            조끼를 모으고, 나만의 선수 프로필을 만들어보세요
          </p>
        </div>
      </section>

      {/* Event Cards */}
      <section className="w-full max-w-lg space-y-4 px-5 py-8">
        <Link href="/vest" className="group block">
          <div className="relative overflow-hidden rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-green/10 text-2xl">
                🦺
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-surface-dark">조끼 모으기</h2>
                <p className="text-xs text-on-surface-variant">
                  48개국 플랩 조끼 컬렉션
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-on-surface-variant">
              매일 출석하고, 매치에 참여하고, POM에 선정되어 월드컵 48개국
              스타일의 플랩 조끼를 모아보세요
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-bold text-accent-blue">
              시작하기
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        </Link>

        <Link href="/profile" className="group block">
          <div className="relative overflow-hidden rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-blue/10 text-2xl">
                ⚽
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-surface-dark">월드컵 프로필</h2>
                <p className="text-xs text-on-surface-variant">
                  나만의 축구선수 프로필
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-on-surface-variant">
              내 사진으로 월드컵 국가대표 스타일 프로필을 만들고, 친구와
              공유하면 더 많은 국가 프로필을 만들 수 있어요
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-bold text-accent-blue">
              만들어보기
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        </Link>
      </section>

      {/* Quick Stats */}
      <section className="w-full max-w-lg px-5 pb-8">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "보유 조끼", value: "5", sub: "/48" },
            { label: "이번 주 매치", value: "1", sub: "/3" },
            { label: "프로필", value: "1", sub: "개" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-bl-[16px] rounded-br-[16px] rounded-tr-[16px] bg-surface-hover p-4 text-center"
            >
              <div className="text-2xl font-bold text-surface-dark">
                {stat.value}
                <span className="text-sm font-normal text-on-surface-variant">
                  {stat.sub}
                </span>
              </div>
              <div className="mt-1 text-xs text-on-surface-variant">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
