"use client";

import { useState } from "react";
import { COUNTRIES } from "@/data/countries";
import { TwemojiFlag } from "@/components/TwemojiFlag";

const POPULAR_COUNTRIES = ["KOR", "BRA", "FRA", "ARG", "ENG", "ESP", "GER", "JPN", "POR", "NED"];
const MY_PROFILES = [
  { country: "KOR", imageUrl: "/img/profile.png" },
];
const FRIEND_PROFILES = [
  { name: "김플랩", country: "BRA", imageUrl: null },
  { name: "박소셜", country: "FRA", imageUrl: null },
];

type Step = "select" | "upload" | "generating" | "result";

export default function ProfilePage() {
  const [step, setStep] = useState<Step>("select");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCountryData = COUNTRIES.find(
    (c) => c.code === selectedCountry
  );

  const filteredCountries = searchQuery
    ? COUNTRIES.filter(
        (c) =>
          c.nameKo.includes(searchQuery) ||
          c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : COUNTRIES.filter((c) => POPULAR_COUNTRIES.includes(c.code));

  const availableSlots = 1 + FRIEND_PROFILES.length;
  const usedSlots = MY_PROFILES.length;

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface-dark px-6 pt-14 pb-10 text-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-blue blur-[100px]" />
        </div>
        <div className="relative z-10">
          <p className="mb-1 text-xs font-semibold tracking-widest uppercase text-accent-green">
            Create your card
          </p>
          <h1 className="text-3xl font-extrabold text-white">월드컵 프로필</h1>
          <p className="mx-auto mt-2 max-w-xs text-sm text-gray-400">
            나만의 축구선수 프로필 카드를 만들어보세요
          </p>

          <div className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-green">
                {MY_PROFILES.length}
              </div>
              <div className="text-xs text-gray-500">내 프로필</div>
            </div>
            <div className="h-8 w-px bg-surface-gray" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {availableSlots - usedSlots}
              </div>
              <div className="text-xs text-gray-500">남은 기회</div>
            </div>
            <div className="h-8 w-px bg-surface-gray" />
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-blue">
                {FRIEND_PROFILES.length}
              </div>
              <div className="text-xs text-gray-500">친구 초대</div>
            </div>
          </div>
        </div>
      </section>

      {/* My Profiles */}
      <section className="bg-white px-5 py-8">
        <h2 className="mb-3 text-lg font-extrabold text-surface-dark">내 프로필</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {MY_PROFILES.map((profile) => {
            const country = COUNTRIES.find((c) => c.code === profile.country)!;
            return (
              <ProfileCard
                key={profile.country}
                country={country}
                name="나"
                imageUrl={profile.imageUrl}
                isActive
              />
            );
          })}

          {usedSlots < availableSlots && (
            <button
              onClick={() => setStep("select")}
              className="flex h-52 w-36 flex-shrink-0 flex-col items-center justify-center gap-2 rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] border-2 border-dashed border-gray-200 text-on-surface-variant transition-all hover:border-accent-green hover:text-accent-green"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-current text-lg">
                +
              </div>
              <span className="text-xs font-medium">새 프로필 만들기</span>
            </button>
          )}
        </div>
      </section>

      {/* Create Profile Flow */}
      {step === "select" && (
        <section className="bg-surface-hover px-5 py-8">
          <h2 className="text-lg font-extrabold text-surface-dark">국가 선택</h2>
          <p className="mt-1 text-xs text-on-surface-variant">
            어느 나라 선수가 되어볼까요?
          </p>

          <div className="relative mt-4">
            <input
              type="text"
              placeholder="국가 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-10 text-sm text-surface-dark placeholder:text-on-surface-variant focus:border-accent-blue focus:outline-none"
            />
            <svg
              className="absolute top-1/2 left-3 -translate-y-1/2 text-on-surface-variant"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>

          {!searchQuery && (
            <p className="mt-3 mb-2 text-xs text-on-surface-variant">인기 국가</p>
          )}

          <div className="mt-2 grid grid-cols-2 gap-2">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => {
                  setSelectedCountry(country.code);
                  setStep("upload");
                }}
                className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 text-left transition-all ${
                  selectedCountry === country.code
                    ? "border-accent-green bg-accent-green/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <TwemojiFlag emoji={country.flag} size={24} />
                <div>
                  <div className="text-sm font-medium text-surface-dark">{country.nameKo}</div>
                  <div className="text-[10px] text-on-surface-variant">
                    Group {country.group}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === "upload" && selectedCountryData && (
        <section className="bg-white px-5 py-8">
          <div className="text-center">
            <TwemojiFlag emoji={selectedCountryData.flag} size={48} />
            <h2 className="mt-2 text-lg font-extrabold text-surface-dark">
              {selectedCountryData.nameKo} 선수 프로필
            </h2>
            <p className="mt-1 text-xs text-on-surface-variant">
              사진을 업로드하면 AI가 선수 스타일로 변환해드려요
            </p>

            <div className="mx-auto mt-6 flex h-48 w-48 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-surface-hover">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#676d7e" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className="text-xs text-on-surface-variant">사진을 업로드해주세요</span>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep("select")}
                className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-on-surface-variant"
              >
                뒤로
              </button>
              <button
                onClick={() => setStep("generating")}
                className="flex-1 rounded-xl bg-accent-green py-3 text-sm font-bold text-surface-dark"
              >
                생성하기
              </button>
            </div>
          </div>
        </section>
      )}

      {step === "generating" && selectedCountryData && (
        <section className="bg-white px-5 py-8">
          <div className="text-center py-8">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-accent-green" />
            <h2 className="mt-6 text-lg font-extrabold text-surface-dark">프로필 생성 중...</h2>
            <p className="mt-2 text-xs text-on-surface-variant">
              AI가 {selectedCountryData.nameKo} 국가대표 스타일로
              <br />
              프로필을 만들고 있어요
            </p>
            <button
              onClick={() => setStep("result")}
              className="mt-6 text-xs text-accent-blue underline"
            >
              (데모: 결과 보기)
            </button>
          </div>
        </section>
      )}

      {step === "result" && selectedCountryData && (
        <section className="bg-white px-5 py-8">
          <div className="text-center">
            <p className="text-xs font-semibold text-accent-green">완성!</p>
            <ProfileCard
              country={selectedCountryData}
              name="나"
              imageUrl="/img/profile.png"
              isActive
              size="lg"
            />

            <div className="mt-6 space-y-3">
              <button className="w-full rounded-xl bg-accent-green py-3 text-sm font-bold text-surface-dark">
                프로필로 설정하기
              </button>
              <button className="w-full rounded-xl border border-gray-200 py-3 text-sm font-medium text-surface-dark">
                친구에게 공유하기
              </button>
              <button
                onClick={() => {
                  setStep("select");
                  setSelectedCountry(null);
                }}
                className="w-full py-2 text-xs text-on-surface-variant"
              >
                다른 국가 프로필 만들기
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Friend Share */}
      <section className="bg-surface-hover px-5 py-8">
        <h2 className="text-lg font-extrabold text-surface-dark">친구 초대</h2>
        <p className="mt-1 text-xs text-on-surface-variant">
          친구를 초대하면 다른 국가 프로필을 만들 수 있는 기회가 생겨요
        </p>

        <button className="mt-4 w-full rounded-xl bg-accent-blue py-3 text-sm font-bold text-white">
          초대 링크 공유하기
        </button>

        {FRIEND_PROFILES.length > 0 && (
          <>
            <p className="mt-5 mb-3 text-xs text-on-surface-variant">
              초대한 친구 ({FRIEND_PROFILES.length}명)
            </p>
            <div className="space-y-2">
              {FRIEND_PROFILES.map((friend) => {
                const country = COUNTRIES.find(
                  (c) => c.code === friend.country
                )!;
                return (
                  <div
                    key={friend.name}
                    className="flex items-center gap-3 rounded-xl bg-white px-4 py-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-hover text-sm font-medium">
                      {friend.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-surface-dark">{friend.name}</div>
                      <div className="flex items-center gap-1 text-[10px] text-on-surface-variant">
                        <TwemojiFlag emoji={country.flag} size={14} /> {country.nameKo} 프로필 생성 완료
                      </div>
                    </div>
                    <div className="text-xs font-bold text-accent-green">+1 기회</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* Friends Gallery */}
      <section className="bg-white px-5 py-8 pb-12">
        <h2 className="mb-3 text-lg font-extrabold text-surface-dark">친구들의 프로필</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {FRIEND_PROFILES.map((friend) => {
            const country = COUNTRIES.find((c) => c.code === friend.country)!;
            return (
              <ProfileCard
                key={friend.name}
                country={country}
                name={friend.name}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ProfileCard({
  country,
  name,
  imageUrl,
  isActive = false,
  size = "sm",
}: {
  country: (typeof COUNTRIES)[0];
  name: string;
  imageUrl?: string | null;
  isActive?: boolean;
  size?: "sm" | "lg";
}) {
  const isLg = size === "lg";

  return (
    <div
      className={`relative flex-shrink-0 overflow-hidden rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px] border transition-all ${
        isLg ? "mx-auto mt-4 w-56" : "w-36"
      } ${
        isActive
          ? "border-accent-green shadow-lg shadow-accent-green/10"
          : "border-gray-200"
      }`}
    >
      <div
        className={`relative ${isLg ? "h-64" : "h-44"}`}
        style={{
          background: `linear-gradient(160deg, ${country.primary}dd, ${country.secondary}dd)`,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 text-6xl font-black text-white">
            {country.code}
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            <div
              className={`rounded-full bg-black/20 ${
                isLg ? "h-24 w-24" : "h-16 w-16"
              } flex items-center justify-center`}
            >
              <svg
                width={isLg ? 40 : 28}
                height={isLg ? 40 : 28}
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                opacity={0.5}
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}
        </div>

        <div className="absolute top-3 left-3">
          <TwemojiFlag emoji={country.flag} size={24} />
        </div>

        {isActive && (
          <div className="absolute top-3 right-3 rounded-full bg-accent-green px-2 py-0.5 text-[9px] font-bold text-surface-dark">
            ACTIVE
          </div>
        )}
      </div>

      <div className="bg-white px-3 py-2.5">
        <div className={`font-bold text-surface-dark ${isLg ? "text-base" : "text-xs"}`}>
          {name}
        </div>
        <div className={`text-on-surface-variant ${isLg ? "text-xs" : "text-[10px]"}`}>
          {country.nameKo} #{country.code}
        </div>
      </div>
    </div>
  );
}
