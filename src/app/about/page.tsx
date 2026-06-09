"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TwemojiFlag } from "@/components/TwemojiFlag";

function MissionBadge({ n }: { n: number }) {
  return (
    <span className="inline-block bg-[#FFCF0A] text-[#22252a] text-[13px] font-extrabold px-4 py-1.5 rounded-full tracking-widest mb-4">
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
    </div>
  );
}

function RewardCard({ text }: { text: string }) {
  return (
    <div className="bg-[#FF4D37] rounded-[20px] px-5 py-5 flex items-center gap-4 mx-auto max-w-sm">
      <img src="/img/prize_trophy.png" alt="트로피" className="h-16 object-contain flex-shrink-0" draggable={false} />
      <p className="text-white text-[14px] font-bold leading-snug text-left">{text}</p>
    </div>
  );
}


const FRIEND_PROFILES = [
  { img: "/img/profile_me_netherland.png", flag: "🇳🇱", alias: "쿠지뉴", realName: "김건수" },
  { img: "/img/profile_me_brazil.png", flag: "🇧🇷", alias: "Cusinho", realName: "박정남" },
  { img: "/img/profile_me_japan.png", flag: "🇯🇵", alias: "Nakamura", realName: "이호두" },
  { img: "/img/profile_me_usa.png", flag: "🇺🇸", alias: "Michael", realName: "최제리" },
];

function FriendsSection() {
  const count = FRIEND_PROFILES.length;
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const [labelPhase, setLabelPhase] = useState<"wait" | "in" | "out">("wait");

  useEffect(() => {
    const HOLD = 2200;
    const IMG_FADE = 450;
    const LABEL_DELAY = 200;
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
    <section className="bg-[#FF4D37] px-5 py-14 text-center overflow-hidden">
      <div className="max-w-[640px] mx-auto">
        <h2 className="text-[28px] font-extrabold text-white leading-snug font-kbl">
          내 친구들의 모습은?
        </h2>
        <p className="mt-3 text-[15px] font-medium text-white/80 leading-relaxed">
          친구들의 새로운 모습을 확인해보세용
        </p>

        <div className="mt-8 mx-auto max-w-[280px] relative">
          {/* First image is relative to set natural container height */}
          <img
            src={FRIEND_PROFILES[0].img}
            alt=""
            className="w-full object-contain invisible"
            draggable={false}
          />
          {FRIEND_PROFILES.map((f, i) => {
            const isCurrent = i === active;
            let imgOpacity = 0;
            let imgX = 40;
            let nameOpacity = 0;

            if (isCurrent) {
              if (phase === "in" || phase === "hold") {
                imgOpacity = 1;
                imgX = 0;
                nameOpacity = 1;
              } else {
                imgOpacity = 0;
                imgX = -50;
                nameOpacity = 0;
              }
            }

            return (
              <div key={i} className="absolute inset-0">
                <span
                  className="absolute top-[28%] -left-2 z-10 text-white text-[17px] font-kbl"
                  style={{
                    opacity: nameOpacity,
                    transition: "opacity 0.4s ease",
                    transform: "rotate(-6deg)",
                    textDecoration: "line-through",
                    textDecorationColor: "#FFCF0A",
                    textDecorationThickness: "3px",
                  }}
                >
                  {f.realName}
                </span>
                <img
                  src={f.img}
                  alt={f.alias}
                  className="w-full object-contain"
                  draggable={false}
                  style={{
                    opacity: imgOpacity,
                    transform: `translateX(${imgX}px)`,
                    transition: "opacity 0.45s ease, transform 0.45s ease",
                  }}
                />
              </div>
            );
          })}
          {/* Full-width gradient — bottom aligned with image bottom */}
          <div
            className="absolute bottom-0 pointer-events-none z-[5]"
            style={{
              left: "-50vw",
              right: "-50vw",
              height: "28%",
              background: "linear-gradient(to bottom, transparent, #FF4D37)",
            }}
          />
          {/* Name badge — in the lower portion of the gradient */}
          {FRIEND_PROFILES.map((f, i) => {
            const isCurrent = i === active;
            let lblOpacity = 0;
            let lblX = 60;
            if (isCurrent) {
              if (labelPhase === "in") { lblOpacity = 1; lblX = 0; }
              else if (labelPhase === "out") { lblOpacity = 0; lblX = -60; }
              else { lblOpacity = 0; lblX = 60; }
            }
            return (
              <div
                key={`lbl-${i}`}
                className="absolute left-1/2 z-10 flex items-stretch rounded-xl overflow-hidden shadow-lg"
                style={{
                  bottom: "5%",
                  transform: `translateX(calc(-50% + ${lblX}px))`,
                  opacity: lblOpacity,
                  transition: "opacity 0.35s ease, transform 0.35s ease",
                }}
              >
                <div className="bg-black flex items-center justify-center px-3" style={{ minWidth: 44 }}>
                  <TwemojiFlag emoji={f.flag} size={26} />
                </div>
                <div className="bg-white flex items-center px-4 py-2">
                  <span className="text-[#22252a] font-extrabold text-base whitespace-nowrap">{f.alias}</span>
                </div>
              </div>
            );
          })}
        </div>

        <button className="mt-6 w-full max-w-[280px] border-2 border-white/30 text-white text-[15px] font-bold px-8 py-3.5 rounded-2xl active:scale-[0.97] transition-transform">
          친구에게 공유하기
        </button>
      </div>
    </section>
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
      <p className="text-lg font-bold text-white/80 tracking-wide">플랩월드</p>
      <h1 className="mt-2 text-[36px] font-extrabold tracking-tight text-white leading-tight">
        어느 나라의
        <br />
        국가 대표
      </h1>
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

      {/* ── 기간한정 나의 부캐 ── */}
      <section className="bg-[#96FF62] px-5 py-14 text-center">
        <div className="max-w-[640px] mx-auto">
          <h2 className="text-[28px] font-extrabold text-[#22252a] leading-snug font-kbl">
            기간한정
            <br />
            나의 부캐
          </h2>
          <p className="mt-4 text-[15px] font-medium text-[#22252a]/70 leading-relaxed">
            내 사진을 업로드하면
            <br />
            랜덤 국가의 AI 프로필이 만들어져요
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <div className="w-36 h-44 rounded-2xl overflow-hidden shadow-lg">
              <img src="/img/profile_me_brazil.png" alt="프로필 1" className="w-full h-full object-cover" draggable={false} />
            </div>
            <div className="w-36 h-44 rounded-2xl overflow-hidden shadow-lg mt-6">
              <img src="/img/profile_me_japan.png" alt="프로필 2" className="w-full h-full object-cover" draggable={false} />
            </div>
          </div>
          <p className="mt-6 text-[13px] font-bold text-[#22252a]/50">
            월드컵 기간에만 만들 수 있는 한정 프로필
          </p>
        </div>
      </section>

      {/* ── 내 친구들의 모습은? ── */}
      <FriendsSection />

      {/* ── Mission 1 — 부캐로 매치 3번 참여하기 ── */}
      <section className="bg-[#1570FF] px-5 py-14 text-center">
        <div className="max-w-[640px] mx-auto">
          <MissionBadge n={1} />
          <h2 className="text-[28px] font-extrabold text-white leading-snug font-kbl">
            부캐로 매치
            <br />
            3번 참여하기
          </h2>
          <p className="mt-4 text-[14px] font-medium text-white/70 leading-relaxed">
            소셜 매치에 참여하고 리워드를 받아가세요
          </p>

          <div className="mt-8">
            <svg viewBox="0 0 300 460" className="w-full max-w-[280px] mx-auto" style={{ height: 400 }}>
              <path
                d="M65,55 C115,55 130,95 155,120 C180,145 245,155 245,195 C245,235 195,260 155,285 C115,310 65,330 65,365 C65,400 160,445 245,430"
                stroke="white"
                strokeWidth="4"
                strokeDasharray="14 10"
                fill="none"
                strokeLinecap="round"
              />

              {/* Match 1 — top left */}
              <g transform="translate(65,55)">
                <g transform="rotate(45)">
                  <rect x="-30" y="-30" width="60" height="60" rx="8" fill="#22252a" stroke="#FFCF0A" strokeWidth="4" />
                </g>
                <text textAnchor="middle" dy="0.38em" fill="white" fontSize="28" fontWeight="800" fontFamily="var(--font-sans), sans-serif">1</text>
              </g>

              {/* Reward 1 */}
              <g transform="translate(155,120)">
                <circle r="20" fill="#1570FF" stroke="#FFCF0A" strokeWidth="3" />
                <polygon points="0,-9 8,-3 5,8 -5,8 -8,-3" fill="#FFCF0A" />
                <line x1="-6" y1="-3" x2="6" y2="-3" stroke="#D4A000" strokeWidth="1" />
              </g>

              {/* Match 2 — right */}
              <g transform="translate(245,195)">
                <g transform="rotate(45)">
                  <rect x="-30" y="-30" width="60" height="60" rx="8" fill="#22252a" stroke="#FFCF0A" strokeWidth="4" />
                </g>
                <text textAnchor="middle" dy="0.38em" fill="white" fontSize="28" fontWeight="800" fontFamily="var(--font-sans), sans-serif">2</text>
              </g>

              {/* Reward 2 */}
              <g transform="translate(155,285)">
                <circle r="20" fill="#1570FF" stroke="#FFCF0A" strokeWidth="3" />
                <polygon points="0,-9 8,-3 5,8 -5,8 -8,-3" fill="#FFCF0A" />
                <line x1="-6" y1="-3" x2="6" y2="-3" stroke="#D4A000" strokeWidth="1" />
              </g>

              {/* Match 3 — bottom left */}
              <g transform="translate(65,365)">
                <g transform="rotate(45)">
                  <rect x="-30" y="-30" width="60" height="60" rx="8" fill="#22252a" stroke="#FFCF0A" strokeWidth="4" />
                </g>
                <text textAnchor="middle" dy="0.38em" fill="white" fontSize="28" fontWeight="800" fontFamily="var(--font-sans), sans-serif">3</text>
              </g>

              {/* Reward 3 — bottom right */}
              <g transform="translate(245,430)">
                <circle r="20" fill="#1570FF" stroke="#FFCF0A" strokeWidth="3" />
                <polygon points="0,-9 8,-3 5,8 -5,8 -8,-3" fill="#FFCF0A" />
                <line x1="-6" y1="-3" x2="6" y2="-3" stroke="#D4A000" strokeWidth="1" />
              </g>
            </svg>
          </div>

          <div className="mt-6">
            <RewardCard text="레고® 에디션 FIFA 월드컵™ 공식 트로피 (1명)" />
          </div>
        </div>
      </section>

      {/* ── Mission 2 — 48개국 조끼 모으기 ── */}
      <section className="bg-[#96FF62] px-5 py-14 text-center">
        <div className="max-w-[640px] mx-auto">
          <MissionBadge n={2} />
          <h2 className="text-[28px] font-extrabold text-[#22252a] leading-snug font-kbl">
            48개국
            <br />
            조끼 모으기
          </h2>
          <p className="mt-4 text-[14px] font-medium text-[#22252a]/60 leading-relaxed">
            출석체크와 매치 참여로 조끼를 모아보세요
          </p>

          <PackFlip />

          <div className="mt-8">
            <RewardCard text="레고® 에디션 FIFA 월드컵™ 공식 트로피 (1명)" />
          </div>
        </div>
      </section>

      {/* ── Mission 3 — 우승국을 맞춰보세요! ── */}
      <section className="bg-[#1570FF] px-5 py-14 text-center">
        <div className="max-w-[640px] mx-auto">
          <MissionBadge n={3} />
          <h2 className="text-[28px] font-extrabold text-white leading-snug font-kbl">
            우승국을
            <br />
            맞춰보세요!
          </h2>
          <p className="mt-4 text-[14px] font-medium text-white/70 leading-relaxed">
            보유한 조끼로 우승국을 예측하세요
          </p>

          <div className="mt-8 flex justify-center gap-3">
            {[
              { flag: "🇰🇷", name: "대한민국", img: "/img/bibs_korea.png", filled: true },
              { flag: "🇩🇪", name: "선택하기", img: null, filled: false },
              { flag: "🇩🇪", name: "잠김", img: null, filled: false, locked: true },
            ].map((slot, i) => (
              <div key={i} className="flex-1 max-w-[100px]">
                <div className={`rounded-bl-[16px] rounded-br-[16px] rounded-tr-[16px] p-1 ${slot.filled ? "bg-[#96ff62]" : "bg-white/20"}`}>
                  {slot.filled && (
                    <div className="flex items-center gap-1 px-2 h-5">
                      <TwemojiFlag emoji={slot.flag} size={12} />
                      <span className="text-[10px] font-bold text-[#22252a]">{slot.name}</span>
                    </div>
                  )}
                  <div className={`flex h-[90px] items-center justify-center rounded-xl ${slot.filled ? "bg-[#22252a]" : "bg-white/10"} ${!slot.filled ? "mt-4" : ""}`}>
                    {slot.filled && slot.img ? (
                      <img src={slot.img} alt="" className="h-full object-contain p-2" />
                    ) : slot.locked ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    ) : (
                      <span className="text-white/40 text-[11px] font-bold">선택하기</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12px] font-medium text-white/50">
            예측은 조별 예선 종료 6/28(일)까지
          </p>

          <div className="mt-10">
            <RewardCard text="레고® 에디션 FIFA 월드컵™ 공식 트로피 (1명)" />
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
