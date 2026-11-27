import { NextRequest, NextResponse } from "next/server";

/**
 * First-party session cookie bridge for OAuth callbacks.
 * Sets `devcore_session` on the frontend origin so Apple WebKit (iPhone Safari & Chrome iOS)
 * never drops it as a third-party cross-site cookie.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const rawNext = request.nextUrl.searchParams.get("next") || "/";
  const safeNext = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin?error=missing_session", request.url));
  }

  const response = NextResponse.redirect(new URL(safeNext, request.url));
  const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

  response.cookies.set("devcore_session", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });

  return response;
}
