export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us | SHPE Colorado",
  description:
    "Learn about SHPE Colorado—our history, mission, vision, values, Region 3, the student chapters we support, and our leadership team.",
};

type TeamMember = { name: string; role: string; photo?: string };

const TEAM: TeamMember[] = [
  {
    name: "Violeta Flores",
    role: "President",
    photo: "/images/team/violeta-flores.jpg",
  },
  {
    name: "Annamaria Valdez",
    role: "VP Finance",
    photo: "/images/team/annamaria-valdez.png",
  },
  {
    name: "Luis Monterrosa",
    role: "VP Compliance",
    photo: "/images/team/luis-monterrosa.jpg",
  },
  {
    name: "Diego Sandoval-Torres",
    role: "VP Marketing",
    photo: "/images/team/diego-sandoval-torres.jpg",
  },
  {
    name: "Carlos Ibarra",
    role: "VP Operations",
    photo: "/images/team/carlos-ibarra.png",
  },
  {
    name: "Lyann Castillo",
    role: "VP Membership",
    photo: "/images/team/lyann-castillo.jpeg",
  },
  {
    name: "Roberto De Mata",
    role: "VP Professional Development",
    photo: "/images/team/roberto-de-mata.jpg",
  },
  {
    name: "Wendy Eidson",
    role: "VP Communications",
    photo: "/images/team/wendy-eidson.jpg",
  },
  {
    name: "Rosa Araiza",
    role: "VP Corporate Relations",
    photo: "/images/team/rosa-araiza.jpg",
  },
  {
    name: "Luis Infante",
    role: "Lead Web Developer",
    photo: "/images/team/luis-infante.jpeg",
  },
];

const STUDENT_CHAPTERS: { name: string; url?: string }[] = [
  { name: "Metropolitan State University of Denver (MSU Denver)", url: "" },
  {
    name: "Colorado State University (Fort Collins)",
    url: "https://www.engr.colostate.edu/organizations/shpe/",
  },
  {
    name: "Colorado School of Mines (Golden)",
    url: "https://shpecsm.weebly.com/",
  },
  {
    name: "University of Colorado Boulder",
    url: "https://www.instagram.com/cuboulder_shpemaes/",
  },
  {
    name: "University of Colorado Denver",
    url: "https://www.instagram.com/shpe_cu_denver/?hl=en",
  },
  { name: "University of Wyoming (Laramie)", url: "" },
  {
    name: "University of Denver",
    url: "https://crimsonconnect.du.edu/shpe/home/",
  },
  {
    name: "Colorado Mesa University (Grand Junction)",
    url: "https://www.instagram.com/shpecmu.mavs/",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Title */}
      <section className="pt-10 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            About Us
          </h1>
          <p className="mt-2 text-slate-600">SHPE Colorado</p>
        </div>
      </section>

      {/* About */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="text-slate-700">
              Today, SHPE Colorado makes a big impact. We’re the largest
              association in the state of Colorado for Hispanics in STEM. We
              meet each of our student and professional members where they
              are—offering effective training, mentorship, and programming for
              our vibrant community.
            </p>
            <p className="mt-4 text-slate-700">
              SHPE Colorado’s growth isn’t slowing down anytime soon. As we
              continue to expand our membership, programs, and partnerships,
              we’re guided by a clear mission, a bright vision, and the core
              values demonstrated by our founders.
            </p>
          </div>
          <div className="md:col-span-5">
            <div className="relative overflow-hidden rounded-xl ring-1 ring-slate-200 bg-slate-100 aspect-[4/3] md:aspect-[3/2]">
              <Image
                src="/images/group-pic.webp"
                alt=""
                fill
                sizes="(min-width:1024px) 480px, 100vw"
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="border-t border-slate-200 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold">History</h2>
          <p className="mt-3 text-slate-700">
            The SHPE Colorado Chapter was founded in 1988. Since its inception,
            SHPE Colorado has awarded scholarships to aspiring young Hispanic
            Engineers and Scientists in Colorado. SHPE Colorado has also hosted
            the National Technical Career Conference (SHPE&apos;s National
            Convention) in 1995 and 2007. This conference attracts over 10,000
            Hispanic Engineers and Scientists from across the nation to research
            and network about engineering and science strategies impacting
            global and local economies.
          </p>
          <p className="mt-3 text-slate-700">
            The SHPE Colorado Chapter was honored by the SHPE National Board of
            Directors as the 2004 Region 3 Professional Chapter of the Year.
          </p>
        </div>
      </section>

      {/* Mission / Vision / Values – full-bleed band */}
      <section className="border-t border-slate-200 bg-[#172A4A] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Mission + Vision */}
          <div className="grid gap-10 sm:grid-cols-2 text-center">
            <div>
              <h3 className="text-sm font-semibold tracking-widest uppercase text-orange-400">
                Mission
              </h3>
              <p className="mt-3 mx-auto max-w-prose italic text-white/90">
                SHPE changes lives by empowering the Hispanic community to
                realize its fullest potential and to impact the world through
                STEM awareness, access, support and development.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-widest uppercase text-orange-400">
                Vision
              </h3>
              <p className="mt-3 mx-auto max-w-prose italic text-white/90">
                SHPE’s vision is a world where Hispanics are highly valued and
                influential as the leading innovators, scientists,
                mathematicians and engineers.
              </p>
            </div>
          </div>

          {/* Divider label */}
          <div className="mt-12 text-center">
            <h3 className="text-sm font-semibold tracking-widest uppercase text-orange-400">
              Values
            </h3>
          </div>

          {/* Value blurbs */}
          <div className="mt-8 grid gap-10 text-center sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h4 className="font-semibold tracking-wide uppercase">Familia</h4>
              <p className="mt-3 mx-auto max-w-xs italic text-white/90">
                We take responsibility for our collective strength and passion
                by developing communities, building a diverse and inclusive
                membership, and challenging each other to be our best.
              </p>
            </div>

            <div>
              <h4 className="font-semibold tracking-wide uppercase">Service</h4>
              <p className="mt-3 mx-auto max-w-xs italic text-white/90">
                We act on a foundation of service. We commit to deliver the
                highest levels of quality, integrity, and ethical behavior. We
                act with empathy, patience, and understanding.
              </p>
            </div>

            <div>
              <h4 className="font-semibold tracking-wide uppercase">
                Education
              </h4>
              <p className="mt-3 mx-auto max-w-xs italic text-white/90">
                We value formal education and professional development. We are
                dedicated to continuous improvement and renewal. We learn from
                successes, setbacks, and each other.
              </p>
            </div>

            <div>
              <h4 className="font-semibold tracking-wide uppercase">
                Resilience
              </h4>
              <p className="mt-3 mx-auto max-w-xs italic text-white/90">
                We embrace our diverse cultures and communities, which enable us
                to adapt, thrive, and persist with optimism.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Region 3 */}
      <section className="border-t border-slate-200 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="text-2xl font-semibold">Region 3. ¡Está aquí!</h2>
            <p className="mt-3 text-slate-700">
              Region 3 is SHPE’s largest region geographically consisting of
              chapters from Colorado, Idaho, Kansas, Montana, Nebraska, New
              Mexico, North Dakota, South Dakota, Utah, and Wyoming. In 2014,
              the Bureau of Economic Analysis reported that Colorado, North
              Dakota, and Wyoming were among the top 5 states with the fastest
              economic and employment growth in the nation. The region has
              experienced considerable growth with the formation of several
              professional and student chapters. SHPE is the hub for technical
              talent in Region 3 and holds tremendous potential.
            </p>
          </div>
          <div className="md:col-span-5">
            <figure className="rounded-xl ring-1 ring-slate-200 bg-white">
              <div className="relative aspect-[16/9] md:aspect-[2/1] p-2">
                <Image
                  src="/images/region3.png"
                  alt="SHPE Regions map highlighting Region 3"
                  fill
                  sizes="(min-width:1024px) 560px, 100vw"
                  className="object-contain"
                  priority={false}
                />
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* Student Chapters */}
      <section className="border-t border-slate-200 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold">
            Student Chapters that SHPE Colorado Supports
          </h2>
          <ul className="mt-4 list-disc pl-6 marker:text-brand-blue-600 grid gap-y-2 sm:grid-cols-2 sm:gap-x-8">
            {STUDENT_CHAPTERS.map((c) => (
              <li key={c.name}>
                {c.url ? (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {c.name}
                  </a>
                ) : (
                  c.name
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="border-t border-slate-200 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-center">Meet the Team</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {TEAM.map((m) => (
              <article
                key={m.name}
                className="rounded-xl border border-slate-200 bg-white p-4 text-center"
              >
                <Avatar name={m.name} src={m.photo} />
                <h3 className="mt-3 font-semibold">{m.name}</h3>
                <p className="text-sm text-slate-600">{m.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Avatar({ name, src }: { name: string; src?: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return src ? (
    <Image
      src={src}
      alt={name}
      width={96}
      height={96}
      className="mx-auto h-24 w-24 rounded-full object-cover ring-1 ring-slate-200"
    />
  ) : (
    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 ring-1 ring-slate-200">
      <span className="text-lg font-semibold text-slate-600">{initials}</span>
    </div>
  );
}
