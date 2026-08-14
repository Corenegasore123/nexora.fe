import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = new Set([
  "/",
  "/about",
  "/how-it-works",
  "/features",
  "/contact",
  "/sign-in",
  "/sign-up",
]);

const CONSENT_COOKIE = "quantscope_cookie_consent";

function apiOrigin() {
  return (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");
}

async function sessionIsValid(request: NextRequest): Promise<boolean> {
  const session = request.cookies.get("quantscope_session")?.value;
  if (!session) return false;

  try {
    const res = await fetch(`${apiOrigin()}/api/auth/check`, {
      headers: { cookie: request.headers.get("cookie") ?? "" },
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/health" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("quantscope_session");
  const consentCookie = request.cookies.get(CONSENT_COOKIE);
  const isPublic = PUBLIC_PATHS.has(pathname);
  const isApp = pathname.startsWith("/app");

  if (pathname === "/app/admin" || pathname.startsWith("/app/admin/")) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  const hasConsent = consentCookie?.value === "accepted";
  const hasValidSession = sessionCookie?.value && hasConsent ? await sessionIsValid(request) : false;

  if (isApp && (!hasConsent || !hasValidSession)) {
    const signIn = new URL(hasConsent ? "/sign-in" : "/sign-in", request.url);
    signIn.searchParams.set("from", pathname);
    const response = NextResponse.redirect(signIn);
    if (sessionCookie?.value && !hasConsent) {
      response.cookies.delete("quantscope_session");
      response.cookies.delete("quantscope_role");
    } else if (sessionCookie?.value && hasConsent && !hasValidSession) {
      response.cookies.delete("quantscope_session");
      response.cookies.delete("quantscope_role");
    }
    return response;
  }

  if (isPublic && hasValidSession && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  if (!isPublic && !isApp && !hasValidSession) {
    const signIn = new URL("/sign-in", request.url);
    signIn.searchParams.set("from", pathname);
    return NextResponse.redirect(signIn);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
