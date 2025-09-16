import Link from "next/link";
import FlyerPreview from "@/components/events/flyer-preview";

type UiEvent = {
  id: string;
  title: string;
  start: string;
  end?: string;
  url?: string;
  extendedProps?: {
    location?: string;
    ticketUrl?: string; // Eventbrite, partner site, Google Form, etc.
    gcalUrl?: string; // Google Calendar event link
    flyerUrl?: string; // flyer (Drive/URL)
  };
};

function isGoogleForm(url?: string) {
  if (!url) return false;
  return /^(https?:\/\/)?(forms\.gle|docs\.google\.com\/forms)/i.test(url);
}

function isGoogleCalendar(url?: string) {
  if (!url) return false;
  return /(calendar\.google\.com|google\.com\/calendar)/i.test(url);
}

/** Treat Google Drive files (incl. uc?export=view) as *flyers*, not RSVP links */
function isDriveFile(url?: string) {
  if (!url) return false;
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    if (/^drive\.google\.com$/.test(host)) return true; // drive.google.com/...
    if (/^lh\d*\.googleusercontent\.com$/.test(host)) return true; // image CDN occasionally
    if (
      /^docs\.google\.com$/.test(host) &&
      /\/(file|document|presentation|spreadsheets|uc)\b/i.test(u.pathname)
    ) {
      return true; // docs.google.com/file/d/... or docs.../uc
    }
    return false;
  } catch {
    return false;
  }
}

// Compare destinations, ignoring query/hash and trailing slashes
function sameDest(a?: string, b?: string) {
  if (!a || !b) return false;
  try {
    const u1 = new URL(a);
    const u2 = new URL(b);
    const p1 = u1.pathname.replace(/\/+$/, "");
    const p2 = u2.pathname.replace(/\/+$/, "");
    return u1.origin === u2.origin && p1 === p2;
  } catch {
    return a === b;
  }
}

function primaryLabelFor(url: string) {
  return isGoogleForm(url) ? "Sign up" : "RSVP";
}

export default async function UpcomingEvents({
  limit = 4,
}: {
  limit?: number;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/events`,
    {
      next: { revalidate: 300 },
    }
  );
  const events: UiEvent[] = res.ok ? await res.json() : [];
  const upcoming = events.slice(0, limit);

  const btnOutline =
    "inline-flex rounded-md ring-1 ring-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-900 hover:bg-slate-50";

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

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-start">
          {upcoming.map((e) => {
            const gcalUrl = e.extendedProps?.gcalUrl ?? e.url;
            const ticketUrl = e.extendedProps?.ticketUrl;
            const flyerUrl = e.extendedProps?.flyerUrl;

            // Primary CTA exists only if it's NOT a calendar link and NOT a Drive flyer
            const hasPrimary =
              Boolean(ticketUrl) &&
              !sameDest(ticketUrl, gcalUrl) &&
              !isGoogleCalendar(ticketUrl) &&
              !isDriveFile(ticketUrl);

            return (
              <article
                key={e.id}
                className="self-start rounded-lg border border-slate-200 p-4 flex flex-col"
              >
                {/* Title links to calendar only when a primary CTA exists */}
                {hasPrimary && gcalUrl ? (
                  <h3 className="font-medium">
                    <a
                      href={gcalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline underline-offset-2"
                    >
                      {e.title}
                    </a>
                  </h3>
                ) : (
                  <h3 className="font-medium">{e.title}</h3>
                )}

                <p className="mt-1 text-sm text-slate-600">
                  {formatRange(e.start, e.end)}
                  {e.extendedProps?.location
                    ? ` • ${e.extendedProps.location}`
                    : ""}
                </p>

                {/* Flyer thumbnail (modal on click) */}
                {flyerUrl ? (
                  <FlyerPreview
                    src={flyerUrl}
                    alt={`${e.title} flyer`}
                    className=""
                  />
                ) : null}

                {/* Action row pinned to the right */}
                <div className="mt-4 flex items-center gap-2">
                  {hasPrimary && ticketUrl ? (
                    <a
                      href={ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`ml-auto ${btnOutline}`}
                      aria-label={`${primaryLabelFor(ticketUrl)}: ${e.title}`}
                    >
                      {primaryLabelFor(ticketUrl)}
                    </a>
                  ) : (
                    gcalUrl && (
                      <a
                        href={gcalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`ml-auto ${btnOutline}`}
                        aria-label={`View calendar: ${e.title}`}
                      >
                        View on Google
                      </a>
                    )
                  )}
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
