import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        + <title>SHPE Colorado</title>+{" "}
        <meta
          name="description"
          content="SHPE Colorado — advancing Hispanics in STEM across Colorado through networking, mentorship, and career development."
        />
        +{" "}
      </head>
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
