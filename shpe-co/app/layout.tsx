import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import './globals.css';
import './fullcalendar.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-white text-slate-900">
        <SiteHeader />
        <main className="flex-1 py-4">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
