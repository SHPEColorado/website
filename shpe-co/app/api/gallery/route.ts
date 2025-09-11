import { NextResponse } from "next/server";

const API = "https://www.googleapis.com/drive/v3/files";

export async function GET() {
  const key = process.env.GOOGLE_DRIVE_API_KEY!;
  const folder = process.env.GOOGLE_DRIVE_FOLDER_ID!;
  if (!key || !folder) {
    return NextResponse.json({ error: "Missing env vars" }, { status: 500 });
  }

  const params = new URLSearchParams({
    key,
    q: `'${folder}' in parents and mimeType contains 'image/' and trashed=false`,
    fields:
      "files(id,name,mimeType,webViewLink,thumbnailLink,imageMediaMetadata(width,height))",
    pageSize: "200",
    orderBy: "createdTime desc",
    supportsAllDrives: "true",
    includeItemsFromAllDrives: "true",
  });

  const r = await fetch(`${API}?${params.toString()}`, {
    // server-side cache to keep it snappy
    next: { revalidate: 600 },
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json({ error: text }, { status: r.status });
  }

  const data = await r.json();

  // Build direct view URLs. For public files, this works well:
  //  - viewUrl: large image for <img>
  //  - pageUrl: opens the Drive viewer (nice for sharing)
  const images = (data.files ?? []).map((f: any) => ({
    id: f.id as string,
    name: f.name as string,
    mimeType: f.mimeType as string,
    pageUrl: f.webViewLink as string,
    // Either of these work; uc?export=view is simple and reliable for public files
    viewUrl: `https://drive.google.com/uc?export=view&id=${f.id}`,
    // dimensions (if available)
    width: f.imageMediaMetadata?.width ?? null,
    height: f.imageMediaMetadata?.height ?? null,
  }));

  return NextResponse.json(images, {
    headers: {
      "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
