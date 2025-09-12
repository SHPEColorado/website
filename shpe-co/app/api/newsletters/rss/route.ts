import { NextResponse } from "next/server";
import { parse } from "rss-to-json";

type RssItem = {
  id?: string;
  guid?: string;
  link?: string;
  title?: string;
  published?: string;
  created?: string;
};
type RssFeed = { items?: RssItem[] };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function coerceFeed(v: unknown): RssFeed {
  if (!isRecord(v)) return {};
  const arr = Array.isArray((v as { items?: unknown }).items)
    ? ((v as { items?: unknown }).items as unknown[])
    : [];
  const items: RssItem[] = arr.map((it) =>
    isRecord(it)
      ? {
          id: typeof it.id === "string" ? it.id : undefined,
          guid: typeof it.guid === "string" ? it.guid : undefined,
          link: typeof it.link === "string" ? it.link : undefined,
          title: typeof it.title === "string" ? it.title : undefined,
          published:
            typeof it.published === "string" ? it.published : undefined,
          created: typeof it.created === "string" ? it.created : undefined,
        }
      : {}
  );
  return { items };
}

export async function GET() {
  const feedUrl = process.env.NEXT_PUBLIC_MAILCHIMP_ARCHIVE_RSS;
  if (!feedUrl) return NextResponse.json({ items: [], total: 0 });

  const raw = await parse(feedUrl);
  const feed = coerceFeed(raw as unknown);

  const items = (feed.items ?? []).map((it) => ({
    id: it.id || it.guid || it.link || "",
    title: it.title ?? "",
    sentAt: it.published || it.created || "",
    url: it.link ?? "",
  }));

  return NextResponse.json(
    { items, total: items.length },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
      },
    }
  );
}
