/**
 * lib/api.ts
 * Typed API adapter. All public endpoints go through here.
 * Switch NEXT_PUBLIC_API_URL to point at the real backend — no component changes needed.
 */

import {
  MOCK_SHOWCASE,
  MOCK_PROJECTS,
  MOCK_SERVICES,
  MOCK_TESTIMONIALS,
  MOCK_CONTACT_SETTINGS,
  MOCK_BENTO_PROOF,
  type ShowcaseItem,
  type ProjectItem,
  type ServiceItem,
  type TestimonialItem,
  type ContactSettings,
  type BentoProofItem,
} from "./mock/data";

// ─── ENVELOPE TYPES ──────────────────────────────────────────────────────────
type ApiOk<T> = { data: T; message?: string };
type ApiError = { error: { code: string; message: string; fields?: Record<string, string> } };
type ApiResult<T> = ApiOk<T> | ApiError;

function isOk<T>(r: ApiResult<T>): r is ApiOk<T> {
  return "data" in r;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const USE_MOCK = !BASE_URL;

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...init,
  });
  const json: ApiResult<T> = await res.json();
  if (!isOk(json)) throw new Error(json.error.message);
  return json.data;
}

// ─── SHOWCASE ─────────────────────────────────────────────────────────────────
export type ShowcaseListParams = {
  limit?: number;
  cursor?: string;
  category?: string;
};

export type ShowcaseListResult = {
  items: ShowcaseItem[];
  nextCursor?: string;
  total: number;
};

export async function getShowcaseList(params: ShowcaseListParams = {}): Promise<ShowcaseListResult> {
  if (USE_MOCK) {
    const { limit = 6, category, cursor } = params;
    let items = [...MOCK_SHOWCASE];
    if (category) items = items.filter((s) => s.category === category);
    items.sort((a, b) => new Date(b.launchedAt).getTime() - new Date(a.launchedAt).getTime());
    const startIdx = cursor ? items.findIndex((i) => i.id === cursor) + 1 : 0;
    const page = items.slice(startIdx, startIdx + limit);
    return { items: page, nextCursor: page.length === limit ? page[page.length - 1].id : undefined, total: items.length };
  }
  const q = new URLSearchParams();
  if (params.limit) q.set("limit", String(params.limit));
  if (params.cursor) q.set("cursor", params.cursor);
  if (params.category) q.set("category", params.category);
  return apiFetch<ShowcaseListResult>(`/api/public/showcase?${q}`);
}

export async function getShowcaseBySlug(slug: string): Promise<ShowcaseItem | null> {
  if (USE_MOCK) return MOCK_SHOWCASE.find((s) => s.slug === slug) ?? null;
  return apiFetch<ShowcaseItem>(`/api/public/showcase/${slug}`).catch(() => null);
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
export type ProjectListParams = { limit?: number; cursor?: string; category?: string; tech?: string };
export type ProjectListResult = { items: ProjectItem[]; nextCursor?: string; total: number };

export async function getProjectList(params: ProjectListParams = {}): Promise<ProjectListResult> {
  if (USE_MOCK) {
    const { limit = 6, category, cursor } = params;
    let items = [...MOCK_PROJECTS];
    if (category) items = items.filter((p) => p.category === category);
    const startIdx = cursor ? items.findIndex((i) => i.id === cursor) + 1 : 0;
    const page = items.slice(startIdx, startIdx + limit);
    return { items: page, nextCursor: page.length === limit ? page[page.length - 1].id : undefined, total: items.length };
  }
  const q = new URLSearchParams();
  if (params.limit) q.set("limit", String(params.limit));
  if (params.cursor) q.set("cursor", params.cursor);
  if (params.category) q.set("category", params.category);
  if (params.tech) q.set("tech", params.tech);
  return apiFetch<ProjectListResult>(`/api/public/projects?${q}`);
}

export async function getProjectBySlug(slug: string): Promise<ProjectItem | null> {
  if (USE_MOCK) return MOCK_PROJECTS.find((p) => p.slug === slug) ?? null;
  return apiFetch<ProjectItem>(`/api/public/projects/${slug}`).catch(() => null);
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────
export async function getServices(): Promise<ServiceItem[]> {
  if (USE_MOCK) return MOCK_SERVICES;
  return apiFetch<ServiceItem[]>("/api/public/services");
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
export async function getTestimonials(): Promise<TestimonialItem[]> {
  if (USE_MOCK) return MOCK_TESTIMONIALS;
  return apiFetch<TestimonialItem[]>("/api/public/testimonials");
}

// ─── CONTACT SETTINGS ─────────────────────────────────────────────────────────
export async function getContactSettings(): Promise<ContactSettings> {
  if (USE_MOCK) return MOCK_CONTACT_SETTINGS;
  return apiFetch<ContactSettings>("/api/public/contact-settings");
}

// ─── BENTO PROOF ─────────────────────────────────────────────────────────────
export async function getBentoProof(): Promise<BentoProofItem[]> {
  if (USE_MOCK) return MOCK_BENTO_PROOF;
  return apiFetch<BentoProofItem[]>("/api/public/bento-proof");
}

// ─── LEADS ────────────────────────────────────────────────────────────────────
export type QuickCallbackPayload = {
  name: string;
  phone: string;
  message?: string;
  pageUrl: string;
  source: "QUICK_CALLBACK";
};

export async function submitLead(payload: QuickCallbackPayload): Promise<{ id: string }> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    return { id: `mock-${Date.now()}` };
  }
  return apiFetch<{ id: string }>("/api/public/leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ─── CONTACT EVENTS (Beacon) ─────────────────────────────────────────────────
export function beaconContactEvent(pageUrl: string): void {
  if (USE_MOCK || typeof navigator === "undefined") return;
  const data = JSON.stringify({ pageUrl, timestamp: Date.now() });
  navigator.sendBeacon(`${BASE_URL}/api/public/contact-events`, data);
}

// Re-export types for use in components
export type { ShowcaseItem, ProjectItem, ServiceItem, TestimonialItem, ContactSettings, BentoProofItem };
