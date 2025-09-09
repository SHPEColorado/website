import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-white text-slate-900">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter
          facebook="https://www.facebook.com/SHPEColorado"
          instagram="https://www.instagram.com/SHPEColorado"
          linkedin="https://www.linkedin.com/company/shpe-colorado"
        />
      </body>
    </html>
  );
}
