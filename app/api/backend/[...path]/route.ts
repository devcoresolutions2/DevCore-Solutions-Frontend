import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").replace(
  /\/+$/,
  ""
);

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const targetPath = path.join("/");
  const search = request.nextUrl.search;
  const normalizedPath = targetPath.startsWith("api/") ? targetPath : `api/${targetPath}`;
  const targetUrl = `${BACKEND_URL}/${normalizedPath}${search}`;

  const headers = new Headers();
  const forwardHeaders = [
    "accept",
    "content-type",
    "cookie",
    "authorization",
    "user-agent",
    "x-idempotency-key",
  ];

  for (const key of forwardHeaders) {
    const val = request.headers.get(key);
    if (val) headers.set(key, val);
  }

  const origin = request.nextUrl.origin;
  headers.set("origin", origin);
  headers.set("x-forwarded-host", request.nextUrl.host);
  headers.set("x-forwarded-proto", request.nextUrl.protocol.replace(":", ""));

  const method = request.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  try {
    const upstream = await fetch(targetUrl, {
      method,
      headers,
      body: body && body.byteLength > 0 ? body : undefined,
      redirect: "manual",
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    const contentType = upstream.headers.get("content-type");
    if (contentType) responseHeaders.set("content-type", contentType);

    const contentDisposition = upstream.headers.get("content-disposition");
    if (contentDisposition) responseHeaders.set("content-disposition", contentDisposition);

    const location = upstream.headers.get("location");
    if (location) responseHeaders.set("location", location);

    // Forward Set-Cookie headers as first-party cookies on the frontend origin
    const getSetCookie = (upstream.headers as unknown as { getSetCookie?: () => string[] })
      .getSetCookie;
    const setCookies = typeof getSetCookie === "function" ? getSetCookie.call(upstream.headers) : [];
    for (const rawCookie of setCookies) {
      const rewritten = rawCookie
        .replace(/;\s*Domain=[^;]+/gi, "")
        .replace(/;\s*SameSite=None/gi, "; SameSite=Lax");
      responseHeaders.append("set-cookie", rewritten);
    }

    const resBuffer = await upstream.arrayBuffer();
    return new NextResponse(resBuffer, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("[API Proxy] Upstream error:", targetUrl, err);
    return NextResponse.json(
      { error: { message: "Failed to reach backend service." } },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
