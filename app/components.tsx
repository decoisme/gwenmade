"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Check, Minus } from "lucide-react";
import { Flip } from "gsap/Flip";
import { gsap } from "gsap";
import { BrandMark } from "@/app/brand-mark";

type Lang = "id" | "en";

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

const chapterIds = ["home", "services", "pricing", "process", "faq"] as const;

export function EditorialSite() {
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
        <Hero lang={lang} />
        <Services lang={lang} />
        <Pricing lang={lang} />
        <Process lang={lang} />
        <FAQ lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
}

function Navbar({ lang, activeSection, onToggleLanguage }: { lang: Lang; activeSection: number; onToggleLanguage: () => void }) {
  const navItems = [
    { id: "services", label: copy(lang, "Layanan", "Services") },
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
            <summary>{copy(lang, "Ngobrol yuk", "Let’s talk")} <span>↗</span></summary>
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

function Hero({ lang }: { lang: Lang }) {
  return (
    <section className="hero editorial-hero" id="home">
      <div className="hero-topline editorial-wrap"><span>INDEPENDENT DIGITAL STUDIO <i>·</i> INDONESIA</span><span>AVAILABLE FOR SELECT PROJECTS</span></div>
      <div className="hero-stage editorial-wrap">
        <div className="hero-copy">
          <p className="hero-kicker reveal"><span className="status-dot" />{copy(lang, "STUDIO LANDING PAGE · DESAIN & DEVELOPMENT", "LANDING PAGE STUDIO · DESIGN & DEVELOPMENT")}</p>
          <h1 className="reveal">{lang === "id" ? <>Bikin ruang<br />buat brand-mu<br /><em>jadi pilihan.</em></> : <>Make room<br />for your brand<br /><em>to be chosen.</em></>}</h1>
          <p className="hero-description reveal">{copy(lang, "Landing page custom yang merangkum cerita brand-mu dengan jelas, terasa dekat, dan siap mengubah kunjungan jadi obrolan.", "Custom landing pages that tell your brand story clearly, feel human, and turn visits into conversations.")}</p>
          <div className="hero-actions reveal">
            <a className="button button-primary" href="#pricing">{copy(lang, "Lihat paket", "Explore packages")} <span>↗</span></a>
            <a className="button button-text" href={whatsappLink(copy(lang, "Hai GwenMade, aku mau konsultasi soal landing page.", "Hi GwenMade, I’d love to talk about a landing page."))} target="_blank" rel="noreferrer">{copy(lang, "Konsultasi dulu", "Talk it through")}</a>
          </div>
        </div>
        <div className="hero-art reveal" aria-label={copy(lang, "Identitas tiga dimensi GwenMade", "Three-dimensional GwenMade identity")}>
          <div className="hero-art-caption"><span>OBJECT 001</span><span>GWENMADE / CUSTOM BY DESIGN</span></div>
          <BrandMark label={copy(lang, "Logo tiga dimensi GwenMade", "Three-dimensional GwenMade logo")} />
          <p>{copy(lang, "Satu bentuk. Banyak kemungkinan.", "One form. Many possibilities.")}</p>
        </div>
      </div>
      <div className="hero-bottomline editorial-wrap">
        <span>{copy(lang, "DARI IDE SAMPAI TAYANG", "FROM FIRST IDEA TO LAUNCH")}</span>
        <span>{copy(lang, "CUSTOM SEJAK LAYAR PERTAMA", "CUSTOM FROM THE VERY FIRST SCREEN")}</span>
        <a href="#services" className="scroll-cue"><span>{copy(lang, "LIHAT CARA KERJANYA", "SEE HOW IT WORKS")}</span><span>↓</span></a>
      </div>
    </section>
  );
}

const featureData = [
  { no: "01", slug: "zero-template", title: { id: "Visual yang terasa memang punya kamu.", en: "A visual identity that feels like yours." }, body: { id: "Mulai dari kanvas kosong. Arah visual dan pengalaman dibentuk dari karakter brand serta orang yang ingin kamu jangkau.", en: "We start from a blank canvas, shaping the visual direction around your brand and the people you want to reach." }, note: { id: "ARAH VISUAL", en: "ART DIRECTION" } },
  { no: "02", slug: "fast-build", title: { id: "Progres jelas, dari awal sampai live.", en: "Clear progress, from brief to launch." }, body: { id: "Estimasi 7–14 hari kerja dengan update di tiap tahap. Kamu selalu tahu apa yang sedang dikerjakan.", en: "A 7–14 working-day estimate, with updates at every step so you always know what’s happening." }, note: { id: "7–14 HARI KERJA", en: "7–14 WORKING DAYS" } },
  { no: "03", slug: "conversion-copy", title: { id: "Copy yang bikin orang paham.", en: "Copy that makes things click." }, body: { id: "Susunan pesan yang bantu pengunjung mengenali manfaat, merasa yakin, dan tahu langkah berikutnya.", en: "A clear message structure helps visitors understand the value, feel confident, and know what to do next." }, note: { id: "STRATEGI KONTEN", en: "CONTENT STRATEGY" } },
  { no: "04", slug: "data-flow", title: { id: "Inquiry masuk, data ikut tertata.", en: "Every inquiry, neatly accounted for." }, body: { id: "Form, WhatsApp, Pixel, dan Google Sheets dapat disambungkan agar pertanyaan calon pelanggan tidak tercecer.", en: "Forms, WhatsApp, pixels, and Google Sheets can work together so customer inquiries stay organized." }, note: { id: "FORM · TRACKING · DATA", en: "FORMS · TRACKING · DATA" } },
];

function AutomationCanvas({ lang }: { lang: Lang }) {
  return (
    <div className="automation-canvas" aria-label={copy(lang, "Ilustrasi alur data lead", "Illustration of the lead data flow")}>
      <div className="automation-flow"><span>{copy(lang, "FORM MASUK", "FORM SUBMITTED")}</span><b>→</b><span>GOOGLE SHEETS</span><b>→</b><span>META PIXEL</span></div>
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

function Services({ lang }: { lang: Lang }) {
  return (
    <section className="services-section editorial-wrap" id="services">
      <div className="section-heading reveal">
        <div><span className="section-index">01 / WHAT WE DO</span><h2>{lang === "id" ? <>Bukan cuma<br />tampil bagus.<br /><em>Juga bekerja.</em></> : <>More than<br />looking good.<br /><em>Made to work.</em></>}</h2></div>
        <p>{copy(lang, "Satu halaman yang disusun dengan tujuan. Dari kesan pertama sampai tombol yang membantu orang mengambil langkah.", "One purposeful page, shaped from the first impression to the action that helps your audience take a next step.")}</p>
      </div>
      <div className="feature-grid">
        {featureData.map((feature) => (
          <article className={`feature-card ${feature.slug} reveal`} key={feature.no}>
            <div className="feature-meta"><span>{feature.note[lang]}</span><span>{feature.no} / 04</span></div>
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

const packages = [
  { name: "Lite", price: "599.000", renewal: "159.000", domain: ".my.id", pages: ["Ringkas, 3–4 section", "Compact, 3–4 sections"], copy: ["Materi dari kamu", "Copy from you"], automation: ["Tombol langsung ke WhatsApp", "Direct WhatsApp button"], tracking: ["Belum termasuk", "Not included"], email: ["Belum termasuk", "Not included"], motion: ["Belum termasuk", "Not included"], revision: ["2x revisi", "2x revisions"], delivery: ["7–10 hari kerja", "7–10 working days"], featured: false },
  { name: "Standard", price: "899.000", renewal: "379.000", domain: ".com / .id", pages: ["Standar, 5–6 section", "Standard, 5–6 sections"], copy: ["Rapihin layout & copy", "Layout and copy polish"], automation: ["WhatsApp + form", "WhatsApp + form"], tracking: ["Meta Pixel basic", "Basic Meta Pixel"], email: ["Belum termasuk", "Not included"], motion: ["Belum termasuk", "Not included"], revision: ["3x revisi", "3x revisions"], delivery: ["7–10 hari kerja", "7–10 working days"], featured: false },
  { name: "Pro", price: "1.399.000", renewal: "499.000", domain: ".com / .id", pages: ["Fokus konversi, 7–8 section", "Conversion-focused, 7–8 sections"], copy: ["Copy jualan pakai AIDA", "AIDA sales copy"], automation: ["WhatsApp + auto ke Google Sheets", "WhatsApp + auto Google Sheets"], tracking: ["Meta Pixel + Google Analytics", "Meta Pixel + Google Analytics"], email: ["1 email domain", "1 domain email"], motion: ["Belum termasuk", "Not included"], revision: ["5x revisi", "5x revisions"], delivery: ["10–14 hari kerja", "10–14 working days"], featured: true },
  { name: "Scale", price: "1.999.000", renewal: "559.000", domain: ".com / .id / .co.id", pages: ["Lebih luas, 9–12 section", "Extended, 9–12 sections"], copy: ["Copywriting full", "Full copywriting"], automation: ["WhatsApp + Sheets + webhook", "WhatsApp + Sheets + webhook"], tracking: ["Pixel FB, Google, TikTok", "FB, Google, TikTok pixels"], email: ["Maks. 3 email domain", "Up to 3 domain emails"], motion: ["Animasi GSAP", "GSAP motion"], revision: ["Revisi minor tanpa batas, 14 hari", "Unlimited minor revisions, 14 days"], delivery: ["10–14 hari kerja", "10–14 working days"], featured: false },
];

function packageLink(name: string, lang: Lang) {
  const message = lang === "id"
    ? `Hai GwenMade, aku tertarik sama paket ${name}. Boleh cerita lebih lanjut?`
    : `Hi GwenMade, I'm interested in the ${name} package. Could you tell me more?`;
  return whatsappLink(message);
}

function FeatureLine({ text }: { text: string }) {
  const included = text !== "Belum termasuk" && text !== "Not included";
  return <li className={included ? "" : "not-included"}>{included ? <Check size={14} aria-hidden="true" /> : <Minus size={14} aria-hidden="true" />}{text}</li>;
}

function Pricing({ lang }: { lang: Lang }) {
  const [view, setView] = useState<"cards" | "compare">("cards");
  const gridRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const fieldLabels = lang === "id"
    ? ["Perpanjangan / tahun", "Domain", "Hosting + SSL", "Panjang halaman", "Copywriting", "Automasi", "Tracking & ads", "Email bisnis", "Motion design", "Revisi", "Waktu pengerjaan"]
    : ["Annual renewal", "Domain", "Hosting + SSL", "Page length", "Copywriting", "Automation", "Tracking & ads", "Business email", "Motion design", "Revisions", "Turnaround"];

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
    item.tracking[lang === "id" ? 0 : 1],
    item.email[lang === "id" ? 0 : 1],
    item.motion[lang === "id" ? 0 : 1],
    item.revision[lang === "id" ? 0 : 1],
    item.delivery[lang === "id" ? 0 : 1],
  ];

  return (
    <section className="pricing-section" id="pricing">
      <div className="editorial-wrap">
        <div className="section-heading pricing-heading reveal">
          <div><span className="section-index">02 / A CLEAR STARTING POINT</span><h2>{lang === "id" ? <>Paket yang pas<br /><em>buat langkahmu.</em></> : <>A package for<br /><em>your next move.</em></>}</h2></div>
          <p>{copy(lang, "Harga jelas dari awal. Semua paket mencakup desain custom, tampilan responsif, hosting, domain, dan SSL untuk tahun pertama.", "Clear pricing from day one. Every package includes custom design, responsive development, hosting, domain, and first-year SSL.")}</p>
        </div>
        <div className="pricing-toolbar reveal"><span>{copy(lang, "PILIH CARA MELIHAT", "CHOOSE A VIEW")}</span><div className="pricing-switch" role="group" aria-label={copy(lang, "Tampilan harga", "Pricing view")}><button type="button" aria-pressed={view === "cards"} className={view === "cards" ? "active" : ""} onClick={() => changeView("cards")}>{copy(lang, "Ringkas", "Overview")}</button><button type="button" aria-pressed={view === "compare"} className={view === "compare" ? "active" : ""} onClick={() => changeView("compare")}>{copy(lang, "Bandingkan", "Compare")}</button></div></div>
        <div className={`pricing-grid ${view === "compare" ? "is-comparison" : ""}`} ref={gridRef}>
          {view === "cards" ? packages.map((item, index) => (
            <article className={`price-card pricing-item reveal ${item.featured ? "price-featured" : ""}`} key={item.name} data-flip-id={`package-${item.name}`}>
              {item.featured && <div className="best-value">{copy(lang, "PALING DIPILIH", "BEST VALUE")}</div>}
              <div className="price-top"><span className="plan-name">{item.name}</span><span className="plan-index">0{index + 1} / 04</span></div>
              <div className="price-amount"><small>Rp</small>{item.price}</div>
              <p className="renewal">{copy(lang, "per proyek", "per project")} <span>· {copy(lang, "perpanjangan", "renewal")} Rp {item.renewal}/{copy(lang, "thn", "yr")}</span></p>
              <a className={`button ${item.featured ? "button-primary" : "button-outline"} plan-cta`} href={packageLink(item.name, lang)} target="_blank" rel="noreferrer">{copy(lang, "Pilih paket", "Choose package")} <span>↗</span></a>
              <div className="plan-includes"><span>{copy(lang, "YANG TERMASUK", "WHAT’S INCLUDED")}</span><ul>
                {[`Domain ${item.domain}`, lang === "id" ? "Hosting + SSL · 1 tahun" : "Hosting + SSL · 1 year", item.pages[lang === "id" ? 0 : 1], item.copy[lang === "id" ? 0 : 1], item.automation[lang === "id" ? 0 : 1], item.tracking[lang === "id" ? 0 : 1], item.email[lang === "id" ? 0 : 1], item.motion[lang === "id" ? 0 : 1], item.revision[lang === "id" ? 0 : 1], item.delivery[lang === "id" ? 0 : 1]].map((text, featureIndex) => <FeatureLine text={text} key={`${item.name}-${featureIndex}`} />)}
              </ul></div>
            </article>
          )) : (
            <>
              <div className="comparison-table pricing-item" role="region" tabIndex={0} aria-label={copy(lang, "Perbandingan paket", "Package comparison")}>
                <div className="comparison-row comparison-head"><span className="comparison-label">{copy(lang, "PAKET", "PACKAGE")}</span>{packages.map((item) => <div className={`comparison-plan ${item.featured ? "highlight-plan" : ""}`} data-flip-id={`package-${item.name}`} key={item.name}><span>{item.name}</span><strong>Rp {item.price}</strong><a href={packageLink(item.name, lang)} target="_blank" rel="noreferrer">{copy(lang, "Pilih", "Choose")} ↗</a></div>)}</div>
                {fieldLabels.map((label, rowIndex) => <div className="comparison-row" key={label}><span className="comparison-label">{label}</span>{packages.map((item) => <span className={`comparison-value ${item.featured ? "highlight-value" : ""}`} key={item.name}>{planValues(item)[rowIndex]}</span>)}</div>)}
              </div>
              <div className="mobile-comparison">
                {packages.map((item, index) => (
                  <article className={`mobile-compare-card ${item.featured ? "price-featured" : ""}`} key={item.name}>
                    {item.featured && <div className="best-value">{copy(lang, "PALING DIPILIH", "BEST VALUE")}</div>}
                    <div className="mobile-compare-head"><div><span className="mobile-compare-index">0{index + 1} / 04</span><h3>{item.name}</h3></div><strong>Rp {item.price}</strong></div>
                    <a className={`button ${item.featured ? "button-primary" : "button-outline"} mobile-compare-cta`} href={packageLink(item.name, lang)} target="_blank" rel="noreferrer">{copy(lang, "Pilih paket ini", "Choose this plan")} <span>↗</span></a>
                    <dl className="mobile-compare-details">{fieldLabels.map((label, rowIndex) => <div className="mobile-compare-row" key={label}><dt>{label}</dt><dd>{planValues(item)[rowIndex]}</dd></div>)}</dl>
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

const processSteps = [
  { no: "01", title: ["Kenalan & cari tahu", "Start with the why"], body: ["Kita ngobrolin targetmu, siapa yang mau diajak, dan hal unik dari brand-mu.", "We get clear on your goals, audience, and what makes your brand different."] },
  { no: "02", title: ["Cari arah yang pas", "Find your direction"], body: ["Kita pilih arah visual dan susun alur yang bikin orang gampang paham.", "We find the right visual direction and map out a clear customer journey."] },
  { no: "03", title: ["Build, tes, rapihin", "Build, test, refine"], body: ["Halaman dibangun, dites di berbagai layar, lalu dirapihin sampai siap tayang.", "We build the page, test it across screens, and refine it before launch."] },
  { no: "04", title: ["Tayang & lanjut tumbuh", "Launch and grow"], body: ["Domain disambungin, halaman tayang, dan kamu siap ketemu lebih banyak calon pelanggan.", "Connect the domain, go live, and start reaching more potential customers."] },
];

function Process({ lang }: { lang: Lang }) {
  return (
    <section className="process-section editorial-wrap" id="process">
      <div className="process-heading reveal"><span className="section-index">03 / HOW IT COMES TOGETHER</span><h2>{lang === "id" ? <>Dari obrolan<br /><em>sampai tayang.</em></> : <>From first chat<br /><em>to launch day.</em></>}</h2></div>
      <div className="process-list">{processSteps.map((step) => <article className="process-step reveal" key={step.no}><span className="process-number">{step.no}</span><div><h3>{step.title[lang === "id" ? 0 : 1]}</h3><p>{step.body[lang === "id" ? 0 : 1]}</p></div><span className="step-mark" aria-hidden="true">↗</span></article>)}</div>
      <p className="process-aside">{copy(lang, "ESTIMASI PENGERJAAN · 7–14 HARI KERJA", "ESTIMATED DELIVERY · 7–14 WORKING DAYS")}</p>
    </section>
  );
}

const faqContent = [
  { q: ["Beneran nggak pakai template?", "Do you really build without templates?"], a: ["Beneran. Tiap halaman dimulai dari nol dan dibikin sesuai karakter brand, audiens, dan tujuan bisnismu.", "Yes. Every page starts from scratch and is shaped around your brand, audience, and goals."] },
  { q: ["Tahun depan bayar apa aja?", "What does renewal cost next year?"], a: ["Perpanjangan mulai Rp 159.000 per tahun untuk .my.id, sampai Rp 559.000 untuk paket Scale. Tahun pertama sudah termasuk hosting, domain, dan SSL.", "Renewal starts at Rp 159,000 per year for .my.id and goes up to Rp 559,000 for Scale. First-year hosting, domain, and SSL are included."] },
  { q: ["Bayarnya gimana?", "How does payment work?"], a: ["DP 50% buat mulai. Sisanya dibayar saat halamanmu siap tayang.", "A 50% deposit gets things started. The balance is due when your page is ready to launch."] },
  { q: ["Aku perlu siapin apa?", "What should I prepare?"], a: ["Cukup siapin info bisnis, produk, dan target halamanmu. Belum punya copy atau visual? Bisa kita bahas bareng sesuai paket.", "Bring the basics about your business, product, and goals. Need copy or visuals too? We can figure that out together based on your package."] },
];

function FAQ({ lang }: { lang: Lang }) {
  return (
    <section className="faq-section editorial-wrap" id="faq">
      <div className="faq-intro reveal"><span className="section-index">04 / A FEW GOOD QUESTIONS</span><h2>{lang === "id" ? <>Yang sering<br /><em>ditanyain.</em></> : <>A few things<br /><em>to know.</em></>}</h2><a href={whatsappLink(copy(lang, "Hai GwenMade, aku mau tanya-tanya dulu.", "Hi GwenMade, I have a quick question."))} target="_blank" rel="noreferrer">{copy(lang, "Tanya langsung", "Ask us anything")} ↗</a></div>
      <div className="faq-list">{faqContent.map((faq, index) => <details className="faq-item reveal" key={faq.q[0]}><summary><span className="faq-index">0{index + 1}</span><span>{faq.q[lang === "id" ? 0 : 1]}</span><span className="faq-plus" aria-hidden="true">+</span></summary><p>{faq.a[lang === "id" ? 0 : 1]}</p></details>)}</div>
    </section>
  );
}

function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="footer">
      <div className="editorial-wrap">
        <div className="footer-main">
          <div className="footer-intro">
            <span className="section-index">GWENMADE · DIGITAL STUDIO</span>
            <a className="wordmark footer-wordmark" href="#home" aria-label="GwenMade home"><span className="wordmark-mark">G</span><span className="wordmark-name">GwenMade</span></a>
            <h2>{lang === "id" ? <>Ada ide?<br /><em>Yuk wujudin.</em></> : <>Have an idea?<br /><em>Let’s make it real.</em></>}</h2>
            <p>{copy(lang, "Ceritain sedikit soal brand-mu. Kita cari bentuk yang paling pas, bareng-bareng.", "Tell us a little about your brand. We’ll find the right way to bring it to life.")}</p>
            <a className="button button-primary footer-cta" href={whatsappLink(copy(lang, "Hai GwenMade, aku mau mulai ngobrolin landing page buat brand-ku.", "Hi GwenMade, I’d like to talk about a landing page for my brand."))} target="_blank" rel="noreferrer">{copy(lang, "Mulai ngobrol", "Start a conversation")} <span>↗</span></a>
          </div>
          <div className="footer-links">
            <div><span>{copy(lang, "JELAJAHI", "EXPLORE")}</span><a href="#services">{copy(lang, "Layanan", "Services")}</a><a href="#pricing">{copy(lang, "Harga", "Pricing")}</a><a href="#process">{copy(lang, "Proses", "Process")}</a><a href="#faq">FAQ</a></div>
            <div><span>{copy(lang, "SAPA KAMI", "SAY HELLO")}</span><a href={contacts[0].href} target="_blank" rel="noreferrer">{contacts[0].value} ↗</a><a href={contacts[1].href} target="_blank" rel="noreferrer">{contacts[1].value} ↗</a><a href={contacts[2].href} target="_blank" rel="noreferrer">{contacts[2].value} ↗</a></div>
          </div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} GWENMADE STUDIO</span><a href="https://gwenmade.site">GWENMADE.SITE</a><span>{copy(lang, "DIBUAT DENGAN PENUH PERHATIAN", "MADE WITH CARE")}</span></div>
      </div>
    </footer>
  );
}
