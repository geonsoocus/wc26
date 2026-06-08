// 플랩 네이션스26 (WC26) API 클라이언트.
//
// 인증: 로컬에서는 plab_access 쿠키(httponly=false)를 읽어 Authorization 헤더로 전송.
// 로그인 → localhost:8000 에 plab_access 쿠키 발급 → 이 클라이언트가 헤더에 주입.

export const WC26_BASE = "http://localhost:8000/api/worldcup";

function getAccessToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)plab_access=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
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

// NOTE: 로컬/개발에서 백엔드는 운영 CloudFront(d31wz…) 호스트로 미디어 URL 을 조립해 내려준다.
//       3001 FE 는 개발 버킷(plab-football-test)을 fronting 하는 개발 CloudFront 를 바라봐야 하므로,
//       응답 본문의 운영 CDN 호스트를 개발 CDN 호스트로 치환한다. (백엔드는 변경하지 않음)
const PROD_CDN_HOST = "d31wz4d3hgve8q.cloudfront.net";
const DEV_CDN_HOST = "d1eddhjy83u4nr.cloudfront.net";

async function parse(res: Response): Promise<unknown> {
  // NOTE: 204(No Content) 등 본문 없는 응답은 null 반환.
  if (res.status === 204) return null;
  let text = await res.text();
  if (!text) return null;
  // NOTE: 미디어 URL 의 CDN 호스트를 개발용으로 치환(위 상수 주석 참조). 매치 없으면 no-op.
  if (text.includes(PROD_CDN_HOST)) {
    text = text.split(PROD_CDN_HOST).join(DEV_CDN_HOST);
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request(method: string, path: string, body?: unknown): Promise<unknown> {
  const headers: Record<string, string> = {};
  const token = getAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const init: RequestInit = { method, headers, credentials: "include" };
  if (body !== undefined) init.body = JSON.stringify(body);

  const res = await fetch(`${WC26_BASE}${path}`, init);
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

export function put<T = unknown>(path: string, body?: unknown): Promise<T> {
  return request("PUT", path, body ?? {}) as Promise<T>;
}

export function del<T = unknown>(path: string): Promise<T> {
  return request("DELETE", path) as Promise<T>;
}

// NOTE: multipart(프로필 이미지 업로드) 전용. Content-Type 은 브라우저가 boundary 와 함께 자동 설정.
export async function postForm<T = unknown>(path: string, form: FormData): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${WC26_BASE}${path}`, {
    method: "POST",
    credentials: "include",
    headers,
    body: form,
  });
  const data = await parse(res);
  if (!res.ok) {
    throw new WC26ApiError(res.status, data);
  }
  return data as T;
}
