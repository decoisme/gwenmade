/**
 * Generate Static Sitemap
 * 
 * Script untuk generate sitemap.xml statis di folder public
 * Jalankan: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

// Konfigurasi
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gwenmade.site';
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

// Tanggal saat ini dalam format ISO
const today = new Date().toISOString().split('T')[0];

// Daftar halaman statis
const staticPages = [
  { url: '', changefreq: 'weekly', priority: '1.0', lastmod: today },
  { url: '/#services', changefreq: 'monthly', priority: '0.8', lastmod: today },
  { url: '/#works', changefreq: 'weekly', priority: '0.9', lastmod: today },
  { url: '/#pricing', changefreq: 'monthly', priority: '0.8', lastmod: today },
  { url: '/#process', changefreq: 'monthly', priority: '0.7', lastmod: today },
  { url: '/#faq', changefreq: 'monthly', priority: '0.6', lastmod: today },
];

// Tambahkan project URLs di sini jika perlu
const projectPages = [
  { url: 'https://sackutravel.vercel.app/', changefreq: 'monthly', priority: '0.7', lastmod: today },
  { url: 'https://www.yukie.my.id', changefreq: 'monthly', priority: '0.7', lastmod: today },
  { url: 'https://tivent-chi.vercel.app/', changefreq: 'monthly', priority: '0.7', lastmod: today },
  { url: 'https://micro-terrari.vercel.app/', changefreq: 'monthly', priority: '0.7', lastmod: today },
];

// Generate XML
function generateSitemap() {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
  xml += '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
  xml += '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n\n';

  // Static pages
  xml += '  <!-- Main Pages -->\n';
  staticPages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${SITE_URL}${page.url}</loc>\n`;
    xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n\n';
  });

  // Project pages
  if (projectPages.length > 0) {
    xml += '  <!-- Portfolio Projects -->\n';
    projectPages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${page.url}</loc>\n`;
      xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n\n';
    });
  }

  xml += '</urlset>\n';
  return xml;
}

// Write to file
try {
  const sitemap = generateSitemap();
  fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf8');
  console.log('✅ Sitemap generated successfully!');
  console.log(`📄 Location: ${OUTPUT_PATH}`);
  console.log(`🔗 URL: ${SITE_URL}/sitemap.xml`);
  console.log(`📊 Total URLs: ${staticPages.length + projectPages.length}`);
} catch (error) {
  console.error('❌ Error generating sitemap:', error.message);
  process.exit(1);
}
