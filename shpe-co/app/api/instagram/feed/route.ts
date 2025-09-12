import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { items: [] },
    { headers: { "Cache-Control": "public, s-maxage=300" } }
  );
}
