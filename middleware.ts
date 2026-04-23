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

// Hosts die het labs-gedeelte serveren (bv. labs.maisonblender.com en
// preview-subdomeinen die met "labs." beginnen). Deze worden permanent
// (301) doorgestuurd naar /labs/* op het hoofddomein zodat alle SEO-authority
// op één canonical URL geconsolideerd wordt.
function isLabsHost(hostname: string): boolean {
  return (
    hostname === "labs.maisonblender.com" ||
    hostname.startsWith("labs.maisonblender.") ||
    hostname.startsWith("labs.")
  );
}

export function middleware(request: NextRequest) {
  const hostname = (request.headers.get("host") ?? "").toLowerCase();

  if (REDIRECT_HOSTS.has(hostname)) {
    const target = new URL(
      request.nextUrl.pathname + request.nextUrl.search,
      PRIMARY_HOST,
    );
    return NextResponse.redirect(target, 301);
  }

  if (isLabsHost(hostname)) {
    const pathname = request.nextUrl.pathname;
    // Map labs.maisonblender.com/<path> -> maisonblender.com/labs/<path>.
    // Voorkomt dubbele /labs prefix als een legacy link al /labs bevat.
    const labsPath = pathname.startsWith("/labs")
      ? pathname
      : `/labs${pathname === "/" ? "" : pathname}`;

    const target = new URL(labsPath + request.nextUrl.search, PRIMARY_HOST);
    return NextResponse.redirect(target, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|fonts|images|opengraph-image|robots.txt|sitemap.xml).*)",
  ],
};
