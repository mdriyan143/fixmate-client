import { authClient } from "./auth-client";

const API = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

interface ApiOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
}

// calls the Express server with the user's JWT; throws an Error with the server message
export async function api<T = unknown>(path: string, { method = "GET", body }: ApiOptions = {}): Promise<T> {
  const { data } = await authClient.token();
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${data?.token}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Something went wrong");
  return json as T;
}

// catch blocks give us "unknown" in TypeScript, this turns it into text for a toast
export function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong";
}
