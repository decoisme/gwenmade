# Cara Update Sitemap

Ada 2 cara untuk update sitemap di project ini:

## 1. Sitemap Dinamis (Otomatis) ✨

File: `app/sitemap.ts`

Sitemap ini **otomatis update** setiap kali:
- Ada request ke `/sitemap.xml`
- Data project berubah di Supabase
- Website di-rebuild

**Keuntungan:**
- ✅ Selalu up-to-date dengan data dari database
- ✅ Tidak perlu manual update
- ✅ Otomatis include project baru

**Cara akses:**
```bash
# Development
http://localhost:3000/sitemap.xml

# Production
https://gwenmade.site/sitemap.xml
```

## 2. Sitemap Statis (Manual) 📄

File: `public/sitemap.xml`

Ini adalah backup sitemap yang bisa diupdate manual.

### Cara Update Manual:

#### Opsi A: Edit Langsung File XML
1. Buka `public/sitemap.xml`
2. Edit URL, lastmod, priority sesuai kebutuhan
3. Save file

#### Opsi B: Gunakan Script Generator
1. Edit `scripts/generate-sitemap.js`
2. Update array `staticPages` atau `projectPages`
3. Jalankan script:
```bash
node scripts/generate-sitemap.js
```

### Format Entry Sitemap:

```xml
<url>
  <loc>https://gwenmade.site/halaman</loc>
  <lastmod>2024-11-22</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

**Field Explanation:**
- `<loc>`: URL lengkap halaman
- `<lastmod>`: Tanggal terakhir diupdate (YYYY-MM-DD)
- `<changefreq>`: Seberapa sering berubah (daily, weekly, monthly, yearly)
- `<priority>`: Kepentingan halaman (0.0 - 1.0)

## Priority Guidelines

```
1.0  = Homepage
0.9  = Portfolio/Works (sangat penting)
0.8  = Services, Pricing (penting)
0.7  = Process, individual projects
0.6  = FAQ, about
0.5  = Blog posts
0.4  = Tags, categories
```

## Change Frequency Guidelines

```
always  = Halaman yang selalu berubah (jarang dipakai)
hourly  = Update setiap jam (berita, feed)
daily   = Update setiap hari
weekly  = Update setiap minggu (homepage, blog index)
monthly = Update bulanan (services, pricing)
yearly  = Update tahunan (about, contact)
never   = Arsip, tidak pernah berubah
```

## Kapan Update Sitemap?

### Update Sitemap Ketika:
- ✅ Menambah halaman baru
- ✅ Menghapus halaman
- ✅ Mengubah struktur URL
- ✅ Launch project portfolio baru
- ✅ Update konten signifikan

### TIDAK Perlu Update Untuk:
- ❌ Perubahan kecil pada teks
- ❌ Update styling/CSS
- ❌ Bug fixes
- ❌ Perubahan internal code

## Testing Sitemap

### 1. Cek Format Valid:
```bash
# Online validator
https://www.xml-sitemaps.com/validate-xml-sitemap.html

# Atau manual check
curl https://gwenmade.site/sitemap.xml
```

### 2. Test dengan Google:
1. Buka Google Search Console
2. Masuk ke "Sitemaps"
3. Test sitemap URL
4. Lihat status dan error (jika ada)

### 3. Test dengan Bing:
1. Buka Bing Webmaster Tools
2. Site Scan > Sitemaps
3. Submit dan lihat report

## Troubleshooting

### Sitemap tidak muncul?
- Cek apakah file ada di `public/sitemap.xml`
- Cek Next.js build sudah selesai
- Clear cache browser (Ctrl+Shift+R)

### Format error?
- Pastikan XML valid (tidak ada < > & yang tidak di-escape)
- Cek structure sitemap sesuai schema
- Gunakan XML validator online

### URLs tidak ke-index?
- Tunggu 1-2 minggu setelah submit
- Cek robots.txt tidak block URL
- Pastikan URL bisa diakses publik
- Submit manual URL di Search Console

## Automated Update (Advanced)

Untuk otomatis generate sitemap saat build:

### 1. Tambahkan script di `package.json`:
```json
{
  "scripts": {
    "generate:sitemap": "node scripts/generate-sitemap.js",
    "prebuild": "npm run generate:sitemap"
  }
}
```

### 2. Sitemap akan auto-generate sebelum build:
```bash
npm run build
# Akan otomatis run generate:sitemap dulu
```

## Rekomendasi

**Untuk GwenMade:**
Gunakan **Sitemap Dinamis** (`app/sitemap.ts`) karena:
- ✅ Otomatis sync dengan database Supabase
- ✅ Tidak perlu manual maintenance
- ✅ Selalu up-to-date dengan project baru

**Gunakan Sitemap Statis** (`public/sitemap.xml`) hanya sebagai:
- Backup jika ada masalah dengan dynamic sitemap
- Dokumentasi struktur URL
- Quick reference

## Resources

- [Sitemap Protocol](https://www.sitemaps.org/protocol.html)
- [Google Sitemap Guide](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Bing Sitemap Guide](https://www.bing.com/webmasters/help/how-to-create-a-sitemap-3b5cf6ed)
