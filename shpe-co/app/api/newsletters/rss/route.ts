import { NextResponse } from "next/server";
import { parse } from "rss-to-json";

export async function GET() {
  const feedUrl = process.env.NEXT_PUBLIC_MAILCHIMP_ARCHIVE_RSS;
  if (!feedUrl) return NextResponse.json({ items: [], total: 0 });

  const feed = await parse(feedUrl);
  const items = (feed.items || []).map((it: any) => ({
    id: it.id || it.guid || it.link,
    title: it.title,
    sentAt: it.published || it.created,
    url: it.link, // Mailchimp campaign archive URL
  }));

  return NextResponse.json({ items, total: items.length }, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400" },
  });
}
