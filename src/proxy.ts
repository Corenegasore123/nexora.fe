import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = new Set(["/", "/about", "/how-it-works", "/features", "/contact", "/sign-in", "/sign-up"]);

function apiOrigin() {
  return (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");
}

async function sessionIsValid(request: NextRequest): Promise<boolean> {
  const session = request.cookies.get("nexora_session")?.value;
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
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname === "/health" || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.has(pathname);
  const isApp = pathname.startsWith("/app");
  const hasValidSession = await sessionIsValid(request);

  if (isApp && !hasValidSession) {
    const signIn = new URL("/sign-in", request.url);
    signIn.searchParams.set("from", pathname);
    const response = NextResponse.redirect(signIn);
    response.cookies.delete("nexora_session");
    response.cookies.delete("nexora_role");
    return response;
  }

  if (hasValidSession && (pathname === "/sign-in" || pathname === "/sign-up")) {
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
