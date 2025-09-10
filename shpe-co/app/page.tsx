import Link from "next/link";
// import UpcomingEvents from "@/components/home/upcoming-events";
// import InstagramGrid from "@/components/home/instagram-grid";
import SponsorsSection from "@/components/home/sponsors-section";

export default async function Home() {
  return (
    <>
      {/* HERO */}
      <section className="bg-brand-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl sm:text-5xl font-semibold max-w-3xl">
            Advancing Hispanics in STEM across Colorado.
          </h1>
          <p className="mt-4 max-w-2xl text-white/90">
            We connect professionals, students, and allies through networking,
            mentorship, and career development to grow Hispanic leadership in
            STEM.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="https://www.shpe.org/membership"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-brand-orange px-4 py-2 font-semibold"
            >
              Join
            </a>
            <Link
              href="/sponsor"
              className="inline-flex items-center rounded-lg bg-white/10 px-4 py-2 font-semibold ring-1 ring-white/30 hover:bg-white/20"
            >
              Sponsor
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/events"
            className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
          >
            Events
          </Link>
          <Link
            href="/sponsor"
            className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
          >
            Sponsor
          </Link>
          <Link
            href="/jobs"
            className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
          >
            Job Board
          </Link>
        </div>
      </section>

      {/* UPCOMING EVENTS (auto) */}
      {/* <UpcomingEvents limit={4} /> */}

      {/* MISSION */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">Who we are</h2>
            <p className="mt-3 text-slate-700">
              SHPE Colorado is a professional chapter committed to empowering
              the Hispanic community to realize its fullest potential and to
              impact the world through STEM awareness, access, support, and
              development.
            </p>
            <Link
              href="/about"
              className="mt-4 inline-block text-brand-blue-600 font-medium"
            >
              Learn more →
            </Link>
          </div>
          <div className="rounded-xl bg-slate-100 h-48 md:h-auto" />
        </div>
      </section>

      {/* INSTAGRAM FLYERS (auto) */}
      {/* <InstagramGrid limit={6} /> */}

      {/* SPONSORS STRIP (placeholder) */}
      <SponsorsSection />
    </>
  );
}
