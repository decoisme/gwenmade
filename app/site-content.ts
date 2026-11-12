export type Lang = "id" | "en";

export type Localized = { id: string; en: string };
export type LocalizedLines = { id: string[]; en: string[] };

export type SiteContent = {
  hero: {
    topline: Localized;
    kicker: Localized;
    title: LocalizedLines;
    description: Localized;
    primaryCta: Localized;
    secondaryCta: Localized;
    artCaption: Localized;
    artDescription: Localized;
    bottomLeft: Localized;
    bottomCenter: Localized;
    scrollCue: Localized;
  };
  services: {
    eyebrow: Localized;
    title: LocalizedLines;
    description: Localized;
    items: {
      no: string;
      slug: string;
      title: Localized;
      body: Localized;
      note: Localized;
    }[];
  };
  works: { eyebrow: Localized; title: LocalizedLines; description: Localized };
  pricing: {
    eyebrow: Localized;
    title: LocalizedLines;
    description: Localized;
    packages: {
      name: string;
      price: string;
      renewal: string;
      domain: string;
      pages: [string, string];
      copy: [string, string];
      automation: [string, string];
      tracking: [string, string];
      email: [string, string];
      revision: [string, string];
      delivery: [string, string];
      featured: boolean;
    }[];
  };
  process: {
    eyebrow: Localized;
    title: LocalizedLines;
    aside: Localized;
    steps: { no: string; title: [string, string]; body: [string, string] }[];
  };
  faq: {
    eyebrow: Localized;
    title: LocalizedLines;
    contactCta: Localized;
    items: { q: [string, string]; a: [string, string] }[];
  };
  footer: {
    eyebrow: Localized;
    title: LocalizedLines;
    description: Localized;
    cta: Localized;
    exploreLabel: Localized;
    contactLabel: Localized;
    bottomNote: Localized;
  };
};

export type PortfolioProject = {
  id: string;
  title_id: string;
  title_en: string;
  description_id: string;
  description_en: string;
  category_id: string;
  category_en: string;
  client: string;
  year: string;
  cover_image: string;
  project_url: string;
  sort_order: number;
  published: boolean;
};

export type ClientLogo = {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  sort_order: number;
  published: boolean;
};

export const defaultSiteContent: SiteContent = {
  hero: {
    topline: { id: "STUDIO DIGITAL INDEPENDEN · INDONESIA", en: "INDEPENDENT DIGITAL STUDIO · INDONESIA" },
    kicker: { id: "STUDIO LANDING PAGE · DESAIN & DEVELOPMENT", en: "LANDING PAGE STUDIO · DESIGN & DEVELOPMENT" },
    title: { id: ["Bikin ruang", "buat brand-mu", "jadi pilihan."], en: ["Make room", "for your brand", "to be chosen."] },
    description: { id: "Landing page custom yang merangkum cerita brand-mu dengan jelas, terasa dekat, dan siap mengubah kunjungan jadi obrolan.", en: "Custom landing pages that tell your brand story clearly, feel human, and turn visits into conversations." },
    primaryCta: { id: "Lihat paket", en: "Explore packages" },
    secondaryCta: { id: "Konsultasi dulu", en: "Talk it through" },
    artCaption: { id: "SATU BENTUK · DIBUAT KHUSUS", en: "ONE FORM · CUSTOM BY DESIGN" },
    artDescription: { id: "Satu bentuk. Banyak kemungkinan.", en: "One form. Many possibilities." },
    bottomLeft: { id: "DARI IDE SAMPAI TAYANG", en: "FROM FIRST IDEA TO LAUNCH" },
    bottomCenter: { id: "CUSTOM SEJAK LAYAR PERTAMA", en: "CUSTOM FROM THE VERY FIRST SCREEN" },
    scrollCue: { id: "LIHAT CARA KERJANYA", en: "SEE HOW IT WORKS" },
  },
  services: {
    eyebrow: { id: "01 / YANG KAMI KERJAKAN", en: "01 / WHAT WE DO" },
    title: { id: ["Bukan cuma", "tampil bagus.", "Juga bekerja."], en: ["More than", "looking good.", "Made to work."] },
    description: { id: "Satu halaman yang disusun dengan tujuan. Dari kesan pertama sampai tombol yang membantu orang mengambil langkah.", en: "One purposeful page, shaped from the first impression to the action that helps your audience take a next step." },
    items: [
      { no: "01", slug: "zero-template", title: { id: "Visual yang terasa memang punya kamu.", en: "A visual identity that feels like yours." }, body: { id: "Mulai dari kanvas kosong. Arah visual dan pengalaman dibentuk dari karakter brand serta orang yang ingin kamu jangkau.", en: "We start from a blank canvas, shaping the visual direction around your brand and the people you want to reach." }, note: { id: "ARAH VISUAL", en: "ART DIRECTION" } },
      { no: "02", slug: "fast-build", title: { id: "Progres jelas, dari awal sampai live.", en: "Clear progress, from brief to launch." }, body: { id: "Estimasi 7–14 hari kerja dengan update di tiap tahap. Kamu selalu tahu apa yang sedang dikerjakan.", en: "A 7–14 working-day estimate, with updates at every step so you always know what’s happening." }, note: { id: "7–14 HARI KERJA", en: "7–14 WORKING DAYS" } },
      { no: "03", slug: "conversion-copy", title: { id: "Copy yang bikin orang paham.", en: "Copy that makes things click." }, body: { id: "Susunan pesan yang bantu pengunjung mengenali manfaat, merasa yakin, dan tahu langkah berikutnya.", en: "A clear message structure helps visitors understand the value, feel confident, and know what to do next." }, note: { id: "STRATEGI KONTEN", en: "CONTENT STRATEGY" } },
      { no: "04", slug: "data-flow", title: { id: "Inquiry masuk, data ikut tertata.", en: "Every inquiry, neatly accounted for." }, body: { id: "Form, WhatsApp, Pixel, dan Google Sheets dapat disambungkan agar pertanyaan calon pelanggan tidak tercecer.", en: "Forms, WhatsApp, pixels, and Google Sheets can work together so customer inquiries stay organized." }, note: { id: "FORM · TRACKING · DATA", en: "FORMS · TRACKING · DATA" } },
    ],
  },
  works: {
    eyebrow: { id: "02 / PILIHAN KARYA", en: "02 / SELECTED WORK" },
    title: { id: ["Yang sudah", "kami wujudkan."], en: ["Made with", "good people."] },
    description: { id: "Beberapa cerita brand yang kami bantu hadirkan ke dunia digital.", en: "A few brand stories we’ve helped bring to life online." },
  },
  pricing: {
    eyebrow: { id: "03 / HARGA YANG JELAS", en: "03 / A CLEAR STARTING POINT" },
    title: { id: ["Paket yang pas", "buat langkahmu."], en: ["A package for", "your next move."] },
    description: { id: "Harga jelas dari awal. Semua paket mencakup desain custom, tampilan responsif, hosting, domain, dan SSL untuk tahun pertama.", en: "Clear pricing from day one. Every package includes custom design, responsive development, hosting, domain, and first-year SSL." },
    packages: [
      { name: "Lite", price: "599.000", renewal: "159.000", domain: ".my.id", pages: ["Ringkas, 3–4 section", "Compact, 3–4 sections"], copy: ["Materi dari kamu", "Copy from you"], automation: ["Tombol langsung ke WhatsApp", "Direct WhatsApp button"], tracking: ["", ""], email: ["", ""], revision: ["2x revisi", "2x revisions"], delivery: ["7–10 hari kerja", "7–10 working days"], featured: false },
      { name: "Standard", price: "899.000", renewal: "379.000", domain: ".com / .id", pages: ["Standar, 5–6 section", "Standard, 5–6 sections"], copy: ["Rapihin layout & copy", "Layout and copy polish"], automation: ["WhatsApp + form", "WhatsApp + form"], tracking: ["Meta Pixel basic", "Basic Meta Pixel"], email: ["", ""], revision: ["3x revisi", "3x revisions"], delivery: ["7–10 hari kerja", "7–10 working days"], featured: false },
      { name: "Pro", price: "1.399.000", renewal: "499.000", domain: ".com / .id", pages: ["Fokus konversi, 7–8 section", "Conversion-focused, 7–8 sections"], copy: ["Copy jualan pakai AIDA", "AIDA sales copy"], automation: ["WhatsApp + auto ke Google Sheets", "WhatsApp + auto Google Sheets"], tracking: ["Meta Pixel + Google Analytics", "Meta Pixel + Google Analytics"], email: ["1 email domain", "1 domain email"], revision: ["5x revisi", "5x revisions"], delivery: ["10–14 hari kerja", "10–14 working days"], featured: true },
      { name: "Scale", price: "1.999.000", renewal: "559.000", domain: ".com / .id / .co.id", pages: ["Lebih luas, 9–12 section", "Extended, 9–12 sections"], copy: ["Copywriting full", "Full copywriting"], automation: ["WhatsApp + Sheets + webhook", "WhatsApp + Sheets + webhook"], tracking: ["Pixel FB, Google, TikTok", "FB, Google, TikTok pixels"], email: ["Maks. 3 email domain", "Up to 3 domain emails"], revision: ["Revisi minor tanpa batas, 14 hari", "Unlimited minor revisions, 14 days"], delivery: ["10–14 hari kerja", "10–14 working days"], featured: false },
    ],
  },
  process: {
    eyebrow: { id: "04 / CARA KERJANYA", en: "04 / HOW IT COMES TOGETHER" },
    title: { id: ["Dari obrolan", "sampai tayang."], en: ["From first chat", "to launch day."] },
    aside: { id: "ESTIMASI PENGERJAAN · 7–14 HARI KERJA", en: "ESTIMATED DELIVERY · 7–14 WORKING DAYS" },
    steps: [
      { no: "01", title: ["Kenalan & cari tahu", "Start with the why"], body: ["Kita ngobrolin targetmu, siapa yang mau diajak, dan hal unik dari brand-mu.", "We get clear on your goals, audience, and what makes your brand different."] },
      { no: "02", title: ["Cari arah yang pas", "Find your direction"], body: ["Kita pilih arah visual dan susun alur yang bikin orang gampang paham.", "We find the right visual direction and map out a clear customer journey."] },
      { no: "03", title: ["Build, tes, rapihin", "Build, test, refine"], body: ["Halaman dibangun, dites di berbagai layar, lalu dirapihin sampai siap tayang.", "We build the page, test it across screens, and refine it before launch."] },
      { no: "04", title: ["Tayang & lanjut tumbuh", "Launch and grow"], body: ["Domain disambungin, halaman tayang, dan kamu siap ketemu lebih banyak calon pelanggan.", "Connect the domain, go live, and start reaching more potential customers."] },
    ],
  },
  faq: {
    eyebrow: { id: "05 / BEBERAPA PERTANYAAN", en: "05 / A FEW GOOD QUESTIONS" },
    title: { id: ["Yang sering", "ditanyain."], en: ["A few things", "to know."] },
    contactCta: { id: "Tanya langsung", en: "Ask us anything" },
    items: [
      { q: ["Beneran nggak pakai template?", "Do you really build without templates?"], a: ["Beneran. Tiap halaman dimulai dari nol dan dibikin sesuai karakter brand, audiens, dan tujuan bisnismu.", "Yes. Every page starts from scratch and is shaped around your brand, audience, and goals."] },
      { q: ["Tahun depan bayar apa aja?", "What does renewal cost next year?"], a: ["Perpanjangan mulai Rp 159.000 per tahun untuk .my.id, sampai Rp 559.000 untuk paket Scale. Tahun pertama sudah termasuk hosting, domain, dan SSL.", "Renewal starts at Rp 159,000 per year for .my.id and goes up to Rp 559,000 for Scale. First-year hosting, domain, and SSL are included."] },
      { q: ["Bayarnya gimana?", "How does payment work?"], a: ["DP 50% buat mulai. Sisanya dibayar saat halamanmu siap tayang.", "A 50% deposit gets things started. The balance is due when your page is ready to launch."] },
      { q: ["Aku perlu siapin apa?", "What should I prepare?"], a: ["Cukup siapin info bisnis, produk, dan target halamanmu. Belum punya copy atau visual? Bisa kita bahas bareng sesuai paket.", "Bring the basics about your business, product, and goals. Need copy or visuals too? We can figure that out together based on your package."] },
    ],
  },
  footer: {
    eyebrow: { id: "GWENMADE · DIGITAL STUDIO", en: "GWENMADE · DIGITAL STUDIO" },
    title: { id: ["Ada ide?", "Yuk wujudin."], en: ["Have an idea?", "Let’s make it real."] },
    description: { id: "Ceritain sedikit soal brand-mu. Kita cari bentuk yang paling pas, bareng-bareng.", en: "Tell us a little about your brand. We’ll find the right way to bring it to life." },
    cta: { id: "Mulai ngobrol", en: "Start a conversation" },
    exploreLabel: { id: "JELAJAHI", en: "EXPLORE" },
    contactLabel: { id: "SAPA KAMI", en: "SAY HELLO" },
    bottomNote: { id: "DIBUAT DENGAN PENUH PERHATIAN", en: "MADE WITH CARE" },
  },
};
