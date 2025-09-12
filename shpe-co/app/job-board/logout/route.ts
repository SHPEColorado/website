import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/job-board/login", req.url));
  res.cookies.set("jb_auth", "", { path: "/", maxAge: 0 });
  return res;
}
