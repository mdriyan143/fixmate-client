import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Quick check before the page loads: no session cookie means go to sign-in.
// Role checks stay in the dashboard layout and the Express middlewares.
export function proxy(req: NextRequest) {
  if (getSessionCookie(req)) return NextResponse.next();

  const { pathname, search } = req.nextUrl;
  const url = new URL("/sign-in", req.url);
  url.searchParams.set("redirect", pathname + search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*", "/payment/success"],
};