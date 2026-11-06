import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "GwenMade | Landing page yang dibuat untuk brand-mu",
  description:
    "Bangun landing page custom dengan GwenMade. Pilih paket, susun strategi bareng, dan luncurkan halaman yang dirancang khusus untuk brand-mu.",
  metadataBase: new URL("https://gwenmade.site"),
  openGraph: {
    title: "GwenMade | Landing page yang dibuat untuk brand-mu",
    description: "Custom landing pages, built around your brand and its next move.",
    url: "https://gwenmade.site",
    siteName: "GwenMade",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
