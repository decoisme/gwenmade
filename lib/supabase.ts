import { defaultSiteContent, type ClientLogo, type PortfolioProject, type SiteContent } from "@/app/site-content";

const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const sessionStorageKey = "gwenmade-supabase-session";

export const isSupabaseConfigured = Boolean(projectUrl && anonKey);

type SupabaseSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  expires_in?: number;
  user: { id: string; email?: string };
};

function endpoint(path: string) {
  if (!projectUrl || !anonKey) throw new Error("Add your Supabase URL and anon key to the environment first.");
  return `${projectUrl}${path}`;
}

function publicHeaders() {
  if (!anonKey) throw new Error("Supabase is not configured.");
  const headers: Record<string, string> = { apikey: anonKey };
  if (!anonKey.startsWith("sb_publishable_")) headers.Authorization = `Bearer ${anonKey}`;
  return headers;
}

async function safeJson<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.message || body?.msg || body?.error_description || body?.error || `Supabase request failed (${response.status})`;
    throw new Error(message);
  }
  return body as T;
}

export async function getPublicSiteContent(): Promise<SiteContent> {
  if (!isSupabaseConfigured) return defaultSiteContent;
  try {
    const query = "?id=eq.main&select=content&limit=1";
    const response = await fetch(endpoint(`/rest/v1/site_content${query}`), { headers: publicHeaders(), cache: "no-store" });
    const rows = await safeJson<{ content: SiteContent }[]>(response);
    return rows[0]?.content ?? defaultSiteContent;
  } catch (error) {
    console.error("Could not load GwenMade site content from Supabase.", error);
    return defaultSiteContent;
  }
}

export async function getPublishedClientLogos(): Promise<ClientLogo[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const query = "?select=id,name,logo_url,website_url,sort_order,published&published=eq.true&order=sort_order.asc,created_at.asc";
    const response = await fetch(endpoint(`/rest/v1/client_logos${query}`), { headers: publicHeaders(), cache: "no-store" });
    return await safeJson<ClientLogo[]>(response);
  } catch (error) {
    console.error("Could not load GwenMade client logos from Supabase.", error);
    return [];
  }
}

export async function getPublishedProjects(): Promise<PortfolioProject[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const query = "?select=id,title_id,title_en,description_id,description_en,category_id,category_en,client,year,cover_image,project_url,sort_order,published&published=eq.true&order=sort_order.asc,created_at.desc";
    const response = await fetch(endpoint(`/rest/v1/portfolio_projects${query}`), { headers: publicHeaders(), cache: "no-store" });
    return await safeJson<PortfolioProject[]>(response);
  } catch (error) {
    console.error("Could not load GwenMade portfolio projects from Supabase.", error);
    return [];
  }
}

function getStoredSession(): SupabaseSession | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(sessionStorageKey);
    return stored ? JSON.parse(stored) as SupabaseSession : null;
  } catch {
    return null;
  }
}

function storeSession(session: SupabaseSession | null) {
  if (typeof window === "undefined") return;
  if (session) window.localStorage.setItem(sessionStorageKey, JSON.stringify(session));
  else window.localStorage.removeItem(sessionStorageKey);
}

async function refreshSession(session: SupabaseSession): Promise<SupabaseSession> {
  const response = await fetch(endpoint("/auth/v1/token?grant_type=refresh_token"), {
    method: "POST",
    headers: { ...publicHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  const refreshed = await safeJson<SupabaseSession>(response);
  refreshed.expires_at = refreshed.expires_at ?? Math.floor(Date.now() / 1000) + (refreshed.expires_in ?? 3600);
  storeSession(refreshed);
  return refreshed;
}

export async function getAdminSession(): Promise<SupabaseSession | null> {
  const session = getStoredSession();
  if (!session) return null;
  try {
    if ((session.expires_at ?? 0) < Math.floor(Date.now() / 1000) + 60) return await refreshSession(session);
    return session;
  } catch {
    storeSession(null);
    return null;
  }
}

export async function signInAdmin(email: string, password: string) {
  const response = await fetch(endpoint("/auth/v1/token?grant_type=password"), {
    method: "POST",
    headers: { ...publicHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const session = await safeJson<SupabaseSession>(response);
  session.expires_at = session.expires_at ?? Math.floor(Date.now() / 1000) + (session.expires_in ?? 3600);
  storeSession(session);
  return session;
}

export async function signOutAdmin() {
  const session = await getAdminSession();
  if (session) {
    await fetch(endpoint("/auth/v1/logout"), { method: "POST", headers: { ...publicHeaders(), Authorization: `Bearer ${session.access_token}` } }).catch(() => undefined);
  }
  storeSession(null);
}

async function adminRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const session = await getAdminSession();
  if (!session) throw new Error("Your admin session has expired. Please sign in again.");
  const headers = new Headers(init.headers);
  headers.set("apikey", anonKey!);
  headers.set("Authorization", `Bearer ${session.access_token}`);
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const response = await fetch(endpoint(path), { ...init, headers });
  return safeJson<T>(response);
}

export async function verifyCmsAdmin() {
  const session = await getAdminSession();
  if (!session) return null;
  const email = session.user.email;
  if (!email) return null;
  const query = `?select=email&email=eq.${encodeURIComponent(email.toLowerCase())}&limit=1`;
  const rows = await adminRequest<{ email: string }[]>(`/rest/v1/cms_admins${query}`);
  return rows[0] ? session : null;
}

export async function loadAdminContent() {
  const rows = await adminRequest<{ content: SiteContent }[]>("/rest/v1/site_content?id=eq.main&select=content&limit=1");
  return rows[0]?.content ?? defaultSiteContent;
}

export async function saveAdminContent(content: SiteContent) {
  return adminRequest<{ id: string }[]>("/rest/v1/site_content?on_conflict=id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({ id: "main", content, updated_at: new Date().toISOString() }),
  });
}

export async function loadAdminProjects() {
  return adminRequest<PortfolioProject[]>("/rest/v1/portfolio_projects?select=id,title_id,title_en,description_id,description_en,category_id,category_en,client,year,cover_image,project_url,sort_order,published&order=sort_order.asc,created_at.desc");
}

export async function loadAdminClientLogos() {
  return adminRequest<ClientLogo[]>("/rest/v1/client_logos?select=id,name,logo_url,website_url,sort_order,published&order=sort_order.asc,created_at.asc");
}

export type ClientLogoDraft = Omit<ClientLogo, "id"> & { id?: string };

export async function saveClientLogo(logo: ClientLogoDraft) {
  if (logo.id) {
    const { id, ...values } = logo;
    return adminRequest<ClientLogo[]>(`/rest/v1/client_logos?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ ...values, updated_at: new Date().toISOString() }),
    });
  }
  const { id: _id, ...values } = logo;
  return adminRequest<ClientLogo[]>("/rest/v1/client_logos", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(values),
  });
}

export async function deleteClientLogo(id: string) {
  await adminRequest<unknown>(`/rest/v1/client_logos?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function uploadClientLogo(file: File) {
  const session = await getAdminSession();
  if (!session) throw new Error("Your admin session has expired. Please sign in again.");
  const safeName = file.name.normalize("NFKD").replace(/[^\w.-]+/g, "-").replace(/-+/g, "-").toLowerCase();
  const path = `${crypto.randomUUID()}-${safeName}`;
  const response = await fetch(endpoint(`/storage/v1/object/client-logos/${path}`), {
    method: "POST",
    headers: { ...publicHeaders(), Authorization: `Bearer ${session.access_token}`, "Content-Type": file.type, "x-upsert": "false" },
    body: file,
  });
  await safeJson(response);
  return `${projectUrl}/storage/v1/object/public/client-logos/${path}`;
}

export type ProjectDraft = Omit<PortfolioProject, "id"> & { id?: string };

export async function saveProject(project: ProjectDraft) {
  if (project.id) {
    const { id, ...values } = project;
    return adminRequest<PortfolioProject[]>(`/rest/v1/portfolio_projects?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ ...values, updated_at: new Date().toISOString() }),
    });
  }
  const { id: _id, ...values } = project;
  return adminRequest<PortfolioProject[]>("/rest/v1/portfolio_projects", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(values),
  });
}

export async function deleteProject(id: string) {
  await adminRequest<unknown>(`/rest/v1/portfolio_projects?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function uploadProjectImage(file: File) {
  const session = await getAdminSession();
  if (!session) throw new Error("Your admin session has expired. Please sign in again.");
  const safeName = file.name.normalize("NFKD").replace(/[^\w.-]+/g, "-").replace(/-+/g, "-").toLowerCase();
  const path = `${crypto.randomUUID()}-${safeName}`;
  const response = await fetch(endpoint(`/storage/v1/object/portfolio-images/${path}`), {
    method: "POST",
    headers: { ...publicHeaders(), Authorization: `Bearer ${session.access_token}`, "Content-Type": file.type, "x-upsert": "false" },
    body: file,
  });
  await safeJson(response);
  return `${projectUrl}/storage/v1/object/public/portfolio-images/${path}`;
}
