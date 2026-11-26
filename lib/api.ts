/**
 * lib/api.ts
 * Typed API adapter connecting DevCore Frontend with DevCore Backend.
 * Configure NEXT_PUBLIC_API_URL to point at the Express backend (e.g. http://localhost:5000).
 */

import {
  MOCK_SHOWCASE,
  MOCK_PROJECTS,
  MOCK_SERVICES,
  MOCK_TESTIMONIALS,
  MOCK_CONTACT_SETTINGS,
  MOCK_BENTO_PROOF,
  MOCK_LIFECYCLE_STAGES,
  MOCK_ENGAGEMENT_TIERS,
  MOCK_JOBS,
  IN_MEMORY_APPLICATIONS,
  IN_MEMORY_ABOUT_CONTENT,
  IN_MEMORY_ENGINEERING_PRINCIPLES,
  IN_MEMORY_TEAM_MEMBERS,
  IN_MEMORY_BLOG_HERO_CONFIG,
  IN_MEMORY_BLOG_CATEGORIES,
  IN_MEMORY_BLOG_AUTHORS,
  IN_MEMORY_BLOG_ARTICLES,
  IN_MEMORY_SUBSCRIBERS,
  type ShowcaseItem,
  type ProjectItem,
  type ServiceItem,
  type TestimonialItem,
  type ContactSettings,
  type BentoProofItem,
  type LifecycleStage,
  type EngagementTier,
  type JobItem,
  type JobApplicationPayload,
  type SubmittedApplicationItem,
  type AboutGeneralContent,
  type EngineeringPrincipleItem,
  type TeamMemberItem,
  type BlogArticleItem,
  type BlogCategoryItem,
  type BlogAuthorItem,
  type NewsletterSubscriberItem,
  type BlogHeroConfig,
} from "./mock/data";

// ─── INTERNAL RAW BACKEND SHAPES ──────────────────────────────────────────────
interface RawBackendService {
  id?: string;
  slug?: string;
  title: string;
  summary?: string;
  description?: string;
  deliverables?: string[];
  features?: string[];
  icon?: string;
  serviceCode?: string;
  disciplineNumber?: string;
  category?: string;
  slaBadge?: string;
  techStack?: string[];
  leadTime?: string;
  ctaLabel?: string;
  gridSpan?: "large" | "medium" | "small";
}

interface RawBackendContactSettings {
  whatsappNumber?: string;
  phone?: string;
  publicEmail?: string;
  email?: string;
  businessHours?: { start?: number; end?: number };
  businessHoursStart?: number;
  businessHoursEnd?: number;
  timezone?: string;
  callbackPromise?: string;
  bookingUrl?: string;
  settings?: RawBackendContactSettings;
  contact?: RawBackendContactSettings;
}

interface RawBackendJob {
  id: string;
  slug?: string;
  title: string;
  department?: string;
  location?: string;
  type?: string;
  workplaceType?: "Remote" | "Hybrid" | "On-site";
  description?: string;
  skills?: string[];
  responsibilities?: string[];
  requirements?: string[];
  salary?: string;
  status?: "OPEN" | "CLOSED";
  createdAt?: string;
}

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
const USE_MOCK = !BASE_URL;

function formatFallbackWarning(context: string, err: unknown): void {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("404")) {
    console.warn(`[api] ${context} endpoint returned 404 — using local fallback data.`);
    return;
  }
  console.warn(`[api] Failed to fetch ${context} from backend, using fallback data: ${message}`);
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const signal =
    init?.signal || (AbortSignal.timeout ? AbortSignal.timeout(30000) : undefined);
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    signal,
    ...init,
  });

  if (!res.ok) {
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
      const p = window.location.pathname;
      if (res.status === 401 && !p.startsWith("/admin/session-expired")) {
        window.location.assign(
          `/admin/session-expired?next=${encodeURIComponent(p + window.location.search)}`
        );
      } else if (res.status === 403 && !p.startsWith("/admin/403")) {
        window.location.assign("/admin/403");
      }
    }

    let errorMsg = `HTTP ${res.status}: ${res.statusText}`;
    try {
      const errJson = (await res.json()) as {
        error?: { message?: string };
        message?: string;
      };
      if (errJson?.error?.message) errorMsg = errJson.error.message;
      else if (errJson?.message) errorMsg = errJson.message;
    } catch {
      // response was not JSON
    }
    throw new Error(errorMsg);
  }

  const json = (await res.json()) as unknown;
  if (json && typeof json === "object" && "data" in json) {
    return (json as { data: T }).data;
  }
  return json as T;
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

export async function getShowcaseList(
  params: ShowcaseListParams = {}
): Promise<ShowcaseListResult> {
  if (USE_MOCK) {
    const { limit = 6, category, cursor } = params;
    let items = [...MOCK_SHOWCASE];
    if (category) items = items.filter((s) => s.category === category);
    items.sort((a, b) => new Date(b.launchedAt).getTime() - new Date(a.launchedAt).getTime());
    const startIdx = cursor ? items.findIndex((i) => i.id === cursor) + 1 : 0;
    const page = items.slice(startIdx, startIdx + limit);
    return {
      items: page,
      nextCursor: page.length === limit ? page[page.length - 1].id : undefined,
      total: items.length,
    };
  }

  try {
    const q = new URLSearchParams();
    if (params.limit) q.set("limit", String(params.limit));
    if (params.cursor) q.set("cursor", params.cursor);
    if (params.category) q.set("category", params.category);
    const qs = q.toString();
    return await apiFetch<ShowcaseListResult>(`/api/public/showcase${qs ? `?${qs}` : ""}`);
  } catch (err) {
    formatFallbackWarning("showcase list", err);
    return { items: MOCK_SHOWCASE.slice(0, params.limit || 6), total: MOCK_SHOWCASE.length };
  }
}

export async function getShowcaseBySlug(slug: string): Promise<ShowcaseItem | null> {
  if (USE_MOCK) return MOCK_SHOWCASE.find((s) => s.slug === slug) ?? null;
  try {
    return await apiFetch<ShowcaseItem>(`/api/public/showcase/${encodeURIComponent(slug)}`);
  } catch (err) {
    formatFallbackWarning(`showcase (${slug})`, err);
    return MOCK_SHOWCASE.find((s) => s.slug === slug) ?? null;
  }
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
export type ProjectListParams = {
  limit?: number;
  cursor?: string;
  category?: string;
  tech?: string;
};
export type ProjectListResult = { items: ProjectItem[]; nextCursor?: string; total: number };

export async function getProjectList(
  params: ProjectListParams = {}
): Promise<ProjectListResult> {
  if (USE_MOCK) {
    const { limit = 6, category, cursor } = params;
    let items = [...MOCK_PROJECTS];
    if (category) items = items.filter((p) => p.category === category);
    const startIdx = cursor ? items.findIndex((i) => i.id === cursor) + 1 : 0;
    const page = items.slice(startIdx, startIdx + limit);
    return {
      items: page,
      nextCursor: page.length === limit ? page[page.length - 1].id : undefined,
      total: items.length,
    };
  }

  try {
    const q = new URLSearchParams();
    if (params.limit) q.set("limit", String(params.limit));
    if (params.cursor) q.set("cursor", params.cursor);
    if (params.category) q.set("category", params.category);
    if (params.tech) q.set("tech", params.tech);
    const qs = q.toString();
    return await apiFetch<ProjectListResult>(`/api/public/projects${qs ? `?${qs}` : ""}`);
  } catch (err) {
    formatFallbackWarning("project list", err);
    return { items: MOCK_PROJECTS.slice(0, params.limit || 6), total: MOCK_PROJECTS.length };
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectItem | null> {
  if (USE_MOCK) return MOCK_PROJECTS.find((p) => p.slug === slug) ?? null;
  try {
    return await apiFetch<ProjectItem>(`/api/public/projects/${encodeURIComponent(slug)}`);
  } catch (err) {
    formatFallbackWarning(`project (${slug})`, err);
    return MOCK_PROJECTS.find((p) => p.slug === slug) ?? null;
  }
}

// ─── SERVICES & CAPABILITIES ──────────────────────────────────────────────────
export async function getServices(): Promise<ServiceItem[]> {
  if (USE_MOCK) return MOCK_SERVICES;
  try {
    const raw = await apiFetch<RawBackendService[]>("/api/public/services");
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((item, idx) => ({
        id: item.id || String(idx + 1),
        title: item.title,
        description: item.summary || item.description || "",
        features: item.deliverables || item.features || [],
        deliverables: item.deliverables || item.features || [],
        icon:
          item.icon ||
          (item.serviceCode === "ENG-WEB" || item.title?.toLowerCase().includes("web")
            ? "Layers"
            : item.serviceCode === "ENG-CLD" || item.title?.toLowerCase().includes("cloud")
              ? "Boxes"
              : item.serviceCode === "ENG-AUT" || item.title?.toLowerCase().includes("ai")
                ? "Bot"
                : item.serviceCode === "ENG-DSN" || item.title?.toLowerCase().includes("design")
                  ? "Layout"
                  : "Terminal"),
        serviceCode: item.serviceCode || item.slug || `ENG-0${idx + 1}`,
        disciplineNumber: item.disciplineNumber || String(idx + 1).padStart(2, "0"),
        category: item.category || "Engineering Discipline",
        slaBadge: item.slaBadge,
        techStack: item.techStack || [],
        leadTime: item.leadTime,
        ctaLabel: item.ctaLabel || "Scope Engagement",
        gridSpan: item.gridSpan || (idx === 0 ? "large" : idx === 1 ? "medium" : "small"),
      }));
    }
    return MOCK_SERVICES;
  } catch (err) {
    formatFallbackWarning("services", err);
    return MOCK_SERVICES;
  }
}

export async function getLifecycleStages(): Promise<LifecycleStage[]> {
  if (USE_MOCK) return MOCK_LIFECYCLE_STAGES;
  try {
    const raw = await apiFetch<LifecycleStage[]>("/api/public/lifecycle-stages");
    if (Array.isArray(raw) && raw.length > 0) return raw;
    return MOCK_LIFECYCLE_STAGES;
  } catch {
    return MOCK_LIFECYCLE_STAGES;
  }
}

export async function getEngagementTiers(): Promise<EngagementTier[]> {
  if (USE_MOCK) return MOCK_ENGAGEMENT_TIERS;
  try {
    const raw = await apiFetch<EngagementTier[]>("/api/public/engagement-tiers");
    if (Array.isArray(raw) && raw.length > 0) return raw;
    return MOCK_ENGAGEMENT_TIERS;
  } catch {
    return MOCK_ENGAGEMENT_TIERS;
  }
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
export async function getTestimonials(): Promise<TestimonialItem[]> {
  if (USE_MOCK) return MOCK_TESTIMONIALS;
  try {
    return await apiFetch<TestimonialItem[]>("/api/public/testimonials");
  } catch (err) {
    formatFallbackWarning("testimonials", err);
    return MOCK_TESTIMONIALS;
  }
}

// ─── CONTACT SETTINGS ─────────────────────────────────────────────────────────
export async function getContactSettings(): Promise<ContactSettings> {
  if (USE_MOCK) return MOCK_CONTACT_SETTINGS;
  try {
    // Matches backend route: app.use("/api/public/settings", publicSettingsRouter)
    const response = await apiFetch<RawBackendContactSettings>("/api/public/settings");
    const raw = response?.settings || response?.contact || response;
    if (raw) {
      const startHour = raw.businessHours?.start ?? raw.businessHoursStart ?? 9;
      const endHour = raw.businessHours?.end ?? raw.businessHoursEnd ?? 18;
      return {
        whatsappNumber:
          raw.whatsappNumber ||
          process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
          MOCK_CONTACT_SETTINGS.whatsappNumber,
        phone: raw.phone || process.env.NEXT_PUBLIC_PHONE || MOCK_CONTACT_SETTINGS.phone,
        email:
          raw.publicEmail ||
          raw.email ||
          process.env.NEXT_PUBLIC_EMAIL ||
          MOCK_CONTACT_SETTINGS.email,
        businessHoursStart: startHour,
        businessHoursEnd: endHour,
        timezone: raw.timezone || "Asia/Dhaka",
        callbackPromise: raw.callbackPromise || "We reply within 1 business hour",
        bookingUrl:
          raw.bookingUrl ||
          process.env.NEXT_PUBLIC_BOOKING_URL ||
          MOCK_CONTACT_SETTINGS.bookingUrl,
        isOpenNow: (() => {
          const now = new Date();
          const h = now.getHours();
          return h >= startHour && h < endHour;
        })(),
      };
    }
    return MOCK_CONTACT_SETTINGS;
  } catch (err) {
    formatFallbackWarning("contact settings", err);
    return MOCK_CONTACT_SETTINGS;
  }
}

// ─── BENTO PROOF ─────────────────────────────────────────────────────────────
export async function getBentoProof(): Promise<BentoProofItem[]> {
  if (USE_MOCK) return MOCK_BENTO_PROOF;
  try {
    return await apiFetch<BentoProofItem[]>("/api/public/bento-proof");
  } catch {
    return MOCK_BENTO_PROOF;
  }
}

// ─── LEADS (Estimator & Quick Callback) ────────────────────────────────────────
export type LeadPayload = {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  services?: string[];
  budgetTier?: string;
  timeline?: string;
  brief?: string;
  message?: string;
  pageUrl: string;
  source: "ESTIMATOR" | "QUICK_CALLBACK";
  utmParams?: Record<string, string>;
  idempotencyKey?: string;
};

export type QuickCallbackPayload = {
  name: string;
  phone: string;
  message?: string;
  pageUrl: string;
  source: "QUICK_CALLBACK";
};

export async function submitLead(
  payload: LeadPayload
): Promise<{ id: string; reference?: string }> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    return {
      id: `lead_${Date.now()}`,
      reference: `DC-${new Date().getFullYear()}-${randomHex}`,
    };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (payload.idempotencyKey) {
    headers["Idempotency-Key"] = payload.idempotencyKey;
  }

  const backendBody = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    company: payload.company,
    services: payload.services,
    budget: payload.budgetTier,
    timeline: payload.timeline,
    brief: payload.brief || payload.message,
    pageUrl: payload.pageUrl,
    source: payload.source,
    utm: payload.utmParams,
  };

  return apiFetch<{ id: string; reference?: string }>("/api/public/leads", {
    method: "POST",
    headers,
    body: JSON.stringify(backendBody),
  });
}

// ─── CONTACT EVENTS (Beacon) ─────────────────────────────────────────────────
export function beaconContactEvent(type: string, pageUrl: string): void {
  if (typeof window === "undefined") return;
  const url = `${BASE_URL}/api/public/contact-events`;

  const eventTypeMap: Record<string, string> = {
    whatsapp: "WHATSAPP_CLICK",
    phone: "CALL_CLICK",
    email: "EMAIL_CLICK",
  };

  const body = JSON.stringify({
    type: eventTypeMap[type.toLowerCase()] || type,
    pageUrl,
  });

  if (BASE_URL && navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(url, blob);
  } else if (BASE_URL) {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => { });
  }
}

// ─── CAREERS & OPEN ROLES ────────────────────────────────────────────────────
export async function getJobs(params?: {
  status?: "OPEN" | "CLOSED" | "ALL";
}): Promise<JobItem[]> {
  const filterStatus = params?.status || "OPEN";
  if (USE_MOCK) {
    if (filterStatus === "ALL") return MOCK_JOBS;
    return MOCK_JOBS.filter((j) => j.status === filterStatus);
  }

  try {
    const raw = await apiFetch<RawBackendJob[]>("/api/public/jobs");
    if (Array.isArray(raw) && raw.length > 0) {
      const mapped: JobItem[] = raw.map((j) => ({
        id: j.id,
        slug: j.slug || j.id,
        title: j.title,
        department: j.department || "Engineering",
        location: j.location || "Dhaka / Remote",
        type: j.type || "Full-time",
        workplaceType: j.workplaceType || "Remote",
        description: j.description || "",
        skills: Array.isArray(j.skills) ? j.skills : [],
        responsibilities: Array.isArray(j.responsibilities) ? j.responsibilities : [],
        requirements: Array.isArray(j.requirements) ? j.requirements : [],
        salary: j.salary,
        status: j.status || "OPEN",
        createdAt: j.createdAt,
      }));
      if (filterStatus === "ALL") return mapped;
      return mapped.filter((j) => j.status === filterStatus);
    }
    if (filterStatus === "ALL") return MOCK_JOBS;
    return MOCK_JOBS.filter((j) => j.status === filterStatus);
  } catch (err) {
    formatFallbackWarning("jobs", err);
    if (filterStatus === "ALL") return MOCK_JOBS;
    return MOCK_JOBS.filter((j) => j.status === filterStatus);
  }
}

export async function getJobById(id: string): Promise<JobItem | null> {
  if (USE_MOCK) {
    return MOCK_JOBS.find((j) => j.id === id || j.slug === id) ?? null;
  }
  try {
    const j = await apiFetch<RawBackendJob | null>(`/api/public/jobs/${encodeURIComponent(id)}`);
    if (j) {
      return {
        id: j.id,
        slug: j.slug || j.id,
        title: j.title,
        department: j.department || "Engineering",
        location: j.location || "Dhaka / Remote",
        type: j.type || "Full-time",
        workplaceType: j.workplaceType || "Remote",
        description: j.description || "",
        skills: Array.isArray(j.skills) ? j.skills : [],
        responsibilities: Array.isArray(j.responsibilities) ? j.responsibilities : [],
        requirements: Array.isArray(j.requirements) ? j.requirements : [],
        salary: j.salary,
        status: j.status || "OPEN",
        createdAt: j.createdAt,
      };
    }
    return MOCK_JOBS.find((m) => m.id === id || m.slug === id) ?? null;
  } catch {
    return MOCK_JOBS.find((m) => m.id === id || m.slug === id) ?? null;
  }
}

export async function submitJobApplication(
  payload: JobApplicationPayload
): Promise<{ success: boolean; id: string; message: string }> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 700));
    const newId = `app_${Date.now()}`;
    IN_MEMORY_APPLICATIONS.unshift({
      id: newId,
      jobId: payload.jobId,
      jobTitle: payload.jobTitle || "Open Role",
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      resumeFileName: payload.resumeFileName,
      resumeUrl: payload.resumeUrl,
      portfolioUrl: payload.portfolioUrl,
      githubUrl: payload.githubUrl,
      message: payload.message,
      status: "NEW",
      createdAt: new Date().toISOString(),
    });
    return {
      success: true,
      id: newId,
      message: "Application transmitted successfully to engineering review queue.",
    };
  }

  const backendBody = {
    jobId: payload.jobId,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    resumePublicId: payload.resumeFileName || payload.resumeUrl || "resume_uploaded",
    portfolioUrl: payload.portfolioUrl || payload.githubUrl,
    message: payload.message,
  };

  try {
    const res = await apiFetch<{ id: string; message?: string }>("/api/public/jobs/apply", {
      method: "POST",
      body: JSON.stringify(backendBody),
    });
    return {
      success: true,
      id: res.id,
      message: res.message || "Application received successfully.",
    };
  } catch (err: unknown) {
    const msg =
      err instanceof Error
        ? err.message
        : "Could not submit candidacy. Please check details and retry.";
    throw new Error(msg);
  }
}

export async function getSubmittedApplications(): Promise<SubmittedApplicationItem[]> {
  if (USE_MOCK) return IN_MEMORY_APPLICATIONS;
  try {
    return await apiFetch<SubmittedApplicationItem[]>("/api/admin/applications");
  } catch {
    return IN_MEMORY_APPLICATIONS;
  }
}

export async function updateJobStatus(
  jobId: string,
  status: "OPEN" | "CLOSED"
): Promise<boolean> {
  const target = MOCK_JOBS.find((j) => j.id === jobId);
  if (target) target.status = status;
  if (!USE_MOCK) {
    try {
      await apiFetch(`/api/admin/jobs/${encodeURIComponent(jobId)}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    } catch {
      // ignore
    }
  }
  return true;
}

export async function updateApplicationStatus(
  appId: string,
  status: SubmittedApplicationItem["status"]
): Promise<boolean> {
  const target = IN_MEMORY_APPLICATIONS.find((a) => a.id === appId);
  if (target) target.status = status;
  if (!USE_MOCK) {
    try {
      await apiFetch(`/api/admin/applications/${encodeURIComponent(appId)}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    } catch {
      // ignore
    }
  }
  return true;
}

// ─── ABOUT & TEAM APIS ─────────────────────────────────────────────────────────

export async function getAboutContent(): Promise<AboutGeneralContent> {
  if (USE_MOCK) return IN_MEMORY_ABOUT_CONTENT;
  try {
    return await apiFetch<AboutGeneralContent>("/api/public/about");
  } catch (err) {
    formatFallbackWarning("about content", err);
    return IN_MEMORY_ABOUT_CONTENT;
  }
}

export async function updateAboutContent(
  payload: Partial<AboutGeneralContent>
): Promise<AboutGeneralContent> {
  Object.assign(IN_MEMORY_ABOUT_CONTENT, payload);
  if (!USE_MOCK) {
    try {
      return await apiFetch<AboutGeneralContent>("/api/admin/about", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    } catch {
      // ignore
    }
  }
  return IN_MEMORY_ABOUT_CONTENT;
}

export async function getEngineeringPrinciples(params?: {
  publishedOnly?: boolean;
}): Promise<EngineeringPrincipleItem[]> {
  if (USE_MOCK) {
    let items = [...IN_MEMORY_ENGINEERING_PRINCIPLES];
    if (params?.publishedOnly) {
      items = items.filter((p) => p.isPublished);
    }
    return items.sort((a, b) => a.orderIndex - b.orderIndex);
  }
  try {
    const q = params?.publishedOnly ? "?publishedOnly=true" : "";
    return await apiFetch<EngineeringPrincipleItem[]>(`/api/public/about/principles${q}`);
  } catch {
    let items = [...IN_MEMORY_ENGINEERING_PRINCIPLES];
    if (params?.publishedOnly) {
      items = items.filter((p) => p.isPublished);
    }
    return items.sort((a, b) => a.orderIndex - b.orderIndex);
  }
}

export async function createEngineeringPrinciple(
  payload: Omit<EngineeringPrincipleItem, "id">
): Promise<EngineeringPrincipleItem> {
  const newId = `principle-${Date.now()}`;
  const newItem: EngineeringPrincipleItem = { id: newId, ...payload };
  IN_MEMORY_ENGINEERING_PRINCIPLES.push(newItem);
  if (!USE_MOCK) {
    try {
      return await apiFetch<EngineeringPrincipleItem>("/api/admin/about/principles", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      // ignore
    }
  }
  return newItem;
}

export async function updateEngineeringPrinciple(
  id: string,
  payload: Partial<EngineeringPrincipleItem>
): Promise<EngineeringPrincipleItem> {
  const idx = IN_MEMORY_ENGINEERING_PRINCIPLES.findIndex((p) => p.id === id);
  if (idx !== -1) {
    IN_MEMORY_ENGINEERING_PRINCIPLES[idx] = {
      ...IN_MEMORY_ENGINEERING_PRINCIPLES[idx],
      ...payload,
    };
  }
  if (!USE_MOCK) {
    try {
      return await apiFetch<EngineeringPrincipleItem>(
        `/api/admin/about/principles/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      );
    } catch {
      // ignore
    }
  }
  return idx !== -1
    ? IN_MEMORY_ENGINEERING_PRINCIPLES[idx]
    : (payload as EngineeringPrincipleItem);
}

export async function deleteEngineeringPrinciple(id: string): Promise<boolean> {
  const idx = IN_MEMORY_ENGINEERING_PRINCIPLES.findIndex((p) => p.id === id);
  if (idx !== -1) {
    IN_MEMORY_ENGINEERING_PRINCIPLES.splice(idx, 1);
  }
  if (!USE_MOCK) {
    try {
      await apiFetch(`/api/admin/about/principles/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch {
      // ignore
    }
  }
  return true;
}

export async function reorderEngineeringPrinciples(ids: string[]): Promise<boolean> {
  ids.forEach((id, index) => {
    const item = IN_MEMORY_ENGINEERING_PRINCIPLES.find((p) => p.id === id);
    if (item) item.orderIndex = index + 1;
  });
  IN_MEMORY_ENGINEERING_PRINCIPLES.sort((a, b) => a.orderIndex - b.orderIndex);
  if (!USE_MOCK) {
    try {
      await apiFetch("/api/admin/about/principles/reorder", {
        method: "POST",
        body: JSON.stringify({ ids }),
      });
    } catch {
      // ignore
    }
  }
  return true;
}

export async function getTeamMembers(params?: {
  publishedOnly?: boolean;
}): Promise<TeamMemberItem[]> {
  if (USE_MOCK) {
    let items = [...IN_MEMORY_TEAM_MEMBERS];
    if (params?.publishedOnly) {
      items = items.filter((m) => m.isPublished);
    }
    return items.sort((a, b) => a.displayOrder - b.displayOrder);
  }
  try {
    const q = params?.publishedOnly ? "?publishedOnly=true" : "";
    return await apiFetch<TeamMemberItem[]>(`/api/public/about/team${q}`);
  } catch {
    let items = [...IN_MEMORY_TEAM_MEMBERS];
    if (params?.publishedOnly) {
      items = items.filter((m) => m.isPublished);
    }
    return items.sort((a, b) => a.displayOrder - b.displayOrder);
  }
}

export async function createTeamMember(
  payload: Omit<TeamMemberItem, "id">
): Promise<TeamMemberItem> {
  const newId = `team-${Date.now()}`;
  const newItem: TeamMemberItem = { id: newId, ...payload };
  IN_MEMORY_TEAM_MEMBERS.push(newItem);
  if (!USE_MOCK) {
    try {
      return await apiFetch<TeamMemberItem>("/api/admin/about/team", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      // ignore
    }
  }
  return newItem;
}

export async function updateTeamMember(
  id: string,
  payload: Partial<TeamMemberItem>
): Promise<TeamMemberItem> {
  const idx = IN_MEMORY_TEAM_MEMBERS.findIndex((m) => m.id === id);
  if (idx !== -1) {
    IN_MEMORY_TEAM_MEMBERS[idx] = { ...IN_MEMORY_TEAM_MEMBERS[idx], ...payload };
  }
  if (!USE_MOCK) {
    try {
      return await apiFetch<TeamMemberItem>(`/api/admin/about/team/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    } catch {
      // ignore
    }
  }
  return idx !== -1 ? IN_MEMORY_TEAM_MEMBERS[idx] : (payload as TeamMemberItem);
}

export async function deleteTeamMember(id: string): Promise<boolean> {
  const idx = IN_MEMORY_TEAM_MEMBERS.findIndex((m) => m.id === id);
  if (idx !== -1) {
    IN_MEMORY_TEAM_MEMBERS.splice(idx, 1);
  }
  if (!USE_MOCK) {
    try {
      await apiFetch(`/api/admin/about/team/${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch {
      // ignore
    }
  }
  return true;
}

export async function reorderTeamMembers(ids: string[]): Promise<boolean> {
  ids.forEach((id, index) => {
    const item = IN_MEMORY_TEAM_MEMBERS.find((m) => m.id === id);
    if (item) item.displayOrder = index + 1;
  });
  IN_MEMORY_TEAM_MEMBERS.sort((a, b) => a.displayOrder - b.displayOrder);
  if (!USE_MOCK) {
    try {
      await apiFetch("/api/admin/about/team/reorder", {
        method: "POST",
        body: JSON.stringify({ ids }),
      });
    } catch {
      // ignore
    }
  }
  return true;
}

export async function uploadAvatar(file: File): Promise<string> {
  if (!USE_MOCK) {
    try {
      const resourceType = "image" as const;
      const sig = await apiSignSocialMediaUpload(resourceType);
      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sig.apiKey);
      form.append("timestamp", String(sig.timestamp));
      form.append("signature", sig.signature);
      form.append("folder", sig.folder);
      form.append("public_id", sig.publicId);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
        { method: "POST", body: form }
      );
      if (uploadRes.ok) {
        const data = (await uploadRes.json()) as { secure_url?: string };
        if (data?.secure_url) return data.secure_url;
      }
    } catch {
      // Fallback to data URL below if Cloudinary signing fails
    }
  }

  // Fallback: Base64 data URL for local preview/offline mode
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// ─── BLOG & TECHNICAL CMS ──────────────────────────────────────────────────

export async function getBlogHeroConfig(): Promise<BlogHeroConfig> {
  if (!USE_MOCK) {
    try {
      const res = await apiFetch<BlogHeroConfig>("/api/public/blog/hero");
      if (res) return res;
    } catch {
      // fallback to memory
    }
  }
  return { ...IN_MEMORY_BLOG_HERO_CONFIG };
}

export async function updateBlogHeroConfig(
  config: Partial<BlogHeroConfig>
): Promise<BlogHeroConfig> {
  Object.assign(IN_MEMORY_BLOG_HERO_CONFIG, config);
  if (!USE_MOCK) {
    try {
      const res = await apiFetch<BlogHeroConfig>("/api/admin/blog/hero", {
        method: "PUT",
        body: JSON.stringify(config),
      });
      if (res) return res;
    } catch {
      // ignore
    }
  }
  return { ...IN_MEMORY_BLOG_HERO_CONFIG };
}

export async function getBlogCategories(): Promise<BlogCategoryItem[]> {
  if (!USE_MOCK) {
    try {
      const res = await apiFetch<BlogCategoryItem[]>("/api/public/blog/categories");
      if (res) return res;
    } catch {
      // fallback
    }
  }
  return IN_MEMORY_BLOG_CATEGORIES.map((cat) => ({
    ...cat,
    count: IN_MEMORY_BLOG_ARTICLES.filter(
      (a) =>
        (a.categorySlug === cat.slug || a.category.toLowerCase() === cat.slug.toLowerCase()) &&
        a.status === "PUBLISHED"
    ).length,
  }));
}

export async function createBlogCategory(
  data: Omit<BlogCategoryItem, "id" | "count">
): Promise<BlogCategoryItem> {
  const newCat: BlogCategoryItem = {
    ...data,
    id: `cat-${Date.now()}`,
    count: 0,
    isActive: data.isActive !== undefined ? data.isActive : true,
  };
  IN_MEMORY_BLOG_CATEGORIES.push(newCat);
  if (!USE_MOCK) {
    try {
      const res = await apiFetch<BlogCategoryItem>("/api/admin/blog/categories", {
        method: "POST",
        body: JSON.stringify(newCat),
      });
      if (res) return res;
    } catch {
      // ignore
    }
  }
  return newCat;
}

export async function updateBlogCategory(
  id: string,
  data: Partial<BlogCategoryItem>
): Promise<BlogCategoryItem> {
  const idx = IN_MEMORY_BLOG_CATEGORIES.findIndex((c) => c.id === id);
  if (idx !== -1) {
    IN_MEMORY_BLOG_CATEGORIES[idx] = { ...IN_MEMORY_BLOG_CATEGORIES[idx], ...data };
  }
  if (!USE_MOCK) {
    try {
      const res = await apiFetch<BlogCategoryItem>(
        `/api/admin/blog/categories/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
        }
      );
      if (res) return res;
    } catch {
      // ignore
    }
  }
  return IN_MEMORY_BLOG_CATEGORIES[idx] || (data as BlogCategoryItem);
}

export async function deleteBlogCategory(id: string): Promise<boolean> {
  const idx = IN_MEMORY_BLOG_CATEGORIES.findIndex((c) => c.id === id);
  if (idx !== -1) IN_MEMORY_BLOG_CATEGORIES.splice(idx, 1);
  if (!USE_MOCK) {
    try {
      await apiFetch(`/api/admin/blog/categories/${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch {
      // ignore
    }
  }
  return true;
}

export async function getBlogAuthors(): Promise<BlogAuthorItem[]> {
  if (!USE_MOCK) {
    try {
      const res = await apiFetch<BlogAuthorItem[]>("/api/public/blog/authors");
      if (res) return res;
    } catch {
      // fallback
    }
  }
  return [...IN_MEMORY_BLOG_AUTHORS];
}

export async function createBlogAuthor(
  data: Omit<BlogAuthorItem, "id">
): Promise<BlogAuthorItem> {
  const newAuthor: BlogAuthorItem = {
    ...data,
    id: `auth-${Date.now()}`,
  };
  IN_MEMORY_BLOG_AUTHORS.push(newAuthor);
  if (!USE_MOCK) {
    try {
      const res = await apiFetch<BlogAuthorItem>("/api/admin/blog/authors", {
        method: "POST",
        body: JSON.stringify(newAuthor),
      });
      if (res) return res;
    } catch {
      // ignore
    }
  }
  return newAuthor;
}

export async function updateBlogAuthor(
  id: string,
  data: Partial<BlogAuthorItem>
): Promise<BlogAuthorItem> {
  const idx = IN_MEMORY_BLOG_AUTHORS.findIndex((a) => a.id === id);
  if (idx !== -1) {
    IN_MEMORY_BLOG_AUTHORS[idx] = { ...IN_MEMORY_BLOG_AUTHORS[idx], ...data };
  }
  if (!USE_MOCK) {
    try {
      const res = await apiFetch<BlogAuthorItem>(
        `/api/admin/blog/authors/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
        }
      );
      if (res) return res;
    } catch {
      // ignore
    }
  }
  return IN_MEMORY_BLOG_AUTHORS[idx] || (data as BlogAuthorItem);
}

export async function deleteBlogAuthor(id: string): Promise<boolean> {
  const idx = IN_MEMORY_BLOG_AUTHORS.findIndex((a) => a.id === id);
  if (idx !== -1) IN_MEMORY_BLOG_AUTHORS.splice(idx, 1);
  if (!USE_MOCK) {
    try {
      await apiFetch(`/api/admin/blog/authors/${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch {
      // ignore
    }
  }
  return true;
}

export async function getBlogArticles(params?: {
  category?: string;
  tag?: string;
  search?: string;
  sort?: "newest" | "oldest" | "readingTime";
  status?: "PUBLISHED" | "DRAFT" | "ALL";
}): Promise<BlogArticleItem[]> {
  if (!USE_MOCK) {
    try {
      const query = new URLSearchParams();
      if (params?.category) query.set("category", params.category);
      if (params?.tag) query.set("tag", params.tag);
      if (params?.search) query.set("search", params.search);
      if (params?.sort) query.set("sort", params.sort);
      if (params?.status) query.set("status", params.status);
      const qs = query.toString();
      const res = await apiFetch<BlogArticleItem[]>(`/api/public/blog${qs ? `?${qs}` : ""}`);
      if (res) return res;
    } catch {
      // fallback
    }
  }

  let list = [...IN_MEMORY_BLOG_ARTICLES];

  if (params?.status === "DRAFT") {
    list = list.filter((a) => a.status === "DRAFT");
  } else if (params?.status !== "ALL") {
    list = list.filter((a) => a.status === "PUBLISHED");
  }

  if (params?.category && params.category !== "all") {
    const cat = params.category.toLowerCase();
    list = list.filter(
      (a) => a.category.toLowerCase() === cat || a.categorySlug?.toLowerCase() === cat
    );
  }

  if (params?.tag) {
    const t = params.tag.toLowerCase();
    list = list.filter((a) => a.tags.some((tag) => tag.toLowerCase() === t));
  }

  if (params?.search?.trim()) {
    const q = params.search.toLowerCase().trim();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q) ||
        a.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        a.authorName.toLowerCase().includes(q)
    );
  }

  if (params?.sort === "oldest") {
    list.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
  } else if (params?.sort === "readingTime") {
    list.sort((a, b) => a.readingMinutes - b.readingMinutes);
  } else {
    list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  return list;
}

export async function getFeaturedArticle(): Promise<BlogArticleItem | null> {
  const articles = await getBlogArticles({ status: "PUBLISHED" });
  const featured = articles.find((a) => a.isFeatured);
  return featured || articles[0] || null;
}

export async function getArticleBySlug(slug: string): Promise<BlogArticleItem | null> {
  if (!USE_MOCK) {
    try {
      const res = await apiFetch<BlogArticleItem>(`/api/public/blog/${encodeURIComponent(slug)}`);
      if (res) return res;
    } catch {
      // fallback
    }
  }
  const found = IN_MEMORY_BLOG_ARTICLES.find((a) => a.slug === slug);
  return found ? { ...found } : null;
}

export async function createBlogArticle(
  data: Omit<BlogArticleItem, "id" | "updatedAt">
): Promise<BlogArticleItem> {
  const now = new Date().toISOString();
  const newArticle: BlogArticleItem = {
    ...data,
    id: `post-${Date.now()}`,
    readTime: data.readTime || `${data.readingMinutes || 5} min read`,
    publishedAt: data.publishedAt || now,
    updatedAt: now,
    isFeatured: !!data.isFeatured,
    tags: data.tags || [],
    categorySlug: data.categorySlug || data.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  };
  IN_MEMORY_BLOG_ARTICLES.unshift(newArticle);

  if (!USE_MOCK) {
    try {
      const res = await apiFetch<BlogArticleItem>("/api/admin/blog/articles", {
        method: "POST",
        body: JSON.stringify(newArticle),
      });
      if (res) return res;
    } catch {
      // ignore
    }
  }
  return newArticle;
}

export async function updateBlogArticle(
  id: string,
  data: Partial<BlogArticleItem>
): Promise<BlogArticleItem> {
  const idx = IN_MEMORY_BLOG_ARTICLES.findIndex((a) => a.id === id);
  if (idx !== -1) {
    const existing = IN_MEMORY_BLOG_ARTICLES[idx];
    const updated: BlogArticleItem = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
      publishedAt: data.publishedAt || existing.publishedAt,
    };
    IN_MEMORY_BLOG_ARTICLES[idx] = updated;
  }
  if (!USE_MOCK) {
    try {
      const res = await apiFetch<BlogArticleItem>(
        `/api/admin/blog/articles/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
        }
      );
      if (res) return res;
    } catch {
      // ignore
    }
  }
  return IN_MEMORY_BLOG_ARTICLES[idx] || (data as BlogArticleItem);
}

export async function deleteBlogArticle(id: string): Promise<boolean> {
  const idx = IN_MEMORY_BLOG_ARTICLES.findIndex((a) => a.id === id);
  if (idx !== -1) IN_MEMORY_BLOG_ARTICLES.splice(idx, 1);
  if (!USE_MOCK) {
    try {
      await apiFetch(`/api/admin/blog/articles/${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch {
      // ignore
    }
  }
  return true;
}

// ─── NEWSLETTER SUBSCRIPTION ───────────────────────────────────────────────

export async function subscribeNewsletter(
  email: string,
  source = "BLOG_PAGE"
): Promise<{ success: boolean; message: string; subscriber?: NewsletterSubscriberItem }> {
  const normalized = email.trim().toLowerCase();
  const existing = IN_MEMORY_SUBSCRIBERS.find((s) => s.email.toLowerCase() === normalized);

  if (existing) {
    if (existing.status === "ACTIVE") {
      return {
        success: true,
        message: "You are already subscribed to the technical dispatch.",
        subscriber: existing,
      };
    } else {
      existing.status = "ACTIVE";
      return {
        success: true,
        message: "Welcome back! Your subscription has been reactivated.",
        subscriber: existing,
      };
    }
  }

  const newSub: NewsletterSubscriberItem = {
    id: `sub-${Date.now()}`,
    email: normalized,
    status: "ACTIVE",
    subscribedAt: new Date().toISOString(),
  };
  IN_MEMORY_SUBSCRIBERS.unshift(newSub);

  if (!USE_MOCK) {
    try {
      const res = await apiFetch<{
        success: boolean;
        message: string;
        subscriber?: NewsletterSubscriberItem;
      }>("/api/public/newsletter/subscribe", {
        method: "POST",
        body: JSON.stringify({ email: normalized, source }),
      });
      if (res) return res;
    } catch {
      // ignore
    }
  }

  return {
    success: true,
    message: "Thank you for subscribing to DevCore Technical Engineering Dispatches.",
    subscriber: newSub,
  };
}

export async function unsubscribeNewsletter(
  email: string
): Promise<{ success: boolean; message: string }> {
  const normalized = email.trim().toLowerCase();
  const sub = IN_MEMORY_SUBSCRIBERS.find((s) => s.email.toLowerCase() === normalized);
  if (sub) {
    sub.status = "UNSUBSCRIBED";
  }

  if (!USE_MOCK) {
    try {
      await apiFetch("/api/public/newsletter/unsubscribe", {
        method: "POST",
        body: JSON.stringify({ email: normalized }),
      });
    } catch {
      // ignore
    }
  }

  return { success: true, message: "You have been unsubscribed from the dispatch." };
}

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriberItem[]> {
  if (!USE_MOCK) {
    try {
      const res = await apiFetch<NewsletterSubscriberItem[]>(
        "/api/admin/newsletter/subscribers"
      );
      if (res) return res;
    } catch {
      // fallback
    }
  }
  return [...IN_MEMORY_SUBSCRIBERS];
}

export async function deleteNewsletterSubscriber(id: string): Promise<boolean> {
  const idx = IN_MEMORY_SUBSCRIBERS.findIndex((s) => s.id === id);
  if (idx !== -1) IN_MEMORY_SUBSCRIBERS.splice(idx, 1);
  if (!USE_MOCK) {
    try {
      await apiFetch(`/api/admin/newsletter/subscribers/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch {
      // ignore
    }
  }
  return true;
}

export async function updateNewsletterSubscriberStatus(
  id: string,
  status: "ACTIVE" | "UNSUBSCRIBED"
): Promise<NewsletterSubscriberItem> {
  const sub = IN_MEMORY_SUBSCRIBERS.find((s) => s.id === id);
  if (sub) sub.status = status;
  if (!USE_MOCK) {
    try {
      const res = await apiFetch<NewsletterSubscriberItem>(
        `/api/admin/newsletter/subscribers/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          body: JSON.stringify({ status }),
        }
      );
      if (res) return res;
    } catch {
      // ignore
    }
  }
  return sub || { id, email: "", status, subscribedAt: new Date().toISOString() };
}

export async function getBlogStats(): Promise<{
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalCategories: number;
  totalSubscribers: number;
  totalReads: number;
}> {
  const articles = IN_MEMORY_BLOG_ARTICLES;
  return {
    totalArticles: articles.length,
    publishedArticles: articles.filter((a) => a.status === "PUBLISHED").length,
    draftArticles: articles.filter((a) => a.status === "DRAFT").length,
    totalCategories: IN_MEMORY_BLOG_CATEGORIES.length,
    totalSubscribers: IN_MEMORY_SUBSCRIBERS.filter((s) => s.status === "ACTIVE").length,
    totalReads: articles.length * 480,
  };
}

// ─── AUTHENTICATION API ────────────────────────────────────────────────────

export type AuthUser = {
  id: string;
  name: string;
  username?: string | null;
  email: string;
  role: "USER" | "CLIENT" | "EDITOR" | "SUPER_ADMIN";
  emailVerified: boolean;
  avatarUrl?: string | null;
  hasPassword?: boolean;
};

let IN_MEMORY_CURRENT_USER: AuthUser | null = null;

export async function apiSignUp(payload: {
  name: string;
  email: string;
  password: string;
  termsAccepted: boolean;
  inviteToken?: string;
}): Promise<{ success: boolean; message: string; email: string; inviteAccepted?: boolean }> {
  if (!USE_MOCK) {
    return await apiFetch<{
      success: boolean;
      message: string;
      email: string;
      inviteAccepted?: boolean;
    }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  const normalized = payload.email.trim().toLowerCase();
  IN_MEMORY_CURRENT_USER = {
    id: `user-${Date.now()}`,
    name: payload.name.trim(),
    email: normalized,
    role: "USER",
    emailVerified: false,
  };

  return {
    success: true,
    message: "Account created successfully. A verification code has been dispatched to your email.",
    email: normalized,
  };
}

export async function apiSignIn(payload: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): Promise<{ success: boolean; user: AuthUser; redirectUrl: string }> {
  if (!USE_MOCK) {
    return await apiFetch<{ success: boolean; user: AuthUser; redirectUrl: string }>(
      "/api/auth/signin",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  }

  const normalized = payload.email.trim().toLowerCase();
  const isAdmin =
    normalized.includes("admin") ||
    normalized.includes("dev.core") ||
    normalized.includes("pinon") ||
    normalized.includes("samin");

  const user: AuthUser = {
    id: "user-1",
    name: normalized.split("@")[0] || "DevCore User",
    email: normalized,
    role: isAdmin ? "SUPER_ADMIN" : "USER",
    emailVerified: true,
  };
  IN_MEMORY_CURRENT_USER = user;

  return {
    success: true,
    user,
    redirectUrl: isAdmin ? "/admin/dashboard" : "/",
  };
}

export async function apiGetSession(): Promise<{ user: AuthUser | null }> {
  if (!USE_MOCK) {
    try {
      return await apiFetch<{ user: AuthUser | null }>("/api/auth/me");
    } catch {
      return { user: null };
    }
  }
  return { user: IN_MEMORY_CURRENT_USER };
}

export async function apiSignOut(): Promise<{ success: boolean }> {
  if (!USE_MOCK) {
    try {
      await apiFetch("/api/auth/signout", { method: "POST" });
    } catch {
      // ignore
    }
  }
  IN_MEMORY_CURRENT_USER = null;
  return { success: true };
}

export interface VerificationStatusResponse {
  hasActiveOtp: boolean;
  expiresInSeconds: number;
  cooldownSeconds: number;
  attemptsLeft: number;
  resendsLeft: number;
  isLocked: boolean;
  emailVerified: boolean;
}

export async function apiGetVerificationStatus(
  email: string
): Promise<VerificationStatusResponse> {
  if (!USE_MOCK) {
    return await apiFetch<VerificationStatusResponse>(
      `/api/auth/verification-status?email=${encodeURIComponent(email)}`,
      { method: "GET" }
    );
  }
  return {
    hasActiveOtp: true,
    expiresInSeconds: 600,
    cooldownSeconds: 0,
    attemptsLeft: 5,
    resendsLeft: 3,
    isLocked: false,
    emailVerified: false,
  };
}

export async function apiChangePendingEmail(
  currentEmail: string,
  newEmail: string
): Promise<{ success: boolean; message: string; newEmail?: string }> {
  if (!USE_MOCK) {
    return await apiFetch<{ success: boolean; message: string; newEmail?: string }>(
      "/api/auth/change-pending-email",
      {
        method: "POST",
        body: JSON.stringify({ currentEmail, newEmail }),
      }
    );
  }
  return {
    success: true,
    message: `Verification code dispatched to ${newEmail}`,
    newEmail,
  };
}

export async function apiVerifyEmail(payload: {
  token?: string;
  otp?: string;
  email?: string;
}): Promise<{ success: boolean; message: string; attemptsLeft?: number }> {
  if (!USE_MOCK) {
    return await apiFetch<{ success: boolean; message: string; attemptsLeft?: number }>(
      "/api/auth/verify-email",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  }
  if (IN_MEMORY_CURRENT_USER) {
    IN_MEMORY_CURRENT_USER.emailVerified = true;
  }
  return { success: true, message: "Email verified successfully! You may now sign in." };
}

export async function apiResendVerification(
  email: string
): Promise<{ success: boolean; message: string; cooldownSeconds?: number; resendsLeft?: number }> {
  if (!USE_MOCK) {
    return await apiFetch<{
      success: boolean;
      message: string;
      cooldownSeconds?: number;
      resendsLeft?: number;
    }>("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }
  return {
    success: true,
    message: "A fresh verification link and security code have been sent.",
  };
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  maskedEmail?: string;
  expiresInSeconds?: number;
  cooldownSeconds?: number;
  resendsLeft?: number;
}

export interface VerifyResetOtpResponse {
  success: boolean;
  message: string;
  resetToken?: string;
  attemptsLeft?: number;
}

export interface ResendResetOtpResponse {
  success: boolean;
  message: string;
  cooldownSeconds?: number;
  resendsLeft?: number;
}

export async function apiForgotPassword(email: string): Promise<ForgotPasswordResponse> {
  if (!USE_MOCK) {
    return await apiFetch<ForgotPasswordResponse>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }
  return {
    success: true,
    message: "If an account matches this email, a verification code has been dispatched.",
    maskedEmail: email.replace(/(^.{2})(.*)(@.*$)/, "$1****$3"),
    expiresInSeconds: 600,
    cooldownSeconds: 60,
    resendsLeft: 3,
  };
}

export async function apiVerifyResetOtp(
  email: string,
  otp: string
): Promise<VerifyResetOtpResponse> {
  if (!USE_MOCK) {
    return await apiFetch<VerifyResetOtpResponse>("/api/auth/verify-reset-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  }
  return {
    success: true,
    message: "OTP verified successfully.",
    resetToken: "mock-reset-token-" + Date.now(),
  };
}

export async function apiResendResetOtp(email: string): Promise<ResendResetOtpResponse> {
  if (!USE_MOCK) {
    return await apiFetch<ResendResetOtpResponse>("/api/auth/resend-reset-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }
  return {
    success: true,
    message: "A fresh verification code has been dispatched to your email.",
    cooldownSeconds: 60,
    resendsLeft: 2,
  };
}

export async function apiValidateResetToken(token: string): Promise<{
  valid: boolean;
  message?: string;
  expiresInSeconds?: number;
}> {
  if (!USE_MOCK) {
    return await apiFetch<{
      valid: boolean;
      message?: string;
      expiresInSeconds?: number;
    }>("/api/auth/validate-reset-token", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }
  return {
    valid: Boolean(token),
    expiresInSeconds: 900,
    message: "Token is active and valid.",
  };
}

export async function apiResetPassword(payload: {
  token: string;
  password: string;
  confirmPassword?: string;
}): Promise<{ success: boolean; message: string }> {
  if (!USE_MOCK) {
    return await apiFetch<{ success: boolean; message: string }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  return {
    success: true,
    message: "Password updated successfully. You may now sign in with your new credentials.",
  };
}

// ─── ACCOUNT SETTINGS & SECURITY API ─────────────────────────────────────────

export interface AccountProfile extends AuthUser {
  avatarPublicId?: string | null;
  avatarVersion?: number | null;
  isActive: boolean;
  hasPassword: boolean;
  lastSignInAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectedProviderItem {
  id: string;
  provider: string;
  connectedAt: string;
}

export interface AccountOverviewResponse {
  user: AccountProfile;
  providers: ConnectedProviderItem[];
  activeSessionsCount: number;
  recentEventsCount: number;
  oauthConfigured: {
    google: boolean;
    github: boolean;
  };
}

export interface AvatarSignatureResponse {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  publicId: string;
  eager: string;
  allowedFormats: string;
  maxFileSizeBytes: number;
}

export interface AccountSessionItem {
  id: string;
  isCurrent: boolean;
  browser: string;
  os: string;
  deviceType: "desktop" | "mobile" | "cli";
  ip: string | null;
  approxLocation: string | null;
  rememberMe: boolean;
  lastActiveAt: string;
  createdAt: string;
  expiresAt: string;
}

export interface AccountAuditEventItem {
  id: string;
  type: string;
  status: string;
  ip: string | null;
  client: { browser: string; os: string; deviceType: string };
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export async function apiGetAccountOverview(): Promise<AccountOverviewResponse> {
  return await apiFetch<AccountOverviewResponse>("/api/account/overview");
}

export async function apiUpdateProfile(payload: {
  name: string;
  username?: string | null;
}): Promise<{ success: boolean; message: string; user: AccountProfile }> {
  return await apiFetch("/api/account/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function apiGetAvatarUploadSignature(): Promise<AvatarSignatureResponse> {
  return await apiFetch<AvatarSignatureResponse>("/api/account/avatar/signature", {
    method: "POST",
  });
}

export async function apiConfirmAvatarUpload(publicId: string): Promise<{
  success: boolean;
  message: string;
  avatarUrl: string;
  avatarPublicId: string;
  avatarVersion: number | null;
}> {
  return await apiFetch("/api/account/avatar/confirm", {
    method: "POST",
    body: JSON.stringify({ publicId }),
  });
}

export async function apiDeleteAvatar(): Promise<{ success: boolean; message: string }> {
  return await apiFetch("/api/account/avatar", {
    method: "DELETE",
  });
}

export async function apiChangePassword(payload: {
  currentPassword?: string;
  newPassword: string;
  revokeOtherSessions?: boolean;
}): Promise<{ success: boolean; message: string; revokedOthersCount: number }> {
  return await apiFetch("/api/account/password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiDisconnectProvider(
  provider: "google" | "github"
): Promise<{ success: boolean; message: string }> {
  return await apiFetch(`/api/account/providers/${provider}`, {
    method: "DELETE",
  });
}

export async function apiGetSessions(): Promise<{ sessions: AccountSessionItem[] }> {
  return await apiFetch("/api/account/sessions");
}

export async function apiRevokeSession(
  sessionId: string
): Promise<{ success: boolean; message: string }> {
  return await apiFetch(`/api/account/sessions/${encodeURIComponent(sessionId)}`, {
    method: "DELETE",
  });
}

export async function apiRevokeOtherSessions(): Promise<{
  success: boolean;
  revokedCount: number;
  message: string;
}> {
  return await apiFetch("/api/account/sessions/revoke-others", {
    method: "POST",
  });
}

export async function apiGetAuditEvents(
  page = 1,
  limit = 15
): Promise<{
  events: AccountAuditEventItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  return await apiFetch(`/api/account/audit-events?page=${page}&limit=${limit}`);
}

export function getAuditExportUrl(): string {
  return `${BASE_URL}/api/account/audit-events/export`;
}

export function getOAuthLinkUrl(provider: "google" | "github"): string {
  return `${BASE_URL}/api/auth/${provider}?mode=link`;
}

// ─── ADMIN LEAD MANAGEMENT API ──────────────────────────────────────────────

export type LeadStatus = "NEW" | "CONTACTED" | "PROPOSAL_SENT" | "WON" | "ARCHIVED";
export type LeadSource = "ESTIMATOR" | "QUICK_CALLBACK" | "BOOKING" | "CONTACT_FORM";
export type LeadPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface LeadAssignee {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
}

export interface LeadNoteItem {
  id: string;
  leadId: string;
  authorId: string;
  body: string;
  createdAt: string;
  author: LeadAssignee;
}

export interface LeadActivityItem {
  id: string;
  leadId: string;
  eventType: string;
  fromStatus: LeadStatus | null;
  toStatus: LeadStatus;
  details: string | null;
  actorId: string | null;
  createdAt: string;
  actor?: { id: string; name: string; email: string; role: string } | null;
}

export interface LeadRecord {
  id: string;
  source: LeadSource;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  jobTitle: string | null;
  website: string | null;
  subject: string | null;
  services: string[];
  budget: string | null;
  budgetMin: number | null;
  currency: string;
  timeline: string | null;
  brief: string | null;
  pageUrl: string | null;
  referrer: string | null;
  utm: Record<string, unknown> | null;
  status: LeadStatus;
  priority: LeadPriority;
  assignedToId: string | null;
  assignedTo?: LeadAssignee | null;
  lastContactedAt: string | null;
  nextFollowUpAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { notes: number };
  notes?: LeadNoteItem[];
  history?: LeadActivityItem[];
}

export interface AdminLeadsStatsResponse {
  dateRange: string;
  slaHours: number;
  totalInbound: number;
  awaitingSla: {
    newCount: number;
    breachingCount: number;
    slaHours: number;
  };
  activeNegotiationCount: number;
  pipelineValue: {
    estimatedTotal: number;
    leadsWithBudget: number;
    wonEstimatedTotal: number;
    wonWithBudget: number;
  };
  statusSummary: Record<LeadStatus, { count: number; budgetSum: number }>;
}

export async function apiGetAdminLeadStats(params?: {
  dateRange?: string;
  startDate?: string;
  endDate?: string;
  slaHours?: number;
}): Promise<AdminLeadsStatsResponse> {
  const sp = new URLSearchParams();
  if (params?.dateRange) sp.set("dateRange", params.dateRange);
  if (params?.startDate) sp.set("startDate", params.startDate);
  if (params?.endDate) sp.set("endDate", params.endDate);
  if (params?.slaHours) sp.set("slaHours", String(params.slaHours));
  const qs = sp.toString();
  return await apiFetch<AdminLeadsStatsResponse>(
    `/api/admin/leads/stats${qs ? `?${qs}` : ""}`
  );
}

export async function apiGetAdminLeads(params?: {
  page?: number;
  pageSize?: number;
  q?: string;
  source?: string;
  status?: string;
  priority?: string;
  assignedToId?: string;
  dateRange?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<{
  items: LeadRecord[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
  assignees: LeadAssignee[];
}> {
  const sp = new URLSearchParams();
  if (params?.page) sp.set("page", String(params.page));
  if (params?.pageSize) sp.set("pageSize", String(params.pageSize));
  if (params?.q) sp.set("q", params.q);
  if (params?.source && params.source !== "ALL") sp.set("source", params.source);
  if (params?.status && params.status !== "ALL") sp.set("status", params.status);
  if (params?.priority && params.priority !== "ALL") sp.set("priority", params.priority);
  if (params?.assignedToId && params.assignedToId !== "ALL")
    sp.set("assignedToId", params.assignedToId);
  if (params?.dateRange) sp.set("dateRange", params.dateRange);
  if (params?.startDate) sp.set("startDate", params.startDate);
  if (params?.endDate) sp.set("endDate", params.endDate);
  if (params?.sortBy) sp.set("sortBy", params.sortBy);
  if (params?.sortOrder) sp.set("sortOrder", params.sortOrder);
  const qs = sp.toString();
  return await apiFetch(`/api/admin/leads${qs ? `?${qs}` : ""}`);
}

export async function apiGetAdminLeadById(id: string): Promise<{ lead: LeadRecord }> {
  return await apiFetch(`/api/admin/leads/${encodeURIComponent(id)}`);
}

export async function apiUpdateAdminLead(
  id: string,
  payload: {
    status?: LeadStatus;
    priority?: LeadPriority;
    assignedToId?: string | null;
    nextFollowUpAt?: string | null;
  }
): Promise<{ success: boolean; lead: LeadRecord }> {
  return await apiFetch(`/api/admin/leads/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function apiBulkAdminLeads(payload: {
  leadIds: string[];
  action: "STATUS" | "ARCHIVE" | "RESTORE" | "ASSIGN";
  status?: LeadStatus;
  assignedToId?: string | null;
}): Promise<{ success: boolean; updatedCount: number; message: string }> {
  return await apiFetch("/api/admin/leads/bulk", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiAppendLeadNote(
  leadId: string,
  body: string
): Promise<{ success: boolean; note: LeadNoteItem }> {
  return await apiFetch(`/api/admin/leads/${encodeURIComponent(leadId)}/notes`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

export function getAdminLeadsExportUrl(params?: {
  format?: "csv" | "json";
  status?: string;
  source?: string;
  ids?: string[];
}): string {
  const sp = new URLSearchParams();
  sp.set("format", params?.format || "csv");
  if (params?.status && params.status !== "ALL") sp.set("status", params.status);
  if (params?.source && params.source !== "ALL") sp.set("source", params.source);
  if (params?.ids && params.ids.length > 0) sp.set("ids", params.ids.join(","));
  return `${BASE_URL}/api/admin/leads/export?${sp.toString()}`;
}

// ─── ADMIN SOCIAL INTEGRATIONS & WEBHOOKS ───────────────────────────────────

export type SocialChannelStatus =
  | "CONNECTED"
  | "DISCONNECTED"
  | "EXPIRING_SOON"
  | "EXPIRED"
  | "REAUTH_REQUIRED"
  | "ERROR"
  | "DISABLED"
  | "NOT_CONFIGURED"
  | "UNAVAILABLE";

export interface SocialChannelItem {
  key: "linkedin" | "x" | "meta" | "youtube" | "reddit" | "glassdoor";
  platform: string;
  displayName: string;
  subtitle: string;
  apiLabel: string;
  apiSupported: boolean;
  unavailableReason: string | null;
  configured: boolean;
  requiredEnvKeys: string[];
  defaultScopes: string[];
  status: SocialChannelStatus;
  isActive: boolean;
  accountName: string | null;
  accountId: string | null;
  accountHandle: string | null;
  avatarUrl: string | null;
  scopes: string[];
  keyVersion: number | null;
  tokenExpiresAt: string | null;
  connectedAt: string | null;
  lastSyncAt: string | null;
  lastHealthCheckAt: string | null;
  lastLatencyMs: number | null;
  lastError: string | null;
}

export interface SocialOverviewMetrics {
  totalChannels: number;
  connectedChannels: number;
  expiringSoonChannels: number;
  errorChannels: number;
  notConfiguredChannels: number;
  activeWebhooks: number;
  totalWebhooks: number;
  totalDeliveries24h: number;
  failedDeliveries24h: number;
  encryptionConfigured: boolean;
  encryptionKeyVersion: number;
}

export interface WebhookEndpointItem {
  id: string;
  name: string;
  url: string;
  events: string[];
  secretPrefix: string;
  keyVersion: number;
  isActive: boolean;
  lastDeliveryAt: string | null;
  lastStatusCode: number | null;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { deliveries: number };
}

export interface WebhookDeliveryItem {
  id: string;
  endpointId: string;
  eventType: string;
  payload: Record<string, unknown>;
  responseStatus: number | null;
  responseBody: string | null;
  latencyMs: number | null;
  attemptCount: number;
  status: string;
  errorMessage: string | null;
  deliveredAt: string;
  endpoint?: { id: string; name: string; url: string };
}

export interface SocialOverviewResponse {
  channels: SocialChannelItem[];
  metrics: SocialOverviewMetrics;
  webhooks: WebhookEndpointItem[];
  recentDeliveries: WebhookDeliveryItem[];
  supportedEvents: string[];
}

export interface SocialTestEndpointResult {
  key: string;
  displayName: string;
  status: string;
  ok: boolean;
  latencyMs: number | null;
  message: string;
}

export interface SocialAuditLogItem {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  meta: Record<string, unknown> | null;
  ip: string | null;
  createdAt: string;
  actor: { id: string; name: string; email: string };
}

export async function apiGetSocialOverview(): Promise<SocialOverviewResponse> {
  return await apiFetch("/api/admin/social/overview");
}

export async function apiStartSocialOAuth(key: string): Promise<{ authorizeUrl: string }> {
  return await apiFetch(`/api/admin/social/providers/${encodeURIComponent(key)}/connect`, {
    method: "POST",
  });
}

export async function apiSyncSocialProvider(
  key: string
): Promise<{ channel: SocialChannelItem }> {
  return await apiFetch(`/api/admin/social/providers/${encodeURIComponent(key)}/sync`, {
    method: "POST",
  });
}

export async function apiToggleSocialProvider(
  key: string
): Promise<{ channel: SocialChannelItem }> {
  return await apiFetch(`/api/admin/social/providers/${encodeURIComponent(key)}/toggle`, {
    method: "POST",
  });
}

export async function apiDisconnectSocialProvider(
  key: string
): Promise<{ channel: SocialChannelItem }> {
  return await apiFetch(`/api/admin/social/providers/${encodeURIComponent(key)}/disconnect`, {
    method: "POST",
  });
}

export async function apiTestAllSocialEndpoints(): Promise<{
  results: SocialTestEndpointResult[];
  checkedAt: string;
}> {
  return await apiFetch("/api/admin/social/test-all", { method: "POST" });
}

export async function apiGetSocialAuditLogs(): Promise<{ logs: SocialAuditLogItem[] }> {
  return await apiFetch("/api/admin/social/audit-logs");
}

export async function apiCreateWebhook(payload: {
  name: string;
  url: string;
  events: string[];
}): Promise<{ webhook: WebhookEndpointItem; plaintextSecret: string }> {
  return await apiFetch("/api/admin/social/webhooks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiUpdateWebhook(
  id: string,
  payload: { name?: string; url?: string; events?: string[]; isActive?: boolean }
): Promise<{ webhook: WebhookEndpointItem }> {
  return await apiFetch(`/api/admin/social/webhooks/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function apiRotateWebhookSecret(
  id: string
): Promise<{ webhook: WebhookEndpointItem; plaintextSecret: string }> {
  return await apiFetch(
    `/api/admin/social/webhooks/${encodeURIComponent(id)}/rotate-secret`,
    {
      method: "POST",
    }
  );
}

export async function apiTestWebhook(id: string): Promise<{ delivery: WebhookDeliveryItem }> {
  return await apiFetch(`/api/admin/social/webhooks/${encodeURIComponent(id)}/test`, {
    method: "POST",
  });
}

export async function apiDeleteWebhook(id: string): Promise<{ deleted: boolean; id: string }> {
  return await apiFetch(`/api/admin/social/webhooks/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function apiRetryWebhookDelivery(
  deliveryId: string
): Promise<{ delivery: WebhookDeliveryItem }> {
  return await apiFetch(
    `/api/admin/social/deliveries/${encodeURIComponent(deliveryId)}/retry`,
    {
      method: "POST",
    }
  );
}

// ─── ADMIN SOCIAL BROADCAST COMPOSER & PUBLISHING ─────────────────────────────

export type BroadcastPlatformKey =
  | "LINKEDIN"
  | "TWITTER_X"
  | "META_FACEBOOK"
  | "META_INSTAGRAM"
  | "YOUTUBE"
  | "REDDIT"
  | "GLASSDOOR";

export interface PlatformRuleSpec {
  platform: BroadcastPlatformKey;
  displayName: string;
  maxChars: number;
  urlShortenedLength: number | null;
  maxImages: number;
  maxVideos: number;
  maxImageBytes: number;
  maxVideoBytes: number;
  maxGifBytes: number;
  supportsMarkdown: boolean;
  supportsPublish: boolean;
  requiredWriteScopes: string[];
}

export interface BroadcastAccountItem {
  key: string;
  platform: BroadcastPlatformKey;
  displayName: string;
  accountName: string | null;
  accountHandle: string | null;
  avatarUrl: string | null;
  scopes: string[];
  tokenExpiresAt: string | null;
  status: string;
  canPublish: boolean;
  publishBlockReason: string | null;
  rules: PlatformRuleSpec;
}

export interface SocialMediaAssetItem {
  id: string;
  postId: string | null;
  uploadedById: string;
  publicId: string;
  secureUrl: string;
  resourceType: "image" | "video" | string;
  format: string;
  bytes: number;
  width: number | null;
  height: number | null;
  durationSec: number | null;
  fileName: string;
  altText: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface SocialDeliveryLogItem {
  id: string;
  postId: string;
  platform: BroadcastPlatformKey;
  status: string;
  externalPostId: string | null;
  externalUrl: string | null;
  latencyMs: number | null;
  attemptCount: number;
  error: { message?: string } | null;
  createdAt: string;
}

export interface SocialBroadcastPostItem {
  id: string;
  title: string | null;
  baseContent: string;
  platformContent: Record<string, string> | null;
  variables: Record<string, string> | null;
  mediaUrls: string[];
  mediaAssets: SocialMediaAssetItem[];
  targetPlatforms: BroadcastPlatformKey[];
  status:
  | "DRAFT"
  | "SCHEDULED"
  | "PROCESSING"
  | "PUBLISHED"
  | "PARTIAL_FAILED"
  | "FAILED"
  | "CANCELLED";
  scheduledFor: string | null;
  timezone: string | null;
  publishedAt: string | null;
  cancelledAt: string | null;
  deliveryLogs: SocialDeliveryLogItem[];
  createdAt: string;
  author?: { id: string; name: string; email: string };
}

export interface BroadcastContextResponse {
  accounts: BroadcastAccountItem[];
  aiStatus: { configured: boolean; provider: string; model: string };
  defaultVariables: Record<string, string>;
  allowedVariables: string[];
  recentBroadcasts: SocialBroadcastPostItem[];
}

export async function apiGetBroadcastContext(): Promise<BroadcastContextResponse> {
  return await apiFetch("/api/admin/social/broadcasts/context");
}

export async function apiSignSocialMediaUpload(
  resourceType: "image" | "video" = "image"
): Promise<{
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  publicId: string;
  resourceType: "image" | "video";
  allowedFormats: string;
  maxFileSizeBytes: number;
}> {
  return await apiFetch("/api/admin/social/broadcasts/media/sign", {
    method: "POST",
    body: JSON.stringify({ resourceType }),
  });
}

export async function apiVerifySocialMediaAsset(payload: {
  publicId: string;
  resourceType: "image" | "video";
  fileName: string;
  altText?: string;
}): Promise<{ asset: SocialMediaAssetItem }> {
  return await apiFetch("/api/admin/social/broadcasts/media/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiUpdateSocialMediaAsset(
  assetId: string,
  payload: { altText?: string; sortOrder?: number }
): Promise<{ asset: SocialMediaAssetItem }> {
  return await apiFetch(
    `/api/admin/social/broadcasts/media/${encodeURIComponent(assetId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
}

export async function apiDeleteSocialMediaAsset(
  assetId: string
): Promise<{ deleted: boolean }> {
  return await apiFetch(
    `/api/admin/social/broadcasts/media/${encodeURIComponent(assetId)}`,
    {
      method: "DELETE",
    }
  );
}

export async function apiAdaptSocialCopyWithAi(payload: {
  content: string;
  action:
  | "shorten_x"
  | "technical_linkedin"
  | "format_reddit"
  | "generate_hashtags"
  | "improve_clarity"
  | "rewrite_platform";
  targetPlatform: BroadcastPlatformKey;
}): Promise<{
  suggestion: string;
  targetPlatform: BroadcastPlatformKey;
  charCount: number;
  maxChars: number;
}> {
  return await apiFetch("/api/admin/social/broadcasts/ai/adapt", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiCreateBroadcast(payload: {
  title?: string;
  baseContent: string;
  platformContent?: Record<string, string>;
  variables?: Record<string, string>;
  targetPlatforms: BroadcastPlatformKey[];
  mediaAssetIds: string[];
  mode: "IMMEDIATE" | "SCHEDULE" | "DRAFT";
  scheduledFor?: string;
  timezone?: string;
}): Promise<{ broadcast: SocialBroadcastPostItem }> {
  return await apiFetch("/api/admin/social/broadcasts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiCancelScheduledBroadcast(
  id: string
): Promise<{ broadcast: SocialBroadcastPostItem }> {
  return await apiFetch(
    `/api/admin/social/broadcasts/${encodeURIComponent(id)}/cancel`,
    {
      method: "POST",
    }
  );
}

export async function apiRetryBroadcast(
  id: string
): Promise<{ broadcast: SocialBroadcastPostItem }> {
  return await apiFetch(
    `/api/admin/social/broadcasts/${encodeURIComponent(id)}/retry`,
    {
      method: "POST",
    }
  );
}

// ─── ADMIN SOCIAL MANAGEMENT ──────────────────────────────────────────────────

export interface SocialManageAnalyticsResponse {
  analytics: {
    totalDispatches: number;
    successfulDeliveries: number;
    eligibleDeliveries: number;
    successRate: number | null;
    pendingScheduledCount: number;
    failedCount: number;
    statusCounts: Record<string, number>;
    nextScheduled: { id: string; scheduledFor: string; timezone: string | null } | null;
  };
  failedAlert: {
    affectedDeliveriesCount: number;
    affectedBroadcastIds: string[];
    affectedPlatforms: string[];
    latestFailureAt: string | null;
    errors: string[];
  };
  platformHealth: Array<{
    key: string;
    platform: BroadcastPlatformKey;
    displayName: string;
    status: string;
    accountName: string | null;
    lastHealthCheckAt: string | null;
    lastLatencyMs: number | null;
    lastError: string | null;
    canPublish: boolean;
  }>;
  diagnostics: {
    workerActive: boolean;
    pollIntervalSeconds: number;
    lastHeartbeatAt: string | null;
    lastTickDurationMs: number | null;
    pendingCount: number;
    processingCount: number;
    failedDeliveriesCount: number;
    nextScheduled: { id: string; scheduledFor: string; timezone: string | null } | null;
  };
}

export async function apiGetSocialManageAnalytics(
  dateRange = "30d"
): Promise<SocialManageAnalyticsResponse> {
  return await apiFetch(
    `/api/admin/social/manage/analytics?dateRange=${encodeURIComponent(dateRange)}`
  );
}

export async function apiListManagedBroadcasts(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  platform?: string;
  dateRange?: string;
}): Promise<{
  items: SocialBroadcastPostItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const sp = new URLSearchParams();
  if (params.page) sp.set("page", String(params.page));
  if (params.limit) sp.set("limit", String(params.limit));
  if (params.search) sp.set("search", params.search);
  if (params.status && params.status !== "ALL") sp.set("status", params.status);
  if (params.platform && params.platform !== "ALL") sp.set("platform", params.platform);
  if (params.dateRange) sp.set("dateRange", params.dateRange);
  return await apiFetch(`/api/admin/social/manage/broadcasts?${sp.toString()}`);
}

export async function apiDeleteManagedBroadcast(id: string): Promise<{ deleted: boolean }> {
  return await apiFetch(
    `/api/admin/social/manage/broadcasts/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );
}

export async function apiRetryAllFailedBroadcasts(): Promise<{ retriedCount: number }> {
  return await apiFetch("/api/admin/social/manage/retry-failed", { method: "POST" });
}

export function getSocialManageExportUrl(status = "ALL"): string {
  return `${BASE_URL}/api/admin/social/manage/export?status=${encodeURIComponent(status)}`;
}

// ─── ADMIN USERS & IAM ────────────────────────────────────────────────────────

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: "USER" | "CLIENT" | "EDITOR" | "SUPER_ADMIN";
  permissions: string[];
  isActive: boolean;
  emailVerified: boolean;
  authProvider: string;
  lastLoginAt: string | null;
  createdAt: string;
  activeSessionCount: number;
}

export interface AdminUsersListResponse {
  items: AdminUserRecord[];
  pendingInvitations: Array<{
    id: string;
    email: string;
    name: string;
    role: string;
    expiresAt: string;
    createdAt: string;
  }>;
  stats: {
    totalUsers: number;
    activeToday: number;
    pendingVerification: number;
    pendingInvitationsCount: number;
  };
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function apiListAdminUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}): Promise<AdminUsersListResponse> {
  const sp = new URLSearchParams();
  if (params.page) sp.set("page", String(params.page));
  if (params.limit) sp.set("limit", String(params.limit));
  if (params.search) sp.set("search", params.search);
  if (params.role && params.role !== "ALL") sp.set("role", params.role);
  if (params.status && params.status !== "ALL") sp.set("status", params.status);
  return await apiFetch(`/api/admin/users?${sp.toString()}`);
}

export async function apiGetAdminUserDetail(id: string): Promise<{
  user: AdminUserRecord & {
    sessions: Array<{
      id: string;
      ip: string | null;
      userAgent: string | null;
      expiresAt: string;
      createdAt: string;
    }>;
    authEvents: Array<{
      id: string;
      type: string;
      status: string;
      ip: string | null;
      createdAt: string;
    }>;
  };
  auditLogs: Array<{
    id: string;
    action: string;
    entity: string;
    entityId: string;
    meta: Record<string, unknown> | null;
    createdAt: string;
  }>;
}> {
  return await apiFetch(`/api/admin/users/${encodeURIComponent(id)}`);
}

export async function apiInviteAdminUser(payload: {
  name: string;
  email: string;
  role: string;
  message?: string;
}): Promise<{ invitation: Record<string, unknown>; emailDelivered: boolean }> {
  return await apiFetch("/api/admin/users/invite", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiChangeUserRole(
  id: string,
  role: string
): Promise<{ user: AdminUserRecord }> {
  return await apiFetch(`/api/admin/users/${encodeURIComponent(id)}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

export async function apiToggleUserActive(
  id: string,
  isActive: boolean,
  reason?: string
): Promise<{ user: AdminUserRecord }> {
  return await apiFetch(`/api/admin/users/${encodeURIComponent(id)}/status`, {
    method: "POST",
    body: JSON.stringify({ isActive, reason }),
  });
}

export async function apiRevokeUserSessions(id: string): Promise<{ revokedCount: number }> {
  return await apiFetch(`/api/admin/users/${encodeURIComponent(id)}/revoke-sessions`, {
    method: "POST",
  });
}

export async function apiResendUserVerification(id: string): Promise<{ sent: boolean }> {
  return await apiFetch(`/api/admin/users/${encodeURIComponent(id)}/resend-verification`, {
    method: "POST",
  });
}

export function getAdminUsersExportUrl(): string {
  return `${BASE_URL}/api/admin/users/export`;
}

// ─── ADMIN AUDIT LOG ──────────────────────────────────────────────────────────

export interface AuditLogRecord {
  id: string;
  actorId: string;
  actor: { id: string; name: string; email: string; role: string };
  action: string;
  entity: string;
  entityId: string;
  meta: Record<string, unknown> | null;
  ip: string | null;
  createdAt: string;
}

export async function apiGetAuditStats(window = "7d"): Promise<{
  stats: {
    mutations24h: number;
    privilegedChanges: number;
    accessDenialsAndFailures: number;
    integrityStatus: string;
    integrityNote: string;
  };
}> {
  return await apiFetch(`/api/admin/audit/stats?window=${encodeURIComponent(window)}`);
}

export async function apiGetAuditFilters(): Promise<{
  actions: string[];
  entities: string[];
  actors: Array<{ id: string; name: string; email: string }>;
}> {
  return await apiFetch("/api/admin/audit/filters");
}

export async function apiListAuditLogs(params: {
  page?: number;
  limit?: number;
  search?: string;
  actorId?: string;
  action?: string;
  entity?: string;
  window?: string;
  since?: string;
}): Promise<{
  items: AuditLogRecord[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const sp = new URLSearchParams();
  if (params.page) sp.set("page", String(params.page));
  if (params.limit) sp.set("limit", String(params.limit));
  if (params.search) sp.set("search", params.search);
  if (params.actorId) sp.set("actorId", params.actorId);
  if (params.action) sp.set("action", params.action);
  if (params.entity) sp.set("entity", params.entity);
  if (params.window) sp.set("window", params.window);
  if (params.since) sp.set("since", params.since);
  return await apiFetch(`/api/admin/audit?${sp.toString()}`);
}

export function getAdminAuditExportUrl(): string {
  return `${BASE_URL}/api/admin/audit/export`;
}

// ─── ADMIN SETTINGS ───────────────────────────────────────────────────────────

export async function apiGetAdminSettings(): Promise<{
  settings: Record<string, unknown>;
}> {
  return await apiFetch("/api/admin/settings");
}

export async function apiUpdateAdminSettings(
  payload: Record<string, unknown>
): Promise<{ settings: Record<string, unknown> }> {
  return await apiFetch("/api/admin/settings", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function apiRunSettingsHealthCheck(): Promise<{
  checkedAt: string;
  integrations: Array<{
    key: string;
    name: string;
    category: string;
    status: string;
    latencyMs: number | null;
    detail: string;
  }>;
}> {
  return await apiFetch("/api/admin/settings/health-check", { method: "POST" });
}

// ─── ADMIN MEDIA LIBRARY ──────────────────────────────────────────────────────

export type MediaLibraryItem = SocialMediaAssetItem & {
  tags: string[];
  post?: { id: string; title: string | null; status: string } | null;
};

export async function apiListMediaLibrary(params: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  usage?: string;
  sort?: string;
}): Promise<{
  items: MediaLibraryItem[];
  stats: { totalAssets: number; totalBytes: number; usedAssets: number; unusedAssets: number };
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const sp = new URLSearchParams();
  if (params.page) sp.set("page", String(params.page));
  if (params.limit) sp.set("limit", String(params.limit));
  if (params.search) sp.set("search", params.search);
  if (params.type) sp.set("type", params.type);
  if (params.usage) sp.set("usage", params.usage);
  if (params.sort) sp.set("sort", params.sort);
  return await apiFetch(`/api/admin/media?${sp.toString()}`);
}

export async function apiUpdateMediaLibraryAsset(
  id: string,
  payload: { altText?: string; tags?: string[] }
): Promise<{ asset: MediaLibraryItem }> {
  return await apiFetch(`/api/admin/media/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteMediaLibraryAsset(id: string): Promise<{ deleted: boolean }> {
  return await apiFetch(`/api/admin/media/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function getMediaManifestExportUrl(): string {
  return `${BASE_URL}/api/admin/media/export`;
}

// ─── ADMIN CONTENT OPERATIONS ─────────────────────────────────────────────────

export interface AdminTestimonialItem {
  id: string;
  authorName: string;
  company: string | null;
  role: string | null;
  quote: string;
  rating: number | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  featured: boolean;
  createdAt: string;
}

export async function apiGetContentOverview(): Promise<{
  stats: {
    publishedArticles: number;
    draftArticles: number;
    approvedTestimonials: number;
    pendingTestimonials: number;
    openJobs: number;
    pendingApplications: number;
  };
  recentTestimonials: AdminTestimonialItem[];
  recentJobs: Array<{
    id: string;
    title: string;
    department: string;
    location: string;
    status: string;
    _count: { applications: number };
  }>;
  recentApplications: Array<{
    id: string;
    name: string;
    email: string;
    status: string;
    createdAt: string;
    job: { id: string; title: string };
  }>;
}> {
  return await apiFetch("/api/admin/content/overview");
}

export async function apiListAdminTestimonials(): Promise<{
  items: AdminTestimonialItem[];
}> {
  return await apiFetch("/api/admin/content/testimonials");
}

export async function apiCreateAdminTestimonial(payload: {
  authorName: string;
  company?: string;
  role?: string;
  quote: string;
  rating?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
}): Promise<{ testimonial: AdminTestimonialItem }> {
  return await apiFetch("/api/admin/content/testimonials", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiUpdateAdminTestimonial(
  id: string,
  payload: Partial<{ status: "PENDING" | "APPROVED" | "REJECTED"; featured: boolean; quote: string }>
): Promise<{ testimonial: AdminTestimonialItem }> {
  return await apiFetch(`/api/admin/content/testimonials/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteAdminTestimonial(id: string): Promise<{ deleted: boolean }> {
  return await apiFetch(`/api/admin/content/testimonials/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export function getContentCatalogExportUrl(): string {
  return `${BASE_URL}/api/admin/content/export`;
}

export async function apiGetManagedBroadcastDetail(id: string): Promise<{
  broadcast: SocialBroadcastPostItem;
  auditLogs: Array<{
    id: string;
    action: string;
    actorId: string;
    meta: Record<string, unknown> | null;
    createdAt: string;
  }>;
}> {
  return await apiFetch(`/api/admin/social/manage/broadcasts/${encodeURIComponent(id)}`);
}

export async function apiUpdateManagedBroadcast(
  id: string,
  payload: { scheduledFor?: string; timezone?: string; baseContent?: string }
): Promise<{ broadcast: SocialBroadcastPostItem }> {
  return await apiFetch(
    `/api/admin/social/manage/broadcasts/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
}

export async function apiBulkAdminUsers(payload: {
  userIds: string[];
  action: "REVOKE_SESSIONS" | "DEACTIVATE" | "CHANGE_ROLE";
  role?: string;
}): Promise<{ succeeded: number; skipped: Array<{ id: string; reason: string }> }> {
  return await apiFetch("/api/admin/users/bulk", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiReplaceMediaLibraryAsset(
  id: string,
  payload: { publicId: string; resourceType: "image" | "video"; fileName?: string }
): Promise<{ asset: MediaLibraryItem }> {
  return await apiFetch(`/api/admin/media/${encodeURIComponent(id)}/replace`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiCreateAdminService(payload: {
  title: string;
  summary: string;
  deliverables: string[];
  icon?: string;
  displayOrder?: number;
}): Promise<{ service: RawBackendService }> {
  return await apiFetch("/api/admin/content/services", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteAdminService(
  id: string
): Promise<{ deleted: boolean; id: string }> {
  return await apiFetch(`/api/admin/content/services/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export type {
  ShowcaseItem,
  ProjectItem,
  ServiceItem,
  TestimonialItem,
  ContactSettings,
  BentoProofItem,
  LifecycleStage,
  EngagementTier,
  JobItem,
  JobApplicationPayload,
  SubmittedApplicationItem,
  AboutGeneralContent,
  EngineeringPrincipleItem,
  TeamMemberItem,
  BlogArticleItem,
  BlogCategoryItem,
  BlogAuthorItem,
  NewsletterSubscriberItem,
  BlogHeroConfig,
};