import Link from "next/link";
import Image from "next/image";
// import UpcomingEvents from "@/components/home/upcoming-events";
// import InstagramGrid from "@/components/home/instagram-grid";
import SponsorsSection from "@/components/home/sponsors-section";

export default async function Home() {
  return (
    <>
      {/* HERO */}
      <section className="bg-brand-blue-600 text-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl sm:text-5xl font-semibold max-w-3xl">
            Advancing Hispanics in STEM across Colorado.
          </h1>
          <p className="mt-4 max-w-2xl text-black/90">
            We connect professionals, students, and allies through networking,
            mentorship, and career development to grow Hispanic leadership in
            STEM.
          </p>
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
            href="https://shpe.org/membership/become-a-member/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
          >
            Join
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
          <div
            className="relative rounded-xl overflow-hidden bg-slate-100 shadow-sm
                    aspect-[16/10] md:aspect-[4/3]"
          >
            <Image
              src="/images/mission.png"
              alt="SHPE Colorado members at a recent networking event"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* INSTAGRAM FLYERS (auto) */}
      {/* <InstagramGrid limit={6} /> */}

      {/* SPONSORS STRIP (placeholder) */}
      <SponsorsSection />
    </>
  );
}
