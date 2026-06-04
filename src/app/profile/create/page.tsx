"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COUNTRIES } from "@/data/countries";
import { TwemojiFlag } from "@/components/TwemojiFlag";

type Step = "intro" | "selectCountry" | "uploadPhoto" | "generating" | "done";

const GEN_CAPTIONS = [
  "유니폼을 입히는 중...",
  "국가대표 스타일로 변환 중...",
  "경기장 입장 준비 중...",
  "월드컵 세계관에 입장 중...",
];

const GROUPS = [...new Set(COUNTRIES.map(c => c.group))];

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

export default function ProfileCreatePage() {
  return (
    <Suspense>
      <ProfileCreateInner />
    </Suspense>
  );
}

function ProfileCreateInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode"); // "first" = random country, skip select
  const ownedParam = searchParams.get("owned"); // comma-separated country codes
  const ownedVests = ownedParam ? ownedParam.split(",") : [];
  const isFirstCreate = mode === "first";

  const [step, setStep] = useState<Step>(() => {
    if (isFirstCreate) return "uploadPhoto";
    return "selectCountry";
  });
  const [genCountry, setGenCountry] = useState<string | null>(() => {
    if (isFirstCreate) {
      const rand = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      return rand.code;
    }
    return null;
  });
  const [captionIdx, setCaptionIdx] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const genCountryData = genCountry ? COUNTRIES.find(c => c.code === genCountry) : null;

  const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null);

  const handleSaveCard = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const el = cardRef.current;
      const rect = el.getBoundingClientRect();
      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        width: rect.width,
        height: rect.height,
      });
      const dataUrl = canvas.toDataURL("image/png");
      setSavedImageUrl(dataUrl);
    } catch (e) {
      console.error("Save failed:", e);
    }
  }, []);

  useEffect(() => {
    if (step === "generating") {
      setCaptionIdx(0);
      const captionTimer = setInterval(() => setCaptionIdx(i => (i + 1) % GEN_CAPTIONS.length), 1500);
      const doneTimer = setTimeout(() => setStep("done"), 5000);
      return () => { clearInterval(captionTimer); clearTimeout(doneTimer); };
    }
  }, [step]);

  const goBack = () => {
    if (step === "selectCountry") router.back();
    else if (step === "uploadPhoto") {
      if (isFirstCreate) router.back();
      else setStep("selectCountry");
    }
  };

  return (
    <div className="max-w-[480px] mx-auto bg-white min-h-screen flex flex-col">
      {/* Header */}
      {step !== "generating" && step !== "done" && (
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0 sticky top-0 bg-white z-10">
          <button onClick={goBack} className="text-[#22252a]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <span className="text-base font-bold text-[#22252a]">
            {step === "selectCountry" ? "국가 선택" : "사진 촬영"}
          </span>
          <div className="w-6" />
        </div>
      )}

      {/* Step: Intro */}
      {/* Step: Select Country (additional creation — owned vests only) */}
      {step === "selectCountry" && (
        <div className="flex-1 px-5 pb-10">
          <p className="text-sm text-[#676d7e]">획득한 조끼의 국가로 프로필을 만들 수 있어요</p>

          {ownedVests.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20">
              <p className="text-base font-bold text-[#22252a]">보유한 조끼가 없어요</p>
              <p className="mt-1 text-sm text-[#676d7e]">팩을 열어서 조끼를 먼저 획득해보세요</p>
            </div>
          ) : (
          <div className="mt-5 flex flex-col gap-6">
            {GROUPS.map(group => {
              const groupCountries = COUNTRIES.filter(c => c.group === group && ownedVests.includes(c.code));
              if (groupCountries.length === 0) return null;
              return (
                <div key={group}>
                  <p className="text-xs font-bold text-[#676d7e] mb-2">GROUP {group}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {groupCountries.map(country => (
                      <button
                        key={country.code}
                        onClick={() => { setGenCountry(country.code); setStep("uploadPhoto"); }}
                        className="flex flex-col items-center gap-1.5 rounded-2xl py-3 px-1 bg-gray-50 active:scale-95 transition-transform"
                      >
                        <TwemojiFlag emoji={country.flag} size={30} />
                        <span className="text-[11px] font-medium text-[#22252a] text-center leading-tight">{country.nameKo}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      )}

      {/* Step: Upload Photo */}
      {step === "uploadPhoto" && genCountryData && (
        <div className="flex-1 flex flex-col items-center justify-center px-5">
          <div className="relative w-56 h-56 rounded-full overflow-hidden" style={{ background: genCountryData.primary }}>
            {/* Face outline guide */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="160" height="200" viewBox="0 0 160 200" fill="none">
                <ellipse cx="80" cy="85" rx="50" ry="62" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeDasharray="8 4" />
                <circle cx="62" cy="75" r="4" fill="rgba(255,255,255,0.25)" />
                <circle cx="98" cy="75" r="4" fill="rgba(255,255,255,0.25)" />
                <path d="M70 95 Q80 105 90 95" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <p className="mt-5 text-sm text-[#676d7e]">정면 얼굴 사진을 촬영해주세요</p>

          <button
            onClick={() => setStep("generating")}
            className="mt-8 w-full max-w-[280px] flex items-center justify-center gap-2 rounded-xl bg-[#22252a] py-4 text-sm font-bold text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
            </svg>
            사진 촬영하기
          </button>
          <button onClick={() => setStep("generating")} className="mt-3 text-sm text-[#676d7e] underline">
            앨범에서 선택
          </button>
        </div>
      )}

      {/* Step: Generating */}
      {step === "generating" && genCountryData && (
        <div className="flex-1 flex flex-col items-center justify-center px-5 overflow-hidden">
          <div className="relative w-48 h-48">
            <div className="absolute inset-0 rounded-full animate-spin" style={{ animationDuration: "3s", background: `conic-gradient(from 0deg, ${genCountryData.primary}, ${genCountryData.secondary}, #e0ff47, #1570ff, ${genCountryData.primary})`, opacity: 0.3 }} />
            <div className="absolute inset-3 rounded-full animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse", background: `conic-gradient(from 180deg, ${genCountryData.secondary}, ${genCountryData.primary}, #96ff62, ${genCountryData.secondary})`, opacity: 0.5 }} />
            <div className="absolute inset-8 rounded-full bg-white flex items-center justify-center">
              <TwemojiFlag emoji={genCountryData.flag} size={48} />
            </div>
          </div>

          <p className="mt-8 text-lg font-bold text-[#22252a]">{genCountryData.nameKo} 프로필 생성 중</p>
          <p className="mt-2 text-sm text-[#676d7e] transition-opacity duration-300">{GEN_CAPTIONS[captionIdx]}</p>

          <div className="mt-6 w-48 h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full bg-[#1570ff]" style={{ animation: "genProgress 5s linear forwards" }} />
          </div>
        </div>
      )}

      {/* Step: Done */}
      {step === "done" && genCountryData && (() => {
        const light = isLightColor(genCountryData.primary);
        const txt = light ? "text-[#22252a]" : "text-white";
        const txtSub = light ? "text-[#22252a]/60" : "text-white/60";
        const btnBg = light ? "bg-[#22252a] text-white" : "bg-white text-[#22252a]";
        const btnOutline = light ? "bg-[#22252a]/10 text-[#22252a]" : "bg-white/20 text-white";
        return (
        <div className="flex-1 flex flex-col items-center px-5 pt-12 pb-10" style={{ background: genCountryData.primary }}>
          <p className={`text-xs font-semibold ${txtSub} uppercase tracking-widest`}>Welcome to</p>
          <p className={`mt-1 text-2xl font-bold ${txt}`}>{genCountryData.name}</p>

          <div ref={cardRef} className="mt-6 w-[240px] overflow-hidden rounded-tr-[60px] shadow-xl">
            <div className="relative h-[312px]" style={{ background: genCountryData.primary }}>
              <img src="/img/profile.png" alt="Generated" className="absolute inset-0 w-full h-full object-cover object-top" draggable={false} />
              <div className="absolute top-3 left-3 flex items-center justify-center w-10 h-10 bg-[#22252a]">
                <span className="text-xl leading-none">{genCountryData.flag}</span>
              </div>
            </div>
            <div className="bg-[#1570ff] px-4 py-2.5 flex items-center justify-between text-white text-center">
              {[
                { label: "MATCH", value: 0 },
                { label: "LEVEL", value: 1 },
                { label: "POM", value: 0 },
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center">
                  <span className="text-[8px] font-semibold uppercase opacity-80">{s.label}</span>
                  <span className="text-base font-russo">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Checkbox */}
          <label className="mt-6 flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" defaultChecked className={`w-5 h-5 rounded ${light ? "accent-[#22252a]" : "accent-white"}`} />
            <span className={`text-sm ${txt}`}>프로필 사진 설정</span>
          </label>

          <div className="mt-auto w-full max-w-[320px] flex flex-col gap-3">
            <div className="flex gap-3">
              <button onClick={handleSaveCard} className={`flex-1 flex items-center justify-center gap-2 rounded-xl ${btnBg} py-4 text-sm font-bold`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                저장
              </button>
              <button className={`flex-1 flex items-center justify-center gap-2 rounded-xl ${btnOutline} py-4 text-sm font-bold`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                공유
              </button>
            </div>
            <button
              onClick={() => router.push("/vest")}
              className={`w-full py-2 text-sm ${txtSub}`}
            >
              닫기
            </button>
          </div>

          {/* Saved Image Modal */}
          {savedImageUrl && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={() => setSavedImageUrl(null)}>
              <div className="absolute inset-0 bg-[rgba(0,0,0,0.8)]" />
              <div className="relative flex flex-col items-center gap-4 px-6" onClick={e => e.stopPropagation()}>
                <img src={savedImageUrl} alt="Profile Card" className="w-[280px] rounded-tr-[60px] shadow-2xl" draggable={false} />
                <p className="text-xs text-white/60 text-center">이미지를 길게 눌러 저장하세요</p>
                <button
                  onClick={() => setSavedImageUrl(null)}
                  className="mt-2 rounded-xl bg-white px-8 py-3 text-sm font-bold text-[#22252a]"
                >
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>
        ); })()}
    </div>
  );
}
