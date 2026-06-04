"use client";

import { useState } from "react";
import { TwemojiFlag } from "@/components/TwemojiFlag";

const MATCH_DATA = {
  title: "잠실 LC 풋살파크",
  date: "6월 18일 (수) 20:00",
  location: "서울 송파구 잠실동",
  cover: "/img/match_cover.jpg",
  format: "6vs6 3파전",
  level: "아마추어2 이상",
  gender: "남녀 모두",
  players: "10~18명",
  shoes: "풋살화/운동화",
  avgAge: 24.5,
  avgLevel: "아마추어3",
  reward: {
    type: "vest",
    country: "GER",
    label: "독일 뱃지",
  },
  participants: [
    { name: "라임", level: "아마추어1", style: "패스", pom: 12, country: "ESP", imageUrl: "/img/profile_lime.png", relation: "내가 칭찬했어요" },
    { name: "커스", level: "아마추어1", style: "패스", pom: 12, country: "BRA", imageUrl: "/img/profile_cus.png", relation: "내가 칭찬했어요" },
    { name: "호두", level: "비기너3", style: "패스", pom: 12, country: "ARG", imageUrl: "/img/profile_hodoo.png", relation: "나를 칭찬했어요" },
    { name: "막국", level: "세미프로1", style: "드리블", pom: 12, country: "GER", imageUrl: "/img/profile_macgook.png", relation: "친구" },
    { name: "정남", level: "아마추어4", style: "피지컬", pom: 12, country: "NED", imageUrl: "/img/profile_jeongnam.png", relation: null },
  ],
};

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

export default function MatchDetailPage() {
  const [attending, setAttending] = useState(false);
  const m = MATCH_DATA;
  const rewardCountry = COUNTRIES_MAP[m.reward.country];

  return (
    <div className="max-w-[480px] mx-auto bg-[#f0f3f5] min-h-screen pb-[90px]">
      {/* Nav */}
      <div className="sticky top-0 z-50 bg-white px-5 py-3 flex items-center justify-between">
        <a href="/vest" className="text-surface-dark">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </a>
        <span className="text-base font-bold text-surface-dark">매치 상세</span>
        <div className="w-6" />
      </div>

      {/* Cover */}
      <div className="relative h-[150px] bg-gray-300 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.3)]" />
        <div className="absolute bottom-3 right-3 bg-[rgba(34,40,54,0.5)] rounded-full px-2.5 py-1 text-xs text-white">
          1/3 <span className="font-bold">+</span>
        </div>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-3 mt-3">
        {/* 매치 포인트 */}
        <section className="bg-white px-5 pb-6">
          <h2 className="text-lg font-bold text-surface-dark py-5">매치 포인트</h2>

          <div className="flex flex-col gap-5">
            <div className="flex gap-5">
              <div className="flex flex-1 gap-2.5 items-start">
                <span className="text-base">📊</span>
                <span className="text-[15px] text-on-surface-variant underline">{m.level}</span>
              </div>
              <div className="flex flex-1 gap-2.5 items-start">
                <span className="text-base">👥</span>
                <span className="text-base text-surface-dark">{m.gender}</span>
              </div>
            </div>
            <div className="flex gap-5">
              <div className="flex flex-1 gap-2.5 items-start">
                <span className="text-base">⚽</span>
                <span className="text-base text-surface-dark">{m.format}</span>
              </div>
              <div className="flex flex-1 gap-2.5 items-start">
                <span className="text-base">🏃</span>
                <span className="text-base text-surface-dark">{m.players}</span>
              </div>
            </div>
            <div className="flex gap-2.5 items-start">
              <span className="text-base">👟</span>
              <span className="text-[15px] text-on-surface-variant underline">{m.shoes}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-5 pt-4 flex flex-col gap-2.5">
            <div className="flex gap-2.5 items-start">
              <span className="text-base">🧑‍🤝‍🧑</span>
              <span className="text-[15px] text-surface-dark">여자 플래버 2명이 신청했어요</span>
            </div>
            <div className="flex gap-2.5 items-start">
              <span className="text-base">🔥</span>
              <div>
                <p className="text-[15px] text-surface-dark">기본기를 갖춘 실력자들이 모여요</p>
                <p className="text-xs text-[#818798] leading-[15px] mt-1">일반 매치보다 경기 템포가 빠르기 때문에 더 많은 체력과 순발력 등이 요구됩니다.</p>
              </div>
            </div>
          </div>

          {/* WC26 Reward Banner */}
          <div className="mt-5 rounded-2xl bg-surface-dark flex items-center gap-5 px-5 py-3">
            <div className="relative w-[73px] h-[73px] flex-shrink-0">
              <img src="/img/bibs_germany.png" alt="vest" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[#e0ff47]">리워드</span>
              <span className="text-[19px] font-semibold text-white">{m.reward.label}</span>
            </div>
          </div>
        </section>

        {/* 매치 정보 */}
        <section className="bg-white px-5 pb-6">
          <h2 className="text-lg font-bold text-surface-dark py-5">매치 정보</h2>

          {/* WC26 Event Banner */}
          <div className="flex items-center gap-2.5 bg-[#ffcf0a] rounded-r-3xl rounded-l-full pr-4 mb-4">
            <div className="flex items-center">
              <img src="/img/symbol.svg" alt="WC26" className="h-[45px] w-auto" />
            </div>
            <span className="text-sm font-medium text-black">지구촌 축구 대축제</span>
          </div>

          {/* Stats */}
          <div className="flex gap-2.5 mb-5">
            <div className="flex-1 bg-[#f0f3f5] rounded-xl p-3">
              <p className="text-xs font-medium text-surface-dark">평균 나이</p>
              <p className="text-base font-bold text-surface-dark mt-2">{m.avgAge}</p>
            </div>
            <div className="flex-1 bg-[#f0f3f5] rounded-xl p-3">
              <p className="text-xs font-medium text-surface-dark">평균 레벨</p>
              <p className="text-base font-bold text-surface-dark mt-2">{m.avgLevel}</p>
            </div>
          </div>

          {/* Participants */}
          <div className="flex flex-col gap-5">
            {chunkArray(m.participants, 2).map((row, ri) => (
              <div key={ri} className="flex gap-3">
                {row.map((p) => {
                  const c = COUNTRIES_MAP[p.country];
                  return (
                    <div key={p.name} className="flex flex-1 gap-2 items-start min-w-0">
                      <div className="relative flex-shrink-0">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        {c && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5">
                            <TwemojiFlag emoji={c.flag} size={14} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-sm font-bold text-surface-dark">{p.name}</span>
                        <div className="flex gap-1 text-[10px] text-on-surface-variant">
                          <span>{p.level}</span>
                          <span className="font-semibold">{p.style}</span>
                          <span className="font-semibold">{p.pom}POM</span>
                        </div>
                        {p.relation && (
                          <span className="text-[10px] text-accent-blue font-medium">{p.relation}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Attend Button */}
          <div className="mt-5 flex flex-col gap-2 items-center">
            <button
              onClick={() => setAttending(!attending)}
              className={`w-full rounded-lg h-9 text-sm font-medium text-white ${attending ? "bg-accent-blue" : "bg-accent-blue"}`}
            >
              {attending ? "참가 예정이에요 ✓" : "참가 예정으로 등록"}
            </button>
            <span className="text-sm text-surface-dark">참가 예정으로 등록하면</span>
          </div>
        </section>

        {/* 경기장 정보 */}
        <section className="bg-white px-5 pb-6">
          <h2 className="text-lg font-bold text-surface-dark py-5">경기장 정보</h2>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex gap-2.5 items-center w-[150px]">
                <span className="text-base">📐</span>
                <span className="text-base text-surface-dark">40x20m</span>
              </div>
              <div className="flex gap-2.5 items-center w-[150px]">
                <span className="text-base">🚿</span>
                <span className="text-base text-surface-dark">샤워실</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex gap-2.5 items-center w-[150px]">
                <span className="text-base">🚗</span>
                <span className="text-[15px] text-on-surface-variant underline">유료 주차</span>
              </div>
              <div className="flex gap-2.5 items-center w-[150px]">
                <span className="text-base">👟</span>
                <span className="text-[15px] text-[#b9becb] line-through">풋살화 대여</span>
              </div>
            </div>
            <div className="flex gap-2.5 items-center">
              <span className="text-base">👕</span>
              <span className="text-[15px] text-[#b9becb] line-through">운동복 대여</span>
            </div>
          </div>
        </section>

        {/* 매치 진행 방식 */}
        <section className="bg-white px-5 pb-6">
          <h2 className="text-lg font-bold text-surface-dark py-5">매치 진행 방식</h2>
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-[15px] font-bold text-surface-dark mb-1.5">매치 규칙</p>
              <ul className="list-disc ml-5 flex flex-col gap-1 text-sm text-surface-dark">
                <li>모든 파울은 사이드 라인에서 킥인</li>
                <li>골키퍼에게 백패스 가능. 손으로는 잡으면 안돼요</li>
                <li>사람을 향한 슬라이딩 태클 금지</li>
              </ul>
            </div>
            <div>
              <p className="text-[15px] font-bold text-surface-dark mb-1.5">알아두면 좋아요</p>
              <ul className="list-disc ml-5 flex flex-col gap-1 text-sm text-surface-dark">
                <li>서로 존중하고 격려하며 함께 즐겨요</li>
                <li>플랩 평균 레벨은 아마추어2예요</li>
                <li>플랩에서는 하루 평균 180경기가 진행돼요</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-4 flex items-center gap-3 max-w-[480px] mx-auto border-t border-gray-100 z-50">
        <div className="flex-1">
          <p className="text-sm text-surface-dark leading-snug">지금 신청하면</p>
          <p className="text-sm text-surface-dark leading-snug">진행 확정이 빨라져요!</p>
        </div>
        <button className="bg-accent-blue rounded-xl px-8 py-3 text-base text-white font-medium">
          신청하기
        </button>
      </div>
    </div>
  );
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
