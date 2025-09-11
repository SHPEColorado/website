// Server Component: fetches existing /api/events and shows a small list
import Link from "next/link";

export default async function UpcomingEvents({
  limit = 4,
}: {
  limit?: number;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/events`,
    { next: { revalidate: 300 } }
  );
  const events = res.ok ? await res.json() : [];
  const upcoming = events.slice(0, limit);

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Upcoming Events</h2>
          <Link
            href="/events"
            className="text-sm font-medium text-brand-blue-600"
          >
            View all
          </Link>
        </div>

        {/* stretch cards to equal height per row */}
        <div className="mt-6 grid gap-4 items-stretch sm:grid-cols-2 lg:grid-cols-4">
          {upcoming.map((e: any) => {
            const ticketUrl = e.extendedProps?.ticketUrl ?? e.url;
            const gcalUrl = e.extendedProps?.gcalUrl ?? e.url;
            return (
              <article
                key={e.id}
                className="h-full rounded-lg border border-slate-200 p-4 flex flex-col"
              >
                <h3 className="font-medium">{e.title}</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {formatRange(e.start, e.end)}
                  {e.extendedProps?.location
                    ? ` • ${e.extendedProps.location}`
                    : ""}
                </p>

                {/* actions pinned to bottom */}
                <div className="mt-auto pt-4 flex items-center gap-2">
                  {/* optional Tickets button on the left (hide if same as gcal) */}
                  {ticketUrl && ticketUrl !== gcalUrl && (
                    <a
                      href={ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-md bg-brand-blue-600 px-3 py-1.5 text-white text-sm font-semibold"
                    >
                      Tickets
                    </a>
                  )}

                  {/* always bottom-right */}
                  <a
                    href={gcalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto inline-flex rounded-md ring-1 ring-slate-300 px-3 py-1.5 text-sm font-semibold"
                  >
                    View on Google
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function formatRange(start: string, end?: string) {
  const s = new Date(start);
  const e = end ? new Date(end) : undefined;
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  const date = new Intl.DateTimeFormat(undefined, opts).format(s);
  if (!e) return date;
  const sameDay = s.toDateString() === e.toDateString();
  const endFmt = new Intl.DateTimeFormat(
    undefined,
    sameDay ? { hour: "numeric", minute: "2-digit" } : opts
  ).format(e);
  return sameDay ? `${date} – ${endFmt}` : `${date} → ${endFmt}`;
}
