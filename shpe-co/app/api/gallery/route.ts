import { NextResponse } from "next/server";

const API = "https://www.googleapis.com/drive/v3/files";

type DriveImageMeta = { width?: number; height?: number };
type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  imageMediaMetadata?: DriveImageMeta;
};
type DriveListResponse = { files?: DriveFile[] };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function isDriveFile(v: unknown): v is DriveFile {
  return (
    isRecord(v) &&
    typeof v.id === "string" &&
    typeof v.name === "string" &&
    typeof v.mimeType === "string"
  );
}
function coerceDriveListResponse(v: unknown): DriveListResponse {
  if (!isRecord(v)) return {};
  const raw = (v as { files?: unknown }).files;
  if (!Array.isArray(raw)) return {};
  return { files: raw.filter(isDriveFile) };
}

export async function GET() {
  const key = process.env.GOOGLE_DRIVE_API_KEY;
  const folder = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!key || !folder) {
    return NextResponse.json({ error: "Missing env vars" }, { status: 500 });
  }

  const params = new URLSearchParams({
    key,
    q: `'${folder}' in parents and mimeType contains 'image/' and trashed=false`,
    fields:
      "files(id,name,mimeType,webViewLink,imageMediaMetadata(width,height))",
    pageSize: "200",
    orderBy: "createdTime desc",
    supportsAllDrives: "true",
    includeItemsFromAllDrives: "true",
  });

  const r = await fetch(`${API}?${params.toString()}`, {
    next: { revalidate: 600 },
  });
  if (!r.ok)
    return NextResponse.json({ error: await r.text() }, { status: r.status });

  const json: unknown = await r.json();
  const data = coerceDriveListResponse(json);

  const images = (data.files ?? []).map((f) => ({
    id: f.id,
    name: f.name,
    mimeType: f.mimeType,
    pageUrl: f.webViewLink ?? `https://drive.google.com/file/d/${f.id}/view`,
    viewUrl: `https://drive.google.com/uc?export=view&id=${f.id}`,
    width: f.imageMediaMetadata?.width ?? null,
    height: f.imageMediaMetadata?.height ?? null,
  }));

  return NextResponse.json(images, {
    headers: {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
