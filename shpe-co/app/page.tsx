export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import UpcomingEvents from "@/components/home/upcoming-events";
// import InstagramGrid from "@/components/home/instagram-grid";
import SponsorsSection from "@/components/home/sponsors-section";

import hero from "@/public/images/colorado.jpg";
import mission from "@/public/images/mission.png";

export default async function Home() {
  return (
    <>
      {/* HERO with background image + gradient scrim + quick actions */}
      <section className="relative isolate border-b border-slate-200 text-slate-900">
        {/* Background image (LCP) */}
        <div className="absolute inset-0 -z-10">
          <Image
            src={hero}
            alt="Photo of colorado mountains"
            fill
            priority
            fetchPriority="high"
            quality={60}
            placeholder="blur"
            sizes="100vw"
            className="object-cover object-[center_60%] pointer-events-none"
          />
          <div className="absolute inset-0 bg-white/60 md:bg-white/50" />
          <div className="absolute inset-y-0 left-0 w-full md:w-2/3 bg-gradient-to-r from-white/90 via-white/70 to-transparent" />
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1]">
              Advancing Hispanics in STEM across Colorado.
            </h1>
            <p className="mt-3 max-w-2xl text-slate-800">
              We connect professionals, students, and allies through networking,
              mentorship, and career development to grow Hispanic leadership in
              STEM.
            </p>
          </div>

          {/* Quick actions */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/events"
              className="h-14 rounded-xl ring-1 ring-slate-200 px-4 flex items-center justify-between bg-white/70 backdrop-blur-sm hover:bg-white/90"
            >
              <span>Events</span>
              <span className="text-slate-400">→</span>
            </Link>
            <Link
              href="/sponsor"
              className="h-14 rounded-xl ring-1 ring-slate-200 px-4 flex items-center justify-between bg-white/70 backdrop-blur-sm hover:bg-white/90"
            >
              <span>Sponsor</span>
              <span className="text-slate-400">→</span>
            </Link>
            <a
              href="https://shpe.org/membership/become-a-member/"
              target="_blank"
              rel="noopener noreferrer"
              className="h-14 rounded-xl ring-1 ring-slate-200 px-4 flex items-center justify-between bg-white/70 backdrop-blur-sm hover:bg-white/90"
            >
              <span>Join</span>
              <span className="text-slate-400">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS (auto) */}
      <section className="border-b border-slate-200">
        <UpcomingEvents limit={4} />
      </section>

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
              src={mission}
              alt="SHPE Colorado members at a recent networking event"
              fill
              className="object-cover"
              sizes="(min-width:1024px) 50vw, 100vw"
              quality={60}
              placeholder="blur"
              priority={false}
            />
          </div>
        </div>
      </section>

      {/* INSTAGRAM FLYERS (auto) */}
      {/* <InstagramGrid limit={6} /> */}

      {/* SPONSORS*/}
      <SponsorsSection />
    </>
  );
}
