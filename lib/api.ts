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

// ─── ENVELOPE TYPES ──────────────────────────────────────────────────────────
type ApiOk<T> = { data: T; message?: string };
type ApiError = { error: { code: string; message: string; fields?: Record<string, string> } };
type ApiResult<T> = ApiOk<T> | ApiError | T;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const USE_MOCK = !BASE_URL;

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const signal = init?.signal || (AbortSignal.timeout ? AbortSignal.timeout(30000) : undefined);
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    signal,
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

// ─── ABOUT & TEAM APIS ─────────────────────────────────────────────────────────

export async function getAboutContent(): Promise<AboutGeneralContent> {
  if (USE_MOCK) return IN_MEMORY_ABOUT_CONTENT;
  try {
    return await apiFetch<AboutGeneralContent>("/api/public/about");
  } catch (err) {
    console.warn("[api] Failed to fetch about content from backend, using fallback data:", err);
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
    IN_MEMORY_ENGINEERING_PRINCIPLES[idx] = { ...IN_MEMORY_ENGINEERING_PRINCIPLES[idx], ...payload };
  }
  if (!USE_MOCK) {
    try {
      return await apiFetch<EngineeringPrincipleItem>(`/api/admin/about/principles/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    } catch {
      // ignore
    }
  }
  return idx !== -1 ? IN_MEMORY_ENGINEERING_PRINCIPLES[idx] : (payload as EngineeringPrincipleItem);
}

export async function deleteEngineeringPrinciple(id: string): Promise<boolean> {
  const idx = IN_MEMORY_ENGINEERING_PRINCIPLES.findIndex((p) => p.id === id);
  if (idx !== -1) {
    IN_MEMORY_ENGINEERING_PRINCIPLES.splice(idx, 1);
  }
  if (!USE_MOCK) {
    try {
      await apiFetch(`/api/admin/about/principles/${id}`, { method: "DELETE" });
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
      return await apiFetch<TeamMemberItem>(`/api/admin/about/team/${id}`, {
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
      await apiFetch(`/api/admin/about/team/${id}`, { method: "DELETE" });
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
  // Convert to Base64 data URL for instant client preview and offline persistence
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// ─── BLOG & TECHNICAL CMS ──────────────────────────────────────────────────

const IS_SERVER = !USE_MOCK;

export async function getBlogHeroConfig(): Promise<BlogHeroConfig> {
  if (IS_SERVER) {
    try {
      const res = await apiFetch<BlogHeroConfig>("/api/public/blog/hero");
      if (res) return res;
    } catch {
      // fallback to memory
    }
  }
  return { ...IN_MEMORY_BLOG_HERO_CONFIG };
}

export async function updateBlogHeroConfig(config: Partial<BlogHeroConfig>): Promise<BlogHeroConfig> {
  Object.assign(IN_MEMORY_BLOG_HERO_CONFIG, config);
  if (!IS_SERVER) {
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
  if (IS_SERVER) {
    try {
      const res = await apiFetch<BlogCategoryItem[]>("/api/public/blog/categories");
      if (res) return res;
    } catch {
      // fallback
    }
  }
  // Calculate counts dynamically from articles
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
  if (!IS_SERVER) {
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
  if (!IS_SERVER) {
    try {
      const res = await apiFetch<BlogCategoryItem>(`/api/admin/blog/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
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
  if (!IS_SERVER) {
    try {
      await apiFetch(`/api/admin/blog/categories/${id}`, { method: "DELETE" });
    } catch {
      // ignore
    }
  }
  return true;
}

export async function getBlogAuthors(): Promise<BlogAuthorItem[]> {
  if (IS_SERVER) {
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
  if (!IS_SERVER) {
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
  if (!IS_SERVER) {
    try {
      const res = await apiFetch<BlogAuthorItem>(`/api/admin/blog/authors/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
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
  if (!IS_SERVER) {
    try {
      await apiFetch(`/api/admin/blog/authors/${id}`, { method: "DELETE" });
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
  if (IS_SERVER) {
    try {
      const query = new URLSearchParams();
      if (params?.category) query.set("category", params.category);
      if (params?.tag) query.set("tag", params.tag);
      if (params?.search) query.set("search", params.search);
      if (params?.sort) query.set("sort", params.sort);
      if (params?.status) query.set("status", params.status);
      const res = await apiFetch<BlogArticleItem[]>(`/api/public/blog?${query.toString()}`);
      if (res) return res;
    } catch {
      // fallback
    }
  }

  let list = [...IN_MEMORY_BLOG_ARTICLES];

  // Status filter (defaults to PUBLISHED for public view unless ALL is requested)
  if (params?.status === "DRAFT") {
    list = list.filter((a) => a.status === "DRAFT");
  } else if (params?.status !== "ALL") {
    list = list.filter((a) => a.status === "PUBLISHED");
  }

  // Category filter
  if (params?.category && params.category !== "all") {
    const cat = params.category.toLowerCase();
    list = list.filter(
      (a) => a.category.toLowerCase() === cat || a.categorySlug?.toLowerCase() === cat
    );
  }

  // Tag filter
  if (params?.tag) {
    const t = params.tag.toLowerCase();
    list = list.filter((a) => a.tags.some((tag) => tag.toLowerCase() === t));
  }

  // Search filter
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

  // Sorting
  if (params?.sort === "oldest") {
    list.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
  } else if (params?.sort === "readingTime") {
    list.sort((a, b) => a.readingMinutes - b.readingMinutes);
  } else {
    // Newest first
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
  if (IS_SERVER) {
    try {
      const res = await apiFetch<BlogArticleItem>(`/api/public/blog/${slug}`);
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

  if (!IS_SERVER) {
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
  if (!IS_SERVER) {
    try {
      const res = await apiFetch<BlogArticleItem>(`/api/admin/blog/articles/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
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
  if (!IS_SERVER) {
    try {
      await apiFetch(`/api/admin/blog/articles/${id}`, { method: "DELETE" });
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

  if (!IS_SERVER) {
    try {
      const res = await apiFetch<{ success: boolean; message: string; subscriber?: NewsletterSubscriberItem }>(
        "/api/public/newsletter/subscribe",
        {
          method: "POST",
          body: JSON.stringify({ email: normalized, source }),
        }
      );
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

  if (!IS_SERVER) {
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
  if (IS_SERVER) {
    try {
      const res = await apiFetch<NewsletterSubscriberItem[]>("/api/admin/newsletter/subscribers");
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
  if (!IS_SERVER) {
    try {
      await apiFetch(`/api/admin/newsletter/subscribers/${id}`, { method: "DELETE" });
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
  if (!IS_SERVER) {
    try {
      const res = await apiFetch<NewsletterSubscriberItem>(`/api/admin/newsletter/subscribers/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
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

// Mock in-memory session for offline preview / fallback
let IN_MEMORY_CURRENT_USER: AuthUser | null = null;

export async function apiSignUp(payload: {
  name: string;
  email: string;
  password: string;
  termsAccepted: boolean;
}): Promise<{ success: boolean; message: string; email: string }> {
  if (!USE_MOCK) {
    return await apiFetch<{ success: boolean; message: string; email: string }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // Fallback in-memory
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
    return await apiFetch<{ success: boolean; user: AuthUser; redirectUrl: string }>("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // Fallback in-memory
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

export async function apiGetVerificationStatus(email: string): Promise<VerificationStatusResponse> {
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
    return await apiFetch<{ success: boolean; message: string; attemptsLeft?: number }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(payload),
    });
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
    return await apiFetch<{ success: boolean; message: string; cooldownSeconds?: number; resendsLeft?: number }>(
      "/api/auth/resend-verification",
      {
        method: "POST",
        body: JSON.stringify({ email }),
      }
    );
  }
  return { success: true, message: "A fresh verification link and security code have been sent." };
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

export async function apiVerifyResetOtp(email: string, otp: string): Promise<VerifyResetOtpResponse> {
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
  metadata?: Record<string, any> | null;
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
