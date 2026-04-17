import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionValue,
} from "@/lib/admin-session";

function isPublicAdminRoute(pathname: string) {
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return true;
  }
  if (pathname === "/api/admin/login" || pathname.startsWith("/api/admin/login")) {
    return true;
  }
  return false;
}

function hasAdminSession(request: NextRequest) {
  return (
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value === getAdminSessionValue()
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  if (isPublicAdminRoute(pathname)) {
    return NextResponse.next();
  }

  if (!hasAdminSession(request)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
