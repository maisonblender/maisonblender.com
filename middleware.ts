import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Map van legacy domeinen die naar maisonblender.com moeten redirecten.
// Vercel's "Redirect to Another Domain" gaf inconsistent gedrag voor de
// applemooz.nl apex (hardcoded /applemooz pad), dus regelen we dit hier.
const REDIRECT_HOSTS = new Set<string>([
  "applemooz.nl",
  "www.applemooz.nl",
]);

const PRIMARY_HOST = "https://maisonblender.com";

export function middleware(request: NextRequest) {
  const hostname = (request.headers.get("host") ?? "").toLowerCase();

  if (REDIRECT_HOSTS.has(hostname)) {
    const target = new URL(
      request.nextUrl.pathname + request.nextUrl.search,
      PRIMARY_HOST,
    );
    return NextResponse.redirect(target, 301);
  }

  const isLabsSubdomain =
    hostname === "labs.maisonblender.com" ||
    hostname.startsWith("labs.maisonblender.") ||
    hostname.startsWith("labs.");

  if (isLabsSubdomain) {
    const url = request.nextUrl.clone();
    const pathname = url.pathname;

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
