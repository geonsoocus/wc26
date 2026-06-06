// 플랩 네이션스26 (WC26) API 클라이언트.
//
// 인증: 쿼리 파라미터 ?user_code=<서명코드> (PlabWeek dev signing 패턴).
// 쿠키/커스텀 헤더 불필요 → fetch credentials 미설정(omit).
// user_code 는 localStorage("wc26_user_code") 에 저장하며, 없으면 URL ?user_code= 에서 읽어 저장한다.

export const WC26_BASE = "http://localhost:8000/api/v2/worldcup";

const STORAGE_KEY = "wc26_user_code";

export function getUserCode(): string | null {
  if (typeof window === "undefined") return null;
  // NOTE: 우선순위 = localStorage → URL ?user_code=. URL 진입 시 자동 저장.
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  const fromUrl = new URLSearchParams(window.location.search).get("user_code");
  if (fromUrl) {
    window.localStorage.setItem(STORAGE_KEY, fromUrl);
    return fromUrl;
  }
  return null;
}

export function setUserCode(code: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, code);
}

export function clearUserCode(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function hasUserCode(): boolean {
  return getUserCode() !== null;
}

export class WC26ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    super(`WC26 API ${status}: ${typeof body === "string" ? body : JSON.stringify(body)}`);
    this.name = "WC26ApiError";
    this.status = status;
    this.body = body;
  }
}

function buildUrl(path: string): string {
  const code = getUserCode();
  const sep = path.includes("?") ? "&" : "?";
  // NOTE: 모든 요청에 user_code 부착. 없으면 빈 값(백엔드가 401 로 응답).
  return `${WC26_BASE}${path}${sep}user_code=${encodeURIComponent(code ?? "")}`;
}

async function parse(res: Response): Promise<unknown> {
  // NOTE: 204(No Content) 등 본문 없는 응답은 null 반환.
  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request(method: string, path: string, body?: unknown): Promise<unknown> {
  const init: RequestInit = { method, credentials: "omit" };
  if (body !== undefined) {
    init.headers = { "Content-Type": "application/json" };
    init.body = JSON.stringify(body);
  }
  const res = await fetch(buildUrl(path), init);
  const data = await parse(res);
  if (!res.ok) {
    throw new WC26ApiError(res.status, data);
  }
  return data;
}

export function get<T = unknown>(path: string): Promise<T> {
  return request("GET", path) as Promise<T>;
}

export function post<T = unknown>(path: string, body?: unknown): Promise<T> {
  return request("POST", path, body ?? {}) as Promise<T>;
}

export function del<T = unknown>(path: string): Promise<T> {
  return request("DELETE", path) as Promise<T>;
}

// NOTE: multipart(프로필 이미지 업로드) 전용. Content-Type 은 브라우저가 boundary 와 함께 자동 설정.
export async function postForm<T = unknown>(path: string, form: FormData): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: "POST",
    credentials: "omit",
    body: form,
  });
  const data = await parse(res);
  if (!res.ok) {
    throw new WC26ApiError(res.status, data);
  }
  return data as T;
}
