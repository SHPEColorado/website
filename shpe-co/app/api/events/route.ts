import { NextResponse } from "next/server";

export const revalidate = 300; // cache this JSON for 5 minutes

type GCalEvent = {
  id?: string;
  status?: string;
  summary?: string;
  description?: string;
  location?: string;
  htmlLink?: string;
  start?: { date?: string; dateTime?: string; timeZone?: string };
  end?: { date?: string; dateTime?: string; timeZone?: string };
};

const URL_RE = /https?:\/\/[^\s)]+/gi;

function extractDriveId(raw: string): string | null {
  try {
    const u = new URL(raw);
    if (!/google\.com$/i.test(u.hostname)) return null;

    // /file/d/<id>/...
    const m = u.pathname.match(/\/file\/d\/([^/]+)/);
    if (m?.[1]) return m[1];

    // ?id=<id>
    const id = u.searchParams.get("id");
    return id || null;
  } catch {
    return null;
  }
}

function isImagePath(urlStr: string): boolean {
  try {
    const u = new URL(urlStr);
    return /\.(png|jpe?g|webp|gif)$/i.test(u.pathname);
  } catch {
    return false;
  }
}

// Prefer a Google Drive file (converted to a direct viewer URL), else first image URL
function pickFlyerUrl(description?: string): string | undefined {
  if (!description) return undefined;
  const urls = Array.from(description.matchAll(URL_RE)).map((m) => m[0]);

  // 1) Google Drive file → convert to uc?export=view
  for (const u of urls) {
    const id = extractDriveId(u);
    if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
  }

  // 2) Direct image URLs
  const img = urls.find(isImagePath);
  return img || undefined;
}

// Prefer Eventbrite, then Google Forms (forms.gle or docs.google.com/forms),
// otherwise first URL found, otherwise the fallback (the GCal htmlLink).
function pickTicketUrl(
  description?: string,
  fallback?: string
): string | undefined {
  if (!description) return fallback;

  // Collect URLs from both plain text and href="…"
  const urls = new Set<string>();

  // 1) href="https://…"
  const hrefRe = /href\s*=\s*"([^"]+)"/gi;
  for (const m of description.matchAll(hrefRe)) {
    urls.add(m[1]);
  }

  // 2) plain text https://… (avoid grabbing trailing punctuation)
  const urlRe = /https?:\/\/[^\s"'<>)]*/gi;
  for (const m of description.matchAll(urlRe)) {
    urls.add(m[0]);
  }

  // Normalize each URL
  const list = Array.from(urls)
    .map((u) => u.replace(/&amp;/g, "&")) // decode common HTML entity
    .map((u) => u.replace(/[).,]+$/g, "")); // trim trailing punctuation

  // Preference order
  const PREFER = [
    /(^|\.)(eventbrite)\./i,
    /(^|\.)(forms)\.gle\b/i,
    /docs\.google\.com\/forms/i,
  ];

  for (const pat of PREFER) {
    const hit = list.find((u) => pat.test(u));
    if (hit) return hit;
  }

  // Otherwise first URL found, else fallback to the calendar link
  return list[0] ?? fallback;
}

export async function GET(req: Request) {
  const calendarId = process.env.GCAL_ID;
  const apiKey = process.env.GCAL_API_KEY;

  if (!calendarId || !apiKey) {
    return NextResponse.json(
      {
        error: "missing_env",
        detail: "GCAL_ID and GCAL_API_KEY are required.",
      },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const now = new Date();
  const timeMin = from ? new Date(from) : now; // default: from now forward
  const timeMax = to
    ? new Date(to)
    : new Date(now.getFullYear(), now.getMonth() + 12, 1); // ~12 months ahead

  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events`
  );
  url.searchParams.set("key", apiKey);
  url.searchParams.set("singleEvents", "true"); // expand recurring events
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("showDeleted", "false");
  url.searchParams.set("maxResults", "2500");
  url.searchParams.set("timeMin", timeMin.toISOString());
  url.searchParams.set("timeMax", timeMax.toISOString());

  try {
    // Let Next cache the route output per `revalidate` above.
    const res = await fetch(url.toString());
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "gcal_error", detail: text },
        { status: res.status }
      );
    }

    const data = (await res.json()) as { items?: GCalEvent[] };

    const events = (data.items ?? [])
      .filter((e) => e.status !== "cancelled")
      .map((e) => {
        const start = e.start?.dateTime ?? e.start?.date ?? null;
        const end = e.end?.dateTime ?? e.end?.date ?? null;
        const desc = e.description ?? "";
        const gcalUrl = e.htmlLink ?? "";
        const ticketUrl = pickTicketUrl(desc, gcalUrl);
        const flyerUrl = pickFlyerUrl(desc);

        return {
          id: e.id,
          title: e.summary ?? "Untitled Event",
          start,
          end,
          allDay: Boolean(e.start?.date && !e.start?.dateTime),
          url: ticketUrl, // FullCalendar uses this when clicking the event
          extendedProps: {
            location: e.location ?? "",
            description: desc,
            gcalUrl,
            ticketUrl,
            flyerUrl,
          },
        };
      });

    return NextResponse.json(events);
  } catch (err) {
    return NextResponse.json(
      { error: "fetch_failed", detail: String(err) },
      { status: 500 }
    );
  }
}
