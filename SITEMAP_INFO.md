# Sitemap & SEO Setup

Sitemap telah berhasil dikonfigurasi untuk website GwenMade!

## 📄 Files yang Dibuat

### 1. **`app/sitemap.ts`**
File dinamis yang menghasilkan sitemap XML secara otomatis.

**URL**: `https://gwenmade.site/sitemap.xml`

**Konten yang tercakup**:
- ✅ Homepage (priority: 1.0)
- ✅ Section Services (priority: 0.8)
- ✅ Section Works (priority: 0.9)
- ✅ Section Pricing (priority: 0.8)
- ✅ Section Process (priority: 0.7)
- ✅ Section FAQ (priority: 0.6)
- ✅ Project URLs dinamis dari Supabase (priority: 0.7)

### 2. **`app/robots.ts`**
File untuk mengatur crawler search engine.

**URL**: `https://gwenmade.site/robots.txt`

**Konfigurasi**:
- ✅ Mengizinkan semua crawler untuk mengakses halaman publik
- ✅ Memblokir `/admin/` dan `/api/` dari search engine
- ✅ Mengarahkan ke sitemap: `https://gwenmade.site/sitemap.xml`

### 3. **`.env.local` (updated)**
Ditambahkan variable `NEXT_PUBLIC_SITE_URL=https://gwenmade.site`

## 🔍 Cara Melihat Sitemap

### Development:
1. Jalankan server: `npm run dev`
2. Buka: http://localhost:3000/sitemap.xml
3. Buka: http://localhost:3000/robots.txt

### Production:
1. Build project: `npm run build`
2. Start server: `npm run start`
3. Buka: http://localhost:3000/sitemap.xml

### Live (setelah deploy):
- Sitemap: https://gwenmade.site/sitemap.xml
- Robots: https://gwenmade.site/robots.txt

## 📊 Submit ke Search Engines

### Google Search Console
1. Buka: https://search.google.com/search-console
2. Tambahkan property: `https://gwenmade.site`
3. Di sidebar klik **Sitemaps**
4. Masukkan URL: `https://gwenmade.site/sitemap.xml`
5. Klik **Submit**

### Bing Webmaster Tools
1. Buka: https://www.bing.com/webmasters
2. Tambahkan site: `https://gwenmade.site`
3. Di menu klik **Sitemaps**
4. Submit sitemap URL: `https://gwenmade.site/sitemap.xml`

## 🎯 Fitur Sitemap

### Update Otomatis
Sitemap akan **otomatis update** setiap kali:
- Ada project baru yang dipublish di Supabase
- Ada perubahan konten
- Halaman di-rebuild

### Change Frequency
- Homepage: Weekly (karena sering update)
- Works section: Weekly (karena portfolio sering ditambah)
- Services, Pricing, Process: Monthly
- FAQ: Monthly
- Project URLs: Monthly

### Priority
Priority menunjukkan kepentingan halaman:
- 1.0 = Homepage (paling penting)
- 0.9 = Works (portfolio)
- 0.8 = Services & Pricing
- 0.7 = Process & Projects
- 0.6 = FAQ

## 🚀 Optimasi SEO Lanjutan

Untuk meningkatkan SEO lebih lanjut, pertimbangkan:

1. **Meta Tags** - Tambahkan di `app/layout.tsx`:
   - Open Graph tags untuk social sharing
   - Twitter Card tags
   - Canonical URLs

2. **Structured Data** - JSON-LD schema:
   - Organization schema
   - WebSite schema
   - BreadcrumbList schema

3. **Performance**:
   - Image optimization (sudah pakai Next.js Image)
   - Core Web Vitals monitoring
   - Lazy loading

4. **Analytics**:
   - Google Analytics 4
   - Google Tag Manager
   - Meta Pixel (sudah ada di rencana)

## ✅ Checklist Post-Deploy

Setelah deploy ke production:
- [ ] Verifikasi sitemap dapat diakses: `curl https://gwenmade.site/sitemap.xml`
- [ ] Verifikasi robots.txt: `curl https://gwenmade.site/robots.txt`
- [ ] Submit sitemap ke Google Search Console
- [ ] Submit sitemap ke Bing Webmaster Tools
- [ ] Test dengan [Google's Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Test dengan [Bing URL Inspection Tool](https://www.bing.com/webmasters)

## 📝 Catatan

- Sitemap di-generate secara **dinamis** (server-side)
- Tidak perlu manual update XML file
- Semua URL menggunakan `NEXT_PUBLIC_SITE_URL` dari environment variable
- Admin pages tidak diindeks oleh search engine (diblok via robots.txt)
