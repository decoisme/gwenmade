"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Minus, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Flip } from "gsap/Flip";
import { gsap } from "gsap";
import Image from "next/image";
import { BrandMark } from "@/app/brand-mark";
import { defaultSiteContent, type ClientLogo, type Lang, type PortfolioProject, type SiteContent } from "@/app/site-content";

const contacts = [
  { label: "WhatsApp 01", value: "+62 815-3322-7007", href: "https://wa.me/6281533227007" },
  { label: "WhatsApp 02", value: "+62 822-5822-1745", href: "https://wa.me/6282258221745" },
  { label: "Instagram", value: "@nadeqo", href: "https://instagram.com/nadeqo" },
];


function copy(lang: Lang, id: string, en: string) {
  return lang === "id" ? id : en;
}

function whatsappLink(message: string) {
  return `https://wa.me/6281533227007?text=${encodeURIComponent(message)}`;
}

const chapterIds = ["home", "services", "works", "pricing", "process", "faq"] as const;

function DisplayLines({ lines }: { lines: string[] }) {
  return <>{lines.slice(0, -1).map((line, index) => <Fragment key={`${line}-${index}`}>{line}<br /></Fragment>)}<em>{lines.at(-1)}</em></>;
}

export function EditorialSite({ content = defaultSiteContent, projects = [], clientLogos = [] }: { content?: SiteContent; projects?: PortfolioProject[]; clientLogos?: ClientLogo[] }) {
  const [lang, setLang] = useState<Lang>("id");
  const [isChanging, setIsChanging] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const sections = chapterIds.map((id) => document.getElementById(id)).filter((section): section is HTMLElement => section instanceof HTMLElement);
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!current) return;
      const index = chapterIds.indexOf(current.target.id as (typeof chapterIds)[number]);
      if (index >= 0) setActiveSection(index);
    }, { rootMargin: "-120px 0px -120px 0px", threshold: [0, .1, .35, .65] });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function toggleLanguage() {
    setIsChanging(true);
    setLang((current) => current === "id" ? "en" : "id");
    window.setTimeout(() => setIsChanging(false), 220);
  }

  return (
    <div className={`editorial-site ${isChanging ? "is-changing" : ""}`} data-lang={lang}>
      <Navbar lang={lang} activeSection={activeSection} onToggleLanguage={toggleLanguage} />
      <main lang={lang}>
        <Hero lang={lang} content={content.hero} />
        <ClientMarquee lang={lang} logos={clientLogos} />
        <Services lang={lang} content={content.services} />
        <Works lang={lang} content={content.works} projects={projects} />
        <Pricing lang={lang} content={content.pricing} />
        <Process lang={lang} content={content.process} />
        <FAQ lang={lang} content={content.faq} />
      </main>
      <Footer lang={lang} content={content.footer} />
    </div>
  );
}

function Navbar({ lang, activeSection, onToggleLanguage }: { lang: Lang; activeSection: number; onToggleLanguage: () => void }) {
  const navItems = [
    { id: "services", label: copy(lang, "Layanan", "Services") },
    { id: "works", label: copy(lang, "Karya", "Work") },
    { id: "pricing", label: copy(lang, "Harga", "Pricing") },
    { id: "process", label: copy(lang, "Proses", "Process") },
    { id: "faq", label: "FAQ" },
  ];
  const progress = Math.round(((activeSection + 1) / chapterIds.length) * 100);

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label={copy(lang, "Navigasi GwenMade", "GwenMade navigation")}>
        <a className="wordmark" href="#home" aria-label="GwenMade home"><span className="wordmark-mark">G</span><span className="wordmark-name">GwenMade</span></a>
        <div className="nav-links">
          {navItems.map((item, index) => (
            <a href={`#${item.id}`} key={item.id} aria-current={activeSection === index + 1 ? "location" : undefined}>
              <span className="nav-level">0{index + 1}</span><span>{item.label}</span>
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <div className="language-switch" aria-label={copy(lang, "Pilih bahasa", "Choose language")}>
            <button type="button" aria-pressed={lang === "id"} onClick={() => lang !== "id" && onToggleLanguage()}>ID</button>
            <span>/</span>
            <button type="button" aria-pressed={lang === "en"} onClick={() => lang !== "en" && onToggleLanguage()}>EN</button>
          </div>
          <details className="contact-menu">
            <summary>{copy(lang, "Ngobrol yuk", "Let’s talk")} <span>↗︎</span></summary>
            <div className="contact-popover">
              {contacts.map((contact) => (
                <a href={contact.href} key={contact.label} target="_blank" rel="noreferrer">
                  <span>{contact.label}</span><strong>{contact.value}</strong>
                </a>
              ))}
            </div>
          </details>
        </div>
        <div className="nav-progress" role="progressbar" aria-label={copy(lang, "Posisi halaman", "Page progress")} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <span style={{ "--progress": `${progress}%` } as CSSProperties} />
        </div>
      </nav>
    </header>
  );
}

function Hero({ lang, content }: { lang: Lang; content: SiteContent["hero"] }) {
  return (
    <section className="hero editorial-hero" id="home">
      <div className="hero-topline editorial-wrap"><span>{content.topline[lang]}</span><span>{copy(lang, "TERBUKA UNTUK PROYEK PILIHAN", "AVAILABLE FOR SELECT PROJECTS")}</span></div>
      <div className="hero-stage editorial-wrap">
        <div className="hero-copy">
          <p className="hero-kicker reveal"><span className="status-dot" />{content.kicker[lang]}</p>
          <h1 className="reveal"><DisplayLines lines={content.title[lang]} /></h1>
          <p className="hero-description reveal">{content.description[lang]}</p>
          <div className="hero-actions reveal">
            <a className="button button-primary" href="#pricing">{content.primaryCta[lang]} <span>↗︎</span></a>
            <a className="button button-text" href={whatsappLink(copy(lang, "Hai GwenMade, aku mau konsultasi soal landing page.", "Hi GwenMade, I’d love to talk about a landing page."))} target="_blank" rel="noreferrer">{content.secondaryCta[lang]}</a>
          </div>
        </div>
        <div className="hero-art reveal" aria-label={copy(lang, "Identitas tiga dimensi GwenMade", "Three-dimensional GwenMade identity")}>
          <div className="hero-art-caption"><span>OBJECT 001</span><span>{content.artCaption[lang]}</span></div>
          <BrandMark label={copy(lang, "Logo tiga dimensi GwenMade", "Three-dimensional GwenMade logo")} />
          <p>{content.artDescription[lang]}</p>
        </div>
      </div>
      <div className="hero-bottomline editorial-wrap">
        <span>{content.bottomLeft[lang]}</span>
        <span>{content.bottomCenter[lang]}</span>
        <a href="#services" className="scroll-cue"><span>{content.scrollCue[lang]}</span><span>↓︎</span></a>
      </div>
    </section>
  );
}

function ClientMarquee({ lang, logos }: { lang: Lang; logos: ClientLogo[] }) {
  if (!logos.length) return null;

  const renderLogos = (duplicate = false) => (
    <div className="client-marquee-group" role={duplicate ? undefined : "list"} aria-hidden={duplicate || undefined}>
      {logos.map((logo) => {
        const image = <Image className="client-logo-image" src={logo.logo_url} alt={duplicate ? "" : logo.name} width={240} height={120} unoptimized />;
        return <div className="client-logo-card" role={duplicate ? undefined : "listitem"} key={`${logo.id}-${duplicate ? "copy" : "item"}`}>
          {logo.website_url ? <a href={logo.website_url} target="_blank" rel="noopener noreferrer" tabIndex={duplicate ? -1 : undefined} aria-label={duplicate ? undefined : `${logo.name} website`}>{image}</a> : image}
        </div>;
      })}
    </div>
  );

  return (
    <section className="client-marquee" aria-label={copy(lang, "Klien GwenMade", "GwenMade clients")}>
      <p className="client-marquee-label">{copy(lang, "BRAND YANG PERNAH KAMI KERJAKAN", "BRANDS WE’VE WORKED WITH")}</p>
      <div className="client-marquee-viewport"><div className="client-marquee-track">{renderLogos()}{renderLogos(true)}</div></div>
    </section>
  );
}

function AutomationCanvas({ lang }: { lang: Lang }) {
  return (
    <div className="automation-canvas" aria-label={copy(lang, "Ilustrasi alur data lead", "Illustration of the lead data flow")}>
      <div className="automation-flow"><span>{copy(lang, "FORM MASUK", "FORM SUBMITTED")}</span><b>→︎</b><span>GOOGLE SHEETS</span><b>→︎</b><span>META PIXEL</span></div>
      <div className="sheet-window">
        <div className="sheet-head"><span>LEAD MASUK / LIVE</span><span><i /> {copy(lang, "TERHUBUNG", "CONNECTED")}</span></div>
        <div className="sheet-row sheet-cols"><span>NAMA</span><span>PRODUK</span><span>STATUS</span></div>
        <div className="sheet-row"><span>Rani P.</span><span>Serum No. 01</span><span className="lead-new">{copy(lang, "BARU", "NEW")}</span></div>
        <div className="sheet-row"><span>Fajar A.</span><span>Starter Kit</span><span>{copy(lang, "DIBALAS", "REPLIED")}</span></div>
        <div className="sheet-row"><span>Nadia K.</span><span>Daily Cleanser</span><span className="lead-new">{copy(lang, "BARU", "NEW")}</span></div>
      </div>
      <p>{copy(lang, "CONTOH ALUR · DATA TERSIMPAN OTOMATIS", "SAMPLE FLOW · DATA SAVED AUTOMATICALLY")}</p>
    </div>
  );
}

function Services({ lang, content }: { lang: Lang; content: SiteContent["services"] }) {
  return (
    <section className="services-section editorial-wrap" id="services">
      <div className="section-heading reveal">
        <div><span className="section-index">{content.eyebrow[lang]}</span><h2><DisplayLines lines={content.title[lang]} /></h2></div>
        <p>{content.description[lang]}</p>
      </div>
      <div className="feature-grid">
        {content.items.map((feature) => (
          <article className={`feature-card ${feature.slug} reveal`} key={feature.no}>
            <div className="feature-meta"><span>{feature.note[lang]}</span><span>{feature.no} / {String(content.items.length).padStart(2, "0")}</span></div>
            <div className="feature-copy"><h3>{feature.title[lang]}</h3><p>{feature.body[lang]}</p></div>
            {feature.slug === "zero-template" && <div className="feature-visual canvas-visual" aria-hidden="true"><span>MADE FROM A BLANK CANVAS</span><strong>{lang === "id" ? <>Dibikin<br />buat <em>kamu.</em></> : <>Made with<br /><em>you in mind.</em></>}</strong><small>GWENMADE / ORIGINAL</small></div>}
            {feature.slug === "fast-build" && <div className="performance-mark"><span>{copy(lang, "ESTIMASI PENGERJAAN", "ESTIMATED DELIVERY")}</span><b>7–14<br />{copy(lang, "HARI", "DAYS")}</b><i><span /><span /><span /><span /><span /><span /><span /><span /></i><small>{copy(lang, "DARI BRIEF SAMPAI LIVE", "FROM BRIEF TO LIVE")}</small></div>}
            {feature.slug === "conversion-copy" && <div className="feature-visual copy-visual" aria-hidden="true"><span>MESSAGE / 01</span><strong>{lang === "id" ? <>Kenal dulu.<br /><em>Baru yakin.</em></> : <>Get to know it.<br /><em>Then believe.</em></>}</strong><small>CONTENT / CUSTOMER JOURNEY</small></div>}
            {feature.slug === "data-flow" && <AutomationCanvas lang={lang} />}
          </article>
        ))}
      </div>
    </section>
  );
}

const packages = defaultSiteContent.pricing.packages;

function WorkDescription({ text, lang }: { text: string; lang: Lang }) {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [hasMore, setHasMore] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const element = descriptionRef.current;
    if (!element) return;

    const measure = () => {
      const fullText = element.cloneNode(true) as HTMLParagraphElement;
      fullText.classList.remove("is-expanded");
      fullText.classList.add("work-description-measure");
      fullText.style.width = `${element.clientWidth}px`;
      document.body.appendChild(fullText);
      const lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight) || 24;
      setHasMore(fullText.scrollHeight > lineHeight * 3 + 2);
      fullText.remove();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [text]);

  return <>
    <p ref={descriptionRef} className={`work-description ${expanded ? "is-expanded" : ""}`}>{text}</p>
    {hasMore && <button className="work-more" type="button" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>{expanded ? copy(lang, "Lihat lebih sedikit", "View less") : copy(lang, "Lihat selengkapnya", "View more")}</button>}
  </>;
}

function Works({ lang, content, projects }: { lang: Lang; content: SiteContent["works"]; projects: PortfolioProject[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollProjects(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * track.clientWidth * .82,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  return (
    <section className="works-section editorial-wrap" id="works">
      <div className="section-heading reveal">
        <div><span className="section-index">{content.eyebrow[lang]}</span><h2><DisplayLines lines={content.title[lang]} /></h2></div>
        <p>{content.description[lang]}</p>
      </div>
      {projects.length ? (
        <>
          {projects.length > 1 && <div className="works-rail-controls"><span>{copy(lang, "GESER UNTUK LIHAT SEMUA KARYA", "SCROLL TO EXPLORE ALL WORK")}</span><div><button type="button" aria-label={copy(lang, "Karya sebelumnya", "Previous projects")} onClick={() => scrollProjects(-1)}><ArrowLeft size={17} aria-hidden="true" /></button><button type="button" aria-label={copy(lang, "Karya berikutnya", "Next projects")} onClick={() => scrollProjects(1)}><ArrowRight size={17} aria-hidden="true" /></button></div></div>}
          <div className="works-track" ref={trackRef} role="region" tabIndex={0} aria-label={copy(lang, "Galeri karya GwenMade, dapat digeser mendatar", "GwenMade project gallery, horizontally scrollable")}>
          {projects.map((project, index) => (
            <article className="work-card reveal" key={project.id}>
              <div className="work-image">
                {project.cover_image ? <Image src={project.cover_image} alt={lang === "id" ? project.title_id : project.title_en} width={1600} height={1100} unoptimized loading="lazy" /> : <div className="work-image-empty"><span>{project.client || "GWENMADE"}</span><strong>{project.title_id}</strong></div>}
                <span className="work-image-index">{String(index + 1).padStart(2, "0")} / {project.year}</span>
              </div>
              <div className="work-details">
                <div><span>{lang === "id" ? project.category_id : project.category_en}</span><span>{project.client}</span></div>
                <h3>{lang === "id" ? project.title_id : project.title_en}</h3>
                <WorkDescription text={lang === "id" ? project.description_id : project.description_en} lang={lang} />
                {project.project_url && <a href={project.project_url} target="_blank" rel="noreferrer">{copy(lang, "Lihat proyek", "Visit project")} <span>↗︎</span></a>}
              </div>
            </article>
          ))}
          </div>
        </>
      ) : <p className="works-empty">{copy(lang, "Karya terbaru akan segera hadir di sini.", "Selected projects will appear here soon.")}</p>}
    </section>
  );
}

function packageLink(name: string, lang: Lang) {
  const message = lang === "id"
    ? `Hai GwenMade, aku tertarik sama paket ${name}. Boleh cerita lebih lanjut?`
    : `Hi GwenMade, I'm interested in the ${name} package. Could you tell me more?`;
  return whatsappLink(message);
}

function packageFeatures(item: (typeof packages)[number], lang: Lang): { text: string; included?: boolean }[] {
  const languageIndex = lang === "id" ? 0 : 1;
  const tracking = item.tracking[languageIndex];
  const email = item.email[languageIndex];
  const isIncluded = (value: string) => value.trim().length > 0;

  return [
    { text: `Domain ${item.domain}` },
    { text: lang === "id" ? "Hosting + SSL · 1 tahun" : "Hosting + SSL · 1 year" },
    { text: item.pages[languageIndex] },
    { text: item.copy[languageIndex] },
    { text: item.automation[languageIndex] },
    { text: isIncluded(tracking) ? tracking : "Tracking & ads", included: isIncluded(tracking) },
    { text: isIncluded(email) ? email : copy(lang, "Email bisnis", "Business email"), included: isIncluded(email) },
    { text: item.revision[languageIndex] },
    { text: item.delivery[languageIndex] },
  ];
}

function FeatureLine({ text, included = true }: { text: string; included?: boolean }) {
  return <li className={included ? "" : "not-included"}>{included ? <Check size={14} aria-hidden="true" /> : <Minus size={14} aria-hidden="true" />}{text}</li>;
}

function Pricing({ lang, content }: { lang: Lang; content: SiteContent["pricing"] }) {
  const packages = content.packages;
  const [view, setView] = useState<"cards" | "compare">("cards");
  const gridRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const fieldLabels = lang === "id"
    ? ["Perpanjangan / tahun", "Domain", "Hosting + SSL", "Panjang halaman", "Copywriting", "Automasi", "Tracking & ads", "Email bisnis", "Revisi", "Waktu pengerjaan"]
    : ["Annual renewal", "Domain", "Hosting + SSL", "Page length", "Copywriting", "Automation", "Tracking & ads", "Business email", "Revisions", "Turnaround"];

  useLayoutEffect(() => {
    if (!flipState.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      flipState.current = null;
      return;
    }
    gsap.registerPlugin(Flip);
    Flip.from(flipState.current, { duration: .42, ease: "power2.inOut", stagger: .025, absolute: true });
    flipState.current = null;
  }, [view]);

  function changeView(next: "cards" | "compare") {
    if (next === view) return;
    if (window.matchMedia("(max-width: 720px)").matches) {
      setView(next);
      return;
    }
    const items = gridRef.current?.querySelectorAll("[data-flip-id]");
    if (items?.length) {
      gsap.registerPlugin(Flip);
      flipState.current = Flip.getState(items);
    }
    setView(next);
  }

  const planValues = (item: (typeof packages)[number]) => [
    `Rp ${item.renewal} / ${lang === "id" ? "tahun" : "year"}`,
    item.domain,
    lang === "id" ? "Termasuk · 1 tahun" : "Included · 1 year",
    item.pages[lang === "id" ? 0 : 1],
    item.copy[lang === "id" ? 0 : 1],
    item.automation[lang === "id" ? 0 : 1],
    item.tracking[lang === "id" ? 0 : 1] || "—",
    item.email[lang === "id" ? 0 : 1] || "—",
    item.revision[lang === "id" ? 0 : 1],
    item.delivery[lang === "id" ? 0 : 1],
  ];

  return (
    <section className="pricing-section" id="pricing">
      <div className="editorial-wrap">
        <div className="section-heading pricing-heading reveal">
          <div><span className="section-index">{content.eyebrow[lang]}</span><h2><DisplayLines lines={content.title[lang]} /></h2></div>
          <p>{content.description[lang]}</p>
        </div>
        <div className="pricing-toolbar reveal"><span>{copy(lang, "PILIH CARA MELIHAT", "CHOOSE A VIEW")}</span><div className="pricing-switch" role="group" aria-label={copy(lang, "Tampilan harga", "Pricing view")}><button type="button" aria-pressed={view === "cards"} className={view === "cards" ? "active" : ""} onClick={() => changeView("cards")}>{copy(lang, "Ringkas", "Overview")}</button><button type="button" aria-pressed={view === "compare"} className={view === "compare" ? "active" : ""} onClick={() => changeView("compare")}>{copy(lang, "Bandingkan", "Compare")}</button></div></div>
        <div className={`pricing-grid ${view === "compare" ? "is-comparison" : ""}`} ref={gridRef} style={{ "--package-columns": Math.min(packages.length, 4) } as CSSProperties}>
          {view === "cards" ? packages.map((item, index) => (
            <article className={`price-card pricing-item reveal ${item.featured ? "price-featured" : ""}`} key={item.name} data-flip-id={`package-${item.name}`}>
              {item.featured && <div className="best-value">{copy(lang, "PALING DIPILIH", "BEST VALUE")}</div>}
              <div className="price-top"><span className="plan-name">{item.name}</span><span className="plan-index">{String(index + 1).padStart(2, "0")} / {String(packages.length).padStart(2, "0")}</span></div>
              <div className="price-amount"><small>Rp</small>{item.price}</div>
              <p className="renewal">{copy(lang, "per proyek", "per project")} <span>· {copy(lang, "perpanjangan", "renewal")} Rp {item.renewal}/{copy(lang, "thn", "yr")}</span></p>
              <a className={`button ${item.featured ? "button-primary" : "button-outline"} plan-cta`} href={packageLink(item.name, lang)} target="_blank" rel="noreferrer">{copy(lang, "Pilih paket", "Choose package")} <span>↗︎</span></a>
              <div className="plan-includes"><span>{copy(lang, "YANG TERMASUK", "WHAT’S INCLUDED")}</span><ul>
                {packageFeatures(item, lang).map(({ text, included }, featureIndex) => <FeatureLine text={text} included={included} key={`${item.name}-${featureIndex}`} />)}
              </ul></div>
            </article>
          )) : (
            <>
              <div className="comparison-table pricing-item" role="region" tabIndex={0} aria-label={copy(lang, "Perbandingan paket", "Package comparison")} style={{ "--plan-count": packages.length } as CSSProperties}>
                <div className="comparison-row comparison-head"><span className="comparison-label">{copy(lang, "PAKET", "PACKAGE")}</span>{packages.map((item) => <div className={`comparison-plan ${item.featured ? "highlight-plan" : ""}`} data-flip-id={`package-${item.name}`} key={item.name}><span>{item.name}</span><strong>Rp {item.price}</strong><a href={packageLink(item.name, lang)} target="_blank" rel="noreferrer">{copy(lang, "Pilih", "Choose")} ↗︎</a></div>)}</div>
                {fieldLabels.map((label, rowIndex) => <div className="comparison-row" key={label}><span className="comparison-label">{label}</span>{packages.map((item) => <span className={`comparison-value ${item.featured ? "highlight-value" : ""} ${planValues(item)[rowIndex] === "—" ? "not-included" : ""}`} key={item.name}>{planValues(item)[rowIndex]}</span>)}</div>)}
              </div>
              <div className="mobile-comparison">
                {packages.map((item, index) => (
                  <article className={`mobile-compare-card ${item.featured ? "price-featured" : ""}`} key={item.name}>
                    {item.featured && <div className="best-value">{copy(lang, "PALING DIPILIH", "BEST VALUE")}</div>}
                    <div className="mobile-compare-head"><div><span className="mobile-compare-index">{String(index + 1).padStart(2, "0")} / {String(packages.length).padStart(2, "0")}</span><h3>{item.name}</h3></div><strong>Rp {item.price}</strong></div>
                    <a className={`button ${item.featured ? "button-primary" : "button-outline"} mobile-compare-cta`} href={packageLink(item.name, lang)} target="_blank" rel="noreferrer">{copy(lang, "Pilih paket ini", "Choose this plan")} <span>↗︎</span></a>
                    <dl className="mobile-compare-details">{fieldLabels.map((label, rowIndex) => <div className="mobile-compare-row" key={label}><dt>{label}</dt><dd className={planValues(item)[rowIndex] === "—" ? "not-included" : ""}>{planValues(item)[rowIndex]}</dd></div>)}</dl>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
        <p className="pricing-footnote reveal">{copy(lang, "DP 50% untuk mulai. Pelunasan saat halaman siap tayang. Ada kebutuhan khusus? Kita obrolin.", "A 50% deposit gets things started. The balance is due when your page is ready. Have a custom request? Let’s talk.")}</p>
      </div>
    </section>
  );
}

function Process({ lang, content }: { lang: Lang; content: SiteContent["process"] }) {
  return (
    <section className="process-section editorial-wrap" id="process">
      <div className="process-heading reveal"><span className="section-index">{content.eyebrow[lang]}</span><h2><DisplayLines lines={content.title[lang]} /></h2></div>
      <div className="process-list">{content.steps.map((step) => <article className="process-step reveal" key={step.no}><span className="process-number">{step.no}</span><div><h3>{step.title[lang === "id" ? 0 : 1]}</h3><p>{step.body[lang === "id" ? 0 : 1]}</p></div><span className="step-mark" aria-hidden="true">↗︎</span></article>)}</div>
      <p className="process-aside">{content.aside[lang]}</p>
    </section>
  );
}

function FAQ({ lang, content }: { lang: Lang; content: SiteContent["faq"] }) {
  return (
    <section className="faq-section editorial-wrap" id="faq">
      <div className="faq-intro reveal"><span className="section-index">{content.eyebrow[lang]}</span><h2><DisplayLines lines={content.title[lang]} /></h2><a href={whatsappLink(copy(lang, "Hai GwenMade, aku mau tanya-tanya dulu.", "Hi GwenMade, I have a quick question."))} target="_blank" rel="noreferrer">{content.contactCta[lang]} ↗︎</a></div>
      <div className="faq-list">{content.items.map((faq, index) => <details className="faq-item reveal" key={`${faq.q[0]}-${index}`}><summary><span className="faq-index">0{index + 1}</span><span>{faq.q[lang === "id" ? 0 : 1]}</span><span className="faq-plus" aria-hidden="true">+</span></summary><p>{faq.a[lang === "id" ? 0 : 1]}</p></details>)}</div>
    </section>
  );
}

function Footer({ lang, content }: { lang: Lang; content: SiteContent["footer"] }) {
  const [secretOpen, setSecretOpen] = useState(false);
  const [secretClosing, setSecretClosing] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const autoCloseTimerRef = useRef<number | null>(null);
  const finishCloseTimerRef = useRef<number | null>(null);
  const secretClosingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (autoCloseTimerRef.current !== null) window.clearTimeout(autoCloseTimerRef.current);
      if (finishCloseTimerRef.current !== null) window.clearTimeout(finishCloseTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!secretOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
      else document.querySelector<HTMLElement>(".site-header .wordmark")?.focus();
    };
  }, [secretOpen]);

  function closeSecret() {
    if (secretClosingRef.current) return;
    secretClosingRef.current = true;
    if (autoCloseTimerRef.current !== null) window.clearTimeout(autoCloseTimerRef.current);
    setSecretClosing(true);
    finishCloseTimerRef.current = window.setTimeout(() => {
      setSecretOpen(false);
      setSecretClosing(false);
      secretClosingRef.current = false;
      finishCloseTimerRef.current = null;
    }, reduceMotion ? 100 : 1000);
  }

  function openSecret() {
    if (secretOpen) return;
    secretClosingRef.current = false;
    setSecretClosing(false);
    setSecretOpen(true);
    autoCloseTimerRef.current = window.setTimeout(closeSecret, reduceMotion ? 3100 : 3800);
  }

  function handleSecretKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      closeSecret();
      return;
    }
    if (event.key !== "Tab") return;
    const controls = dialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])");
    if (!controls?.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <footer className="footer">
      <div className="editorial-wrap">
        <div className="footer-main">
          <div className="footer-intro">
            <span className="section-index">{content.eyebrow[lang]}</span>
            <a className="wordmark footer-wordmark" href="#home" aria-label="GwenMade home"><span className="wordmark-mark">G</span><span className="wordmark-name">GwenMade</span></a>
            <h2><DisplayLines lines={content.title[lang]} /></h2>
            <p>{content.description[lang]}</p>
            <a className="button button-primary footer-cta" href={whatsappLink(copy(lang, "Hai GwenMade, aku mau mulai ngobrolin landing page buat brand-ku.", "Hi GwenMade, I’d like to talk about a landing page for my brand."))} target="_blank" rel="noreferrer">{content.cta[lang]} <span>↗︎</span></a>
          </div>
          <div className="footer-links">
            <div><span>{content.exploreLabel[lang]}</span><a href="#services">{copy(lang, "Layanan", "Services")}</a><a href="#works">{copy(lang, "Karya", "Work")}</a><a href="#pricing">{copy(lang, "Harga", "Pricing")}</a><a href="#process">{copy(lang, "Proses", "Process")}</a><a href="#faq">FAQ</a></div>
            <div><span>{content.contactLabel[lang]}</span><a href={contacts[0].href} target="_blank" rel="noreferrer">{contacts[0].value} ↗︎</a><a href={contacts[1].href} target="_blank" rel="noreferrer">{contacts[1].value} ↗︎</a><a href={contacts[2].href} target="_blank" rel="noreferrer">{contacts[2].value} ↗︎</a></div>
          </div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} GWENMADE STUDIO</span><a href="https://gwenmade.site">GWENMADE.SITE</a><span>{content.bottomNote[lang]}</span><button className="footer-secret-trigger" type="button" aria-label={copy(lang, "Buka pesan rahasia", "Open the secret message")} aria-haspopup="dialog" aria-expanded={secretOpen} onClick={openSecret}>?</button></div>
      </div>
      {secretOpen && <motion.div
        className={`secret-overlay ${secretClosing ? "is-closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="secret-slogan-title"
        ref={dialogRef}
        onKeyDown={handleSecretKeyDown}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.08, filter: "blur(12px)" }}
        animate={secretClosing
          ? { opacity: 0, scale: reduceMotion ? 1 : 0.94, y: reduceMotion ? 0 : "-2vh", filter: reduceMotion ? "blur(0px)" : "blur(10px)" }
          : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        transition={secretClosing
          ? { duration: reduceMotion ? 0.1 : 1, ease: [0.76, 0, 0.24, 1] }
          : { duration: reduceMotion ? 0.1 : 0.8, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className="secret-countdown" aria-hidden="true"><motion.span initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: reduceMotion ? 3.2 : 4.8, ease: "linear" }} /></div>
        <motion.span className="secret-light-streak" aria-hidden="true" initial={{ opacity: 0, scaleX: 0, x: "-42vw" }} animate={{ opacity: [0, 0.7, 0], scaleX: [0, 1, 0.2], x: ["-42vw", "0vw", "42vw"] }} transition={{ delay: 0.55, duration: 0.9, ease: "easeInOut" }} />
        <motion.div className="secret-overlay-top" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : 0.55, duration: reduceMotion ? 0.1 : 0.4 }}><button ref={closeRef} type="button" className="secret-close" onClick={closeSecret}><span>{copy(lang, "Tutup", "Close")}</span><X size={18} aria-hidden="true" /></button></motion.div>
        <div className="secret-main"><motion.svg className="secret-bmw-logo" viewBox="0 0 100 100" role="img" aria-label="BMW logo" initial={{ opacity: 0, scale: 0.7, rotate: reduceMotion ? 0 : -55 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: reduceMotion ? 0 : 1.7, duration: reduceMotion ? 0.1 : 0.8, ease: [0.16, 1, 0.3, 1] }}><circle cx="50" cy="50" r="48" fill="#e5e3dd" /><circle cx="50" cy="50" r="45" fill="#080808" /><text x="50" y="14.5" fill="#f5f3ed" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9" fontWeight="700" letterSpacing="1.1">BMW</text><circle cx="50" cy="50" r="34" fill="#f5f3ed" /><path d="M50 50 L16 50 A34 34 0 0 1 50 16 Z" fill="#f5f3ed" /><path d="M50 50 L50 16 A34 34 0 0 1 84 50 Z" fill="#1769aa" /><path d="M50 50 L84 50 A34 34 0 0 1 50 84 Z" fill="#f5f3ed" /><path d="M50 50 L50 84 A34 34 0 0 1 16 50 Z" fill="#1769aa" /><circle cx="50" cy="50" r="34" fill="none" stroke="#101010" strokeWidth="1.5" /><path d="M50 16 V84 M16 50 H84" fill="none" stroke="#101010" strokeWidth="1.5" /></motion.svg><h1 id="secret-slogan-title"><motion.span initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : 0.9, duration: reduceMotion ? 0.1 : 0.45 }}>NEED MONEY FOR</motion.span><motion.s initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : 1.25, duration: reduceMotion ? 0.1 : 0.45 }}>BMW<motion.span className="secret-strike" aria-hidden="true" initial={{ scaleX: 0 }} animate={{ scaleX: 1, boxShadow: reduceMotion ? "0 0 5px #ffb493" : ["0 0 3px #cf694b", "0 0 14px #ffb493", "0 0 3px #cf694b"] }} transition={{ scaleX: { delay: reduceMotion ? 0 : 1.75, duration: reduceMotion ? 0.1 : 0.55, ease: [0.16, 1, 0.3, 1] }, boxShadow: { delay: reduceMotion ? 0 : 2.3, duration: 0.8, repeat: reduceMotion ? 0 : Infinity, ease: "easeInOut" } }} /></motion.s><motion.strong initial={{ opacity: 0, scale: 0.92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : 1.85, duration: reduceMotion ? 0.1 : 0.55, ease: [0.16, 1, 0.3, 1] }}>CLAUDE MAX</motion.strong></h1></div>
        <motion.div className="secret-overlay-bottom" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduceMotion ? 0 : 0.65, duration: reduceMotion ? 0.1 : 0.4 }}><button type="button" className="secret-return" onClick={closeSecret}><ArrowLeft size={16} aria-hidden="true" />{copy(lang, "Kembali ke studio", "Back to the studio")}</button></motion.div>
      </motion.div>}
    </footer>
  );
}
