"use client";

import { useState, useEffect, useRef, useCallback, Suspense, Fragment } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { COUNTRIES } from "@/data/countries";
import { TwemojiFlag } from "@/components/TwemojiFlag";

function useEscClose(isOpen: boolean, onClose: () => void) {
  const handler = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);
  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, handler]);
}

// ─── Pack & Reward Types ───
type PackType = "nations" | "reward";

interface Pack {
  id: number;
  type: PackType;
  label: string;
  image: string;
  guaranteedCountry?: string;
  mockReward: NationsReward | RewardPackReward;
}

interface NationsReward {
  kind: "nations";
  country: string; // country code
}

interface RewardPackReward {
  kind: "reward";
  item: string;
}

const BONUS_REWARD_POOL = [
  "1,000원 할인 쿠폰",
  "2,000원 할인 쿠폰",
  "5,000원 할인 쿠폰",
  "FREE 1경기 무료 쿠폰",
  "대한민국 국가대표 유니폼",
];

function rollRewardPackRewards(): { baseTokens: number; bonus: string | null } {
  const baseTokens = Math.floor(Math.random() * 100) + 1;
  const hasBonus = Math.random() < 0.4;
  const bonus = hasBonus ? BONUS_REWARD_POOL[Math.floor(Math.random() * BONUS_REWARD_POOL.length)] : null;
  return { baseTokens, bonus };
}

// ─── Scenario Data ───
type Scenario = "new" | "active" | "invited";

const SCENARIO_DATA = {
  new: {
    label: "케이스1: 신규 유저",
    desc: "이벤트를 처음 발견한 유저",
    ownedVests: [] as string[],
    packs: [
      { id: 1, type: "nations" as PackType, label: "웰컴 네이션스팩", image: "/img/daily_pack.svg", guaranteedCountry: "KOR", mockReward: { kind: "nations" as const, country: "KOR" } },
      { id: 2, type: "reward" as PackType, label: "웰컴 리워드팩", image: "/img/match_pack.svg", mockReward: { kind: "reward" as const, item: "프로필 생성 토큰 1개" } },
    ] as Pack[],
    stats: { match: 0, level: "AM1", sentPraise: 0, receivedPraise: 0, pom: 0 },
    profiles: [] as { id: number; country: string; imageUrl: string; isActive: boolean }[],
    profileQuota: { used: 0, total: 3 },
    predictions: [
      { slot: 1, country: null, unlocked: true },
      { slot: 2, country: null, unlocked: true },
      { slot: 3, country: null, unlocked: true },
    ],
    friends: [] as { name: string; country: string; imageUrl: string | null; hasProfile?: boolean; stats?: { match: number; level: number; praise: number; pom: number; manner?: number } }[],
    hasProfile: false,
    matchMission: { completed: 0, total: 3 },
    inviter: null as { name: string; country: string; imageUrl: string | null } | null,
    tokens: 0,
    tokenHistory: [] as { date: string; label: string; amount: number }[],
    tickets: { profileCreate: 0, gacha: 0 },
    attendance: { total: 0, checkedToday: false, weekDays: [false, false, false, false, false, false, false] as boolean[] },
  },
  active: {
    label: "케이스2: 참여중 유저",
    desc: "프로필 생성 완료, 매치 참여 중",
    ownedVests: ["NOR", "KOR", "MEX", "GER"],
    packs: [
      { id: 1, type: "nations" as PackType, label: "네이션스팩", image: "/img/daily_pack.svg", guaranteedCountry: "GER", mockReward: { kind: "nations" as const, country: "GER" } },
      { id: 2, type: "nations" as PackType, label: "네이션스팩", image: "/img/daily_pack.svg", mockReward: { kind: "nations" as const, country: "JPN" } },
      { id: 3, type: "reward" as PackType, label: "리워드팩", image: "/img/match_pack.svg", mockReward: { kind: "reward" as const, item: "5,000원 할인 쿠폰" } },
      { id: 4, type: "reward" as PackType, label: "리워드팩", image: "/img/match_pack.svg", mockReward: { kind: "reward" as const, item: "무료 참가 쿠폰" } },
    ] as Pack[],
    stats: { match: 7, level: "AM5", sentPraise: 72, receivedPraise: 48, pom: 3 },
    profiles: [
      { id: 1, country: "BRA", imageUrl: "/img/profile_me_brazil.png", isActive: false },
      { id: 2, country: "JPN", imageUrl: "/img/profile_me_japan.png", isActive: false },
      { id: 3, country: "NED", imageUrl: "/img/profile_me_netherland.png", isActive: true },
      { id: 4, country: "USA", imageUrl: "/img/profile_me_usa.png", isActive: false },
    ],
    profileQuota: { used: 4, total: 5 },
    predictions: [
      { slot: 1, country: "KOR", unlocked: true },
      { slot: 2, country: null, unlocked: true },
      { slot: 3, country: null, unlocked: true },
    ],
    friends: [
      { name: "커스", country: "BRA", imageUrl: "/img/profile_cus.png", hasProfile: true, stats: { match: 12, level: 8, praise: 45, pom: 3, manner: 4.8 } },
      { name: "히어로", country: "FRA", imageUrl: "/img/profile_hero.png", hasProfile: true, stats: { match: 8, level: 6, praise: 32, pom: 1, manner: 4.2 } },
      { name: "호두", country: "ARG", imageUrl: "/img/profile_hodoo.png", hasProfile: true, stats: { match: 15, level: 9, praise: 58, pom: 5, manner: 4.9 } },
      { name: "라임", country: "ESP", imageUrl: "/img/profile_lime.png", hasProfile: true, stats: { match: 5, level: 4, praise: 18, pom: 0, manner: 3.8 } },
      { name: "막국", country: "GER", imageUrl: "/img/profile_macgook.png", hasProfile: true, stats: { match: 10, level: 7, praise: 41, pom: 2, manner: 4.5 } },
      { name: "큐", country: "KOR", imageUrl: "/img/profile_q.png", hasProfile: true, stats: { match: 20, level: 10, praise: 72, pom: 7, manner: 5.0 } },
      { name: "제리", country: "JPN", imageUrl: "/img/profile_zerry.png", hasProfile: true, stats: { match: 3, level: 3, praise: 12, pom: 0, manner: 4.0 } },
      { name: "정남", country: "NED", imageUrl: "/img/profile_jeongnam.png", hasProfile: true, stats: { match: 9, level: 6, praise: 35, pom: 2, manner: 4.6 } },
      { name: "민수", country: "KOR", imageUrl: null, hasProfile: false, stats: { match: 5, level: 3, praise: 10, pom: 0, manner: 3.5 } },
      { name: "지은", country: "KOR", imageUrl: null, hasProfile: false, stats: { match: 8, level: 5, praise: 20, pom: 1, manner: 4.1 } },
      { name: "태영", country: "KOR", imageUrl: null, hasProfile: false, stats: { match: 2, level: 2, praise: 3, pom: 0, manner: 3.2 } },
    ],
    hasProfile: true,
    matchMission: { completed: 1, total: 3 },
    inviter: null,
    tokens: 1200,
    tokenHistory: [
      { date: "2026-06-08", label: "리워드팩 오픈", amount: 42 },
      { date: "2026-06-08", label: "굿즈 뽑기", amount: -10 },
      { date: "2026-06-07", label: "리워드팩 오픈", amount: 78 },
      { date: "2026-06-07", label: "프로필 생성권 구매", amount: -10 },
      { date: "2026-06-06", label: "매치데이 1 달성", amount: 100 },
      { date: "2026-06-06", label: "리워드팩 오픈", amount: 15 },
      { date: "2026-06-06", label: "굿즈 뽑기", amount: -10 },
      { date: "2026-06-06", label: "굿즈 뽑기", amount: -10 },
      { date: "2026-06-05", label: "리워드팩 오픈", amount: 55 },
      { date: "2026-06-04", label: "출석 보너스", amount: 200 },
      { date: "2026-06-04", label: "플랩 크루 삭스 구매", amount: -80 },
      { date: "2026-06-03", label: "리워드팩 오픈", amount: 30 },
      { date: "2026-06-02", label: "웰컴 보너스", amount: 500 },
      { date: "2026-06-01", label: "리워드팩 오픈", amount: 300 },
    ],
    tickets: { profileCreate: 3, gacha: 2 },
    attendance: { total: 12, checkedToday: true, weekDays: [true, true, false, true, true, false, false] as boolean[] },
  },
  invited: {
    label: "케이스3: 초대받은 유저",
    desc: "친구의 공유 링크로 접근",
    ownedVests: [] as string[],
    packs: [
      { id: 1, type: "nations" as PackType, label: "웰컴 네이션스팩", image: "/img/daily_pack.svg", guaranteedCountry: "BRA", mockReward: { kind: "nations" as const, country: "BRA" } },
      { id: 2, type: "reward" as PackType, label: "웰컴 리워드팩", image: "/img/match_pack.svg", mockReward: { kind: "reward" as const, item: "프로필 생성 토큰 1개" } },
    ] as Pack[],
    stats: { match: 2, level: "AM2", sentPraise: 5, receivedPraise: 8, pom: 0 },
    profiles: [] as { id: number; country: string; imageUrl: string; isActive: boolean }[],
    profileQuota: { used: 0, total: 3 },
    predictions: [
      { slot: 1, country: null, unlocked: true },
      { slot: 2, country: null, unlocked: true },
      { slot: 3, country: null, unlocked: true },
    ],
    friends: [] as { name: string; country: string; imageUrl: string | null; hasProfile?: boolean; stats?: { match: number; level: number; praise: number; pom: number; manner?: number } }[],
    hasProfile: false,
    matchMission: { completed: 0, total: 3 },
    inviter: { name: "커스", country: "BRA", imageUrl: "/img/profile_cus.png" },
    tokens: 100,
    tokenHistory: [
      { date: "2026-06-02", label: "웰컴 보너스", amount: 100 },
    ],
    tickets: { profileCreate: 0, gacha: 0 },
    attendance: { total: 3, checkedToday: false, weekDays: [true, false, true, false, true, false, false] as boolean[] },
  },
};

type Tab = "main" | "packs" | "friends" | "collection" | "store";
const VALID_TABS: Tab[] = ["main", "friends", "collection", "store", "packs"];

export default function VestPage() {
  return (
    <Suspense>
      <VestPageInner />
    </Suspense>
  );
}

function VestPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab") ?? "main";
  const activeTab: Tab = VALID_TABS.includes(tabParam as Tab) ? (tabParam as Tab) : "main";

  const setActiveTab = (tab: Tab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "main") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const qs = params.toString();
    router.push(`/${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const [scenario, setScenario] = useState<Scenario>("active");
  const [debugOpen, setDebugOpen] = useState(false);
  const [openedPack, setOpenedPack] = useState<Pack | null>(null);
  const [packPhase, setPackPhase] = useState<"hold" | "flash" | "reveal">("hold");
  useEscClose(debugOpen, () => setDebugOpen(false));
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const [inviteDismissed, setInviteDismissed] = useState(false);
  const [profilePickerOpen, setProfilePickerOpen] = useState(false);
  const [pomOpen, setPomOpen] = useState(false);
  useEscClose(profilePickerOpen, () => setProfilePickerOpen(false));
  useEscClose(pomOpen, () => setPomOpen(false));
  useEscClose(!!openedPack, () => setOpenedPack(null));
  const [showIntro, setShowIntro] = useState(!SCENARIO_DATA[scenario].hasProfile);

  const data = SCENARIO_DATA[scenario];

  const [activeProfileId, setActiveProfileId] = useState(data.profiles.find(p => p.isActive)?.id ?? 0);

  // Reset state on scenario change
  useEffect(() => {
    setActiveTab("main");
    setOpenedPack(null);
    setWelcomeDismissed(false);
    setInviteDismissed(false);
    setProfilePickerOpen(false);
    setShowIntro(!SCENARIO_DATA[scenario].hasProfile);
    setActiveProfileId(SCENARIO_DATA[scenario].profiles.find(p => p.isActive)?.id ?? 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario]);

  useEffect(() => {
    if (openedPack) {
      setPackPhase("hold");
    }
  }, [openedPack]);

  const packCount = data.packs.length;
  const TABS: { key: Tab; label: string; badge?: number }[] = [
    { key: "main", label: "미션" },
    { key: "friends", label: "친구" },
    { key: "collection", label: "컬렉션" },
    { key: "packs", label: "팩", badge: packCount > 0 ? packCount : undefined },
    { key: "store", label: "스토어" },
  ];

  if (showIntro) {
    return (
      <div className="max-w-[480px] mx-auto bg-white min-h-screen flex flex-col">
        <ProfileIntroScreen onStart={() => setShowIntro(false)} />

        {/* Debug FAB */}
        <button
          onClick={() => setDebugOpen(!debugOpen)}
          className="fixed bottom-5 right-5 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-surface-dark text-white shadow-lg active:scale-95"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
          </svg>
        </button>

        {debugOpen && (
          <div className="fixed inset-0 z-[60] flex items-end lg:items-center justify-center bg-[rgba(0,0,0,0.5)]" onClick={() => setDebugOpen(false)}>
            <div className="w-full max-w-lg rounded-t-2xl lg:rounded-2xl bg-white p-5 pb-10 lg:pb-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-surface-dark">시나리오 선택</h3>
                <button onClick={() => setDebugOpen(false)} className="text-on-surface-variant text-sm">닫기</button>
              </div>
              <div className="space-y-2">
                {(Object.entries(SCENARIO_DATA) as [Scenario, typeof SCENARIO_DATA.new][]).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => { setScenario(key); setDebugOpen(false); }}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                      scenario === key ? "border-accent-green bg-accent-green/5" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-sm font-bold text-surface-dark">{val.label}</div>
                    <div className="text-xs text-on-surface-variant mt-0.5">{val.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-[1024px] mx-auto pb-20 lg:pb-0">
      {/* Invite Banner (Case 3) */}
      {scenario === "invited" && !inviteDismissed && (
        <InviteBanner inviter={data.inviter!} onDismiss={() => setInviteDismissed(true)} />
      )}


      {/* 2-column layout on lg, single column on mobile */}
      <div className="flex flex-col lg:flex-row lg:items-start">
        {/* Left: Profile Card (sticky on desktop) */}
        <div className="lg:w-[380px] lg:flex-shrink-0 lg:sticky lg:top-0 lg:self-start">
          <section className="relative overflow-hidden rounded-bl-[40px] lg:rounded-bl-none lg:rounded-br-[40px]" style={{ background: "#5fc0e1" }}>
            {/* Token Badge */}
            <button
              onClick={() => setActiveTab("store")}
              className="absolute top-3 right-4 z-20 flex items-center gap-1.5 rounded-full bg-surface-dark/80 backdrop-blur-sm pl-1.5 pr-3 py-1.5 cursor-pointer active:scale-95 transition-transform"
            >
              <img src="/img/token.svg" alt="token" className="h-5 w-5" draggable={false} />
              <span className="text-sm font-russo text-accent-green">{data.tokens.toLocaleString()}</span>
            </button>
            <div className="relative z-10 flex items-center pt-6 pb-0">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => data.hasProfile && setProfilePickerOpen(true)}
                  className={`flex items-center justify-center w-16 h-16 bg-surface-dark ${data.hasProfile ? "cursor-pointer active:scale-95 transition-transform" : ""}`}
                >
                  {activeProfileId === 0 ? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <TwemojiFlag
                      emoji={COUNTRIES.find(c => c.code === (data.profiles.find(p => p.id === activeProfileId)?.country ?? "JPN"))?.flag ?? "🇯🇵"}
                      size={40}
                    />
                  )}
                </button>
                <div className="flex items-center justify-center w-16 bg-white p-2">
                  <img src="/img/symbol.svg" alt="WC26" className="w-12 h-auto" />
                </div>
              </div>
              <div className="flex-1 flex justify-end -mr-5 lg:mr-0 lg:justify-center">
                {data.hasProfile ? (
                  activeProfileId === 0 ? (
                    <button onClick={() => setProfilePickerOpen(true)} className="w-[260px] h-[260px] flex items-center justify-center active:scale-95 transition-transform">
                      <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity={0.6}>
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    </button>
                  ) : (
                    <button onClick={() => setProfilePickerOpen(true)} className="active:scale-95 transition-transform">
                      <img src={data.profiles.find(p => p.id === activeProfileId)?.imageUrl ?? data.profiles[0]?.imageUrl ?? "/img/profile.png"} alt="Player" className="w-[260px] h-[260px] object-contain" />
                    </button>
                  )
                ) : (
                  <button onClick={() => setProfilePickerOpen(true)} className="w-[260px] h-[260px] flex items-center justify-center active:scale-95 transition-transform">
                    <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity={0.6}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  </button>
                )}
              </div>
            </div>
            <div className="bg-accent-blue px-5 py-3">
              <div className="flex items-center justify-between text-white text-center">
                {[
                  { label: "MATCH", value: data.stats.match },
                  { label: "LEVEL", value: data.stats.level },
                  { label: "보낸 칭찬", value: data.stats.sentPraise },
                  { label: "받은 칭찬", value: data.stats.receivedPraise },
                  { label: "POM", value: data.stats.pom },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-semibold tracking-wider uppercase opacity-80">{stat.label}</span>
                    <span className={`font-russo ${typeof stat.value === "string" ? "text-lg" : "text-2xl"}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right: Tabs + Content */}
        <div className="flex-1 min-w-0">
          {/* Tabs */}
          <nav className="flex border-b border-gray-200 bg-white sticky top-0 z-50">
            {TABS.map((tab) => (
              <a
                key={tab.key}
                href={tab.key === "main" ? "/" : `/?tab=${tab.key}`}
                onClick={(e) => { e.preventDefault(); setActiveTab(tab.key); }}
                className={`flex-1 py-4 text-sm font-bold text-center transition-colors relative cursor-pointer ${
                  activeTab === tab.key ? "text-surface-dark" : "text-on-surface-variant"
                }`}
              >
                <span className="relative">
                  {tab.label}
                  {tab.badge && (
                    <span className="absolute -top-1.5 -right-4 flex h-4 w-4 items-center justify-center rounded-full bg-accent-blue text-[9px] font-bold text-white font-sans">
                      {tab.badge}
                    </span>
                  )}
                </span>
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-10 rounded-full bg-surface-dark" />
                )}
              </a>
            ))}
          </nav>

          {/* Tab Content */}
          {activeTab === "main" && (
            <MainTab
              data={data}
              scenario={scenario}
              onOpenProfilePicker={() => setProfilePickerOpen(true)}
            />
          )}
          {activeTab === "packs" && <PacksTab data={data} openedPack={openedPack} setOpenedPack={setOpenedPack} packPhase={packPhase} setPackPhase={setPackPhase} />}
          {activeTab === "friends" && <FriendsTab data={data} scenario={scenario} />}
          {activeTab === "collection" && <CollectionTab data={data} />}
          {activeTab === "store" && <StoreTab data={data} />}
        </div>
      </div>

      {/* Profile Picker Modal */}
      {profilePickerOpen && <ProfilePickerModal
        data={data}
        activeProfileId={activeProfileId}
        onSelect={(id) => { setActiveProfileId(id); setProfilePickerOpen(false); }}
        onClose={() => setProfilePickerOpen(false)}
      />}

      {/* POM Screen */}
      {pomOpen && (
        <PomScreen
          profileImage={data.profiles.find(p => p.id === activeProfileId)?.imageUrl ?? "/img/profile.png"}
          country={data.profiles.find(p => p.id === activeProfileId)?.country ?? "NED"}
          onClose={() => setPomOpen(false)}
        />
      )}

      {/* Debug FAB */}
      <button
        onClick={() => setDebugOpen(!debugOpen)}
        className="fixed bottom-5 right-5 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-surface-dark text-white shadow-lg active:scale-95"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
        </svg>
      </button>

      {/* Debug Panel */}
      {debugOpen && (
        <div className="fixed inset-0 z-[60] flex items-end lg:items-center justify-center bg-[rgba(0,0,0,0.5)]" onClick={() => setDebugOpen(false)}>
          <div className="w-full max-w-lg rounded-t-2xl lg:rounded-2xl bg-white p-5 pb-10 lg:pb-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-surface-dark">시나리오 선택</h3>
              <button onClick={() => setDebugOpen(false)} className="text-on-surface-variant text-sm">닫기</button>
            </div>
            <div className="space-y-2">
              {(Object.entries(SCENARIO_DATA) as [Scenario, typeof SCENARIO_DATA.new][]).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => { setScenario(key); setDebugOpen(false); }}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                    scenario === key
                      ? "border-accent-green bg-accent-green/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-sm font-bold text-surface-dark">{val.label}</div>
                  <div className="text-xs text-on-surface-variant mt-0.5">{val.desc}</div>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-surface-dark mb-2">이벤트</h3>
              <button
                onClick={() => { setPomOpen(true); setDebugOpen(false); }}
                className="w-full rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-left"
              >
                <div className="text-sm font-bold text-surface-dark">⚽ POM 획득</div>
                <div className="text-xs text-on-surface-variant mt-0.5">매치 참여 후 POM 선정 화면</div>
              </button>
              <a
                href="/match"
                className="block w-full rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-left"
              >
                <div className="text-sm font-bold text-surface-dark">📋 매치 상세</div>
                <div className="text-xs text-on-surface-variant mt-0.5">매치 디테일 페이지 (WC26 리워드 + 프로필)</div>
              </a>
              <a
                href="/locker"
                className="block w-full rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-left"
              >
                <div className="text-sm font-bold text-surface-dark">🚪 라커룸</div>
                <div className="text-xs text-on-surface-variant mt-0.5">매치 라커룸 — 팀 편성, 프로필 확인</div>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Profile Intro Screen ───
function ProfileIntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8">
      <div style={{ perspective: "600px" }}>
        <img
          src="/img/symbol.svg"
          alt="WC26"
          className="w-20 h-auto"
          style={{ animation: "globeSpin 6s linear infinite", transformStyle: "preserve-3d" }}
        />
      </div>

      <h1 className="mt-5 text-3xl font-kbl text-surface-dark">플랩 월드</h1>
      <p className="mt-2 text-sm text-on-surface-variant text-center leading-relaxed">
        AI가 월드컵 국가대표 스타일로<br />나만의 프로필을 만들어드려요
      </p>

      <div className="mt-8 flex items-end justify-center gap-3">
        <div className="w-[100px] overflow-hidden rounded-tr-[30px] shadow-lg -rotate-6 translate-y-2">
          <div className="relative bg-[#006847]" style={{ paddingBottom: "130%" }}>
            <img src="/img/profile_me_brazil.png" alt="sample" className="absolute inset-0 w-full h-full object-cover object-top" draggable={false} />
          </div>
          <div className="bg-accent-blue py-1.5 text-center">
            <span className="text-[8px] font-bold text-white">🇧🇷 브라질</span>
          </div>
        </div>
        <div className="w-[120px] overflow-hidden rounded-tr-[36px] shadow-xl z-10">
          <div className="relative bg-[#ff6600]" style={{ paddingBottom: "130%" }}>
            <img src="/img/profile_me_netherland.png" alt="sample" className="absolute inset-0 w-full h-full object-cover object-top" draggable={false} />
          </div>
          <div className="bg-accent-blue py-1.5 text-center">
            <span className="text-[8px] font-bold text-white">🇳🇱 네덜란드</span>
          </div>
        </div>
        <div className="w-[100px] overflow-hidden rounded-tr-[30px] shadow-lg rotate-6 translate-y-2">
          <div className="relative bg-[#bc002d]" style={{ paddingBottom: "130%" }}>
            <img src="/img/profile_me_japan.png" alt="sample" className="absolute inset-0 w-full h-full object-cover object-top" draggable={false} />
          </div>
          <div className="bg-accent-blue py-1.5 text-center">
            <span className="text-[8px] font-bold text-white">🇯🇵 일본</span>
          </div>
        </div>
      </div>

      <a
        href="/profile/create?mode=first"
        className="mt-10 w-full max-w-[320px] rounded-xl bg-accent-green py-4 text-base font-bold text-surface-dark text-center block"
      >
        시작하기
      </a>
    </div>
  );
}

// ─── Welcome Overlay (Case 1) ───
function WelcomeOverlay({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center bg-[rgba(0,0,0,0.7)] backdrop-blur-sm">
      <div className="mx-6 w-full max-w-sm rounded-2xl bg-white p-8 text-center">
        <div className="text-4xl">🎉</div>
        <h2 className="mt-3 text-xl font-bold text-surface-dark">PLAB WC26에 오신 걸 환영해요!</h2>
        <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
          2026 월드컵을 플랩에서 즐겨보세요!<br />
          웰컴 팩을 드렸어요. 열어서 첫 조끼를 받아보세요
        </p>
        <div className="mt-5 flex justify-center">
          <img src="/img/match_pack.svg" alt="Welcome Pack" className="h-[120px]" />
        </div>
        <button
          onClick={onDismiss}
          className="mt-6 w-full rounded-xl bg-accent-green py-3 text-sm font-bold text-surface-dark"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}

// ─── Invite Banner (Case 3) ───
function InviteBanner({
  inviter,
  onDismiss,
}: {
  inviter: { name: string; country: string; imageUrl: string | null };
  onDismiss: () => void;
}) {
  const country = COUNTRIES.find((c) => c.code === inviter.country)!;
  const [friendAdded, setFriendAdded] = useState(false);
  const [sliding, setSliding] = useState(false);

  const handleAdd = () => {
    setFriendAdded(true);
    setTimeout(() => setSliding(true), 800);
    setTimeout(() => onDismiss(), 1200);
  };

  return (
    <div
      className={`bg-accent-blue px-5 py-4 flex items-center gap-3 transition-all duration-400 ${
        sliding ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
      }`}
    >
      <div className="relative flex-shrink-0">
        {inviter.imageUrl ? (
          <img src={inviter.imageUrl} alt={inviter.name} className="w-10 h-10 rounded-full object-cover border-2 border-white" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-sm font-bold text-white">{inviter.name[0]}</span>
          </div>
        )}
        <div className="absolute -bottom-0.5 -right-0.5">
          <TwemojiFlag emoji={country.flag} size={14} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">
          {inviter.name}님이 초대했어요!
        </p>
        <p className="text-[10px] text-white/70">
          프로필을 만들면 {inviter.name}님에게도 보상이 전달돼요
        </p>
      </div>
      <div className="flex flex-col gap-1.5 flex-shrink-0">
        {!friendAdded ? (
          <button
            onClick={handleAdd}
            className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-accent-blue"
          >
            친구 추가
          </button>
        ) : (
          <span className="rounded-full bg-accent-green px-3 py-1.5 text-[10px] font-bold text-surface-dark flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            완료
          </span>
        )}
        <button onClick={onDismiss} className="text-[10px] text-white/50 text-center">
          닫기
        </button>
      </div>
    </div>
  );
}

// ─── Main Tab ───
type ScenarioData = typeof SCENARIO_DATA[Scenario];

function MainTab({
  data,
  scenario,
  onOpenProfilePicker,
}: {
  data: ScenarioData;
  scenario: Scenario;
  onOpenProfilePicker: () => void;
}) {
  const [predictions, setPredictions] = useState(data.predictions.map(p => ({ ...p })));
  const [pickingSlot, setPickingSlot] = useState<number | null>(null);
  const [collectionOpen, setCollectionOpen] = useState(false);
  useEscClose(pickingSlot !== null, () => setPickingSlot(null));
  useEscClose(collectionOpen, () => setCollectionOpen(false));
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [rewardInfo, setRewardInfo] = useState<{ title: string; emoji: string; desc: string } | null>(null);
  useEscClose(!!rewardInfo, () => setRewardInfo(null));

  useEffect(() => {
    setPredictions(data.predictions.map(p => ({ ...p })));
  }, [data]);

  useEffect(() => {
    if (pickingSlot !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [pickingSlot]);

  const alreadyPicked = predictions.filter(p => p.country).map(p => p.country!);
  const ownedCountries = COUNTRIES.filter(c => data.ownedVests.includes(c.code));

  const handleSelect = (code: string) => {
    if (pickingSlot === null) return;
    setPredictions(prev => prev.map(p => p.slot === pickingSlot ? { ...p, country: code } : p));
    setPickingSlot(null);
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      {/* Case 1 & 3: 프로필 만들기 유도 */}
      {!data.hasProfile && (
        <section className="rounded-2xl bg-gray-50 px-5 py-8">
          <div className="text-center">
            <h2 className="text-lg font-bold text-surface-dark">
              {scenario === "invited" ? "친구처럼 프로필을 만들어보세요!" : "먼저 프로필을 만들어보세요!"}
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              AI가 월드컵 국가대표 스타일의 프로필 이미지를 만들어드려요
            </p>
            <button
              onClick={onOpenProfilePicker}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent-blue px-6 py-3 text-sm font-bold text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              프로필 만들기
            </button>
          </div>
        </section>
      )}

      {/* Case 2: 매치 참여 마일스톤 */}
      {scenario === "active" && <MatchMission completed={data.matchMission.completed} />}

      {/* 미션 (출석체크 + 우승국 예측 + 친구 초대) */}
      <MissionSection attendance={data.attendance} predictionCount={predictions.filter(p => p.country).length} onOpenPrediction={() => setPickingSlot(predictions.find(p => !p.country)?.slot ?? 1)} />

      {/* 조끼 컬렉션 */}
      <section className="rounded-2xl bg-gray-50 px-5 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-surface-dark">조끼 컬렉션 <span className="font-medium text-on-surface-variant">{data.ownedVests.length}<span className="text-on-surface-variant/40">/48</span></span></h2>
            <p className="mt-1 text-sm font-medium text-on-surface-variant">48개국 조끼를 모아보세요</p>
          </div>
          <button onClick={() => setRewardInfo({ title: "컬렉션 리워드", emoji: "⚽", desc: "48개국 조끼를 모두 모은 플래버 중 추첨하여 월드컵 히스토리볼 세트를 드려요" })} className="flex items-center gap-1 rounded-full bg-accent-green/20 px-2.5 py-1 text-[11px] font-bold text-surface-dark active:scale-95 transition-transform flex-shrink-0">
            🎁 리워드
          </button>
        </div>
        {data.ownedVests.length > 0 ? (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {data.ownedVests.slice(0, 4).map((code) => {
              const country = COUNTRIES.find(c => c.code === code)!;
              return (
                <div key={code} className="flex items-center justify-center h-[100px]">
                  {country.bibImage ? (
                    <img src={country.bibImage} alt={country.nameKo} className="h-full object-contain" draggable={false} />
                  ) : (
                    <TwemojiFlag emoji={country.flag} size={42} />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-3 text-sm text-on-surface-variant">팩을 열어서 조끼를 모아보세요</p>
        )}
        <button
          onClick={() => setCollectionOpen(true)}
          className="mt-4 w-full rounded-xl border border-gray-200 py-3 text-sm font-bold text-surface-dark"
        >
          전체 보기
        </button>
      </section>

      {/* 우승국 예측 */}
      <section className="rounded-2xl bg-gray-50 px-5 py-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-surface-dark">우승국 예측 <span className="font-medium text-on-surface-variant">{predictions.filter(p => p.country).length}<span className="text-on-surface-variant/40">/3</span></span></h2>
            <p className="mt-1 text-sm font-medium text-on-surface-variant">획득한 조끼로 우승국을 예측해보세요</p>
          </div>
          <button onClick={() => setRewardInfo({ title: "예측 리워드", emoji: "🏆", desc: "우승국을 맞춘 플래버 중 1명을 추첨하여 월드컵 트로피 레고를 드려요" })} className="flex items-center gap-1 rounded-full bg-accent-green/20 px-2.5 py-1 text-[11px] font-bold text-surface-dark active:scale-95 transition-transform flex-shrink-0">
            🎁 리워드
          </button>
        </div>
        <div className="mt-6 flex gap-2">
          {predictions.map((pred) => {
            const country = pred.country ? COUNTRIES.find((c) => c.code === pred.country) : null;
            return (
              <button
                key={pred.slot}
                onClick={() => setPickingSlot(pred.slot)}
                className={`flex flex-1 flex-col gap-1 rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] p-1 text-left transition-transform cursor-pointer active:scale-95 ${
                  country ? "bg-accent-green" : "bg-surface-gray"
                }`}
              >
                <div className="flex items-center gap-1 px-2 h-6">
                  {country ? (
                    <>
                      <TwemojiFlag emoji={country.flag} size={16} />
                      <span className="text-xs font-semibold text-surface-dark tracking-tight">{country.nameKo}</span>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-accent-green tracking-tight">선택하기</span>
                  )}
                </div>
                <div className="flex h-[120px] items-center justify-center rounded-2xl bg-surface-dark px-4 py-3">
                  {country ? (
                    country.bibImage
                      ? <img src={country.bibImage} alt={country.nameKo} className="h-full object-contain" draggable={false} />
                      : <TwemojiFlag emoji={country.flag} size={48} />
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#96ff62" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Toast */}
        {toast && (
          <div className="mt-3 flex justify-center animate-fade-in">
            <div className="rounded-full bg-surface-dark px-4 py-2 text-xs font-medium text-white shadow-lg">
              매치에 참여하면 슬롯이 해제돼요
            </div>
          </div>
        )}
      </section>

      {/* Collection Bottom Sheet */}
      {collectionOpen && (
        <div className="fixed inset-0 z-[200] flex items-end lg:items-center lg:justify-center" onClick={() => setCollectionOpen(false)}>
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)]" />
          <div className="relative w-full lg:max-w-md rounded-t-3xl lg:rounded-3xl bg-white pt-6 pb-10 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 lg:hidden" />
            <div className="flex items-center justify-between px-6 mb-4">
              <h3 className="text-lg font-bold text-surface-dark">조끼 컬렉션</h3>
              <span className="text-lg font-russo text-surface-dark">{data.ownedVests.length}<span className="text-sm font-sans text-on-surface-variant font-normal">/48</span></span>
            </div>
            <div className="flex-1 overflow-y-auto px-6">
              <div className="grid grid-cols-4 gap-2">
                {COUNTRIES.map((country) => (
                  <VestCard key={country.code} country={country} owned={data.ownedVests.includes(country.code)} />
                ))}
              </div>
            </div>
            <div className="px-6 pt-4">
              <button onClick={() => setCollectionOpen(false)} className="w-full rounded-xl bg-surface-dark py-3 text-sm font-bold text-white">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vest Picker Modal */}
      {pickingSlot !== null && (
        <div
          className="fixed inset-0 z-[200] flex items-end lg:items-center lg:justify-center"
          onClick={() => setPickingSlot(null)}
        >
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)]" />
          <div
            className="relative w-full lg:max-w-md rounded-t-3xl lg:rounded-3xl bg-white px-6 pt-6 pb-10 max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 lg:hidden" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-surface-dark">우승국 선택</h3>
              <button onClick={() => setPickingSlot(null)} className="text-sm text-on-surface-variant">닫기</button>
            </div>
            {ownedCountries.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm font-bold text-surface-dark">보유한 조끼가 없어요</p>
                <p className="mt-1 text-xs text-on-surface-variant">팩을 열어서 조끼를 획득해보세요</p>
              </div>
            ) : (
              <div className="overflow-y-auto flex-1 -mx-1">
                <div className="grid grid-cols-4 gap-2 px-1">
                  {ownedCountries.map((c) => {
                    const used = alreadyPicked.includes(c.code);
                    return (
                      <button
                        key={c.code}
                        disabled={used}
                        onClick={() => handleSelect(c.code)}
                        className={`flex flex-col items-center gap-1.5 rounded-xl p-2 transition-all ${
                          used ? "opacity-30 cursor-default" : "cursor-pointer active:scale-95 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-accent-green/10">
                          {c.bibImage ? (
                            <img src={c.bibImage} alt={c.nameKo} className="h-14 object-contain" draggable={false} />
                          ) : (
                            <TwemojiFlag emoji={c.flag} size={28} />
                          )}
                        </div>
                        <span className="text-[11px] font-semibold text-surface-dark text-center leading-tight">{c.nameKo}</span>
                        {used && <span className="text-[9px] text-on-surface-variant">선택됨</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reward Info Modal */}
      {rewardInfo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={() => setRewardInfo(null)}>
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)]" />
          <div className="relative w-[280px] rounded-3xl bg-white px-6 pt-8 pb-6 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <span className="text-5xl">{rewardInfo.emoji}</span>
            <h3 className="mt-4 text-lg font-bold text-surface-dark">{rewardInfo.title}</h3>
            <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{rewardInfo.desc}</p>
            <button onClick={() => setRewardInfo(null)} className="mt-5 w-full rounded-xl bg-surface-dark py-3 text-sm font-bold text-white">
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Confetti Burst ───
function ConfettiBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    import("canvas-confetti").then((mod) => {
      const confetti = mod.default;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });
      const colors = ["#FF4029", "#1570FF", "#FFBE1A", "#E0FF47"];

      // Initial big burst from center
      myConfetti({
        particleCount: 100,
        spread: 100,
        origin: { x: 0.5, y: 0.4 },
        colors,
        ticks: 300,
        gravity: 0.8,
        scalar: 1.2,
        shapes: ["square", "circle"],
        drift: 0,
      });

      // Continuous side cannons
      let count = 0;
      const interval = setInterval(() => {
        count++;
        if (count > 8) { clearInterval(interval); return; }

        // Left cannon
        myConfetti({
          particleCount: 15,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors,
          ticks: 250,
          gravity: 1,
          scalar: 1.1,
          shapes: ["square", "circle"],
          drift: 0.5,
        });

        // Right cannon
        myConfetti({
          particleCount: 15,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors,
          ticks: 250,
          gravity: 1,
          scalar: 1.1,
          shapes: ["square", "circle"],
          drift: -0.5,
        });
      }, 200);

      return () => clearInterval(interval);
    });
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[71]" style={{ width: "100vw", height: "100vh" }} />;
}

// ─── Pack Open Screen ───
const CONFETTI_COLORS = ["#96ff62", "#1570ff", "#ffd700", "#ff6b6b", "#a855f7", "#f97316", "#06b6d4", "#ec4899"];

function PackOpenScreen({
  pack,
  phase,
  setPhase,
  onClose,
}: {
  pack: Pack;
  phase: "hold" | "flash" | "reveal";
  setPhase: (p: "hold" | "flash" | "reveal") => void;
  onClose: () => void;
}) {
  const [spinSpeed, setSpinSpeed] = useState(0);
  const [holdTime, setHoldTime] = useState(0);
  const [pressing, setPressing] = useState(false);
  const [rewardRoll] = useState(() => pack.mockReward.kind === "reward" ? rollRewardPackRewards() : null);
  const [showBonus, setShowBonus] = useState(false);
  const [bonusFlash, setBonusFlash] = useState(false);
  const [bonusConfetti, setBonusConfetti] = useState(false);
  const reward = pack.mockReward;
  const isNations = reward.kind === "nations";
  const rewardCountry = isNations ? COUNTRIES.find((c) => c.code === reward.country) : null;

  // Increment hold time while pressing
  useEffect(() => {
    if (phase !== "hold" || !pressing) return;
    const interval = setInterval(() => {
      setHoldTime((t) => t + 0.1);
    }, 100);
    return () => clearInterval(interval);
  }, [phase, pressing]);

  // Map hold time to spin speed
  useEffect(() => {
    if (holdTime > 0) {
      setSpinSpeed(Math.min(holdTime * 0.3, 3));
    }
  }, [holdTime]);

  // Auto-open when gauge is full
  useEffect(() => {
    if (holdTime >= 2 && phase === "hold") {
      setPressing(false);
      setPhase("flash");
      setTimeout(() => setPhase("reveal"), 600);
    }
  }, [holdTime, phase, setPhase]);

  const handleRelease = () => {
    setPressing(false);
  };


  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-surface-dark overflow-hidden">
      {/* Hold phase: spinning pack */}
      {phase === "hold" && (
        <div
          className="flex-1 flex flex-col items-center justify-center gap-6 select-none"
          onPointerDown={() => { setPressing(true); setHoldTime(0.1); }}
          onPointerUp={handleRelease}
          onPointerLeave={handleRelease}
        >
          <div style={{ perspective: "600px" }}>
            <div
              style={{
                animation: pressing && spinSpeed > 0 ? `packSpinY ${Math.max(0.15, 1 - spinSpeed * 0.3)}s linear infinite` : "none",
                transformStyle: "preserve-3d",
              }}
            >
              <img src={pack.image} alt="Pack" className="h-[320px] w-[205px]" draggable={false} />
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg font-kbl text-white">
              {holdTime < 0.3 ? "꾹 누르고 있으세요!" : "게이지를 채우세요!"}
            </p>
            <p className="mt-1 text-xs text-white/50">
              {isNations ? "네이션스팩" : "리워드팩"}
            </p>
          </div>
          {/* Progress ring */}
          <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-accent-green transition-all duration-100"
              style={{ width: `${Math.min(holdTime / 2 * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Flash phase */}
      {phase === "flash" && (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-flash w-[300px] h-[300px] rounded-full bg-white" />
        </div>
      )}

      {/* Reveal phase */}
      {phase === "reveal" && (
        <div className="flex-1 flex flex-col relative">
          {/* Confetti */}
          {!showBonus && !bonusFlash && <ConfettiBurst />}
          {bonusConfetti && <ConfettiBurst />}

          {/* Bonus Flash */}
          {bonusFlash && (
            <div className="absolute inset-0 z-[75] flex items-center justify-center">
              <div className="animate-flash w-[300px] h-[300px] rounded-full bg-white" />
            </div>
          )}

          {/* Top title */}
          <div className="text-center pt-16 relative z-20">
            {isNations && rewardCountry ? (
              <>
                <div className="text-xs font-semibold text-accent-green uppercase tracking-widest">Nations Pack</div>
                <div className="mt-2 text-lg font-kbl text-white">새로운 조끼를 획득했어요!</div>
              </>
            ) : showBonus ? (
              <>
                <div className="text-xs font-semibold text-[#FFBE1A] uppercase tracking-widest">Bonus Reward!</div>
                <div className="mt-2 text-lg font-kbl text-white">추가 보상이 나왔어요!</div>
              </>
            ) : (
              <>
                <div className="text-xs font-semibold text-accent-blue uppercase tracking-widest">Reward Pack</div>
                <div className="mt-2 text-lg font-kbl text-white">보상을 획득했어요!</div>
              </>
            )}
          </div>

          {/* Reward content - centered */}
          <div className="flex-1 flex items-center justify-center">
            <div key={showBonus ? "bonus" : "base"} className="animate-reward-slide-up text-center px-8">
              {isNations && rewardCountry ? (
                <>
                  <div className="mx-auto animate-vest-pop">
                    {rewardCountry.bibImage ? (
                      <img src={rewardCountry.bibImage} alt={rewardCountry.name} className="h-[300px] object-contain mx-auto" draggable={false} />
                    ) : (
                      <TwemojiFlag emoji={rewardCountry.flag} size={80} />
                    )}
                  </div>
                  <div className="mt-6 text-3xl font-russo text-white uppercase tracking-wider">{rewardCountry.name}</div>
                </>
              ) : showBonus && rewardRoll?.bonus ? (
                <div className="mx-auto animate-vest-pop flex flex-col items-center w-full max-w-[280px]">
                  {rewardRoll.bonus.includes("쿠폰") ? (
                    <RewardCouponCard label={rewardRoll.bonus} />
                  ) : (
                    <RewardGenericCard label={rewardRoll.bonus} />
                  )}
                </div>
              ) : (
                <div className="mx-auto animate-vest-pop flex flex-col items-center w-full max-w-[280px]">
                  <RewardTokenCard label={`${rewardRoll?.baseTokens ?? 1}토큰`} />
                </div>
              )}
            </div>
          </div>

          {/* Bottom button */}
          <div className="absolute bottom-0 inset-x-0 p-5 pb-10">
            {!isNations && !showBonus && !bonusFlash && rewardRoll?.bonus ? (
              <button
                onClick={() => {
                  setBonusFlash(true);
                  setTimeout(() => {
                    setBonusFlash(false);
                    setShowBonus(true);
                    setBonusConfetti(true);
                  }, 500);
                }}
                className="w-full rounded-xl bg-[#FFBE1A] py-4 text-sm font-bold text-surface-dark flex items-center justify-center gap-2"
              >
                <span className="text-lg">🎁</span> 보너스! 한번 더!
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-full rounded-xl bg-accent-green py-4 text-sm font-bold text-surface-dark"
              >
                확인
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Packs Tab ───
function PacksTab({
  data,
  openedPack,
  setOpenedPack,
  packPhase,
  setPackPhase,
}: {
  data: ScenarioData;
  openedPack: Pack | null;
  setOpenedPack: (v: Pack | null) => void;
  packPhase: "hold" | "flash" | "reveal";
  setPackPhase: (v: "hold" | "flash" | "reveal") => void;
}) {
  return (
    <section className="bg-white px-5 py-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-surface-dark">나의 팩</h2>
        <button className="flex items-center gap-1 text-xs font-bold text-surface-dark underline">팩 얻는 방법</button>
      </div>
      <p className="mt-1 text-sm text-on-surface-variant">팩을 오픈하고 조끼와 보상을 확인하세요</p>

      {data.packs.length === 0 ? (
        <div className="mt-8 text-center py-10">
          <div className="text-4xl">📦</div>
          <p className="mt-3 text-sm font-bold text-surface-dark">보유한 팩이 없어요</p>
          <p className="mt-1 text-xs text-on-surface-variant">매치에 참여하면 팩을 받을 수 있어요</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-4 gap-3">
          {data.packs.map((pack) => {
            const gc = pack.guaranteedCountry ? COUNTRIES.find(c => c.code === pack.guaranteedCountry) : null;
            return (
              <button key={pack.id} onClick={() => setOpenedPack(pack)} className="relative transition-transform active:scale-95">
                {gc && (
                  <div className="absolute top-0 left-0 z-10 w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <TwemojiFlag emoji={gc.flag} size={14} />
                  </div>
                )}
                <img src={pack.image} alt={pack.label} className="w-full h-auto" draggable={false} />
                <div className="mt-1 text-[10px] font-semibold text-on-surface-variant text-center">{pack.label}</div>
              </button>
            );
          })}
        </div>
      )}

      {/* Pack Open Fullscreen */}
      {openedPack && <PackOpenScreen pack={openedPack} phase={packPhase} setPhase={setPackPhase} onClose={() => setOpenedPack(null)} />}
    </section>
  );
}

// ─── Profile Picker Modal (Bottom Sheet) ───
function ProfilePickerModal({
  data,
  activeProfileId,
  onSelect,
  onClose,
}: {
  data: ScenarioData;
  activeProfileId: number;
  onSelect: (id: number) => void;
  onClose: () => void;
}) {
  const remaining = data.profileQuota.total - data.profileQuota.used;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (data.profiles.length === 0) {
    if (typeof window !== "undefined") window.location.href = "/profile/create";
    return null;
  }

  return (
    <div className="fixed inset-0 z-[55] flex items-end lg:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)]" />
      <div className="relative w-full max-w-lg rounded-t-3xl lg:rounded-3xl bg-white px-5 pt-6 pb-10 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 lg:hidden" />

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-surface-dark">내 프로필</h3>
          <div className="flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1">
            <span className="text-[10px] font-bold text-accent-blue">{remaining}회 남음</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Default profile option */}
          <button onClick={() => onSelect(0)} className="flex flex-col items-center gap-1.5">
            <div className={`relative w-full rounded-tr-[20px] overflow-hidden border-2 transition-all ${
              activeProfileId === 0 ? "border-accent-green shadow-md" : "border-transparent"
            }`} style={{ paddingBottom: "125%" }}>
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              {activeProfileId === 0 && (
                <div className="absolute bottom-0 inset-x-0 bg-accent-green py-1 text-center">
                  <span className="text-[9px] font-bold text-surface-dark">적용중</span>
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-on-surface-variant">기본</span>
          </button>

          {data.profiles.map((profile) => {
            const country = COUNTRIES.find((c) => c.code === profile.country)!;
            const isSelected = profile.id === activeProfileId;
            return (
              <button key={profile.id} onClick={() => onSelect(profile.id)} className="flex flex-col items-center gap-1.5">
                <div className={`relative w-full rounded-tr-[20px] overflow-hidden border-2 transition-all ${
                  isSelected ? "border-accent-green shadow-md" : "border-transparent"
                }`} style={{ paddingBottom: "125%" }}>
                  <img src={profile.imageUrl} alt={country.nameKo} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
                  <div className="absolute top-2 left-2">
                    <TwemojiFlag emoji={country.flag} size={18} />
                  </div>
                  {isSelected && (
                    <div className="absolute bottom-0 inset-x-0 bg-accent-green py-1 text-center">
                      <span className="text-[9px] font-bold text-surface-dark">적용중</span>
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-on-surface-variant">{country.nameKo}</span>
              </button>
            );
          })}
        </div>

        <a
          href={`/profile/create?owned=${data.ownedVests.join(",")}`}
          className={`mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-accent-blue py-4 text-sm font-bold text-white ${remaining <= 0 ? "opacity-40 pointer-events-none" : ""}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
          새 프로필 만들기
        </a>
      </div>
    </div>
  );
}

// ─── Attendance Mission ───
const WEEK_LABELS = ["월", "화", "수", "목", "금", "토", "일"];
const WC_TOTAL_DAYS = 39; // 6/11 ~ 7/19

// Mock checked dates for demo (scattered across the WC period)
function getMockCheckedDates(total: number): Set<string> {
  const dates = new Set<string>();
  const start = new Date(2026, 5, 11);
  const pool: string[] = [];
  for (let d = 0; d < WC_TOTAL_DAYS; d++) {
    const dt = new Date(start);
    dt.setDate(dt.getDate() + d);
    pool.push(`${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`);
  }
  for (let i = 0; i < Math.min(total, pool.length); i++) {
    dates.add(pool[i]);
  }
  return dates;
}

function MissionSection({ attendance, predictionCount, onOpenPrediction }: { attendance: ScenarioData["attendance"]; predictionCount: number; onOpenPrediction: () => void }) {
  const [justChecked, setJustChecked] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  useEscClose(calendarOpen, () => setCalendarOpen(false));
  const [calendarMonth, setCalendarMonth] = useState(5);
  const checked = justChecked || attendance.checkedToday;
  const totalCount = attendance.total + (justChecked && !attendance.checkedToday ? 1 : 0);
  const checkedDates = getMockCheckedDates(totalCount);

  useEffect(() => {
    if (calendarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [calendarOpen]);

  const handleAttendance = () => {
    if (checked) {
      setCalendarOpen(true);
      return;
    }
    setJustChecked(true);
    setCalendarOpen(true);
  };

  const renderMonth = (monthIdx: number) => {
    const year = 2026;
    const firstDay = new Date(year, monthIdx, 1).getDay();
    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const cells: (number | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    const wcStart = new Date(2026, 5, 11);
    const wcEnd = new Date(2026, 6, 19);

    return (
      <div className="grid grid-cols-7 gap-1">
        {WEEK_LABELS.map((l) => (
          <div key={l} className="flex items-center justify-center h-8 text-[11px] font-semibold text-on-surface-variant">{l}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} className="h-10" />;
          const dt = new Date(year, monthIdx, day);
          const key = `${year}-${monthIdx + 1}-${day}`;
          const isWc = dt >= wcStart && dt <= wcEnd;
          const isDone = checkedDates.has(key);
          return (
            <div key={i} className={`flex items-center justify-center h-10 rounded-full text-sm ${
              isDone ? "bg-accent-green font-bold text-surface-dark" : isWc ? "text-surface-dark" : "text-on-surface-variant/30"
            }`}>
              {isDone ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22252a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : day}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="rounded-2xl bg-gray-50 px-5 py-6 flex flex-col gap-5">
      <h2 className="text-xl font-extrabold text-surface-dark">미션</h2>

      {/* 출석체크 */}
      <button onClick={handleAttendance} className="flex items-center gap-4 text-left active:scale-[0.99] transition-transform">
        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${checked ? "bg-accent-green" : "bg-accent-green/15"}`}>
          {checked ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22252a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          ) : (
            <span className="text-xl">📅</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-surface-dark">출석체크하고</p>
          <p className="mt-0.5 text-xs text-on-surface-variant">조끼 모으기</p>
        </div>
        {checked ? (
          <span className="text-xs text-on-surface-variant bg-gray-100 rounded-full px-3 py-1.5 flex-shrink-0">출석완료</span>
        ) : (
          <span className="rounded-full bg-accent-blue px-4 py-1.5 text-xs font-bold text-white flex-shrink-0">출석체크</span>
        )}
      </button>

      {/* 우승국 예측 */}
      <button onClick={onOpenPrediction} className="flex items-center gap-4 text-left active:scale-[0.99] transition-transform">
        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${predictionCount >= 3 ? "bg-accent-green" : "bg-yellow-100"}`}>
          {predictionCount >= 3 ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22252a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          ) : (
            <span className="text-xl">🏆</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-surface-dark">우승국 예측하고</p>
          <p className="mt-0.5 text-xs text-on-surface-variant">트로피 리워드 받기</p>
        </div>
        {predictionCount >= 3 ? (
          <span className="text-xs text-on-surface-variant bg-gray-100 rounded-full px-3 py-1.5 flex-shrink-0">{predictionCount}/3</span>
        ) : (
          <span className="text-xs text-on-surface-variant bg-gray-100 rounded-full px-3 py-1.5 flex-shrink-0">{predictionCount}/3</span>
        )}
      </button>

      {/* 친구에게 알리기 */}
      <button className="flex items-center gap-4 text-left active:scale-[0.99] transition-transform">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-accent-blue/10">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1570FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-surface-dark">친구에게 알리고</p>
          <p className="mt-0.5 text-xs text-on-surface-variant">프로필 이미지 생성권 받기</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* 친구 초대하기 */}
      <button className="flex items-center gap-4 text-left active:scale-[0.99] transition-transform">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-accent-green/15">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-surface-dark">친구 초대하고</p>
          <p className="mt-0.5 text-xs text-on-surface-variant">플랩 선물받기</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Calendar Bottom Sheet */}
      {calendarOpen && (
        <div className="fixed inset-0 z-[200] flex items-end lg:items-center lg:justify-center" onClick={() => setCalendarOpen(false)}>
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)]" />
          <div className="relative w-full lg:max-w-md rounded-t-3xl lg:rounded-3xl bg-white px-6 pt-6 pb-10" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 lg:hidden" />

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-surface-dark">출석 캘린더</h3>
              <div className="flex items-center gap-1.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-green">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22252a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-surface-dark">{totalCount}일 출석</span>
              </div>
            </div>

            <div className="mt-4 flex rounded-xl bg-gray-100 p-1">
              <button onClick={() => setCalendarMonth(5)} className={`flex-1 rounded-lg py-2 text-sm font-bold transition-colors ${calendarMonth === 5 ? "bg-white text-surface-dark shadow-sm" : "text-on-surface-variant"}`}>
                6월
              </button>
              <button onClick={() => setCalendarMonth(6)} className={`flex-1 rounded-lg py-2 text-sm font-bold transition-colors ${calendarMonth === 6 ? "bg-white text-surface-dark shadow-sm" : "text-on-surface-variant"}`}>
                7월
              </button>
            </div>

            <div className="mt-4">
              {renderMonth(calendarMonth)}
            </div>

            <button onClick={() => setCalendarOpen(false)} className="mt-5 w-full rounded-xl bg-surface-dark py-3 text-sm font-bold text-white">
              닫기
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Match Mission ───
const MATCHDAY_MILESTONES = [
  { step: 1, type: "match" as const, label: "매치데이 1" },
  { step: 2, type: "reward" as const, label: "리워드 1", reward: { nations: 1, rewardPack: 1 } },
  { step: 3, type: "match" as const, label: "매치데이 2" },
  { step: 4, type: "reward" as const, label: "리워드 2", reward: { nations: 3, rewardPack: 2 } },
  { step: 5, type: "match" as const, label: "매치데이 3" },
  { step: 6, type: "reward" as const, label: "리워드 3", reward: { nations: 5, rewardPack: 3 } },
];

function MatchMission({ completed }: { completed: number }) {
  const progressStep = completed * 2;
  const [claimed, setClaimed] = useState<Set<number>>(() => {
    const s = new Set<number>();
    for (let i = 1; i < completed; i++) s.add(i * 2);
    return s;
  });
  const [rewardModal, setRewardModal] = useState<(typeof MATCHDAY_MILESTONES)[number] | null>(null);
  useEscClose(rewardModal !== null, () => setRewardModal(null));

  const handleClaim = (ms: typeof MATCHDAY_MILESTONES[number]) => {
    setClaimed(prev => new Set(prev).add(ms.step));
    setRewardModal(ms);
  };

  const getNodeState = (ms: typeof MATCHDAY_MILESTONES[number]) => {
    const isDone = ms.type === "match" ? progressStep >= ms.step : claimed.has(ms.step);
    const isClaimable = ms.type === "reward" && progressStep >= ms.step && !claimed.has(ms.step);
    const isLocked = !isDone && !isClaimable;
    return { isDone, isClaimable, isLocked };
  };

  const isConnActive = (fromStep: number) => {
    const from = MATCHDAY_MILESTONES.find(m => m.step === fromStep)!;
    const { isDone, isClaimable } = getNodeState(from);
    return isDone || isClaimable;
  };

  const matchNum = (step: number) => Math.ceil(step / 2);

  const renderNode = (ms: typeof MATCHDAY_MILESTONES[number]) => {
    const { isDone, isClaimable, isLocked } = getNodeState(ms);
    const isMatch = ms.type === "match";

    const NODE_H = 72;

    return (
      <button
        key={ms.step}
        onClick={() => {
          if (isClaimable) handleClaim(ms);
          else if (ms.type === "reward" && ms.reward && !isDone) setRewardModal(ms);
        }}
        className="flex flex-col items-center gap-1.5 flex-shrink-0"
        style={{ width: isMatch ? 66 : 40 }}
      >
        <div className="flex items-center justify-center" style={{ height: NODE_H }}>
          {isMatch ? (
            <div className="relative" style={{ width: 66, height: 72 }}>
              <svg width="66" height="72" viewBox="0 0 66 72" className="absolute inset-0">
                <polygon
                  points="33,1 64,19 64,53 33,71 2,53 2,19"
                  fill={isLocked ? "#dfe1e5" : "#22252a"}
                  stroke={isDone ? "#96ff62" : isLocked ? "#bcc0c7" : "#96ff62"}
                  strokeWidth={isDone ? "3.5" : "1.5"}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {isDone ? (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#96ff62" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  <span className={`text-2xl font-russo ${isLocked ? "text-gray-400" : "text-accent-green"}`} style={{ textShadow: isLocked ? "none" : "0 0 8px rgba(150,255,98,0.5)" }}>{matchNum(ms.step)}</span>
                )}
              </div>
            </div>
          ) : (
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                isDone ? "border-accent-green bg-accent-green"
                  : isClaimable ? "border-accent-green bg-accent-green shadow-[0_0_10px_rgba(150,255,98,0.4)] animate-pulse"
                  : "border-gray-300 bg-gray-200"
              }`}
            >
              {isDone ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              ) : isClaimable ? (
                <span className="text-base">🎁</span>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
            </div>
          )}
        </div>
        <span className={`text-[11px] font-bold text-center leading-tight whitespace-nowrap ${isDone ? "text-surface-dark" : isClaimable ? "text-accent-blue" : "text-on-surface-variant"}`}>
          {isMatch ? ms.label : isDone ? "완료" : isClaimable ? "받기" : "미리보기"}
        </span>
      </button>
    );
  };

  const connH = (fromStep: number) => {
    const active = isConnActive(fromStep);
    if (active) {
      return <div className="w-8 self-start flex-shrink-0 bg-accent-green" style={{ height: 2, marginTop: 35 }} />;
    }
    return (
      <svg width="32" height="2" className="self-start flex-shrink-0" style={{ marginTop: 35 }}>
        <line x1="0" y1="1" x2="32" y2="1" stroke="#d1d5db" strokeWidth="2" strokeDasharray="4 3" />
      </svg>
    );
  };

  return (
    <section className="rounded-2xl bg-gray-50 px-5 py-6 overflow-hidden">
      <h2 className="text-xl font-extrabold text-surface-dark">매치데이 <span className="font-medium text-on-surface-variant">{completed}<span className="text-on-surface-variant/40">/3</span></span></h2>
      <p className="mt-1 text-sm font-medium text-on-surface-variant">매치에 참여하고 리워드를 받으세요</p>

      <div className="mt-5 -mx-5 px-5 overflow-x-auto scrollbar-hide">
        <div className="flex items-start w-max">
          {MATCHDAY_MILESTONES.map((ms, i) => (
            <Fragment key={ms.step}>
              {renderNode(ms)}
              {i < MATCHDAY_MILESTONES.length - 1 && connH(ms.step)}
            </Fragment>
          ))}
        </div>
      </div>

      {MATCHDAY_MILESTONES.some(ms => ms.type === "reward" && progressStep >= ms.step && !claimed.has(ms.step)) ? (
        <button className="mt-4 w-full rounded-xl bg-accent-green py-3 text-sm font-bold text-surface-dark" onClick={() => {
          const claimable = MATCHDAY_MILESTONES.find(ms => ms.type === "reward" && progressStep >= ms.step && !claimed.has(ms.step));
          if (claimable) handleClaim(claimable);
        }}>
          리워드 받기
        </button>
      ) : (
        <button className="mt-4 w-full rounded-xl bg-accent-blue py-3 text-sm font-bold text-white">
          매치 참여하러 가기
        </button>
      )}

      {/* Reward Modal */}
      {rewardModal && rewardModal.type === "reward" && rewardModal.reward && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center" onClick={() => setRewardModal(null)}>
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)]" />
          <div className="relative w-[300px] rounded-3xl bg-white px-6 pt-8 pb-6 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
            <span className="text-5xl">{claimed.has(rewardModal.step) ? "🎉" : "🎁"}</span>
            <h3 className="mt-4 text-lg font-bold text-surface-dark">
              {claimed.has(rewardModal.step) ? `${rewardModal.label} 획득!` : `${rewardModal.label} 보상`}
            </h3>
            {!claimed.has(rewardModal.step) && (
              <p className="mt-1 text-sm text-on-surface-variant">매치 완료 시 받을 수 있어요</p>
            )}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                <img src="/img/daily_pack.svg" alt="" className="h-10 w-7 flex-shrink-0" />
                <span className="text-sm font-bold text-surface-dark">네이션스팩 x{rewardModal.reward.nations}</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                <img src="/img/match_pack.svg" alt="" className="h-10 w-7 flex-shrink-0" />
                <span className="text-sm font-bold text-surface-dark">리워드팩 x{rewardModal.reward.rewardPack}</span>
              </div>
            </div>
            <button
              onClick={() => setRewardModal(null)}
              className="mt-5 w-full rounded-xl bg-surface-dark py-3 text-sm font-bold text-white"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Friends Tab ───
type FriendView = "card" | "list";

function FriendsTab({ data, scenario }: { data: ScenarioData; scenario: Scenario }) {
  const [view, setView] = useState<FriendView>("card");
  const [selectedFriend, setSelectedFriend] = useState<{ name: string; country: string; imageUrl: string | null; stats?: { match: number; level: number; praise: number; pom: number; manner?: number } } | null>(null);
  useEscClose(!!selectedFriend, () => setSelectedFriend(null));
  const selectedCountry = selectedFriend ? COUNTRIES.find((c) => c.code === selectedFriend.country)! : null;

  useEffect(() => {
    if (selectedFriend) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedFriend]);

  return (
    <section className="bg-white px-5 py-8">
      {/* Friend Detail Bottom Sheet */}
      {selectedFriend && selectedCountry && (
        <div className="fixed inset-0 z-[55] flex items-end lg:items-center justify-center bg-[rgba(0,0,0,0.4)]" onClick={() => setSelectedFriend(null)}>
          <div className="w-full max-w-lg rounded-t-2xl lg:rounded-2xl bg-white px-5 pt-4 pb-10 lg:pb-6" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-300 lg:hidden" />
            <div className="flex flex-col items-center">
              {/* Profile Card */}
              <div className="w-[65vw] max-w-[260px] overflow-hidden rounded-tr-[20px] border border-gray-100">
                <div className="relative w-full" style={{ background: selectedCountry.primary, paddingBottom: "150%" }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {selectedFriend.imageUrl ? (
                      <img src={selectedFriend.imageUrl} alt={selectedFriend.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/20">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity={0.5}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0">
                    <div className="flex items-center justify-center w-8 h-8 bg-surface-dark">
                      <TwemojiFlag emoji={selectedCountry.flag} size={22} />
                    </div>
                  </div>
                </div>
                <div className="bg-accent-blue px-3 py-2">
                  <div className="flex items-center justify-between text-white text-center">
                    {[
                      { label: "MATCH", value: selectedFriend.stats?.match ?? 0 },
                      { label: "LEVEL", value: selectedFriend.stats?.level ?? 0 },
                      { label: "칭찬", value: selectedFriend.stats?.praise ?? 0 },
                      { label: "POM", value: selectedFriend.stats?.pom ?? 0 },
                    ].map((s) => (
                      <div key={s.label} className="flex flex-col items-center">
                        <span className="text-[7px] font-semibold tracking-wider uppercase opacity-80">{s.label}</span>
                        <span className="text-base font-russo">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white px-3 py-2.5 text-center">
                  <div className="text-sm font-extrabold text-surface-dark">{selectedFriend.name}</div>
                  <div className="text-[10px] text-on-surface-variant">{selectedCountry.nameKo}</div>
                </div>
              </div>

              <button
                onClick={() => setSelectedFriend(null)}
                className="mt-5 w-[65vw] max-w-[260px] rounded-xl bg-accent-blue py-3 text-sm font-bold text-white"
              >
                프로필 방문하기
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Case 3: Inviter highlight */}
      {scenario === "invited" && data.inviter && (
        <div className="mb-6 rounded-2xl border border-accent-blue/20 bg-accent-blue/5 p-4">
          <p className="text-sm font-bold text-surface-dark">나를 초대한 친구</p>
          <div className="mt-3 flex items-center gap-3">
            {data.inviter.imageUrl ? (
              <img src={data.inviter.imageUrl} alt={data.inviter.name} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue font-bold">{data.inviter.name[0]}</div>
            )}
            <div className="flex-1">
              <div className="text-sm font-bold text-surface-dark">{data.inviter.name}</div>
              <div className="text-xs text-on-surface-variant flex items-center gap-1">
                <TwemojiFlag emoji={COUNTRIES.find((c) => c.code === data.inviter!.country)!.flag} size={14} />
                {COUNTRIES.find((c) => c.code === data.inviter!.country)!.nameKo}
              </div>
            </div>
            <button className="rounded-xl bg-accent-blue px-4 py-2 text-xs font-bold text-white">친구 추가</button>
          </div>
        </div>
      )}

      {(() => {
        const withProfile = data.friends.filter(f => f.hasProfile !== false);
        const withoutProfile = data.friends.filter(f => f.hasProfile === false);
        return (<>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-surface-dark">친구들</h2>
            {data.friends.length > 0 && (
              <div className="flex items-center rounded-lg bg-surface-hover p-0.5">
                <button
                  onClick={() => setView("card")}
                  className={`rounded-md px-2.5 py-1 transition-all ${view === "card" ? "bg-white shadow-sm" : ""}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={view === "card" ? "#22252a" : "#676d7e"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                  </svg>
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`rounded-md px-2.5 py-1 transition-all ${view === "list" ? "bg-white shadow-sm" : ""}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={view === "list" ? "#22252a" : "#676d7e"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <p className="mt-1 text-sm text-on-surface-variant">친구들의 월드컵 프로필을 확인해보세요</p>

          {data.friends.length === 0 ? (
            <div className="mt-8 text-center py-10">
              <div className="text-4xl">👥</div>
              <p className="mt-3 text-sm font-bold text-surface-dark">아직 친구가 없어요</p>
              <p className="mt-1 text-xs text-on-surface-variant">친구를 초대해서 함께 즐겨보세요</p>
              <button className="mt-4 rounded-xl bg-accent-blue px-6 py-3 text-sm font-bold text-white">친구 초대하기</button>
            </div>
          ) : (<>
            {view === "card" ? (
              /* Card View */
              <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-3">
                {withProfile.map((friend) => {
                  const country = COUNTRIES.find((c) => c.code === friend.country)!;
                  return (
                    <button key={friend.name} onClick={() => setSelectedFriend(friend)} className="overflow-hidden rounded-tr-[20px] text-left transition-transform active:scale-95">
                      <div className="relative w-full" style={{ background: country.primary, paddingBottom: "150%" }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          {friend.imageUrl ? (
                            <img src={friend.imageUrl} alt={friend.name} className="h-full w-full object-cover" draggable={false} />
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/20">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity={0.5}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </div>
                          )}
                        </div>
                        <div className="absolute bottom-0 left-0">
                          <div className="flex items-center justify-center w-6 h-6 bg-surface-dark">
                            <TwemojiFlag emoji={country.flag} size={18} />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
                <div className="relative" style={{ paddingBottom: "150%" }}>
                  <button className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-tr-[20px] border-2 border-dashed border-gray-200 text-on-surface-variant hover:border-accent-green hover:text-accent-green">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-current text-lg">+</div>
                    <span className="text-[10px] font-medium">친구 초대</span>
                  </button>
                </div>
              </div>
            ) : (
              /* List View - sorted by manner desc */
              <div className="mt-6">
                {/* Header */}
                <div className="flex items-center px-3 py-2 text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                  <div className="w-14 flex-shrink-0" />
                  <div className="flex-1">이름</div>
                  <div className="w-10 text-center">매치</div>
                  <div className="w-10 text-center">칭찬</div>
                  <div className="w-10 text-center">POM</div>
                  <div className="w-10 text-center">매너</div>
                </div>
                <div className="space-y-1">
                  {[...withProfile].sort((a, b) => (b.stats?.manner ?? 0) - (a.stats?.manner ?? 0)).map((friend) => {
                    const country = COUNTRIES.find((c) => c.code === friend.country)!;
                    const manner = friend.stats?.manner ?? 0;
                    return (
                      <button
                        key={friend.name}
                        onClick={() => setSelectedFriend(friend)}
                        className="flex items-center w-full rounded-xl bg-surface-hover px-3 py-2.5 transition-all active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-2 w-14 flex-shrink-0">
                          <TwemojiFlag emoji={country.flag} size={16} />
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            {friend.imageUrl ? (
                              <img src={friend.imageUrl} alt={friend.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-on-surface-variant">{friend.name[0]}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 text-left text-sm font-bold text-surface-dark truncate">{friend.name}</div>
                        <div className="w-10 text-center text-sm font-russo text-surface-dark">{friend.stats?.match ?? 0}</div>
                        <div className="w-10 text-center text-sm font-russo text-surface-dark">{friend.stats?.praise ?? 0}</div>
                        <div className="w-10 text-center text-sm font-russo text-surface-dark">{friend.stats?.pom ?? 0}</div>
                        <div className={`w-10 text-center text-sm font-russo ${manner >= 4.5 ? "text-accent-blue" : manner >= 4.0 ? "text-surface-dark" : "text-on-surface-variant"}`}>{manner.toFixed(1)}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Friends without profile */}
            {withoutProfile.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-bold text-surface-dark">아직 프로필을 만들지 않은 친구</h3>
                <p className="mt-1 text-[10px] text-on-surface-variant">친구에게 알려서 함께 즐겨보세요</p>
                <div className="mt-3 space-y-2">
                  {withoutProfile.map((friend) => (
                    <div key={friend.name} className="flex items-center gap-3 rounded-xl bg-surface-hover px-4 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-on-surface-variant flex-shrink-0">
                        {friend.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-surface-dark">{friend.name}</div>
                        <div className="text-[10px] text-on-surface-variant">매치 {friend.stats?.match ?? 0}회 참여</div>
                      </div>
                      <button className="flex-shrink-0 rounded-lg bg-accent-blue px-3 py-1.5 text-[10px] font-bold text-white">
                        알리기
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>)}
        </>);
      })()}
    </section>
  );
}

// ─── Collection Tab ───
const MOCK_FIFA_RANK: Record<string, number> = {
  ARG: 1, FRA: 2, ESP: 3, ENG: 4, BRA: 5, BEL: 6, NED: 7, POR: 8, COL: 9, ITA: 10,
  GER: 11, URU: 12, CRO: 13, USA: 14, MEX: 15, MAR: 16, SUI: 17, JPN: 18, IRN: 19, SEN: 20,
  AUS: 21, DEN: 22, TUR: 23, AUT: 24, KOR: 25, UKR: 26, SRB: 27, POL: 28, ROU: 29, CZE: 30,
  SCO: 31, NGA: 32, CAN: 33, EGY: 34, WAL: 35, NOR: 36, CIV: 37, TUN: 38, RSA: 39, PAR: 40,
  PAN: 41, ECU: 42, CRC: 43, JAM: 44, BIH: 45, NZL: 46, SAU: 47, QAT: 48,
};

function CollectionTab({ data }: { data: ScenarioData }) {
  const [selected, setSelected] = useState<(typeof COUNTRIES)[0] | null>(null);
  const isOwned = selected ? data.ownedVests.includes(selected.code) : false;
  useEscClose(!!selected, () => setSelected(null));

  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <section className="bg-white px-5 py-8 overflow-hidden">
      <div className="flex items-center justify-between py-2">
        <h2 className="text-xl font-bold text-surface-dark">컬렉션</h2>
        <span className="text-2xl font-semibold tracking-tight text-surface-dark">{data.ownedVests.length}/48</span>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {COUNTRIES.map((country) => (
          <button key={country.code} onClick={() => setSelected(country)} className="text-left active:scale-95 transition-transform">
            <VestCard country={country} owned={data.ownedVests.includes(country.code)} />
          </button>
        ))}
      </div>

      {/* Vest Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-[200] flex items-end lg:items-center lg:justify-center" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)]" />
          <div className="relative w-full lg:max-w-sm rounded-t-3xl lg:rounded-3xl bg-white pt-6 pb-10" onClick={e => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 lg:hidden" />

            {/* Vest Image */}
            <div className="flex flex-col items-center px-6">
              <div className="flex h-[180px] w-[180px] items-center justify-center rounded-2xl" style={{ background: isOwned ? selected.primary : "#e5e7eb" }}>
                {isOwned && selected.bibImage ? (
                  <img src={selected.bibImage} alt={selected.nameKo} className="h-[150px] object-contain" draggable={false} />
                ) : isOwned ? (
                  <TwemojiFlag emoji={selected.flag} size={72} />
                ) : (
                  <TwemojiFlag emoji={selected.flag} size={72} grayscale />
                )}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <TwemojiFlag emoji={selected.flag} size={20} />
                <span className="text-lg font-bold text-surface-dark">{selected.nameKo}</span>
                <span className="text-sm text-on-surface-variant">({selected.name})</span>
              </div>
              <span className="mt-1 text-xs text-on-surface-variant">GROUP {selected.group}</span>
            </div>

            {/* Stats */}
            <div className="mt-5 mx-6 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-gray-50 p-3 text-center">
                <p className="text-[10px] text-on-surface-variant">FIFA 랭킹</p>
                <p className="mt-1 text-xl font-russo text-surface-dark">{MOCK_FIFA_RANK[selected.code] ?? "-"}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 text-center">
                <p className="text-[10px] text-on-surface-variant">획득 확률</p>
                <p className="mt-1 text-xl font-russo text-surface-dark">{(100 / 48).toFixed(1)}%</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 text-center">
                <p className="text-[10px] text-on-surface-variant">획득 수</p>
                <p className="mt-1 text-xl font-russo text-surface-dark">{isOwned ? 1 : 0}</p>
              </div>
            </div>

            <div className="mt-6 px-6">
              <button onClick={() => setSelected(null)} className="w-full rounded-xl bg-surface-dark py-3 text-sm font-bold text-white">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Store Tab ───
const STORE_ITEMS = [
  {
    id: 0,
    name: "프로필 이미지 생성권 10개",
    price: 10,
    emoji: "🎨",
    description: "AI 프로필 이미지 생성 10회",
    stock: 999,
  },
  {
    id: 1,
    name: "플랩 크루 삭스",
    price: 80,
    emoji: "🧦",
    description: "월드컵 에디션 플랩 크루삭스",
    stock: 120,
  },
  {
    id: 2,
    name: "플랩 오피셜 소셜매치볼",
    price: 350,
    emoji: "⚽",
    description: "플랩 공식 소셜매치볼",
    stock: 50,
  },
  {
    id: 3,
    name: "플랩 트레이닝 캡",
    price: 280,
    emoji: "🧢",
    description: "플랩 트레이닝 캡",
    stock: 80,
  },
  {
    id: 4,
    name: "플랩 스웨트 백",
    price: 180,
    emoji: "👜",
    description: "플랩 스웨트 백",
    stock: 200,
  },
  {
    id: 5,
    name: "플랩 팀 조끼",
    price: 120,
    emoji: "🦺",
    description: "플랩 팀 조끼",
    stock: 150,
  },
  {
    id: 6,
    name: "네이션스 우승국 뱃지",
    price: 50,
    emoji: "📌",
    description: "월드컵 에디션 메탈 핀 뱃지",
    stock: 300,
  },
];

const GACHA_POOL = [
  { name: "플랩 크루 삭스", emoji: "🧦", rarity: "common" },
  { name: "WC26 핀 뱃지", emoji: "📌", rarity: "common" },
  { name: "프로필 생성권 10개", emoji: "🎨", rarity: "common" },
  { name: "플랩 스웨트 백", emoji: "👜", rarity: "uncommon" },
  { name: "플랩 팀 조끼", emoji: "🦺", rarity: "uncommon" },
  { name: "플랩 트레이닝 캡", emoji: "🧢", rarity: "rare" },
  { name: "플랩 오피셜 소셜매치볼", emoji: "⚽", rarity: "rare" },
  { name: "대한민국 국가대표 유니폼", emoji: "👕", rarity: "legendary" },
];

const RARITY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  common: { bg: "bg-gray-100", text: "text-[#676d7e]", label: "일반" },
  uncommon: { bg: "bg-blue-50", text: "text-[#1570ff]", label: "고급" },
  rare: { bg: "bg-purple-50", text: "text-purple-600", label: "희귀" },
  legendary: { bg: "bg-amber-50", text: "text-amber-600", label: "전설" },
};

function StoreTab({ data }: { data: ScenarioData }) {
  const [selectedItem, setSelectedItem] = useState<(typeof STORE_ITEMS)[0] | null>(null);
  const [gachaOpen, setGachaOpen] = useState(false);
  const [gachaResult, setGachaResult] = useState<(typeof GACHA_POOL)[0] | null>(null);
  const [gachaSpinning, setGachaSpinning] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  useEscClose(!!selectedItem, () => setSelectedItem(null));
  useEscClose(gachaOpen && !gachaResult, () => setGachaOpen(false));
  useEscClose(!!gachaResult, () => { setGachaResult(null); setGachaOpen(false); });
  useEscClose(historyOpen, () => setHistoryOpen(false));

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedItem]);

  return (
    <section className="bg-white px-5 py-8 overflow-hidden">
      {/* Token & Ticket Balance */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/img/token.svg" alt="token" className="h-6 w-6" draggable={false} />
          <span className="text-2xl font-russo text-surface-dark">{data.tokens.toLocaleString()}</span>
          <span className="text-sm text-on-surface-variant">토큰</span>
        </div>
        <button
          onClick={() => setHistoryOpen(true)}
          className="text-sm text-on-surface-variant cursor-pointer active:opacity-60"
        >
          내역 &rsaquo;
        </button>
      </div>

      <div className="mt-4 flex gap-3">
        <div className="flex-1 flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
          <span className="text-2xl">🎨</span>
          <div>
            <p className="text-xs text-on-surface-variant">프로필 생성권</p>
            <p className="text-lg font-bold text-surface-dark">{data.tickets.profileCreate}<span className="text-sm font-normal text-on-surface-variant">개</span></p>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
          <span className="text-2xl">🎰</span>
          <div>
            <p className="text-xs text-on-surface-variant">굿즈뽑기 이용권</p>
            <p className="text-lg font-bold text-surface-dark">{data.tickets.gacha}<span className="text-sm font-normal text-on-surface-variant">개</span></p>
          </div>
        </div>
      </div>

      {/* Gacha Card */}
      <button
        onClick={() => setGachaOpen(true)}
        className="mt-6 w-full rounded-2xl bg-surface-dark p-5 text-left cursor-pointer active:scale-[0.99] transition-transform"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">🎰 굿즈 뽑기</h2>
            <p className="mt-1 text-sm text-white/50">랜덤으로 굿즈를 획득하세요!</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5">
            <img src="/img/token.svg" alt="token" className="h-4 w-4" draggable={false} />
            <span className="text-sm font-russo text-accent-green">10</span>
          </div>
        </div>
      </button>

      {/* Gacha Modal */}
      {gachaOpen && !gachaResult && (
        <div className="fixed inset-0 z-[200] flex items-end lg:items-center lg:justify-center" onClick={() => !gachaSpinning && setGachaOpen(false)}>
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)]" />
          <div className="relative w-full lg:max-w-md rounded-t-3xl lg:rounded-3xl bg-white pt-6 pb-10 max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 lg:hidden" />

            <div className="px-6">
              <h3 className="text-xl font-bold text-surface-dark text-center">굿즈 뽑기</h3>
              <p className="mt-1 text-sm text-on-surface-variant text-center">1회 10토큰으로 랜덤 굿즈를 뽑아보세요</p>
            </div>

            {/* Gacha Machine */}
            <div className="mt-6 flex flex-col items-center px-6">
              <div className={`relative w-32 h-32 rounded-full flex items-center justify-center text-6xl ${gachaSpinning ? "animate-spin" : ""}`} style={{ background: "conic-gradient(#FF4029, #1570FF, #FFBE1A, #E0FF47, #96ff62, #FF4029)", animationDuration: "0.5s" }}>
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-5xl">
                  {gachaSpinning ? "✨" : "🎰"}
                </div>
              </div>

              <button
                onClick={() => {
                  if (gachaSpinning || data.tokens < 10) return;
                  setGachaSpinning(true);
                  setTimeout(() => {
                    const result = GACHA_POOL[Math.floor(Math.random() * GACHA_POOL.length)];
                    setGachaResult(result);
                    setGachaSpinning(false);
                  }, 2000);
                }}
                disabled={data.tokens < 10 || gachaSpinning}
                className={`mt-6 w-full max-w-[280px] rounded-xl py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  gachaSpinning ? "bg-gray-200 text-on-surface-variant" : data.tokens < 10 ? "bg-gray-200 text-on-surface-variant" : "bg-surface-dark text-white active:scale-[0.98]"
                }`}
              >
                {gachaSpinning ? (
                  <>뽑는 중...</>
                ) : (
                  <>
                    뽑기
                    <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px]">
                      <img src="/img/token.svg" alt="" className="h-3 w-3" /> 10
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Pool List */}
            <div className="mt-6 px-6 flex-1 overflow-y-auto">
              <p className="text-xs font-bold text-on-surface-variant mb-3">획득 가능 상품</p>
              <div className="grid grid-cols-2 gap-2">
                {GACHA_POOL.map((item) => {
                  const r = RARITY_COLORS[item.rarity];
                  return (
                    <div key={item.name} className="flex flex-col items-center gap-1.5 rounded-xl bg-gray-50 px-3 py-4">
                      <span className="text-3xl">{item.emoji}</span>
                      <p className="text-xs font-bold text-surface-dark text-center leading-tight">{item.name}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.bg} ${r.text}`}>{r.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gacha Result Modal */}
      {gachaResult && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center">
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)]" />
          <div className="relative flex flex-col items-center bg-white rounded-3xl px-8 pt-10 pb-8 w-[300px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${RARITY_COLORS[gachaResult.rarity].text}`}>
              {RARITY_COLORS[gachaResult.rarity].label}
            </span>
            <div className="mt-5 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50 text-6xl animate-vest-pop">
              {gachaResult.emoji}
            </div>
            <p className="mt-5 text-lg font-bold text-surface-dark text-center">{gachaResult.name}</p>
            <p className="mt-1 text-sm text-on-surface-variant">축하합니다! 🎉</p>
            <div className="mt-6 w-full flex flex-col gap-2">
              <button
                onClick={() => {
                  setGachaResult(null);
                }}
                className="w-full rounded-xl bg-surface-dark py-3.5 text-sm font-bold text-white"
              >
                한번 더 뽑기
              </button>
              <button
                onClick={() => { setGachaResult(null); setGachaOpen(false); }}
                className="w-full py-2 text-sm text-on-surface-variant"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Token History Bottom Sheet */}
      {historyOpen && (
        <div className="fixed inset-0 z-[200] flex items-end lg:items-center lg:justify-center" onClick={() => setHistoryOpen(false)}>
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)]" />
          <div className="relative w-full lg:max-w-md rounded-t-3xl lg:rounded-3xl bg-white pt-6 pb-10 max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 lg:hidden" />
            <div className="px-6">
              <h3 className="text-xl font-bold text-surface-dark">토큰 내역</h3>
              <div className="mt-3 flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent-green" />
                  <span className="text-sm text-on-surface-variant">획득</span>
                  <span className="text-sm font-bold text-surface-dark">
                    {data.tokenHistory.filter(h => h.amount > 0).reduce((s, h) => s + h.amount, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#FF4029]" />
                  <span className="text-sm text-on-surface-variant">사용</span>
                  <span className="text-sm font-bold text-surface-dark">
                    {Math.abs(data.tokenHistory.filter(h => h.amount < 0).reduce((s, h) => s + h.amount, 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 px-6 flex-1 overflow-y-auto">
              {data.tokenHistory.length === 0 ? (
                <p className="py-12 text-center text-sm text-on-surface-variant">토큰 내역이 없습니다</p>
              ) : (
                (() => {
                  let lastDate = "";
                  return data.tokenHistory.map((h, i) => {
                    const showDate = h.date !== lastDate;
                    lastDate = h.date;
                    return (
                      <div key={i}>
                        {showDate && (
                          <p className="mt-4 first:mt-0 mb-2 text-xs font-bold text-on-surface-variant">{h.date}</p>
                        )}
                        <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                          <span className="text-sm text-surface-dark">{h.label}</span>
                          <span className={`text-sm font-russo ${h.amount > 0 ? "text-accent-green" : "text-[#FF4029]"}`}>
                            {h.amount > 0 ? "+" : ""}{h.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  });
                })()
              )}
            </div>
          </div>
        </div>
      )}

      {/* Store Items */}
      <div className="mt-6">
        <h2 className="text-xl font-bold text-surface-dark">토큰으로 굿즈를 구매하세요!</h2>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {STORE_ITEMS.map((item) => {
          const canAfford = data.tokens >= item.price;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden text-left transition-shadow hover:shadow-md cursor-pointer"
            >
              <div className="flex h-20 w-full items-center justify-center text-4xl bg-gray-50">
                {item.emoji}
              </div>
              <div className="px-4 pt-3 pb-4">
              <p className="text-base font-bold text-surface-dark leading-tight">{item.name}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <img src="/img/token.svg" alt="token" className="h-4 w-4" draggable={false} />
                  <span className={`text-sm font-russo ${canAfford ? "text-surface-dark" : "text-on-surface-variant"}`}>
                    {item.price.toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] text-on-surface-variant">{item.stock}개 남음</span>
              </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[200] flex items-end lg:items-center lg:justify-center"
          onClick={() => setSelectedItem(null)}
        >
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.4)]" />
          <div
            className="relative w-full lg:max-w-md rounded-t-3xl lg:rounded-3xl bg-white px-6 pt-8 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-gray-200 lg:hidden" />
            <div className="flex flex-col items-center">
              <span className="text-6xl">{selectedItem.emoji}</span>
              <h3 className="mt-4 text-lg font-bold text-surface-dark">{selectedItem.name}</h3>
              <p className="mt-1 text-sm text-on-surface-variant">{selectedItem.description}</p>
              <div className="mt-4 flex items-center gap-2">
                <img src="/img/token.svg" alt="token" className="h-6 w-6" draggable={false} />
                <span className="text-2xl font-russo text-surface-dark">{selectedItem.price.toLocaleString()}</span>
              </div>
              <p className="mt-2 text-[11px] text-on-surface-variant">남은 수량: {selectedItem.stock}개</p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-bold text-surface-dark"
              >
                닫기
              </button>
              <button
                className={`flex-1 rounded-xl py-3 text-sm font-bold text-white ${data.tokens >= selectedItem.price ? "bg-accent-blue" : "bg-gray-300 cursor-default"}`}
                disabled={data.tokens < selectedItem.price}
              >
                {data.tokens >= selectedItem.price ? "구매하기" : "토큰 부족"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Reward Cards ───
function RewardCouponCard({ label }: { label: string }) {
  const isFree = label.includes("FREE") || label.includes("무료");
  const amount = isFree ? "FREE" : (label.match(/[\d,]+원/)?.[0] ?? label);
  const subtitle = isFree ? "1경기 무료 쿠폰" : "할인 쿠폰";
  const bg = isFree
    ? "linear-gradient(135deg, #FF4029 0%, #FF6B55 50%, #FF4029 100%)"
    : "linear-gradient(135deg, #1570FF 0%, #4A9CFF 50%, #1570FF 100%)";
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl" style={{ background: bg }}>
      <div className="relative px-6 pt-8 pb-6">
        <div className="absolute top-0 left-0 right-0 h-full opacity-20 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)" }} />
          <div className="absolute -bottom-5 -left-5 w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)" }} />
        </div>
        <div className="relative z-10">
          <p className="text-xs font-semibold text-white/70 uppercase tracking-widest">{isFree ? "FREE MATCH" : "DISCOUNT COUPON"}</p>
          <p className="mt-4 text-4xl font-russo text-white">{amount}</p>
          <p className="mt-1 text-sm text-white/80">{subtitle}</p>
        </div>
      </div>
      <div className="relative flex items-center">
        <div className="w-4 h-8 bg-surface-dark rounded-r-full -ml-px" />
        <div className="flex-1 border-t-2 border-dashed border-white/20" />
        <div className="w-4 h-8 bg-surface-dark rounded-l-full -mr-px" />
      </div>
      <div className="relative px-6 py-4 flex items-center justify-between">
        <span className="text-xs text-white/50">PLAB WC26</span>
        <img src="/img/symbol.svg" alt="WC26" className="h-5 w-auto opacity-50" />
      </div>
    </div>
  );
}

function RewardTokenCard({ label }: { label: string }) {
  const count = label.match(/(\d+)/)?.[1] ?? "1";
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg, #22252A 0%, #393D46 50%, #22252A 100%)" }}>
      <div className="relative px-6 pt-8 pb-6">
        <div className="absolute top-0 left-0 right-0 h-full opacity-20 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: "radial-gradient(circle, rgba(150,255,98,0.3) 0%, transparent 70%)" }} />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <img src="/img/token.svg" alt="token" className="h-16 w-16" draggable={false} />
          <p className="mt-4 text-4xl font-russo text-accent-green">{count}</p>
          <p className="mt-1 text-sm text-white/80">토큰</p>
        </div>
      </div>
    </div>
  );
}

function RewardGenericCard({ label }: { label: string }) {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl" style={{ background: "linear-gradient(135deg, #96FF62 0%, #6BE03A 50%, #96FF62 100%)" }}>
      <div className="relative px-6 pt-8 pb-8">
        <div className="absolute top-0 left-0 right-0 h-full opacity-20 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)" }} />
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/30">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22252A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
            </svg>
          </div>
          <p className="mt-4 text-xl font-bold text-surface-dark">{label}</p>
        </div>
      </div>
    </div>
  );
}

// ─── POM Screen ───
function PomScreen({ profileImage, country, onClose }: { profileImage: string; country: string; onClose: () => void }) {
  const countryData = COUNTRIES.find(c => c.code === country);
  const [phase, setPhase] = useState<"spin" | "flash" | "reveal">("spin");
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const speedRef = useRef(0);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Accelerate → decelerate spin, then flash → reveal
  useEffect(() => {
    if (phase !== "spin") return;
    const startTime = performance.now();
    const totalDuration = 2000;
    let raf: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / totalDuration, 1);

      // Ease: accelerate first half, decelerate second half
      if (t < 0.4) {
        speedRef.current = (t / 0.4) * 35;
      } else {
        speedRef.current = 35 * (1 - ((t - 0.4) / 0.6));
      }

      rotationRef.current += speedRef.current;
      setRotation(rotationRef.current);

      if (t < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        const snapped = Math.round(rotationRef.current / 360) * 360;
        rotationRef.current = snapped;
        setRotation(snapped);
        setPhase("flash");
        setTimeout(() => setPhase("reveal"), 400);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Fire confetti when reveal
  useEffect(() => {
    if (phase !== "reveal") return;
    import("canvas-confetti").then((mod) => {
      const confetti = mod.default;
      const canvas = confettiCanvasRef.current;
      if (!canvas) return;
      const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });
      const colors = ["#FF4029", "#1570FF", "#FFBE1A", "#E0FF47"];

      myConfetti({ particleCount: 120, spread: 100, origin: { x: 0.5, y: 0.45 }, colors, ticks: 300, gravity: 0.8, scalar: 1.3, shapes: ["square", "circle"] });

      let count = 0;
      const interval = setInterval(() => {
        count++;
        if (count > 6) { clearInterval(interval); return; }
        myConfetti({ particleCount: 20, angle: 60, spread: 50, origin: { x: 0, y: 0.55 }, colors, ticks: 250, gravity: 1, scalar: 1.1, shapes: ["square", "circle"], drift: 0.5 });
        myConfetti({ particleCount: 20, angle: 120, spread: 50, origin: { x: 1, y: 0.55 }, colors, ticks: 250, gravity: 1, scalar: 1.1, shapes: ["square", "circle"], drift: -0.5 });
      }, 200);

      return () => clearInterval(interval);
    });
  }, [phase]);

  return (
    <div className="fixed inset-0 z-[80] flex flex-col items-center" style={{ background: "#e0ff47" }}>
      {/* Confetti canvas */}
      <canvas ref={confettiCanvasRef} className="fixed inset-0 pointer-events-none z-[81]" style={{ width: "100vw", height: "100vh" }} />

      {/* Diagonal pattern background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-[200%] w-[40px] bg-[#c8e600] origin-center"
            style={{ left: `${i * 60 - 200}px`, top: "-50%", transform: "rotate(30deg)" }}
          />
        ))}
      </div>

      {/* Flash */}
      {phase === "flash" && (
        <div className="fixed inset-0 z-[82] bg-white animate-flash pointer-events-none" />
      )}

      {/* POM Card with spin */}
      <div className="relative mt-16 mx-6 w-[calc(100%-48px)] max-w-[340px]" style={{ perspective: "800px" }}>
        <div
          className="w-full overflow-hidden rounded-bl-[40px] rounded-tr-[80px]"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Yellow top bar */}
          <div className="h-[72px] bg-[#ffcf0a] flex items-end px-6 pb-2">
            <span className="text-[72px] font-kbl leading-none text-surface-dark tracking-tight" style={{ lineHeight: "0.85" }}>POM</span>
          </div>

          {/* Profile image area */}
          <div className="relative bg-[#5fc0e1]" style={{ paddingBottom: "110%" }}>
            <img
              src={profileImage}
              alt="POM Player"
              className="absolute inset-0 w-full h-full object-cover object-top"
              draggable={false}
            />

            {/* Country flag + symbol badge */}
            <div className="absolute right-0 bottom-[52px] flex flex-col items-center">
              <div className="flex items-center justify-center w-[56px] h-[56px] bg-surface-dark">
                {countryData && <TwemojiFlag emoji={countryData.flag} size={36} />}
              </div>
              <div className="flex items-center justify-center w-[56px] bg-white p-2">
                <img src="/img/symbol.svg" alt="WC26" className="w-10 h-auto" />
              </div>
            </div>
          </div>

          {/* Blue bottom bar */}
          <div className="bg-accent-blue px-5 py-3 flex items-center justify-center">
            <span className="text-[20px] font-kbl text-surface-dark tracking-wide">PLABER OF THE MATCH</span>
          </div>
        </div>
      </div>

      {/* Message (fade in after reveal) */}
      <div
        className="mt-8 text-center px-6 transition-opacity duration-500"
        style={{ opacity: phase === "reveal" ? 1 : 0 }}
      >
        <p className="text-lg font-bold text-surface-dark leading-relaxed">
          최고의 매너로<br />모두 함께 즐길 수 있었어요
        </p>
      </div>

      {/* Buttons (fade in after reveal) */}
      <div
        className="mt-auto mb-10 w-full px-6 max-w-[340px] flex flex-col gap-3 transition-opacity duration-500"
        style={{ opacity: phase === "reveal" ? 1 : 0 }}
      >
        <button className="w-full rounded-xl bg-surface-dark py-4 text-sm font-bold text-white">
          공유하기
        </button>
        <button
          onClick={onClose}
          className="w-full rounded-xl py-3 text-sm font-bold text-surface-dark"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

// ─── VestCard ───
function VestCard({ country, owned, size = "sm" }: { country: (typeof COUNTRIES)[0]; owned: boolean; size?: "sm" | "lg" }) {
  const isLg = size === "lg";
  return (
    <div className={`flex flex-col gap-1 rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] p-1 ${isLg ? "w-[120px] mx-auto" : "w-full min-w-0"} ${owned ? "bg-accent-green/20 border border-accent-green/40" : "bg-gray-100"}`}>
      <div className="flex items-center px-2">
        <span className={`text-[11px] font-semibold leading-relaxed tracking-tight ${owned ? "text-surface-dark" : "text-on-surface-variant"}`}>{country.nameKo}</span>
      </div>
      <div className={`flex items-center justify-center rounded-2xl ${owned ? "bg-white" : "bg-gray-200"} ${isLg ? "h-[140px] px-3 py-4" : "h-[130px] px-2 py-2"}`}>
        {owned && country.bibImage ? (
          <img src={country.bibImage} alt={`${country.nameKo} 조끼`} className="h-full object-contain" draggable={false} />
        ) : owned ? (
          <TwemojiFlag emoji={country.flag} size={isLg ? 48 : 30} />
        ) : (
          <TwemojiFlag emoji={country.flag} size={30} grayscale />
        )}
      </div>
    </div>
  );
}
