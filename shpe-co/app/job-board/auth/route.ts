import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/job-board");

  if (password === process.env.JOB_BOARD_PASSWORD) {
    const res = NextResponse.redirect(new URL(next, req.url));
    res.cookies.set("jb_auth", "ok", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  }

  const url = new URL("/job-board/login", req.url);
  url.searchParams.set("error", "1");
  return NextResponse.redirect(url);
}
