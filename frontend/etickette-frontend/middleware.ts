import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/_next", "/favicon.ico"];


export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value || req.headers.get("authorization") || req.nextUrl.searchParams.get("token") || "";

  const isPublic = PUBLIC_PATHS.some(path => pathname.startsWith(path));

  if (!isPublic && !token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

