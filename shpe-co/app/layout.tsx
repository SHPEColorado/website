import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.shpecolorado.org"),
  title: {
    default: "SHPE Colorado",
    template: "%s | SHPE Colorado",
  },
  description:
    "SHPE Colorado — advancing Hispanics in STEM across Colorado through networking, mentorship, and career development.",
  openGraph: {
    title: "SHPE Colorado",
    description:
      "Advancing Hispanics in STEM across Colorado through networking, mentorship, and career development.",
    url: "https://www.shpecolorado.org",
    siteName: "SHPE Colorado",
    images: [{ url: "/images/og-cover.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SHPE Colorado",
    description:
      "Advancing Hispanics in STEM across Colorado through networking, mentorship, and career development.",
    images: ["/images/og-cover.png"],
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-white text-slate-900"
      >
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
