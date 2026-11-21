import { authClient } from "./auth-client";

const API = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

interface ApiOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
}

let cached: { token: string; exp: number } | null = null;

// call this on sign in and sign out, so one user never reuses another user's token
export function clearToken() {
  cached = null;
}

async function getToken(): Promise<string | undefined> {
  if (cached && cached.exp > Date.now() + 30_000) return cached.token;
  const { data } = await authClient.token();
  if (!data?.token) {
    cached = null;
    return undefined;
  }
  try {
    const part = data.token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const exp = JSON.parse(atob(part)).exp * 1000;
    cached = { token: data.token, exp };
  } catch {
    cached = null; // cannot read expiry, so do not cache
  }
  return data.token;
}

export async function api<T = unknown>(path: string, { method = "GET", body }: ApiOptions = {}, retried = false): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401 && !retried) {
    clearToken();
    return api<T>(path, { method, body }, true);
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Something went wrong");
  return json as T;
}

// catch blocks give us "unknown" in TypeScript, this turns it into text for a toast
export function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong";
}
