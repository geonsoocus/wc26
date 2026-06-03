"use client";

import { useState, useEffect } from "react";
import { COUNTRIES } from "@/data/countries";
import { TwemojiFlag } from "@/components/TwemojiFlag";

// ─── Pack & Reward Types ───
type PackType = "nations" | "reward";

interface Pack {
  id: number;
  type: PackType;
  label: string;
  image: string;
  // Mock reward for demo
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

const REWARD_POOL = [
  "대한민국 국가대표 유니폼",
  "프로필 생성 토큰 1개",
  "프로필 생성 토큰 2개",
  "프로필 생성 토큰 3개",
  "프로필 생성 토큰 5개",
  "2,000원 할인 쿠폰",
  "5,000원 할인 쿠폰",
  "무료 참가 쿠폰",
];

// ─── Scenario Data ───
type Scenario = "new" | "active" | "invited";

const SCENARIO_DATA = {
  new: {
    label: "케이스1: 신규 유저",
    desc: "이벤트를 처음 발견한 유저",
    ownedVests: [] as string[],
    packs: [
      { id: 1, type: "nations" as PackType, label: "웰컴 네이션스팩", image: "/img/daily_pack.svg", mockReward: { kind: "nations" as const, country: "KOR" } },
      { id: 2, type: "reward" as PackType, label: "웰컴 리워드팩", image: "/img/match_pack.svg", mockReward: { kind: "reward" as const, item: "프로필 생성 토큰 1개" } },
    ],
    stats: { match: 0, level: 1, sentPraise: 0, receivedPraise: 0, pom: 0 },
    profiles: [] as { id: number; country: string; imageUrl: string; isActive: boolean }[],
    profileQuota: { used: 0, total: 3 },
    predictions: [
      { slot: 1, country: null, unlocked: false },
      { slot: 2, country: null, unlocked: false },
      { slot: 3, country: null, unlocked: false },
    ],
    friends: [] as { name: string; country: string; imageUrl: string | null; hasProfile?: boolean; stats?: { match: number; level: number; praise: number; pom: number; manner?: number } }[],
    hasProfile: false,
    matchMission: { completed: 0, total: 3 },
    inviter: null as { name: string; country: string; imageUrl: string | null } | null,
  },
  active: {
    label: "케이스2: 참여중 유저",
    desc: "프로필 생성 완료, 매치 참여 중",
    ownedVests: ["KOR", "BRA", "FRA", "MEX", "GER"],
    packs: [
      { id: 1, type: "nations" as PackType, label: "네이션스팩", image: "/img/daily_pack.svg", mockReward: { kind: "nations" as const, country: "MEX" } },
      { id: 2, type: "nations" as PackType, label: "네이션스팩", image: "/img/daily_pack.svg", mockReward: { kind: "nations" as const, country: "JPN" } },
      { id: 3, type: "reward" as PackType, label: "리워드팩", image: "/img/match_pack.svg", mockReward: { kind: "reward" as const, item: "5,000원 할인 쿠폰" } },
      { id: 4, type: "reward" as PackType, label: "리워드팩", image: "/img/match_pack.svg", mockReward: { kind: "reward" as const, item: "무료 참가 쿠폰" } },
    ],
    stats: { match: 7, level: 7, sentPraise: 72, receivedPraise: 48, pom: 3 },
    profiles: [
      { id: 1, country: "BRA", imageUrl: "/img/profile_me_brazil.png", isActive: true },
      { id: 2, country: "JPN", imageUrl: "/img/profile_me_japan.png", isActive: false },
      { id: 3, country: "NED", imageUrl: "/img/profile_me_netherland.png", isActive: false },
      { id: 4, country: "USA", imageUrl: "/img/profile_me_usa.png", isActive: false },
    ],
    profileQuota: { used: 4, total: 5 },
    predictions: [
      { slot: 1, country: "CUW", unlocked: true },
      { slot: 2, country: null, unlocked: false },
      { slot: 3, country: null, unlocked: false },
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
  },
  invited: {
    label: "케이스3: 초대받은 유저",
    desc: "친구의 공유 링크로 접근",
    ownedVests: [] as string[],
    packs: [
      { id: 1, type: "nations" as PackType, label: "웰컴 네이션스팩", image: "/img/daily_pack.svg", mockReward: { kind: "nations" as const, country: "BRA" } },
      { id: 2, type: "reward" as PackType, label: "웰컴 리워드팩", image: "/img/match_pack.svg", mockReward: { kind: "reward" as const, item: "프로필 생성 토큰 1개" } },
    ],
    stats: { match: 2, level: 3, sentPraise: 5, receivedPraise: 8, pom: 0 },
    profiles: [] as { id: number; country: string; imageUrl: string; isActive: boolean }[],
    profileQuota: { used: 0, total: 3 },
    predictions: [
      { slot: 1, country: null, unlocked: false },
      { slot: 2, country: null, unlocked: false },
      { slot: 3, country: null, unlocked: false },
    ],
    friends: [] as { name: string; country: string; imageUrl: string | null; hasProfile?: boolean; stats?: { match: number; level: number; praise: number; pom: number; manner?: number } }[],
    hasProfile: false,
    matchMission: { completed: 0, total: 3 },
    inviter: { name: "커스", country: "BRA", imageUrl: "/img/profile_cus.png" },
  },
};

type Tab = "main" | "friends" | "collection";

export default function VestPage() {
  const [scenario, setScenario] = useState<Scenario>("active");
  const [debugOpen, setDebugOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("main");
  const [openedPack, setOpenedPack] = useState<Pack | null>(null);
  const [packPhase, setPackPhase] = useState<"shake" | "reveal">("shake");
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const [inviteDismissed, setInviteDismissed] = useState(false);
  const [profilePickerOpen, setProfilePickerOpen] = useState(false);

  const data = SCENARIO_DATA[scenario];

  const [activeProfileId, setActiveProfileId] = useState(data.profiles.find(p => p.isActive)?.id ?? 0);

  // Reset state on scenario change
  useEffect(() => {
    setActiveTab("main");
    setOpenedPack(null);
    setWelcomeDismissed(false);
    setInviteDismissed(false);
    setProfilePickerOpen(false);
    setActiveProfileId(SCENARIO_DATA[scenario].profiles.find(p => p.isActive)?.id ?? 0);
  }, [scenario]);

  useEffect(() => {
    if (openedPack) {
      setPackPhase("shake");
      const timer = setTimeout(() => setPackPhase("reveal"), 1200);
      return () => clearTimeout(timer);
    }
  }, [openedPack]);

  const TABS: { key: Tab; label: string }[] = [
    { key: "main", label: "메인" },
    { key: "friends", label: "친구" },
    { key: "collection", label: "컬렉션" },
  ];

  return (
    <div className="max-w-[1024px] mx-auto pb-0">
      {/* Invite Banner (Case 3) */}
      {scenario === "invited" && !inviteDismissed && (
        <InviteBanner inviter={data.inviter!} onDismiss={() => setInviteDismissed(true)} />
      )}

      {/* Welcome Modal (Case 1 & 3) */}
      {!data.hasProfile && !welcomeDismissed && !data.inviter && (
        <WelcomeOverlay onDismiss={() => setWelcomeDismissed(true)} />
      )}

      {/* 2-column layout on lg, single column on mobile */}
      <div className="flex flex-col lg:flex-row lg:items-start">
        {/* Left: Profile Card (sticky on desktop) */}
        <div className="lg:w-[380px] lg:flex-shrink-0 lg:sticky lg:top-0 lg:self-start">
          <section className="relative overflow-hidden rounded-bl-[40px] lg:rounded-bl-none lg:rounded-br-[40px]" style={{ background: "#5fc0e1" }}>
            <div className="relative z-10 flex items-center pt-6 pb-0">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => data.hasProfile && setProfilePickerOpen(true)}
                  className={`flex items-center justify-center w-16 h-16 bg-surface-dark ${data.hasProfile ? "cursor-pointer active:scale-95 transition-transform" : ""}`}
                >
                  <TwemojiFlag
                    emoji={COUNTRIES.find(c => c.code === (data.profiles.find(p => p.id === activeProfileId)?.country ?? "JPN"))?.flag ?? "🇯🇵"}
                    size={40}
                  />
                </button>
                <div className="flex items-center justify-center w-16 bg-white p-2">
                  <img src="/img/symbol.svg" alt="WC26" className="w-12 h-auto" />
                </div>
              </div>
              <div className="flex-1 flex justify-end -mr-5 lg:mr-0 lg:justify-center">
                {data.hasProfile ? (
                  <button onClick={() => setProfilePickerOpen(true)} className="active:scale-95 transition-transform">
                    <img src={data.profiles.find(p => p.id === activeProfileId)?.imageUrl ?? data.profiles[0]?.imageUrl ?? "/img/profile.png"} alt="Player" className="w-[260px] h-[260px] object-contain" />
                  </button>
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
                    <span className="text-2xl font-russo">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right: Tabs + Content */}
        <div className="flex-1 min-w-0">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-white sticky top-0 z-50">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-4 text-sm font-bold text-center transition-colors relative cursor-pointer ${
                  activeTab === tab.key ? "text-surface-dark" : "text-on-surface-variant"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-10 rounded-full bg-surface-dark" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "main" && (
            <MainTab
              data={data}
              scenario={scenario}
              openedPack={openedPack}
              setOpenedPack={setOpenedPack}
              packPhase={packPhase}
              onOpenProfilePicker={() => setProfilePickerOpen(true)}
            />
          )}
          {activeTab === "friends" && <FriendsTab data={data} scenario={scenario} />}
          {activeTab === "collection" && <CollectionTab data={data} />}
        </div>
      </div>

      {/* Profile Picker Modal */}
      {profilePickerOpen && <ProfilePickerModal
        data={data}
        activeProfileId={activeProfileId}
        onSelect={(id) => { setActiveProfileId(id); setProfilePickerOpen(false); }}
        onClose={() => setProfilePickerOpen(false)}
      />}

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
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[rgba(0,0,0,0.5)]" onClick={() => setDebugOpen(false)}>
          <div className="w-full max-w-lg rounded-t-2xl bg-white p-5 pb-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-surface-dark">시나리오 선택</h3>
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
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Welcome Overlay (Case 1) ───
function WelcomeOverlay({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center bg-[rgba(0,0,0,0.7)] backdrop-blur-sm">
      <div className="mx-6 w-full max-w-sm rounded-2xl bg-white p-8 text-center">
        <div className="text-4xl">🎉</div>
        <h2 className="mt-3 text-xl font-extrabold text-surface-dark">PLAB WC26에 오신 걸 환영해요!</h2>
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
  openedPack,
  setOpenedPack,
  packPhase,
  onOpenProfilePicker,
}: {
  data: ScenarioData;
  scenario: Scenario;
  openedPack: Pack | null;
  setOpenedPack: (v: Pack | null) => void;
  packPhase: "shake" | "reveal";
  onOpenProfilePicker: () => void;
}) {

  return (
    <>
      {/* Case 1 & 3: 프로필 만들기 유도 */}
      {!data.hasProfile && (
        <section className="bg-accent-green/10 px-5 py-8 border-b border-accent-green/20">
          <div className="text-center">
            <h2 className="text-lg font-extrabold text-surface-dark">
              {scenario === "invited" ? "친구처럼 프로필을 만들어보세요!" : "먼저 프로필을 만들어보세요!"}
            </h2>
            <p className="mt-1 text-xs text-on-surface-variant">
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

      {/* 나의 팩 */}
      <section className="bg-white px-5 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-surface-dark">나의 팩</h2>
            <p className="mt-1 text-xs text-on-surface-variant">팩을 오픈하고 조끼를 확인하세요</p>
          </div>
          <button className="flex items-center gap-1 text-xs font-bold text-surface-dark underline">팩 얻는 방법</button>
        </div>
        <div className="mt-5 flex gap-4 overflow-x-auto pb-2">
          {data.packs.map((pack) => (
            <button key={pack.id} onClick={() => setOpenedPack(pack)} className="flex-shrink-0 transition-transform active:scale-95">
              <img src={pack.image} alt={pack.label} className="h-[97px] w-[62px]" draggable={false} />
              <div className="mt-1 text-[10px] font-semibold text-on-surface-variant text-center">{pack.label}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Pack Open Modal */}
      {openedPack && (() => {
        const reward = openedPack.mockReward;
        const isNations = reward.kind === "nations";
        const rewardCountry = isNations ? COUNTRIES.find((c) => c.code === reward.country) : null;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.7)] backdrop-blur-sm" onClick={() => { if (packPhase === "reveal") setOpenedPack(null); }}>
            <div className="mx-6 w-full max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
              {packPhase === "shake" ? (
                <div className="flex flex-col items-center gap-4">
                  <img src={openedPack.image} alt="Pack" className="h-[194px] w-[124px] animate-pack-shake" />
                  <p className="text-sm font-semibold text-white animate-pulse">
                    {isNations ? "네이션스팩" : "리워드팩"} 오픈 중...
                  </p>
                </div>
              ) : (
                <div className="animate-pack-reveal rounded-2xl bg-white p-8">
                  {isNations && rewardCountry ? (
                    <>
                      <div className="text-xs font-semibold text-accent-green uppercase tracking-wider">Nations Pack</div>
                      <div className="text-lg font-extrabold text-surface-dark mt-1">새로운 조끼 획득!</div>
                      <div className="mx-auto mt-6 animate-vest-pop">
                        <VestCard country={rewardCountry} owned={true} size="lg" />
                      </div>
                      <p className="mt-4 text-sm text-on-surface-variant">
                        {rewardCountry.flag} {rewardCountry.nameKo} 스타일 플랩 조끼를 획득했습니다
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="text-xs font-semibold text-accent-blue uppercase tracking-wider">Reward Pack</div>
                      <div className="text-lg font-extrabold text-surface-dark mt-1">보상 획득!</div>
                      <div className="mx-auto mt-6 animate-vest-pop flex flex-col items-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-blue/10">
                          {(reward as RewardPackReward).item.includes("토큰") ? (
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1570ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                            </svg>
                          ) : (reward as RewardPackReward).item.includes("쿠폰") ? (
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1570ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="5" width="20" height="14" rx="2" />
                              <line x1="2" y1="10" x2="22" y2="10" />
                            </svg>
                          ) : (
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1570ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
                            </svg>
                          )}
                        </div>
                        <p className="mt-4 text-base font-bold text-surface-dark">
                          {(reward as RewardPackReward).item}
                        </p>
                      </div>
                    </>
                  )}
                  <button onClick={() => setOpenedPack(null)} className="mt-6 w-full rounded-xl bg-accent-green px-4 py-3 text-sm font-bold text-surface-dark">확인</button>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Case 2: 매치 참여 마일스톤 */}
      {scenario === "active" && <MatchMission completed={data.matchMission.completed} />}

      {/* 우승국 예측 */}
      <section className="bg-surface-hover px-5 py-10">
        <h2 className="text-xl font-extrabold text-surface-dark">우승국 예측</h2>
        <p className="mt-1 text-sm font-medium text-black">획득한 조끼로 우승국을 예측해보세요!</p>
        <div className="mt-6 flex gap-2">
          {data.predictions.map((pred) => {
            const country = pred.country ? COUNTRIES.find((c) => c.code === pred.country) : null;
            return (
              <div key={pred.slot} className={`flex flex-1 flex-col gap-1 rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] p-1 ${pred.unlocked ? "bg-accent-green" : "bg-surface-gray pt-6"}`}>
                {pred.unlocked && country && (
                  <div className="flex items-center gap-1 px-2">
                    <TwemojiFlag emoji={country.flag} size={16} />
                    <span className="text-xs font-semibold text-surface-dark tracking-tight">{country.nameKo}</span>
                  </div>
                )}
                <div className="flex h-[120px] items-center justify-center rounded-2xl bg-surface-dark px-4 py-5">
                  {pred.unlocked && country ? <TwemojiFlag emoji={country.flag} size={48} /> : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#676d7e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

// ─── Profile Picker Modal ───
type ProfileGenStep = "idle" | "selectCountry" | "uploadPhoto" | "generating" | "done";

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
  const [genStep, setGenStep] = useState<ProfileGenStep>("idle");
  const [genCountry, setGenCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const genCountryData = genCountry ? COUNTRIES.find((c) => c.code === genCountry) : null;
  const remaining = data.profileQuota.total - data.profileQuota.used;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    if (genStep === "generating") {
      const timer = setTimeout(() => setGenStep("done"), 2000);
      return () => clearTimeout(timer);
    }
  }, [genStep]);

  return (
    <div className="fixed inset-0 z-[55] flex items-end justify-center bg-[rgba(0,0,0,0.5)]" onClick={onClose}>
      <div className="w-full max-w-lg rounded-t-2xl bg-white p-5 pb-10 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-300" />

        {genStep === "idle" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-surface-dark">내 프로필</h3>
              <div className="flex items-center gap-1 rounded-full bg-surface-hover px-2.5 py-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1570ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                <span className="text-[10px] font-bold text-accent-blue">{remaining}회 남음</span>
              </div>
            </div>

            {data.profiles.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {data.profiles.map((profile) => {
                  const country = COUNTRIES.find((c) => c.code === profile.country)!;
                  const isSelected = profile.id === activeProfileId;
                  return (
                    <button
                      key={profile.id}
                      onClick={() => onSelect(profile.id)}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className={`relative w-full rounded-bl-[16px] rounded-br-[16px] rounded-tr-[16px] overflow-hidden border-2 transition-all ${
                        isSelected ? "border-accent-green shadow-md" : "border-transparent"
                      }`} style={{ paddingBottom: "125%" }}>
                        <img src={profile.imageUrl} alt={country.nameKo} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
                        <div className="absolute top-1.5 left-1.5">
                          <TwemojiFlag emoji={country.flag} size={16} />
                        </div>
                        {isSelected && (
                          <div className="absolute bottom-0 inset-x-0 bg-accent-green py-0.5 text-center">
                            <span className="text-[8px] font-bold text-surface-dark">적용중</span>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-medium text-on-surface-variant">{country.nameKo}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {data.profiles.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-on-surface-variant">아직 프로필이 없어요</p>
              </div>
            )}

            <button
              onClick={() => setGenStep("selectCountry")}
              disabled={remaining <= 0}
              className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-accent-blue py-3 text-sm font-bold text-white disabled:opacity-40"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
              새 프로필 만들기
            </button>
          </>
        )}

        {genStep === "selectCountry" && (
          <>
            <h3 className="text-base font-extrabold text-surface-dark mb-1">어느 나라 선수가 되어볼까요?</h3>
            <p className="text-xs text-on-surface-variant mb-3">AI가 해당 국가 스타일로 프로필을 만들어드려요</p>
            <div className="relative">
              <input type="text" placeholder="국가 검색..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-surface-hover px-4 py-2.5 pl-9 text-sm text-surface-dark placeholder:text-on-surface-variant focus:border-accent-blue focus:outline-none" />
              <svg className="absolute top-1/2 left-3 -translate-y-1/2 text-on-surface-variant" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 max-h-[240px] overflow-y-auto">
              {(searchQuery ? COUNTRIES.filter((c) => c.nameKo.includes(searchQuery) || c.name.toLowerCase().includes(searchQuery.toLowerCase())) : COUNTRIES.slice(0, 12)).map((country) => (
                <button key={country.code} onClick={() => { setGenCountry(country.code); setGenStep("uploadPhoto"); setSearchQuery(""); }} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-left hover:border-accent-blue">
                  <TwemojiFlag emoji={country.flag} size={18} />
                  <span className="text-xs font-medium text-surface-dark truncate">{country.nameKo}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setGenStep("idle")} className="mt-3 w-full text-xs text-on-surface-variant">뒤로</button>
          </>
        )}

        {genStep === "uploadPhoto" && genCountryData && (
          <div className="text-center">
            <TwemojiFlag emoji={genCountryData.flag} size={36} />
            <p className="mt-2 text-sm font-bold text-surface-dark">{genCountryData.nameKo} 선수 프로필</p>
            <p className="mt-1 text-xs text-on-surface-variant">사진을 업로드하면 AI가 변환해드려요</p>
            <div className="mx-auto mt-4 flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 bg-surface-hover">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#676d7e" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              <span className="text-[10px] text-on-surface-variant">사진 업로드</span>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setGenStep("selectCountry")} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-medium text-on-surface-variant">뒤로</button>
              <button onClick={() => setGenStep("generating")} className="flex-1 rounded-xl bg-accent-green py-2.5 text-xs font-bold text-surface-dark">생성하기</button>
            </div>
          </div>
        )}

        {genStep === "generating" && genCountryData && (
          <div className="text-center py-6">
            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-accent-blue" />
            <p className="mt-4 text-sm font-bold text-surface-dark">프로필 생성 중...</p>
            <p className="mt-1 text-xs text-on-surface-variant">AI가 {genCountryData.nameKo} 국가대표 스타일로 만들고 있어요</p>
          </div>
        )}

        {genStep === "done" && genCountryData && (
          <div className="text-center">
            <p className="text-xs font-bold text-accent-blue">생성 완료!</p>
            <div className="mx-auto mt-3 w-32 h-40 rounded-bl-[16px] rounded-br-[16px] rounded-tr-[16px] overflow-hidden border-2 border-accent-green">
              <img src="/img/profile.png" alt="Generated" className="w-full h-full object-cover" />
            </div>
            <p className="mt-2 text-sm font-bold text-surface-dark">{genCountryData.nameKo} 프로필</p>
            <div className="mt-4 flex gap-2">
              <button onClick={onClose} className="flex-1 rounded-xl bg-accent-green py-2.5 text-xs font-bold text-surface-dark">프로필에 적용</button>
              <button onClick={() => { setGenStep("idle"); setGenCountry(null); }} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-medium text-on-surface-variant">다른 프로필 보기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Match Mission ───
const MISSION_REWARDS = [
  {
    match: 1,
    label: "MATCHDAY 1",
    nations: { count: 1, desc: "랜덤 국가 조끼 1개" },
    rewards: { count: 1, items: ["대한민국 국가대표 유니폼", "프로필 생성 토큰 1개", "2,000원 할인 쿠폰"] },
  },
  {
    match: 2,
    label: "MATCHDAY 2",
    nations: { count: 3, desc: "랜덤 국가 조끼 3개" },
    rewards: { count: 2, items: ["프로필 생성 토큰 2개", "5,000원 할인 쿠폰", "무료 참가 쿠폰"] },
  },
  {
    match: 3,
    label: "MATCHDAY 3",
    nations: { count: 5, desc: "랜덤 국가 조끼 5개" },
    rewards: { count: 3, items: ["프로필 생성 토큰 3개", "프로필 생성 토큰 5개", "무료 참가 쿠폰"] },
  },
];

function MatchMission({ completed }: { completed: number }) {
  const [rewardModal, setRewardModal] = useState<number | null>(null);
  const selectedReward = rewardModal !== null ? MISSION_REWARDS.find(r => r.match === rewardModal) : null;

  return (
    <section className="bg-white px-5 py-8 border-t border-gray-100">
      <h2 className="text-xl font-extrabold text-surface-dark">매치데이 미션</h2>
      <p className="mt-1 text-xs text-on-surface-variant">매치에 참여할 때마다 보상을 받을 수 있어요</p>

      <div className="mt-5 relative">
        {/* Progress line */}
        <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200 rounded-full">
          <div
            className="h-full rounded-full bg-accent-green transition-all duration-500"
            style={{ width: `${(completed / 3) * 100}%` }}
          />
        </div>

        {/* Milestones */}
        <div className="relative flex justify-between">
          {MISSION_REWARDS.map((ms) => {
            const done = completed >= ms.match;
            const isCurrent = completed === ms.match - 1;
            return (
              <button
                key={ms.match}
                onClick={() => setRewardModal(ms.match)}
                className="flex flex-col items-center w-24"
              >
                <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                  done ? "border-accent-green bg-accent-green" : isCurrent ? "border-accent-blue bg-white" : "border-gray-200 bg-white"
                }`}>
                  {done ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22252a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : (
                    <span className={`text-sm font-bold ${isCurrent ? "text-accent-blue" : "text-gray-300"}`}>{ms.match}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-[10px] font-bold ${done ? "text-surface-dark" : "text-on-surface-variant"}`}>{ms.label}</div>
                  <div className="text-[9px] text-accent-blue font-semibold mt-0.5">리워드 보기</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <button className="mt-6 w-full rounded-xl bg-accent-blue py-3 text-sm font-bold text-white">
        매치 참여하러 가기
      </button>

      {/* Reward Detail Modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-[55] flex items-end justify-center bg-[rgba(0,0,0,0.4)]" onClick={() => setRewardModal(null)}>
          <div className="w-full max-w-lg rounded-t-2xl bg-white p-5 pb-10" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-300" />
            <h3 className="text-base font-extrabold text-surface-dark">{selectedReward.label} 보상</h3>
            <p className="mt-1 text-xs text-on-surface-variant">매치 완료 시 아래 보상을 받을 수 있어요</p>

            <div className="mt-5 space-y-3">
              {/* Nations Pack */}
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-surface-hover p-4">
                <img src="/img/daily_pack.svg" alt="Nations Pack" className="h-14 w-9 flex-shrink-0" />
                <div>
                  <div className="text-sm font-bold text-surface-dark">네이션스팩 x{selectedReward.nations.count}</div>
                  <div className="text-xs text-on-surface-variant mt-0.5">{selectedReward.nations.desc}</div>
                </div>
              </div>

              {/* Reward Pack */}
              <div className="rounded-xl border border-gray-100 bg-surface-hover p-4">
                <div className="flex items-center gap-3">
                  <img src="/img/match_pack.svg" alt="Reward Pack" className="h-14 w-9 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-surface-dark">리워드팩 x{selectedReward.rewards.count}</div>
                    <div className="text-xs text-on-surface-variant mt-0.5">아래 보상 중 {selectedReward.rewards.count}개 획득</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  {selectedReward.rewards.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-blue flex-shrink-0" />
                      <span className="text-xs text-surface-dark">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setRewardModal(null)}
              className="mt-5 w-full rounded-xl bg-surface-dark py-3 text-sm font-bold text-white"
            >
              닫기
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
        <div className="fixed inset-0 z-[55] flex items-end justify-center bg-[rgba(0,0,0,0.4)]" onClick={() => setSelectedFriend(null)}>
          <div className="w-full max-w-lg rounded-t-2xl bg-white px-5 pt-4 pb-10" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-gray-300" />
            <div className="flex flex-col items-center">
              {/* Profile Card */}
              <div className="w-[65vw] max-w-[260px] overflow-hidden rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] border border-gray-100">
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
                  <div className="absolute bottom-0 left-0 flex flex-col">
                    <div className="flex items-center justify-center w-8 h-8 bg-surface-dark">
                      <TwemojiFlag emoji={selectedCountry.flag} size={22} />
                    </div>
                    <div className="flex items-center justify-center w-8 bg-white p-1">
                      <img src="/img/symbol.svg" alt="WC26" className="w-5 h-auto" />
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
            <h2 className="text-xl font-extrabold text-surface-dark">친구들</h2>
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
          <p className="mt-1 text-xs text-on-surface-variant">친구들의 월드컵 프로필을 확인해보세요</p>

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
              <div className="mt-6 grid grid-cols-3 gap-3">
                {withProfile.map((friend) => {
                  const country = COUNTRIES.find((c) => c.code === friend.country)!;
                  return (
                    <button key={friend.name} onClick={() => setSelectedFriend(friend)} className="overflow-hidden rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] text-left transition-transform active:scale-95">
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
                        <div className="absolute bottom-0 left-0 flex flex-col">
                          <div className="flex items-center justify-center w-6 h-6 bg-surface-dark">
                            <TwemojiFlag emoji={country.flag} size={18} />
                          </div>
                          <div className="flex items-center justify-center w-6 bg-white p-0.5">
                            <img src="/img/symbol.svg" alt="WC26" className="w-4 h-auto" />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
                <div className="relative" style={{ paddingBottom: "150%" }}>
                  <button className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] border-2 border-dashed border-gray-200 text-on-surface-variant hover:border-accent-green hover:text-accent-green">
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
                  <div className="w-10 text-center">매너</div>
                  <div className="w-10 text-center">매치</div>
                  <div className="w-10 text-center">칭찬</div>
                  <div className="w-10 text-center">POM</div>
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
                        <div className={`w-10 text-center text-sm font-russo ${manner >= 4.5 ? "text-accent-green" : manner >= 4.0 ? "text-accent-blue" : "text-surface-dark"}`}>{manner.toFixed(1)}</div>
                        <div className="w-10 text-center text-sm font-russo text-surface-dark">{friend.stats?.match ?? 0}</div>
                        <div className="w-10 text-center text-sm font-russo text-surface-dark">{friend.stats?.praise ?? 0}</div>
                        <div className="w-10 text-center text-sm font-russo text-surface-dark">{friend.stats?.pom ?? 0}</div>
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
function CollectionTab({ data }: { data: ScenarioData }) {
  return (
    <section className="bg-white px-5 py-8 overflow-hidden">
      <div className="flex items-center justify-between py-2">
        <h2 className="text-xl font-extrabold text-surface-dark">컬렉션</h2>
        <span className="text-2xl font-semibold tracking-tight text-surface-dark">{data.ownedVests.length}/48</span>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {COUNTRIES.map((country) => (
          <VestCard key={country.code} country={country} owned={data.ownedVests.includes(country.code)} />
        ))}
      </div>
    </section>
  );
}

// ─── VestCard ───
function VestCard({ country, owned, size = "sm" }: { country: (typeof COUNTRIES)[0]; owned: boolean; size?: "sm" | "lg" }) {
  const isLg = size === "lg";
  return (
    <div className={`flex flex-col gap-1 rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] p-1 ${isLg ? "w-[120px] mx-auto" : "w-full min-w-0"} ${owned ? "bg-accent-green" : "bg-surface-gray"}`}>
      <div className="flex items-center px-2">
        <span className={`text-[11px] font-semibold leading-relaxed tracking-tight ${owned ? "text-surface-dark" : "text-white"}`}>{country.nameKo}</span>
      </div>
      <div className={`flex items-center justify-center rounded-2xl bg-surface-dark ${isLg ? "h-[140px] px-3 py-4" : "h-[110px] px-3 py-3"}`}>
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
