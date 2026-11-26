import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  return NextResponse.redirect(`${backendUrl}/api/auth/github`);
}
