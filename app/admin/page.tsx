"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ImagePlus, LoaderCircle, LogOut, Plus, Save, Trash2, X } from "lucide-react";
import { defaultSiteContent, type PortfolioProject, type SiteContent } from "@/app/site-content";
import {
  deleteProject,
  getAdminSession,
  isSupabaseConfigured,
  loadAdminContent,
  loadAdminProjects,
  saveAdminContent,
  saveProject,
  signInAdmin,
  signOutAdmin,
  uploadProjectImage,
  verifyCmsAdmin,
  type ProjectDraft,
} from "@/lib/supabase";

type DashboardTab = "works" | "content";
type ContentSection = keyof SiteContent;

const contentSections: ContentSection[] = ["hero", "services", "works", "pricing", "process", "faq", "footer"];
const sectionNames: Record<ContentSection, string> = {
  hero: "Hero",
  services: "Services",
  works: "Works section",
  pricing: "Pricing",
  process: "Process",
  faq: "FAQ",
  footer: "Footer",
};

function emptyProject(): ProjectDraft {
  return {
    title_id: "",
    title_en: "",
    description_id: "",
    description_en: "",
    category_id: "",
    category_en: "",
    client: "",
    year: String(new Date().getFullYear()),
    cover_image: "",
    project_url: "",
    sort_order: 0,
    published: false,
  };
}

function blankFromTemplate(template: unknown, index: number, collection: string): unknown {
  if (Array.isArray(template)) return template.map((item) => blankFromTemplate(item, index, collection));
  if (template && typeof template === "object") {
    return Object.fromEntries(Object.entries(template as Record<string, unknown>).map(([key, value]) => {
      if (key === "no") return [key, String(index + 1).padStart(2, "0")];
      if (key === "slug") return [key, `new-${collection}-${index + 1}`];
      if (key === "name") return [key, `New ${collection === "packages" ? "plan" : "item"} ${String(index + 1).padStart(2, "0")}`];
      if (key === "featured" || key === "published") return [key, false];
      return [key, blankFromTemplate(value, index, collection)];
    }));
  }
  if (typeof template === "number") return 0;
  if (typeof template === "boolean") return false;
  return "";
}

function displayFieldName(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}


function ContentFields({ value, path, onChange }: { value: unknown; path: (string | number)[]; onChange: (value: unknown) => void }) {
  if (Array.isArray(value)) {
    const canManageItems = value.length > 0 && value.every((item) => item && typeof item === "object" && !Array.isArray(item));
    return <div className="cms-array-fields">
      {value.map((item, index) => {
        const itemPath = [...path, index];
        const label = typeof item === "string" && (index === 0 || index === 1) && value.length === 2
          ? (index === 0 ? "Indonesian" : "English")
          : `${displayFieldName(String(path.at(-1) ?? "Item"))} ${String(index + 1).padStart(2, "0")}`;
        return <fieldset className="cms-item-fieldset" key={itemPath.join(".")}>
          <legend>{label}</legend>
          {canManageItems && <button type="button" className="cms-remove-item" disabled={value.length < 2} onClick={() => onChange(value.filter((_, entryIndex) => entryIndex !== index))}>Remove</button>}
          <ContentFields value={item} path={itemPath} onChange={(next) => onChange(value.map((entry, entryIndex) => entryIndex === index ? next : entry))} />
        </fieldset>;
      })}
      {canManageItems && <button type="button" className="cms-add-item" onClick={() => onChange([...value, blankFromTemplate(value[0], value.length, String(path.at(-1) ?? "items"))])}><Plus size={14} /> Add {displayFieldName(String(path.at(-1) ?? "item")).toLowerCase()}</button>}
    </div>;
  }

  if (value && typeof value === "object") {
    return <div className="cms-object-fields">
      {Object.entries(value as Record<string, unknown>).map(([key, child]) => {
        const childPath = [...path, key];
        if (child && typeof child === "object") {
          return <details className="cms-nested-group" key={childPath.join(".")} open={path.length < 2}>
            <summary>{displayFieldName(key)}</summary>
            <ContentFields value={child} path={childPath} onChange={(next) => onChange({ ...(value as Record<string, unknown>), [key]: next })} />
          </details>;
        }
        const label = childPath.map((part) => typeof part === "number" ? String(part + 1).padStart(2, "0") : displayFieldName(part)).join(" / ");
        const setValue = (next: unknown) => onChange({ ...(value as Record<string, unknown>), [key]: next });
        return <label className="cms-field" key={childPath.join(".")}>
          <span>{label}</span>
          {typeof child === "boolean" ? (
            <input type="checkbox" checked={child} onChange={(event) => setValue(event.target.checked)} />
          ) : typeof child === "number" ? (
            <input type="number" value={child} onChange={(event) => setValue(Number(event.target.value))} />
          ) : (
            String(child ?? "").length > 90 || String(child ?? "").includes("\n")
              ? <textarea rows={3} value={String(child ?? "")} onChange={(event) => setValue(event.target.value)} />
              : <input value={String(child ?? "")} onChange={(event) => setValue(event.target.value)} />
          )}
        </label>;
      })}
    </div>;
  }

  const inputLabel = path.map((part) => typeof part === "number" ? String(part + 1).padStart(2, "0") : displayFieldName(part)).join(" / ");
  return <label className="cms-field"><span>{inputLabel}</span><input value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} /></label>;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [tab, setTab] = useState<DashboardTab>("works");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [project, setProject] = useState<ProjectDraft | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const publishedCount = useMemo(() => projects.filter((item) => item.published).length, [projects]);

  async function loadDashboard() {
    const session = await verifyCmsAdmin();
    if (!session) {
      setAuthorized(false);
      setLoading(false);
      return false;
    }
    const [savedContent, savedProjects] = await Promise.all([loadAdminContent(), loadAdminProjects()]);
    setContent(savedContent);
    setProjects(savedProjects);
    setAuthorized(true);
    setLoading(false);
    return true;
  }

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    getAdminSession().then((session) => {
      if (!session) setLoading(false);
      else loadDashboard().catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : "Could not load the dashboard.");
        setLoading(false);
      });
    });
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signInAdmin(email, password);
      const isAdmin = await loadDashboard();
      if (!isAdmin) {
        await signOutAdmin();
        setError("This account is not listed as a GwenMade CMS admin.");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveContent() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await saveAdminContent(content);
      setMessage("Site content saved. Published pages will use the new copy.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save content.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!project) return;
    if (!project.title_id.trim() || !project.title_en.trim()) {
      setError("Add the project title in Indonesian and English.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await saveProject(project);
      setProjects(await loadAdminProjects());
      setProject(null);
      setMessage("Project saved.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save project.");
    } finally {
      setBusy(false);
    }
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !project) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadProjectImage(file);
      setProject((current) => current ? { ...current, cover_image: url } : current);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Image upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleDeleteProject(id: string) {
    if (!window.confirm("Delete this work from the portfolio? This cannot be undone.")) return;
    setBusy(true);
    setError("");
    try {
      await deleteProject(id);
      setProjects(await loadAdminProjects());
      setMessage("Project deleted.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete project.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    await signOutAdmin();
    setAuthorized(false);
    setProjects([]);
    setMessage("");
  }

  if (!isSupabaseConfigured) {
    return <AdminNotice title="Connect Supabase to use the CMS" text="Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your local environment, then run supabase/setup.sql in the Supabase SQL Editor." />;
  }

  if (loading) return <AdminNotice title="Opening your studio" text="Checking your secure admin session…" />;

  if (!authorized) {
    return <main className="admin-login-shell">
      <Link href="/" className="admin-back-link">← Back to GwenMade</Link>
      <form className="admin-login" onSubmit={handleLogin}>
        <span className="admin-eyebrow">GWENMADE / PRIVATE STUDIO</span>
        <h1>Welcome<br /><em>back.</em></h1>
        <p>Sign in with the admin account you created in Supabase.</p>
        {error && <p className="admin-message admin-error" role="alert">{error}</p>}
        <label className="cms-field"><span>Email</span><input autoComplete="username" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label className="cms-field"><span>Password</span><input autoComplete="current-password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        <button className="admin-primary-button" type="submit" disabled={busy}>{busy ? <LoaderCircle className="spin" size={16} /> : null} Sign in</button>
      </form>
    </main>;
  }

  return <main className="admin-shell">
    <header className="admin-topbar">
      <Link href="/" className="admin-brand"><span className="admin-brand-mark">G</span><span>GWENMADE <small>CONTENT STUDIO</small></span></Link>
      <div className="admin-top-actions"><span className="admin-saved"><i /> Connected to Supabase</span><button type="button" className="admin-quiet-button" onClick={handleSignOut}><LogOut size={15} /> Sign out</button></div>
    </header>
    <div className="admin-workspace">
      <aside className="admin-sidebar">
        <span className="admin-eyebrow">PUBLISHING</span>
        <button type="button" className={tab === "works" ? "active" : ""} onClick={() => { setTab("works"); setMessage(""); setError(""); }}>Portfolio <span>{projects.length}</span></button>
        <button type="button" className={tab === "content" ? "active" : ""} onClick={() => { setTab("content"); setMessage(""); setError(""); }}>Site content</button>
        <div className="admin-sidebar-note"><strong>{publishedCount} live works</strong><span>Only published projects appear on the public site.</span></div>
      </aside>
      <section className="admin-main-panel">
        <div className="admin-page-heading">
          <div><span className="admin-eyebrow">{tab === "works" ? "PORTFOLIO MANAGER" : "CONTENT MANAGER"}</span><h1>{tab === "works" ? "Your work, out in the world." : "Shape the whole story."}</h1><p>{tab === "works" ? "Add projects, upload images, and choose what visitors can see." : "Edit bilingual page copy, service details, package data, process steps, and FAQs."}</p></div>
          {tab === "works" && !project && <button type="button" className="admin-primary-button" onClick={() => { setProject(emptyProject()); setMessage(""); setError(""); }}><Plus size={16} /> Add a project</button>}
          {tab === "content" && <button type="button" className="admin-primary-button" disabled={busy} onClick={handleSaveContent}>{busy ? <LoaderCircle className="spin" size={16} /> : <Save size={16} />} Save all content</button>}
        </div>
        {message && <p className="admin-message admin-success" role="status"><Check size={15} />{message}</p>}
        {error && <p className="admin-message admin-error" role="alert"><X size={15} />{error}</p>}

        {tab === "works" ? (project ? (
          <form className="project-editor" onSubmit={handleSaveProject}>
            <div className="project-editor-heading"><div><span className="admin-eyebrow">{project.id ? "EDIT PROJECT" : "NEW PROJECT"}</span><h2>{project.id ? project.title_id || "Untitled project" : "Add a portfolio project"}</h2></div><button type="button" className="admin-quiet-button" onClick={() => setProject(null)}><X size={16} /> Close</button></div>
            <div className="project-form-grid">
              <label className="cms-field"><span>Project title · Indonesian</span><input required value={project.title_id} onChange={(event) => setProject({ ...project, title_id: event.target.value })} /></label>
              <label className="cms-field"><span>Project title · English</span><input required value={project.title_en} onChange={(event) => setProject({ ...project, title_en: event.target.value })} /></label>
              <label className="cms-field"><span>Category · Indonesian</span><input value={project.category_id} onChange={(event) => setProject({ ...project, category_id: event.target.value })} placeholder="Landing page, identity…" /></label>
              <label className="cms-field"><span>Category · English</span><input value={project.category_en} onChange={(event) => setProject({ ...project, category_en: event.target.value })} placeholder="Landing page, identity…" /></label>
              <label className="cms-field"><span>Client / brand</span><input value={project.client} onChange={(event) => setProject({ ...project, client: event.target.value })} /></label>
              <label className="cms-field"><span>Year</span><input value={project.year} onChange={(event) => setProject({ ...project, year: event.target.value })} /></label>
              <label className="cms-field project-wide"><span>Description · Indonesian</span><textarea rows={3} value={project.description_id} onChange={(event) => setProject({ ...project, description_id: event.target.value })} /></label>
              <label className="cms-field project-wide"><span>Description · English</span><textarea rows={3} value={project.description_en} onChange={(event) => setProject({ ...project, description_en: event.target.value })} /></label>
              <label className="cms-field project-wide"><span>Project URL</span><input type="url" value={project.project_url} onChange={(event) => setProject({ ...project, project_url: event.target.value })} placeholder="https://…" /></label>
              <label className="cms-field"><span>Display order</span><input type="number" value={project.sort_order} onChange={(event) => setProject({ ...project, sort_order: Number(event.target.value) })} /></label>
              <label className="cms-field"><span>Cover image URL</span><input value={project.cover_image} onChange={(event) => setProject({ ...project, cover_image: event.target.value })} placeholder="Upload below or paste an image URL" /></label>
            </div>
            <div className="project-image-upload">
              {project.cover_image ? <Image src={project.cover_image} alt="Project cover preview" width={1600} height={1100} unoptimized /> : <div className="project-image-placeholder"><ImagePlus size={22} /><span>Preview appears here</span></div>}
              <label className="admin-secondary-button"><ImagePlus size={15} />{uploading ? "Uploading image…" : "Upload cover image"}<input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={handleImageUpload} disabled={uploading} /></label>
              <small>Use a landscape image, ideally 1600 × 1100 px or larger.</small>
            </div>
            <label className="publish-toggle"><input type="checkbox" checked={project.published} onChange={(event) => setProject({ ...project, published: event.target.checked })} /><span><strong>Publish this project</strong><small>Visible to everyone on the public portfolio.</small></span></label>
            <div className="project-editor-actions"><button type="button" className="admin-quiet-button" onClick={() => setProject(null)}>Cancel</button><button type="submit" className="admin-primary-button" disabled={busy || uploading}>{busy ? <LoaderCircle className="spin" size={16} /> : <Save size={16} />} Save project</button></div>
          </form>
        ) : projects.length ? (
          <div className="project-list">{projects.map((item) => <ProjectRow key={item.id} project={item} onEdit={() => { setProject({ ...item }); setMessage(""); setError(""); }} onDelete={() => handleDeleteProject(item.id)} />)}</div>
        ) : <div className="admin-empty-state"><ImagePlus size={28} /><h2>Your work starts here.</h2><p>Add your first project to give visitors a look at what GwenMade can make.</p><button type="button" className="admin-primary-button" onClick={() => setProject(emptyProject())}><Plus size={16} /> Add a project</button></div>
        ) : (
          <div className="content-editor">
            <div className="content-editor-tip"><strong>Editing guide</strong><span>Each section contains Indonesian and English fields. Clear the tracking or business email values in a plan to show those items muted as not included.</span></div>
            {contentSections.map((section) => (
              <details className="cms-section" key={section} open={section === "hero"}>
                <summary><span>{sectionNames[section]}</span><small>Edit section copy and data</small></summary>
                <ContentFields value={content[section]} path={[section]} onChange={(next) => setContent((current) => ({ ...current, [section]: next }) as SiteContent)} />
              </details>
            ))}
          </div>
        )}
      </section>
    </div>
  </main>;
}

function ProjectRow({ project, onEdit, onDelete }: { project: PortfolioProject; onEdit: () => void; onDelete: () => void }) {
  return <article className="project-list-row">
    {project.cover_image ? <Image src={project.cover_image} alt="" width={1600} height={1100} unoptimized /> : <div className="project-list-placeholder"><ImagePlus size={20} /></div>}
    <div className="project-list-copy"><span className={project.published ? "project-status is-live" : "project-status"}>{project.published ? "PUBLISHED" : "DRAFT"}</span><h2>{project.title_id}</h2><p>{project.client}{project.year ? ` · ${project.year}` : ""}</p></div>
    <div className="project-list-actions"><button type="button" className="admin-quiet-button" onClick={onEdit}>Edit</button><button type="button" className="admin-icon-button" aria-label={`Delete ${project.title_id}`} onClick={onDelete}><Trash2 size={16} /></button></div>
  </article>;
}

function AdminNotice({ title, text }: { title: string; text: string }) {
  return <main className="admin-login-shell"><Link href="/" className="admin-back-link">← Back to GwenMade</Link><div className="admin-login"><span className="admin-eyebrow">GWENMADE / CONTENT STUDIO</span><h1>{title}</h1><p>{text}</p></div></main>;
}
