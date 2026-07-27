import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

const PROTECTED_API_PREFIXES = ["/api/compose", "/api/uploads/local", "/api/assets/upload-target"];

function isProtectedApi(pathname: string): boolean {
  return PROTECTED_API_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isStudioPage(pathname: string): boolean {
  return pathname === "/studio" || pathname.startsWith("/studio/");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedApi = isProtectedApi(pathname);
  const studioPage = isStudioPage(pathname);

  if (!protectedApi && !studioPage) {
    return NextResponse.next();
  }

  const secret = process.env.AUTH_SESSION_SECRET;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = secret && token ? await verifySessionToken(token, secret) : null;

  if (session) {
    return NextResponse.next();
  }

  if (protectedApi) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/studio",
    "/studio/:path*",
    "/api/compose",
    "/api/compose/:path*",
    "/api/uploads/local",
    "/api/uploads/local/:path*",
    "/api/assets/upload-target",
    "/api/assets/upload-target/:path*"
  ]
};
