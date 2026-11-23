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
} from "./mock/data";

// ─── ENVELOPE TYPES ──────────────────────────────────────────────────────────
type ApiOk<T> = { data: T; message?: string };
type ApiError = { error: { code: string; message: string; fields?: Record<string, string> } };
type ApiResult<T> = ApiOk<T> | ApiError | T;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const USE_MOCK = !BASE_URL;

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...init,
  });

  if (!res.ok) {
    let errorMsg = `HTTP ${res.status}: ${res.statusText}`;
    try {
      const errJson = await res.json();
      if (errJson?.error?.message) errorMsg = errJson.error.message;
      else if (errJson?.message) errorMsg = errJson.message;
    } catch {
      // response was not JSON
    }
    throw new Error(errorMsg);
  }

  const json: any = await res.json();
  if (json && typeof json === "object" && "data" in json) {
    return json.data as T;
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

  try {
    const q = new URLSearchParams();
    if (params.limit) q.set("limit", String(params.limit));
    if (params.cursor) q.set("cursor", params.cursor);
    if (params.category) q.set("category", params.category);
    return await apiFetch<ShowcaseListResult>(`/api/public/showcase?${q}`);
  } catch (err) {
    console.warn("[api] Failed to fetch showcase list from backend, using fallback data:", err);
    return { items: MOCK_SHOWCASE.slice(0, params.limit || 6), total: MOCK_SHOWCASE.length };
  }
}

export async function getShowcaseBySlug(slug: string): Promise<ShowcaseItem | null> {
  if (USE_MOCK) return MOCK_SHOWCASE.find((s) => s.slug === slug) ?? null;
  try {
    return await apiFetch<ShowcaseItem>(`/api/public/showcase/${slug}`);
  } catch (err) {
    console.warn(`[api] Failed to fetch showcase ${slug} from backend:`, err);
    return MOCK_SHOWCASE.find((s) => s.slug === slug) ?? null;
  }
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

  try {
    const q = new URLSearchParams();
    if (params.limit) q.set("limit", String(params.limit));
    if (params.cursor) q.set("cursor", params.cursor);
    if (params.category) q.set("category", params.category);
    if (params.tech) q.set("tech", params.tech);
    return await apiFetch<ProjectListResult>(`/api/public/projects?${q}`);
  } catch (err) {
    console.warn("[api] Failed to fetch project list from backend, using fallback data:", err);
    return { items: MOCK_PROJECTS.slice(0, params.limit || 6), total: MOCK_PROJECTS.length };
  }
}

export async function getProjectBySlug(slug: string): Promise<ProjectItem | null> {
  if (USE_MOCK) return MOCK_PROJECTS.find((p) => p.slug === slug) ?? null;
  try {
    return await apiFetch<ProjectItem>(`/api/public/projects/${slug}`);
  } catch (err) {
    console.warn(`[api] Failed to fetch project ${slug} from backend:`, err);
    return MOCK_PROJECTS.find((p) => p.slug === slug) ?? null;
  }
}

// ─── SERVICES & CAPABILITIES ──────────────────────────────────────────────────
export async function getServices(): Promise<ServiceItem[]> {
  if (USE_MOCK) return MOCK_SERVICES;
  try {
    const raw = await apiFetch<any[]>("/api/public/services");
    if (Array.isArray(raw) && raw.length > 0) {
      // Map Prisma backend Service model into frontend ServiceItem
      return raw.map((item, idx) => ({
        id: item.id || String(idx + 1),
        title: item.title,
        description: item.summary || item.description || "",
        features: item.deliverables || item.features || [],
        deliverables: item.deliverables || item.features || [],
        icon: item.icon || "Code2",
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
    console.warn("[api] Failed to fetch services from backend, using fallback data:", err);
    return MOCK_SERVICES;
  }
}

export async function getLifecycleStages(): Promise<LifecycleStage[]> {
  if (USE_MOCK) return MOCK_LIFECYCLE_STAGES;
  try {
    const raw = await apiFetch<LifecycleStage[]>("/api/public/lifecycle-stages");
    if (Array.isArray(raw) && raw.length > 0) return raw;
    return MOCK_LIFECYCLE_STAGES;
  } catch (err) {
    return MOCK_LIFECYCLE_STAGES;
  }
}

export async function getEngagementTiers(): Promise<EngagementTier[]> {
  if (USE_MOCK) return MOCK_ENGAGEMENT_TIERS;
  try {
    const raw = await apiFetch<EngagementTier[]>("/api/public/engagement-tiers");
    if (Array.isArray(raw) && raw.length > 0) return raw;
    return MOCK_ENGAGEMENT_TIERS;
  } catch (err) {
    return MOCK_ENGAGEMENT_TIERS;
  }
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
export async function getTestimonials(): Promise<TestimonialItem[]> {
  if (USE_MOCK) return MOCK_TESTIMONIALS;
  try {
    return await apiFetch<TestimonialItem[]>("/api/public/testimonials");
  } catch (err) {
    console.warn("[api] Failed to fetch testimonials from backend, using fallback data:", err);
    return MOCK_TESTIMONIALS;
  }
}

// ─── CONTACT SETTINGS ─────────────────────────────────────────────────────────
export async function getContactSettings(): Promise<ContactSettings> {
  if (USE_MOCK) return MOCK_CONTACT_SETTINGS;
  try {
    const raw = await apiFetch<any>("/api/public/contact-settings");
    if (raw) {
      return {
        whatsappNumber: raw.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
        phone: raw.phone || process.env.NEXT_PUBLIC_PHONE || "",
        email: raw.publicEmail || raw.email || process.env.NEXT_PUBLIC_EMAIL || "",
        businessHoursStart: raw.businessHours?.start ?? 9,
        businessHoursEnd: raw.businessHours?.end ?? 18,
        timezone: raw.timezone || "Asia/Dhaka",
        callbackPromise: raw.callbackPromise || "We reply within 1 business hour",
        bookingUrl: raw.bookingUrl || process.env.NEXT_PUBLIC_BOOKING_URL || "",
        isOpenNow: (() => {
          const now = new Date();
          const h = now.getHours();
          return h >= (raw.businessHours?.start ?? 9) && h < (raw.businessHours?.end ?? 18);
        })(),
      };
    }
    return MOCK_CONTACT_SETTINGS;
  } catch (err) {
    console.warn("[api] Failed to fetch contact settings from backend, using fallback:", err);
    return MOCK_CONTACT_SETTINGS;
  }
}

// ─── BENTO PROOF ─────────────────────────────────────────────────────────────
export async function getBentoProof(): Promise<BentoProofItem[]> {
  if (USE_MOCK) return MOCK_BENTO_PROOF;
  try {
    return await apiFetch<BentoProofItem[]>("/api/public/bento-proof");
  } catch (err) {
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

export async function submitLead(payload: LeadPayload): Promise<{ id: string; reference?: string }> {
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

  // Mapped to match backend Prisma model Lead
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

  // Map to Prisma ContactEventType enum
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
    }).catch(() => {});
  }
}

// ─── CAREERS & OPEN ROLES ────────────────────────────────────────────────────
export async function getJobs(params?: { status?: "OPEN" | "CLOSED" | "ALL" }): Promise<JobItem[]> {
  const filterStatus = params?.status || "OPEN";
  if (USE_MOCK) {
    if (filterStatus === "ALL") return MOCK_JOBS;
    return MOCK_JOBS.filter((j) => j.status === filterStatus);
  }

  try {
    const raw = await apiFetch<any[]>("/api/public/jobs");
    if (Array.isArray(raw) && raw.length > 0) {
      // Map Prisma backend Job model to frontend JobItem
      const mapped: JobItem[] = raw.map((j) => ({
        id: j.id,
        slug: j.slug || j.id,
        title: j.title,
        department: j.department || "Engineering",
        location: j.location || "Dhaka / Remote",
        type: j.type || "Full-time",
        workplaceType: (j.workplaceType as "Remote" | "Hybrid" | "On-site") || "Remote",
        description: j.description || "",
        skills: Array.isArray(j.skills) ? j.skills : [],
        responsibilities: Array.isArray(j.responsibilities) ? j.responsibilities : [],
        requirements: Array.isArray(j.requirements) ? j.requirements : [],
        salary: j.salary,
        status: (j.status as "OPEN" | "CLOSED") || "OPEN",
        createdAt: j.createdAt,
      }));
      if (filterStatus === "ALL") return mapped;
      return mapped.filter((j) => j.status === filterStatus);
    }
    if (filterStatus === "ALL") return MOCK_JOBS;
    return MOCK_JOBS.filter((j) => j.status === filterStatus);
  } catch (err) {
    console.warn("[api] Failed to fetch jobs from backend, using default active roles:", err);
    if (filterStatus === "ALL") return MOCK_JOBS;
    return MOCK_JOBS.filter((j) => j.status === filterStatus);
  }
}

export async function getJobById(id: string): Promise<JobItem | null> {
  if (USE_MOCK) {
    return MOCK_JOBS.find((j) => j.id === id || j.slug === id) ?? null;
  }
  try {
    const j: any = await apiFetch<any>(`/api/public/jobs/${id}`);
    if (j) {
      return {
        id: j.id,
        slug: j.slug || j.id,
        title: j.title,
        department: j.department || "Engineering",
        location: j.location || "Dhaka / Remote",
        type: j.type || "Full-time",
        workplaceType: (j.workplaceType as "Remote" | "Hybrid" | "On-site") || "Remote",
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
  } catch (err) {
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

  // Format payload for backend JobApplication endpoint
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
  } catch (err: any) {
    throw new Error(err.message || "Could not submit candidacy. Please check details and retry.");
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

export async function updateJobStatus(jobId: string, status: "OPEN" | "CLOSED"): Promise<boolean> {
  const target = MOCK_JOBS.find((j) => j.id === jobId);
  if (target) target.status = status;
  if (!USE_MOCK) {
    try {
      await apiFetch(`/api/admin/jobs/${jobId}/status`, {
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
      await apiFetch(`/api/admin/applications/${appId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
    } catch {
      // ignore
    }
  }
  return true;
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
};
