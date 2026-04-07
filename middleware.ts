import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const isLabsSubdomain =
    hostname === "labs.maisonblender.com" ||
    hostname.startsWith("labs.maisonblender.") ||
    hostname.startsWith("labs.");

  if (isLabsSubdomain) {
    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    // Rewrite all labs subdomain requests to /labs/* paths
    if (!pathname.startsWith("/labs")) {
      url.pathname = `/labs${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|fonts|images|opengraph-image|robots.txt|sitemap.xml).*)",
  ],
};
