import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const searchParams = request.nextUrl.searchParams;
  return NextResponse.redirect(`${backendUrl}/api/auth/google/callback?${searchParams.toString()}`);
}
