import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedMatchers = ["/dashboard", "/compare", "/calculator", "/profile", "/agent", "/manage-properties", "/analytics", "/admin"];

const roleMap: Record<string, string[]> = {
  "/dashboard": ["buyer", "investor"],
  "/compare": ["buyer", "investor", "agent", "admin", "property_manager"],
  "/calculator": ["buyer", "investor", "agent", "admin"],
  "/profile": ["buyer", "investor", "agent", "admin", "property_manager"],
  "/agent": ["agent", "admin"],
  "/manage-properties": ["property_manager", "admin"],
  "/analytics": ["agent", "admin"],
  "/admin": ["admin"]
};

function resolveBasePath(pathname: string) {
  return protectedMatchers.find((matcher) => pathname === matcher || pathname.startsWith(`${matcher}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const basePath = resolveBasePath(pathname);
  if (!basePath) return NextResponse.next();

  const hasSession = Boolean(request.cookies.get("propwise-session")?.value);
  const role = request.cookies.get("propwise-role")?.value ?? "";

  if (!hasSession) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (!roleMap[basePath]?.includes(role)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/compare/:path*", "/calculator/:path*", "/profile/:path*", "/agent/:path*", "/manage-properties/:path*", "/analytics/:path*", "/admin/:path*"]
};
