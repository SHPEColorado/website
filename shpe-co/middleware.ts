import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/job-board")) {
    const authed = req.cookies.get("jb_auth")?.value === "ok";
    const isLogin = pathname === "/job-board/login";
    const isAuth = pathname === "/job-board/auth";
    const isLogout = pathname === "/job-board/logout";

    if (authed || isLogin || isAuth || isLogout) return NextResponse.next();

    const url = req.nextUrl.clone();
    url.pathname = "/job-board/login";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/job-board/:path*"],
};
