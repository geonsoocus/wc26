"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TwemojiFlag } from "@/components/TwemojiFlag";

function MissionBadge({ n }: { n: number }) {
  return (
    <span className="inline-block bg-[#22252a]/10 text-[#22252a] text-[11px] font-bold px-3 py-1 rounded-full tracking-widest mb-3">
      MISSION {String(n).padStart(2, "0")}
    </span>
  );
}

function PackFlip() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.8;
      const end = vh * 0.3;
      const t = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      setProgress(t);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const rotateY = progress * 180;
  const showBack = rotateY > 90;

  return (
    <div ref={ref} className="mt-8 mx-auto max-w-xs" style={{ perspective: 800 }}>
      <div
        className="relative mx-auto w-48 h-64"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateY(${rotateY}deg)`,
          transition: "transform 0.05s linear",
        }}
      >
        <img
          src="/img/daily_pack.svg"
          alt="네이션스팩"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ backfaceVisibility: "hidden", opacity: showBack ? 0 : 1 }}
          draggable={false}
        />
        <img
          src="/img/bibs_germany.png"
          alt="독일 조끼"
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            opacity: showBack ? 1 : 0,
          }}
          draggable={false}
        />
      </div>
      <p className="mt-4 text-[14px] font-bold text-[#22252a]">
        {showBack ? "랜덤 국가의 조끼를 획득!" : "출석체크를 할 때마다 랜덤 네이션스 팩 지급!"}
      </p>
    </div>
  );
}

function MatchdayProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.75;
      const end = vh * 0.15;
      const t = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      setProgress(t);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // progress 0→1 maps to completing steps 1→6
  // step thresholds: each of 6 nodes takes ~1/6 of progress
  const completedStep = Math.min(6, Math.floor(progress * 7));

  const nodes = [
    { type: "match" as const, step: 1, num: 1 },
    { type: "reward" as const, step: 2 },
    { type: "match" as const, step: 3, num: 2 },
    { type: "reward" as const, step: 4 },
    { type: "match" as const, step: 5, num: 3 },
    { type: "reward" as const, step: 6 },
  ];

  const getState = (step: number, type: string) => {
    const done = completedStep >= step;
    const active = !done && completedStep === step - 1 && type === "match";
    const claimable = !done && completedStep >= step - 1 && type === "reward" && completedStep === step - 1;
    return { done, active, claimable };
  };

  return (
    <div ref={ref} className="mt-8 mx-auto overflow-x-auto scrollbar-hide">
      <div className="flex items-start justify-center w-max mx-auto">
        {nodes.map((node, i) => {
          const { done, active, claimable } = getState(node.step, node.type);
          const isMatch = node.type === "match";
          return (
            <div key={i} className="flex items-start">
              <div className="flex flex-col items-center gap-1.5" style={{ width: isMatch ? 66 : 40 }}>
                <div className="flex items-center justify-center" style={{ height: 72 }}>
                  {isMatch ? (
                    <div className="relative" style={{ width: 66, height: 72 }}>
                      <svg width="66" height="72" viewBox="0 0 66 72">
                        <polygon
                          points="33,1 64,19 64,53 33,71 2,53 2,19"
                          fill={done || active ? "#22252a" : "#dfe1e5"}
                          stroke={done ? "#96ff62" : active ? "#96ff62" : "#bcc0c7"}
                          strokeWidth={done ? "3.5" : "1.5"}
                          className="transition-all duration-300"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        {done ? (
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#96ff62" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        ) : (
                          <span className={`text-2xl font-bold transition-colors duration-300 ${active ? "text-[#96ff62]" : "text-gray-400"}`}>{node.num}</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      done ? "border-[#96ff62] bg-[#96ff62] scale-110"
                        : claimable ? "border-[#96ff62] bg-[#96ff62] animate-pulse"
                        : "border-gray-300 bg-gray-200"
                    }`}>
                      {done ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      ) : claimable ? (
                        <span className="text-base">🎁</span>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                      )}
                    </div>
                  )}
                </div>
                <span className={`text-[11px] font-bold whitespace-nowrap transition-colors duration-300 ${
                  done ? "text-[#22252a]" : active || claimable ? "text-[#22252a]" : "text-[#999]"
                }`}>
                  {isMatch ? `매치데이 ${node.num}` : done ? "완료" : claimable ? "받기!" : "미리보기"}
                </span>
              </div>
              {i < nodes.length - 1 && (
                <div className="flex-shrink-0 transition-all duration-300" style={{ marginTop: 35 }}>
                  {done ? (
                    <div className="w-8 bg-[#96ff62]" style={{ height: 2 }} />
                  ) : (
                    <svg width="32" height="2"><line x1="0" y1="1" x2="32" y2="1" stroke="#d1d5db" strokeWidth="2" strokeDasharray="4 3" /></svg>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const HERO_PROFILES = [
  { img: "/img/profile_me_brazil.png", flag: "🇧🇷", name: "브라질", label: "Cusinho", color: [0, 100, 60] },
  { img: "/img/profile_me_netherland.png", flag: "🇳🇱", name: "네덜란드", label: "Van der Cus", color: [255, 100, 30] },
  { img: "/img/profile_me_japan.png", flag: "🇯🇵", name: "일본", label: "Nakamura Cus", color: [0, 40, 120] },
  { img: "/img/profile_me_usa.png", flag: "🇺🇸", name: "미국", label: "Michael Cus", color: [0, 50, 120] },
  { img: "/img/profile_cus.png", flag: "🇧🇷", name: "브라질", label: "Cusinho", color: [21, 112, 255] },
];

function lerpColor(a: number[], b: number[], t: number): string {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;
}

function useIsPC() {
  const [isPC, setIsPC] = useState(false);
  useEffect(() => {
    const check = () => setIsPC(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isPC;
}

function HeroContent() {
  return (
    <div className="relative z-10 text-center px-5 pt-14">
      <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-wide">
        06.12 — 07.20
      </span>
      <p className="mt-5 text-lg font-bold text-white/90">WELCOME TO</p>
      <h1
        className="mt-1 text-[42px] font-extrabold tracking-tight text-white leading-none"
        style={{ fontFamily: "var(--font-russo)" }}
      >
        플랩월드
      </h1>
      <div className="mt-5 text-[17px] font-bold text-white/90 leading-relaxed">
        <p>평범한 풋살러였던 내가</p>
        <p>플랩월드에선 48개국 축구선수가 됐다?!</p>
      </div>
    </div>
  );
}

function HeroBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute top-20 -right-12 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
    </div>
  );
}

function PCHero() {
  const count = HERO_PROFILES.length;
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const [labelPhase, setLabelPhase] = useState<"wait" | "in" | "out">("wait");

  useEffect(() => {
    const HOLD = 2500;
    const IMG_FADE = 500;
    const LABEL_DELAY = 250;
    let timeout: ReturnType<typeof setTimeout>;
    let labelTimeout: ReturnType<typeof setTimeout>;
    const cycle = () => {
      setPhase("in");
      setLabelPhase("wait");
      labelTimeout = setTimeout(() => setLabelPhase("in"), LABEL_DELAY);
      timeout = setTimeout(() => {
        setPhase("hold");
        timeout = setTimeout(() => {
          setLabelPhase("out");
          timeout = setTimeout(() => {
            setPhase("out");
            timeout = setTimeout(() => {
              setActive((prev) => (prev + 1) % count);
              cycle();
            }, IMG_FADE);
          }, LABEL_DELAY);
        }, HOLD);
      }, IMG_FADE);
    };
    cycle();
    return () => { clearTimeout(timeout); clearTimeout(labelTimeout); };
  }, [count]);

  return (
    <div className="relative overflow-hidden flex flex-col items-center bg-[#1570ff]" style={{ height: 800 }}>
      <HeroBg />
      <HeroContent />
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none max-w-[480px] mx-auto" style={{ height: 520 }}>
        {HERO_PROFILES.map((p, i) => {
          const isCurrent = i === active;
          let imgOpacity = 0;
          let imgX = 40;
          let lblOpacity = 0;
          let lblX = 80;
          if (isCurrent) {
            if (phase === "in" || phase === "hold") {
              imgOpacity = 1;
              imgX = 0;
            } else {
              imgOpacity = 0;
              imgX = -60;
            }
            if (labelPhase === "in") {
              lblOpacity = 1;
              lblX = 0;
            } else if (labelPhase === "out") {
              lblOpacity = 0;
              lblX = -80;
            } else {
              lblOpacity = 0;
              lblX = 80;
            }
          }
          return (
            <div key={i} className="absolute inset-0 flex items-end justify-center">
              <div className="relative w-full h-full">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-contain object-bottom"
                  draggable={false}
                  style={{
                    opacity: imgOpacity,
                    transform: `translateX(${imgX}px)`,
                    transition: "opacity 0.5s ease, transform 0.5s ease",
                  }}
                />
                <div
                  className="absolute left-1/2 flex items-stretch rounded-2xl overflow-hidden shadow-lg"
                  style={{
                    bottom: "14%",
                    transform: `translateX(calc(-50% + ${lblX}px))`,
                    opacity: lblOpacity,
                    transition: "opacity 0.4s ease, transform 0.4s ease",
                  }}
                >
                  <div className="bg-black flex items-center justify-center px-4" style={{ minWidth: 56 }}>
                    <TwemojiFlag emoji={p.flag} size={36} />
                  </div>
                  <div className="bg-white flex items-center px-5 py-3">
                    <span className="text-[#22252a] font-extrabold text-xl tracking-wide whitespace-nowrap">{p.label}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MobileHero() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const count = HERO_PROFILES.length;
  const RUNWAY_VH = 100 + count * 80;

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const t = Math.max(0, Math.min(1, -rect.top / scrollable));
      setProgress(t);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const idx = Math.min(count - 1, Math.floor(progress * count));
  const segLocal = (progress * count) - idx;
  const nextIdx = Math.min(count - 1, idx + 1);
  const bgColor = idx === nextIdx
    ? lerpColor(HERO_PROFILES[idx].color, HERO_PROFILES[idx].color, 0)
    : lerpColor(HERO_PROFILES[idx].color, HERO_PROFILES[nextIdx].color, segLocal);

  return (
    <div ref={outerRef} className="relative" style={{ height: `${RUNWAY_VH}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center" style={{ backgroundColor: bgColor }}>
        <HeroBg />
        <HeroContent />
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none" style={{ height: "55vh" }}>
          {HERO_PROFILES.map((p, i) => {
            let opacity = 0;
            const segStart = i / count;
            const segEnd = (i + 1) / count;

            if (progress >= segStart && progress < segEnd) {
              const local = (progress - segStart) / (segEnd - segStart);
              if (i > 0 && local < 0.15) {
                opacity = local / 0.15;
              } else if (local > 0.85 && i < count - 1) {
                opacity = (1 - local) / 0.15;
              } else {
                opacity = 1;
              }
            } else if (i === count - 1 && progress >= segEnd) {
              opacity = 1;
            }

            return (
              <div
                key={i}
                className="absolute inset-0 flex items-end justify-center transition-opacity duration-100"
                style={{ opacity }}
              >
                <div className="relative w-full">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-contain object-bottom"
                    draggable={false}
                  />
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                    <TwemojiFlag emoji={p.flag} size={56} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StickyHero() {
  const isPC = useIsPC();
  return isPC ? <PCHero /> : <MobileHero />;
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#22252a]">
      {/* ── Sticky Hero ── */}
      <StickyHero />

      {/* ── Intro ── */}
      <section className="bg-[#f8fafb] px-5 py-14 text-center">
        <div className="max-w-[640px] mx-auto">
        <p className="text-[15px] text-[#1570ff] font-bold tracking-wide">EVENT GUIDE</p>
        <div className="mt-3 text-[22px] font-extrabold text-[#22252a] leading-snug">
          <p>플랩월드에 입장하신</p>
          <p>플래버님 환영해요</p>
        </div>
        <div className="mt-5 text-[17px] font-medium text-[#555] leading-relaxed">
          <p>지금부터 4가지 미션을 수행하고</p>
          <p>역대급 리워드 받아가시겠습니까?</p>
        </div>
        <div className="mt-8 flex justify-center gap-3 flex-wrap">
          <div className="bg-white rounded-2xl p-4 ">
            <img src="/img/prize_switch.png" alt="" className="h-24 object-contain" />
          </div>
          <div className="bg-white rounded-2xl p-4 ">
            <img src="/img/prize_ball.png" alt="" className="h-20 object-contain" />
          </div>
          <div className="bg-white rounded-2xl p-4 ">
            <img src="/img/prize_trophy.png" alt="" className="h-20 object-contain" />
          </div>
        </div>
        </div>
      </section>

      {/* ── Missions ── */}
      <section className="bg-[#f0f1f3] px-5 py-10">
        <div className="max-w-[640px] mx-auto space-y-5">

        {/* Mission 1 — AI 프로필 */}
        <div className="bg-white rounded-[48px] px-5 py-10 text-center ">
          <MissionBadge n={1} />
          <h2 className="text-[24px] font-extrabold text-[#22252a] leading-snug">
            나만의 <span className="text-[#1570ff]">AI 프로필</span> 만들고
            <br />
            웰컴팩 2종 받아가세요
          </h2>

          <div className="mt-8 mx-auto max-w-xs">
            <img src="/img/profile_sample.png" alt="프로필 샘플" className="w-full object-contain" draggable={false} />
          </div>

          <div className="mt-6 text-[15px] font-medium text-[#666] leading-relaxed">
            <p>내 사진을 업로드하면</p>
            <p>랜덤 국가의 AI 프로필이 만들어져요</p>
          </div>

          <div className="mt-5 bg-[#1570ff]/5 rounded-2xl px-5 py-4 mx-auto max-w-xs">
            <p className="text-[15px] font-bold text-[#1570ff]">
              친구들의 월드컵 프로필도 확인할 수 있어요
            </p>
          </div>
        </div>

        {/* Mission 2 — 출석체크 */}
        <div className="bg-white rounded-[48px] px-5 py-10 text-center ">
          <MissionBadge n={2} />
          <h2 className="text-[24px] font-extrabold text-[#22252a] leading-snug">
            <span className="text-[#0a8a00]">출석 체크</span>하고
            <br />
            48개국 랜덤 조끼를 확인해보세요
          </h2>

          <PackFlip />

          <div className="mt-8 bg-[#f0f2f5] rounded-3xl p-6 mx-auto max-w-xs">
            <p className="text-[17px] font-bold text-[#22252a] leading-relaxed">
              48개국 조끼를 다 모아
              <br />
              컬렉션을 완성하면
              <br />
              추첨을 통해 선물을 드려요!
            </p>
            <div className="mt-4 relative inline-block">
              <img src="/img/prize_ball.png" alt="" className="h-36 object-contain" />
            </div>
            <p className="mt-2 bg-[#1570ff] text-white text-[11px] font-bold px-3 py-1.5 rounded-full inline-block">
              아디다스 26™ FIFA 월드컵 미니볼 세트 (1명)
            </p>
          </div>
        </div>

        {/* Mission 3 — 매치데이 */}
        <div className="bg-white rounded-[48px] px-5 py-10 text-center ">
          <MissionBadge n={3} />
          <h2 className="text-[24px] font-extrabold text-[#22252a] leading-snug">
            소셜 매치 <span className="text-[#1570ff]">3번 참여</span>하고
            <br />
            다양한 경품과 굿즈 받아가세요
          </h2>

          <MatchdayProgress />

          <div className="mt-6 text-[15px] font-medium text-[#666] leading-relaxed">
            <p>매치데이 미션에 참여하면</p>
            <p>총 3가지 팩을 받을 수 있어요</p>
          </div>

          <div className="mt-6 flex justify-center items-stretch gap-3">
            {[
              { img: "/img/pack_nations_confirmed.png", label: "확정 네이션스 팩", h: "h-20" },
              { img: "/img/pack_reward.png", label: "리워드 팩", h: "h-28" },
              { img: "/img/pack_nations_random.png", label: "랜덤 네이션스 팩", h: "h-20" },
            ].map((p) => (
              <div key={p.label} className="flex-1 bg-[#f0f2f5] rounded-2xl p-3 flex flex-col items-center justify-end gap-2">
                <img src={p.img} alt={p.label} className={`${p.h} object-contain`} />
                <span className="text-[11px] font-bold text-[#666]">{p.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-[#0a8a00]/5 border border-[#0a8a00]/15 rounded-2xl px-5 py-4 mx-auto max-w-xs">
            <p className="text-[15px] font-bold text-[#0a8a00] leading-relaxed">
              리워드 팩을 많이 받을수록
              <br />
              다양한 경품과 플랩 굿즈를
              <br />
              받을 수 있는 확률이 높아져요
            </p>
          </div>
        </div>

        {/* Mission 4 — 우승국 예측 */}
        <div className="bg-white rounded-[48px] px-5 py-10 text-center ">
          <MissionBadge n={4} />
          <h2 className="text-[24px] font-extrabold text-[#22252a] leading-snug">
            2026 북중미 축구대회
            <br />
            <span className="text-[#4338ca]">우승국가</span>를 예측하세요
          </h2>
          <div className="mt-4 text-[15px] font-medium text-[#666] leading-relaxed">
            <p>매치 참가와 출석 체크로 얻은 국가의 조끼를</p>
            <p>우승국 예측 슬롯에 추가해요</p>
          </div>

          <div className="mt-6 bg-[#f0f2f5] rounded-3xl p-5 mx-auto max-w-xs">
            <div className="flex gap-2">
              <div className="flex-1 rounded-bl-[16px] rounded-br-[16px] rounded-tr-[16px] bg-[#96ff62] p-1">
                <div className="flex items-center gap-1 px-2 h-5">
                  <span className="text-[10px] font-bold text-[#22252a]">퀴라소</span>
                </div>
                <div className="flex h-[90px] items-center justify-center rounded-xl bg-[#22252a] px-3 py-2">
                  <img src="/img/bibs_korea.png" alt="" className="h-full object-contain" />
                </div>
              </div>
              <div className="flex-1 rounded-bl-[16px] rounded-br-[16px] rounded-tr-[16px] bg-[#e5e7eb] p-1 pt-5">
                <div className="flex h-[90px] items-center justify-center rounded-xl bg-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
              </div>
              <div className="flex-1 rounded-bl-[16px] rounded-br-[16px] rounded-tr-[16px] bg-[#e5e7eb] p-1 pt-5">
                <div className="flex h-[90px] items-center justify-center rounded-xl bg-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
              </div>
            </div>
            <p className="mt-3 text-[12px] font-medium text-[#888]">
              예측은 조별 예선 종료 6/28(일)까지
            </p>
          </div>

          <div className="mt-8 text-[17px] font-bold text-[#22252a] leading-relaxed">
            <p>우승 국가 예측에 성공한 플래버 중</p>
            <p>추첨을 통해 선물을 드려요!</p>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <div className="bg-[#f0f2f5] rounded-2xl p-4">
              <img src="/img/prize_switch.png" alt="" className="h-28 object-contain" />
              <p className="mt-2 bg-[#4338ca] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                닌텐도 스위치 2 (1명)
              </p>
            </div>
            <div className="bg-[#f0f2f5] rounded-2xl p-4">
              <img src="/img/prize_trophy.png" alt="" className="h-24 object-contain" />
              <p className="mt-2 bg-[#4338ca] text-white text-[10px] font-bold px-2.5 py-1 rounded-full leading-tight">
                레고® FIFA 트로피 (1명)
              </p>
            </div>
          </div>
        </div>

        </div>
      </section>

      {/* ── 안내 사항 ── */}
      <section className="bg-[#f5f5f5] px-5 pt-12 pb-28">
        <div className="max-w-[640px] mx-auto">
        <h2 className="text-xl font-extrabold text-[#22252a] text-center mb-6">안내 사항</h2>

        {[
          {
            title: "이벤트 세부 내용",
            items: [
              "2026년 6월 12일 - 2026년 7월 20일 기간 내 참가 완료한 소셜 매치, 스타터 매치에 한해 매치데이 미션이 인정돼요.",
              "게스트모집, 구장 예약은 매치데이 미션에서 제외돼요.",
              "슈퍼서브, 매니저서브, 매니저프리로 참가했을 경우 매치데이 미션 대상에서 제외돼요.",
              "리워드 팩은 매치 참가 완료 후 발급돼요.",
              "네이션스 팩, 리워드 팩 오픈은 플랩풋볼 앱에서만 가능해요.",
              "팩을 받았어도 오픈하지 않으면 조끼 및 리워드를 받을 수 없어요.",
              "우승국 예측 이벤트는 2026년 6월 28일(일) 23:59까지 참여할 수 있어요.",
              "리워드 확률, 수량, 재고 등은 운영 상황에 따라 조정될 수 있어요.",
              "상품이 소진되면 이벤트가 조기 종료될 수 있어요.",
              "브랜드의 내부 사정에 의해 이벤트가 취소될 수 있어요.",
            ],
          },
          {
            title: "상품 지급 및 발송 안내",
            items: [
              ["BBQ 치킨+콜라 세트와 미친피자 교환권", "은 당첨시점 기준 24시간 내 카카오 또는 문자 메시지로 전달됩니다."],
              "플랩풋볼 소셜 매치 할인 쿠폰은 즉시 발급됩니다.",
              ["실물 경품", "은 당첨 이후 배송 정보 수집을 위한 정보 입력이 필요하며, 기간 내 미회신/오입력 시 당첨이 취소됩니다."],
              "48개국 컬렉션 완성 이벤트 및 우승국 예측 이벤트 당첨자에게 카카오톡 알림톡 또는 문자메시지로 개별 연락드려요.",
              "48개국 컬렉션 완성 이벤트 당첨자 발표: 2026년 7월 22일(수)",
              "우승국 예측 이벤트 당첨자 발표: 2026년 7월 22일(수)",
              "당첨자 정보 입력 기간: 2026년 7월 22일(수) ~ 7월 28일(화) 23:59, 기간 내 정보 미입력 시 당첨이 취소됩니다.",
              "5만 원 초과 경품의 제세공과금(22%)은 당첨자가 부담하며, 세금 신고를 위한 개인정보 수집 절차 및 입금 절차가 진행됩니다.",
              "당첨자가 경품 수령을 포기할 경우, 해당 경품은 차순위 당첨자에게 지급되거나 회사 정책에 따라 지급되지 않을 수 있습니다.",
            ],
          },
          {
            title: "참여 시 주의사항",
            items: [
              "비정상적인 방법으로 팩 또는 리워드를 얻는 경우, 이벤트 참여 및 리워드 지급이 제한될 수 있어요.",
              "개인정보 수집 및 이용에 동의하지 않을 경우 이벤트 참여 및 리워드 지급이 제한될 수 있어요.",
              ["'내 프로필 만들기'", "를 누르면 카카오톡 또는 문자(SMS/MMS), 광고성 앱 푸시를 통한 플랩풋볼의 마케팅 정보 수신에 동의하게 돼요."],
              "당첨자 발표일 이전에 마케팅 수신 동의를 철회하면 상품 추첨 대상에서 제외될 수 있어요.",
            ],
          },
        ].map((sec) => (
          <div key={sec.title} className="bg-white rounded-[32px] p-5 mb-3 ">
            <p className="text-[15px] font-extrabold text-[#22252a] mb-3">{sec.title}</p>
            <ul className="space-y-2 list-disc pl-4">
              {sec.items.map((item, i) => (
                <li key={i} className="text-[13px] text-[#666] leading-[18px]">
                  {Array.isArray(item) ? (
                    <>
                      <span className="text-[#ff4029] font-bold">{item[0]}</span>
                      {item[1]}
                    </>
                  ) : (
                    item
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
        </div>
      </section>

      {/* ── Floating CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-5 pb-6 pt-4 pointer-events-none">
        <Link
          href="/"
          className="pointer-events-auto flex items-center justify-center gap-3 w-full max-w-lg mx-auto rounded-2xl bg-[#22252a] py-4 text-[17px] font-bold text-[#96ff62] shadow-xl shadow-black/20 active:scale-[0.98] transition-transform"
        >
          웰컴팩 받고 플랩월드 입장하기
          <span className="text-xl">🎁</span>
        </Link>
      </div>
    </div>
  );
}
