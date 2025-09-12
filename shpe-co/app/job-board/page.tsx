import Image from "next/image";
import { toMDY } from "@/lib/date";

type Job = {
  id: string;
  title: string;
  company: string;
  location?: string;
  url?: string;
  source?: string;
  notes?: string;
  postedAt?: string;
  expiresAt?: string;
};

export const revalidate = 300; // refresh every 5 minutes (ISR)

function parseToDate(s?: string) {
  if (!s) return undefined;

  // Google gviz Date(YYYY,MM,DD)
  const g = s.match(/Date\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (g) return new Date(Number(g[1]), Number(g[2]), Number(g[3]));

  // ISO YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(`${s}T00:00:00`);

  const d = new Date(s);
  return isFinite(+d) ? d : undefined;
}

function isActive(job: Job) {
  if (!job.expiresAt) return true;
  const d = parseToDate(job.expiresAt);
  return d ? d >= new Date() : true;
}

export default async function JobBoardPage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const res = await fetch(`${base}/api/jobs`, { next: { revalidate: 300 } });
  const { items = [] }: { items: Job[] } = res.ok
    ? await res.json()
    : { items: [] };
  const jobs = items.filter(isActive);

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Job Board
          </h1>
          <p className="mt-3 text-slate-700">
            Explore opportunities aligned with engineering and professional
            roles. We highlight openings from sponsors and partners across
            Colorado and beyond.
          </p>
        </div>

        {/* Sponsor highlight */}
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="relative h-14 w-40 shrink-0">
              {/* Put your logo at /public/sponsors/sponsor.png */}
              <Image
                src="/sponsors/xcel.png"
                alt="Xcel Energy"
                fill
                className="object-contain"
                sizes="160px"
                priority
              />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                Opportunities at Xcel Energy
              </h2>
              <p className="mt-1 text-slate-700">
                Please explore current openings from our sponsor Xcel Energy.
                For questions, email{" "}
                <a
                  href="mailto:recruiting@xcelenergy.com"
                  className="text-brand-blue-600 hover:underline underline-offset-2"
                >
                  recruiting@xcelenergy.com
                </a>
                .
              </p>
            </div>
            <div className="self-start sm:self-auto">
              <a
                href="https://jobs.xcelenergy.com/?source=profOrg_SHPE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg ring-1 ring-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                View Xcel careers
              </a>
            </div>
          </div>
        </section>

        {/* Job list */}
        <section className="mt-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((j) => (
              <article
                key={j.id}
                className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col"
              >
                <h3 className="font-semibold">{j.title}</h3>
                <p className="mt-1 text-sm text-slate-700">{j.company}</p>
                {j.location && (
                  <p className="mt-1 text-sm text-slate-600">📍 {j.location}</p>
                )}
                {(j.postedAt || j.expiresAt) && (
                  <p className="mt-1 text-[13px] text-slate-600">
                    {j.postedAt ? <>Posted {toMDY(j.postedAt)}</> : null}
                    {j.postedAt && j.expiresAt ? " · " : null}
                    {j.expiresAt ? <>Closes {toMDY(j.expiresAt)}</> : null}
                  </p>
                )}
                {j.notes && (
                  <p className="mt-2 text-sm text-slate-700">{j.notes}</p>
                )}

                <div className="mt-auto pt-4 flex justify-end">
                  {j.url ? (
                    <a
                      href={j.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-lg ring-1 ring-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    >
                      Apply
                    </a>
                  ) : (
                    <span className="inline-flex items-center rounded-lg ring-1 ring-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-500">
                      Contact listed recruiter
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>

          {!jobs.length && (
            <p className="mt-6 text-slate-500">
              No active jobs right now. Check back soon or email{" "}
              <a
                href="mailto:vpcorporaterelations@shpecolorado.org"
                className="text-brand-blue-600 hover:underline underline-offset-2"
              >
                vpcorporaterelations@shpecolorado.org
              </a>{" "}
              to share a posting.
            </p>
          )}
        </section>

        {/* DOT note */}
        <section className="border-t border-slate-200 mt-10 pt-8">
          <h2 className="text-xl font-semibold">
            Department of Transportation (DOT) positions
          </h2>
          <p className="mt-2 text-slate-700">
            Note: To apply for DOT roles you may need an active account in their
            system. Some positions require sign-in before you can apply.
          </p>
        </section>
      </div>
    </section>
  );
}
