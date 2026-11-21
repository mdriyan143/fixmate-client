// no "/" at the end, so a typo in the env value cannot create "//api/..."
const API = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

// for public data in server components (no login needed)
// returns null ONLY when the server says 404 (not found)
// throws an error when the server is down or too slow, so the error page can show "Try Again"
export async function getJSON<T>(path: string, options: { revalidate?: number } = {}): Promise<T | null> {
  // revalidate = keep the answer for some seconds (fast pages); otherwise always ask the server
  const cacheOptions: RequestInit = options.revalidate
    ? { next: { revalidate: options.revalidate } }
    : { cache: "no-store" };

  let res: Response;
  try {
    res = await fetch(`${API}${path}`, { ...cacheOptions, signal: AbortSignal.timeout(8000) });
  } catch {
    throw new Error("The server is not responding. Please try again in a moment.");
  }
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("The server had a problem. Please try again in a moment.");
  return (await res.json()) as T;
}
