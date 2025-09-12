import { NextResponse } from "next/server";
import { parse } from "rss-to-json";

export const revalidate = 300;

export async function GET() {
  const feedUrl = process.env.NEXT_PUBLIC_MAILCHIMP_ARCHIVE_RSS;
  if (!feedUrl) return NextResponse.redirect("/news", 302);

  try {
    const feed = await parse(feedUrl);
    const latest = (feed.items || [])[0];
    const link = latest?.link;
    return NextResponse.redirect(link || "/news", 302);
  } catch {
    return NextResponse.redirect("/news", 302);
  }
}
