// 라이브 데이터 훅 — 로그인(plab_access 쿠키) 상태이면 백엔드(플랩 네이션스26)에서 실데이터를 가져와
// 기존 SCENARIO_DATA mock 과 동일 shape 의 `data` 객체로 매핑한다.
//
// 매핑 원칙:
//  - 서버 필드명이 FE 와 다르면 여기서 변환(예: bibs[].country_code → ownedVests code).
//  - 서버에 없는 필드(레벨/칭찬/POM/주간 출석배열 등)는 안전 기본값.
//  - 라이브 전용 추가 필드(storeGoods, tokenHistories 등)는 mock 타입의 슈퍼셋으로 노출.

"use client";

import { useCallback, useEffect, useState } from "react";
import * as api from "@/lib/wc26api";

// ─── 서버 응답 타입(serializer 기준, 필요한 필드만) ───
interface MeResponse {
  token_balance: number;
  ticket_balance: number;
  has_profile: boolean;
  welcome_granted: boolean;
  profile_card_image: string | null; // 본 플랩 Profile.profile_card_image full URL (없으면 null)
}

interface MeStatsResponse {
  match: number;
  sent_praise: number;
  received_praise: number;
  pom: number;
}

interface BibItem {
  id: number;
  country_code: string;
  country_name: string;
  group: string;
  image_url: string;
  fifa_rank: number | null;
  owned: boolean;
  owned_count: number;
  draw_probability: number;
}
interface BibsResponse {
  total_count: number;
  owned_count: number;
  completion: { is_completed: boolean };
  bibs: BibItem[];
}

interface PackItem {
  id: number;
  pack_type: "NATIONS_RANDOM" | "NATIONS_CONFIRMED" | "REWARD_WELCOME" | "REWARD_NORMAL";
  status: "UNOPENED" | "OPENED";
}
interface PacksResponse {
  unopened_count: number;
  packs: PackItem[];
}

interface TokenHistory {
  id: number;
  delta: number;
  reason: string;
  balance_after: number;
  created_at: string;
  source_goods_name: string | null;
}
interface TokensResponse {
  balance: number;
  histories: TokenHistory[];
}

interface GoodsItem {
  id: number;
  goods_type: string;
  name: string;
  token_price: number;
  stock: number | null;
  is_active: boolean;
  available_from: string | null;
  available_until: string | null;
}

interface PredictionSlot {
  slot_no: number;
  bib_id: number;
  country_code: string;
  country_name: string;
  image_url: string;
}
interface PredictionBibCount {
  country_code: string;
  country_name: string;
  count: number;
}
interface PredictionResponse {
  is_registration_open: boolean;
  remaining_slots: number;
  my_slots: PredictionSlot[];
  is_winner_announced: boolean;
  my_bibs_by_country: PredictionBibCount[];
}

interface MissionResponse {
  match_count: number;
  milestone_1_rewarded: boolean;
  milestone_2_rewarded: boolean;
  milestone_3_rewarded: boolean;
  display_step: number;
  next_reward_preview: Record<string, number>;
}

interface AttendanceResponse {
  checked_today: boolean;
  total_days: number;
  today: string;
  checked_dates: string[]; // ISO "YYYY-MM-DD" (KST), 실제 출석 일자
}

interface ProfileListItem {
  id: number;
  country_code: string;
  country_name: string;
  bib_image_url: string;
  generated_image_url: string; // full URL or ""
  status: string;
  is_applied: boolean;
  created_at: string;
}

interface FriendItem {
  target_id: number;
  name: string | null;
  user_cd: string | null;
  image: string | null;
  ai_profile_image: string | null;
  profile_card_image: string | null; // 본 플랩 Profile.profile_card_image full URL (메인 카드와 동일)
  has_profile: boolean;
  manner_point: string | null; // Decimal → "4.500"
  bib_count: number;
  is_invited: boolean;
  invite_reward_granted: boolean;
  district: string | null;
}

// ─── mock 과 동일 shape + 라이브 전용 슈퍼셋 ───
export interface LivePack {
  id: number;
  type: "nations" | "reward";
  label: string;
  image: string;
  guaranteedCountry?: string;
  // NOTE: 라이브 전용 — 원본 pack_type(액션 분기용).
  packType?: string;
  status?: string;
  // mock 호환: PackOpenScreen 은 mockReward 를 참조하지만 라이브에서는 실오픈 결과로 대체.
  mockReward?: { kind: "nations"; country: string } | { kind: "reward"; item: string };
}

export interface LiveData {
  ownedVests: string[];
  packs: LivePack[];
  stats: { match: number; level: number; sentPraise: number; receivedPraise: number; pom: number };
  profiles: { id: number; country: string; countryName: string; imageUrl: string; isActive: boolean; status: string }[];
  profileQuota: { used: number; total: number };
  predictions: { slot: number; country: string | null; unlocked: boolean }[];
  friends: {
    name: string;
    country: string;
    imageUrl: string | null;
    hasProfile?: boolean;
    stats?: { match: number; level: number; praise: number; pom: number; manner?: number };
  }[];
  hasProfile: boolean;
  matchMission: { completed: number; total: number; milestone1Rewarded: boolean; milestone2Rewarded: boolean; milestone3Rewarded: boolean };
  inviter: { name: string; country: string; imageUrl: string | null } | null;
  tokens: number;
  attendance: { total: number; checkedToday: boolean; weekDays: boolean[]; checkedDates: string[] };
  // ─── 라이브 전용 추가 필드 ───
  ticketBalance: number;
  welcomeGranted: boolean;
  // NOTE: 메인 플레이어 카드 이미지 = 본 플랩 Profile.profile_card_image (full URL). 없으면 null.
  profileCardImage: string | null;
  bibsTotal: number;
  bibsOwnedCount: number;
  bibsCompleted: boolean;
  unopenedPackCount: number;
  tokenHistories: TokenHistory[];
  storeGoods: GoodsItem[];
  // NOTE: country_code → bib_id (보유 조끼). 예측 슬롯 등록(POST /prediction/slots/ {bib_id}) 에 사용.
  bibIdByCountry: Record<string, number>;
  // NOTE: country_code → 티어별 획득 확률·FIFA 랭킹·보유 수. 컬렉션 상세 모달에서 사용.
  bibInfoByCountry: Record<string, { fifaRank: number | null; drawProbability: number; ownedCount: number }>;
  prediction: {
    isRegistrationOpen: boolean;
    remainingSlots: number;
    isWinnerAnnounced: boolean;
    byCountry: PredictionBibCount[];
  };
}

const PROFILE_QUOTA_TOTAL = 5; // NOTE: 표시용 상한(서버는 잔여 balance 만 제공).
const PREDICTION_MAX_SLOTS = 3;

function mapPredictions(slots: PredictionSlot[]): LiveData["predictions"] {
  const out: LiveData["predictions"] = [];
  for (let i = 0; i < PREDICTION_MAX_SLOTS; i++) {
    const slot = slots.find((s) => s.slot_no === i + 1);
    out.push({ slot: i + 1, country: slot ? slot.country_code : null, unlocked: true });
  }
  return out;
}

// NOTE: 서버 checked_dates(ISO, KST) + today 로 이번 주(월~일) 체크 상태를 정확히 계산.
//       클라이언트 로컬 시간/근사치를 쓰지 않고 서버 today 를 주 기준으로 삼아 drift 제거.
function buildWeekDays(checkedDates: string[], today: string): boolean[] {
  const set = new Set(checkedDates);
  const base = new Date(today + "T00:00:00"); // 서버 today(KST 일자)를 로컬 자정으로
  const jsDay = base.getDay(); // 0=일
  const monOffset = jsDay === 0 ? 6 : jsDay - 1; // 월요일까지 거슬러
  const monday = new Date(base);
  monday.setDate(base.getDate() - monOffset);
  const week: boolean[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    week.push(set.has(iso));
  }
  return week;
}

function isNationsPackType(t: string): boolean {
  return t === "NATIONS_RANDOM" || t === "NATIONS_CONFIRMED";
}

function mapPacks(packs: PackItem[]): LivePack[] {
  // NOTE: 미오픈 팩만 표시(오픈된 팩은 보유 목록에서 제외 — mock 의 "나의 팩" 의도와 일치).
  return packs
    .filter((p) => p.status === "UNOPENED")
    .map((p) => {
      const nations = isNationsPackType(p.pack_type);
      const isWelcome = p.pack_type === "REWARD_WELCOME";
      return {
        id: p.id,
        type: nations ? ("nations" as const) : ("reward" as const),
        label: nations
          ? p.pack_type === "NATIONS_CONFIRMED"
            ? "확정 네이션스팩"
            : "네이션스팩"
          : isWelcome
            ? "웰컴 리워드팩"
            : "리워드팩",
        image: nations ? "/img/daily_pack.svg" : "/img/match_pack.svg",
        packType: p.pack_type,
        status: p.status,
      };
    });
}

function mapProfiles(items: ProfileListItem[]): LiveData["profiles"] {
  // NOTE: GET /profiles/ 목록. applied 먼저·최신순 정렬은 서버가 보장하므로 순서 그대로 유지.
  return items.map((p) => ({
    id: p.id,
    country: p.country_code,
    countryName: p.country_name,
    imageUrl: p.generated_image_url || p.bib_image_url || "",
    isActive: p.is_applied,
    status: p.status,
  }));
}

function mapFriends(friends: FriendItem[]): LiveData["friends"] {
  // NOTE: 서버 친구 탭은 매너점수/도감수/대표이미지 중심. 레벨/칭찬/POM 은 미제공 → 0.
  //       country 는 친구 데이터에 없으므로 표시 안정성을 위해 KOR 기본값(컬렉션과 무관).
  return friends.map((f) => ({
    name: f.name ?? "플래버",
    country: "KOR",
    imageUrl: f.profile_card_image ?? f.ai_profile_image ?? f.image ?? null,
    hasProfile: f.has_profile,
    stats: {
      match: 0,
      level: 0,
      praise: 0,
      pom: 0,
      manner: f.manner_point != null ? parseFloat(f.manner_point) : 0,
    },
  }));
}

export interface UseLiveDataResult {
  data: LiveData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useLiveData(enabled: boolean): UseLiveDataResult {
  const [data, setData] = useState<LiveData | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const [me, bibs, packs, tokens, goods, prediction, mission, attendance, profileList, friends, meStats] =
        await Promise.all([
          api.get<MeResponse>("/me/"),
          api.get<BibsResponse>("/bibs/"),
          api.get<PacksResponse>("/packs/"),
          api.get<TokensResponse>("/tokens/"),
          api.get<GoodsItem[]>("/store/goods/"),
          api.get<PredictionResponse>("/prediction/"),
          api.get<MissionResponse>("/mission/"),
          api.get<AttendanceResponse>("/attendance/"),
          // NOTE: GET /profiles/ — 빈 배열 가능(미보유). 404 아님.
          api.get<ProfileListItem[]>("/profiles/").catch(() => [] as ProfileListItem[]),
          api.get<FriendItem[]>("/friends/").catch(() => [] as FriendItem[]),
          // NOTE: 내 카드 스탯(이벤트 기간 매치/칭찬/POM). 실패 시 0.
          api
            .get<MeStatsResponse>("/me/stats/")
            .catch(() => ({ match: 0, sent_praise: 0, received_praise: 0, pom: 0 } as MeStatsResponse)),
        ]);

      const ownedVests = bibs.bibs.filter((b) => b.owned).map((b) => b.country_code);
      const bibIdByCountry: Record<string, number> = {};
      const bibInfoByCountry: Record<string, { fifaRank: number | null; drawProbability: number; ownedCount: number }> = {};
      for (const b of bibs.bibs) {
        bibIdByCountry[b.country_code] = b.id;
        bibInfoByCountry[b.country_code] = {
          fifaRank: b.fifa_rank,
          drawProbability: b.draw_probability,
          ownedCount: b.owned_count,
        };
      }

      const mapped: LiveData = {
        ownedVests,
        packs: mapPacks(packs.packs),
        stats: { match: meStats.match, level: 1, sentPraise: meStats.sent_praise, receivedPraise: meStats.received_praise, pom: meStats.pom },
        profiles: mapProfiles(profileList),
        profileQuota: {
          used: Math.max(0, PROFILE_QUOTA_TOTAL - me.ticket_balance),
          total: PROFILE_QUOTA_TOTAL,
        },
        predictions: mapPredictions(prediction.my_slots),
        friends: mapFriends(friends),
        hasProfile: me.has_profile,
        matchMission: {
          completed: mission.display_step,
          total: 3,
          milestone1Rewarded: mission.milestone_1_rewarded,
          milestone2Rewarded: mission.milestone_2_rewarded,
          milestone3Rewarded: mission.milestone_3_rewarded,
        },
        inviter: null,
        tokens: me.token_balance,
        attendance: {
          total: attendance.total_days,
          checkedToday: attendance.checked_today,
          weekDays: buildWeekDays(attendance.checked_dates, attendance.today),
          checkedDates: attendance.checked_dates,
        },
        ticketBalance: me.ticket_balance,
        welcomeGranted: me.welcome_granted,
        profileCardImage: me.profile_card_image,
        bibsTotal: bibs.total_count,
        bibsOwnedCount: bibs.owned_count,
        bibsCompleted: bibs.completion.is_completed,
        unopenedPackCount: packs.unopened_count,
        tokenHistories: tokens.histories,
        storeGoods: goods,
        bibIdByCountry,
        bibInfoByCountry,
        prediction: {
          isRegistrationOpen: prediction.is_registration_open,
          remainingSlots: prediction.remaining_slots,
          isWinnerAnnounced: prediction.is_winner_announced,
          byCountry: prediction.my_bibs_by_country,
        },
      };
      setData(mapped);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
