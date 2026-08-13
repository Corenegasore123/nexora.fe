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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/health" ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const session = request.cookies.get("quantscope_session");
  const isPublic = PUBLIC_PATHS.has(pathname);
  const isApp = pathname.startsWith("/app");

  if (isApp && !session?.value) {
    const signIn = new URL("/sign-in", request.url);
    signIn.searchParams.set("from", pathname);
    return NextResponse.redirect(signIn);
  }

  if (isPublic && session?.value && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  if (!isPublic && !isApp && !session?.value) {
    const signIn = new URL("/sign-in", request.url);
    signIn.searchParams.set("from", pathname);
    return NextResponse.redirect(signIn);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
