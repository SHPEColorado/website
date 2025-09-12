import { NextResponse } from "next/server";
import { STATIC_JOBS } from "@/lib/jobs";

type GvizCol = { label?: string | null };
type GvizCell = { v?: unknown };
type GvizRow = { c?: GvizCell[] };
type GvizTable = { cols: GvizCol[]; rows: GvizRow[] };
type GvizResponse = { table: GvizTable };

type JobItem = {
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

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function toString(v: unknown): string {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}
function coerceGvizResponse(txt: string): GvizResponse | null {
  const start = txt.indexOf("{");
  const end = txt.lastIndexOf(")");
  if (start < 0 || end < 0) return null;
  const raw: unknown = JSON.parse(txt.substring(start, end));
  if (!isRecord(raw) || !isRecord(raw.table)) return null;

  const tableUnknown = raw.table as unknown;
  if (!isRecord(tableUnknown)) return null;

  const cols: GvizCol[] = Array.isArray(
    (tableUnknown as { cols?: unknown }).cols
  )
    ? ((tableUnknown as { cols?: unknown }).cols as unknown[])
        .filter(isRecord)
        .map((c) => ({ label: typeof c.label === "string" ? c.label : null }))
    : [];

  const rows: GvizRow[] = Array.isArray(
    (tableUnknown as { rows?: unknown }).rows
  )
    ? ((tableUnknown as { rows?: unknown }).rows as unknown[]).map((row) => {
        if (!isRecord(row)) return { c: [] };
        const cells = Array.isArray((row as { c?: unknown }).c)
          ? ((row as { c?: unknown }).c as unknown[]).map((cell) =>
              isRecord(cell)
                ? ({
                    v: (cell as Record<string, unknown>).v,
                  } satisfies GvizCell)
                : { v: undefined }
            )
          : [];
        return { c: cells };
      })
    : [];

  return { table: { cols, rows } };
}

async function fetchJobsFromSheet(): Promise<JobItem[] | null> {
  const id = process.env.NEXT_PUBLIC_JOBS_SHEET_ID;
  const sheet = process.env.NEXT_PUBLIC_JOBS_SHEET_NAME || "Jobs";
  if (!id) return null;

  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(
    sheet
  )}`;
  const txt = await fetch(url, { next: { revalidate: 300 } }).then((r) =>
    r.text()
  );

  const gviz = coerceGvizResponse(txt);
  if (!gviz) return null;

  const cols = gviz.table.cols.map((c) => toString(c.label).toLowerCase());
  const rows = gviz.table.rows.map((row) => {
    const entries = (row.c ?? []).map((cell, i) => [
      cols[i] ?? `col_${i}`,
      cell?.v ?? "",
    ]);
    return Object.fromEntries(entries) as Record<string, unknown>;
  });

  const items: JobItem[] = rows
    .filter((r) => r.title && r.company)
    .map((r, idx) => {
      const title = toString(r.title);
      const idSlug =
        title.toLowerCase().replace(/\s+/g, "-").slice(0, 50) || `row-${idx}`;
      return {
        id: `${idx}-${idSlug}`,
        title,
        company: toString(r.company),
        location: r.location ? toString(r.location) : undefined,
        url: r.url ? toString(r.url) : undefined,
        source: r.source ? toString(r.source) : undefined,
        notes: r.notes ? toString(r.notes) : undefined,
        postedAt: r.postedat
          ? toString(r.postedat)
          : r.postedAt
          ? toString(r.postedAt)
          : undefined,
        expiresAt: r.expiresat
          ? toString(r.expiresat)
          : r.expiresAt
          ? toString(r.expiresAt)
          : undefined,
      };
    });

  return items;
}

export async function GET() {
  try {
    const sheetItems = await fetchJobsFromSheet();
    if (sheetItems && sheetItems.length)
      return NextResponse.json({ items: sheetItems });
    return NextResponse.json({ items: STATIC_JOBS });
  } catch {
    return NextResponse.json({ items: STATIC_JOBS });
  }
}
