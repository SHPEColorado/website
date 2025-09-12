import { NextResponse } from "next/server";
import { STATIC_JOBS } from "@/lib/jobs";

async function fetchJobsFromSheet() {
  const id = process.env.NEXT_PUBLIC_JOBS_SHEET_ID;
  const sheet = process.env.NEXT_PUBLIC_JOBS_SHEET_NAME || "Jobs";
  if (!id) return null;

  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheet)}`;
  const txt = await fetch(url, { next: { revalidate: 300 } }).then((r) => r.text());

  // strip "google.visualization.Query.setResponse(...);"
  const json = JSON.parse(txt.substring(txt.indexOf("{"), txt.lastIndexOf(")")));
  const cols = json.table.cols.map((c: any) => (c.label || "").toLowerCase());
  const rows = (json.table.rows || []).map((r: any) =>
    Object.fromEntries((r.c || []).map((cell: any, i: number) => [cols[i], cell?.v ?? ""]))
  );

  const items = rows
    .filter((r: any) => r.title && r.company)
    .map((r: any, idx: number) => ({
      id: `${idx}-${String(r.title).toLowerCase().replace(/\s+/g, "-").slice(0, 50)}`,
      title: String(r.title),
      company: String(r.company),
      location: r.location ? String(r.location) : undefined,
      url: r.url ? String(r.url) : undefined,
      source: r.source ? String(r.source) : undefined,
      notes: r.notes ? String(r.notes) : undefined,
      postedAt: r.postedat ? String(r.postedat) : r.postedAt ? String(r.postedAt) : undefined,
      expiresAt: r.expiresat ? String(r.expiresat) : r.expiresAt ? String(r.expiresAt) : undefined,
    }));

  return items;
}

export async function GET() {
  try {
    const sheetItems = await fetchJobsFromSheet();
    if (sheetItems && sheetItems.length) return NextResponse.json({ items: sheetItems });
    return NextResponse.json({ items: STATIC_JOBS });
  } catch {
    return NextResponse.json({ items: STATIC_JOBS });
  }
}
