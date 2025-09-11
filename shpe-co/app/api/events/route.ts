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

// Prefer an Eventbrite URL from the description; else the first URL; else the GCal link
function pickTicketUrl(description?: string, fallback?: string) {
  if (!description) return fallback;
  const urls = Array.from(description.matchAll(/https?:\/\/[^\s)]+/gi)).map((m) => m[0]);
  const eb = urls.find((u) => /eventbrite\./i.test(u));
  return eb ?? urls[0] ?? fallback;
}

export async function GET(req: Request) {
  const calendarId = process.env.GCAL_ID;
  const apiKey = process.env.GCAL_API_KEY;

  if (!calendarId || !apiKey) {
    return NextResponse.json(
      { error: "missing_env", detail: "GCAL_ID and GCAL_API_KEY are required." },
      { status: 500 }
    );
  }

  // Optional query overrides: /api/events?from=2025-01-01&to=2026-01-01
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const now = new Date();
  const timeMin = from ? new Date(from) : now; // default: from now forward
  const timeMax = to ? new Date(to) : new Date(now.getFullYear(), now.getMonth() + 12, 1); // ~12 months ahead

  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`
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
      return NextResponse.json({ error: "gcal_error", detail: text }, { status: res.status });
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
