"use client";

import { useState } from "react";
import { TwemojiFlag } from "@/components/TwemojiFlag";

const COUNTRIES_MAP: Record<string, { flag: string; nameKo: string }> = {
  KOR: { flag: "🇰🇷", nameKo: "한국" },
  BRA: { flag: "🇧🇷", nameKo: "브라질" },
  GER: { flag: "🇩🇪", nameKo: "독일" },
  FRA: { flag: "🇫🇷", nameKo: "프랑스" },
  ESP: { flag: "🇪🇸", nameKo: "스페인" },
  ARG: { flag: "🇦🇷", nameKo: "아르헨티나" },
  NED: { flag: "🇳🇱", nameKo: "네덜란드" },
  JPN: { flag: "🇯🇵", nameKo: "일본" },
  MEX: { flag: "🇲🇽", nameKo: "멕시코" },
  USA: { flag: "🇺🇸", nameKo: "미국" },
};

interface Player {
  name: string;
  country: string;
  imageUrl: string | null;
  level: string;
  pom: number;
  manner: number;
  late?: number;
  isMe?: boolean;
}

interface Team {
  name: string;
  color: string;
  bgColor: string;
  textColor: string;
  level: string;
  players: Player[];
}

const TEAMS: Team[] = [
  {
    name: "RED",
    color: "#FF4029",
    bgColor: "#FF4029",
    textColor: "#fff",
    level: "세미프로1",
    players: [
      { name: "라임", country: "ESP", imageUrl: "/img/profile_lime.png", level: "아마추어1", pom: 12, manner: 4.2 },
      { name: "커스", country: "BRA", imageUrl: "/img/profile_cus.png", level: "세미프로2", pom: 8, manner: 4.8, isMe: false },
      { name: "호두", country: "ARG", imageUrl: "/img/profile_hodoo.png", level: "아마추어3", pom: 5, manner: 4.9 },
      { name: "정남", country: "NED", imageUrl: "/img/profile_jeongnam.png", level: "아마추어4", pom: 2, manner: 4.6, late: 10 },
      { name: "나", country: "NED", imageUrl: "/img/profile_me_netherland.png", level: "아마추어2", pom: 3, manner: 4.5, isMe: true },
    ],
  },
  {
    name: "BLU",
    color: "#1570FF",
    bgColor: "#1570FF",
    textColor: "#fff",
    level: "아마추어5",
    players: [
      { name: "막국", country: "GER", imageUrl: "/img/profile_macgook.png", level: "아마추어2", pom: 7, manner: 4.5 },
      { name: "히어로", country: "FRA", imageUrl: "/img/profile_hero.png", level: "아마추어1", pom: 1, manner: 4.2 },
      { name: "큐", country: "KOR", imageUrl: "/img/profile_q.png", level: "세미프로1", pom: 15, manner: 5.0 },
      { name: "민수", country: "KOR", imageUrl: null, level: "비기너3", pom: 0, manner: 3.5 },
      { name: "지은", country: "KOR", imageUrl: null, level: "아마추어1", pom: 1, manner: 4.1 },
    ],
  },
  {
    name: "YEL",
    color: "#FFBE1A",
    bgColor: "#FFBE1A",
    textColor: "#22252A",
    level: "아마추어5",
    players: [
      { name: "제리", country: "JPN", imageUrl: "/img/profile_zerry.png", level: "비기너2", pom: 0, manner: 4.0 },
      { name: "태영", country: "KOR", imageUrl: null, level: "비기너1", pom: 0, manner: 3.2 },
      { name: "동국", country: "MEX", imageUrl: null, level: "아마추어4", pom: 3, manner: 4.3 },
      { name: "승민", country: "USA", imageUrl: null, level: "아마추어3", pom: 2, manner: 4.0, late: 45 },
      { name: "준호", country: "KOR", imageUrl: null, level: "아마추어2", pom: 1, manner: 3.8 },
    ],
  },
];

type LockerTab = "info" | "team" | "quarter" | "review";

export default function LockerPage() {
  const [activeTab, setActiveTab] = useState<LockerTab>("team");
  const totalPlayers = TEAMS.reduce((sum, t) => sum + t.players.length, 0);

  const TABS: { key: LockerTab; label: string }[] = [
    { key: "info", label: "정보" },
    { key: "team", label: "팀" },
    { key: "quarter", label: "쿼터" },
    { key: "review", label: "리뷰" },
  ];

  return (
    <div className="max-w-[480px] mx-auto bg-white min-h-screen">
      {/* Nav */}
      <div className="sticky top-0 z-50 bg-white">
        <div className="px-5 py-3 flex items-center justify-between">
          <a href="/vest" className="text-surface-dark">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </a>
          <span className="text-base font-bold text-surface-dark">라커룸</span>
          <div className="w-6" />
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-gray-100">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-sm font-bold text-center relative cursor-pointer transition-colors ${
                activeTab === tab.key ? "text-surface-dark" : "text-on-surface-variant"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-12 rounded-full bg-accent-blue" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === "team" && (
        <div className="px-4 py-5">
          {/* Participant Count */}
          <div className="rounded-2xl bg-gray-50 px-5 py-4">
            <span className="text-sm text-on-surface-variant">참가자 <span className="font-bold text-surface-dark">{totalPlayers}명</span></span>
          </div>

          {/* Teams */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {TEAMS.map((team) => (
              <div key={team.name}>
                {/* Team Header */}
                <div className="rounded-t-xl overflow-hidden">
                  <div className="py-2 px-3 text-center font-bold text-sm" style={{ background: team.bgColor, color: team.textColor }}>
                    {team.name} {team.players.length}/{team.players.length}
                  </div>
                  <div className="bg-white border-x border-b border-gray-100 py-2 text-center text-xs text-surface-dark font-medium">
                    {team.level}
                  </div>
                </div>

                {/* Player Slots */}
                <div className="mt-2 flex flex-col gap-1.5">
                  {team.players.map((player, idx) => {
                    const c = COUNTRIES_MAP[player.country];
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 ${
                          player.isMe ? "border-accent-blue bg-accent-blue/5" : "border-gray-100 bg-white"
                        }`}
                      >
                        {/* Number */}
                        <div
                          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-xs font-bold text-white"
                          style={{ background: team.bgColor, color: team.textColor }}
                        >
                          {idx + 1}
                        </div>

                        {/* Profile Photo + Flag */}
                        <div className="relative flex-shrink-0">
                          {player.imageUrl ? (
                            <img
                              src={player.imageUrl}
                              alt={player.name}
                              className="w-8 h-8 rounded-full object-cover"
                              draggable={false}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                              </svg>
                            </div>
                          )}
                          {c && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
                              <TwemojiFlag emoji={c.flag} size={12} />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col min-w-0 flex-1">
                          <div className="flex items-center gap-1">
                            {player.isMe && (
                              <span className="text-[9px] font-bold text-accent-blue bg-accent-blue/10 rounded px-1">나</span>
                            )}
                            <span className="text-xs font-bold text-surface-dark truncate">{player.name}</span>
                          </div>
                          {player.late && (
                            <span className="text-[10px] font-medium text-[#FF4029]">{player.late}분</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "info" && (
        <div className="px-5 py-10 text-center text-on-surface-variant text-sm">
          매치 정보가 여기에 표시됩니다
        </div>
      )}

      {activeTab === "quarter" && (
        <div className="px-5 py-10 text-center text-on-surface-variant text-sm">
          쿼터 정보가 여기에 표시됩니다
        </div>
      )}

      {activeTab === "review" && (
        <div className="px-5 py-10 text-center text-on-surface-variant text-sm">
          리뷰가 여기에 표시됩니다
        </div>
      )}
    </div>
  );
}
