import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_EXACT = new Set([
  "/",
  "/about",
  "/how-it-works",
  "/features",
  "/contact",
  "/sign-in",
  "/sign-up",
  "/discover",
  "/search",
  "/restaurants",
  "/cities",
  "/collections",
]);

function apiOrigin() {
  return (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, "");
}

function isPublicPath(pathname: string) {
  if (PUBLIC_EXACT.has(pathname)) return true;
  if (pathname.startsWith("/restaurants")) return true;
  if (pathname.startsWith("/discover")) return true;
  if (pathname.startsWith("/search")) return true;
  if (pathname.startsWith("/cities")) return true;
  if (pathname.startsWith("/collections")) return true;
  if (pathname.startsWith("/reservations")) return true;
  return false;
}

async function sessionInfo(request: NextRequest) {
  const session = request.cookies.get("nexora_session")?.value;
  if (!session) return null;
  try {
    const res = await fetch(`${apiOrigin()}/api/auth/check`, {
      headers: { cookie: request.headers.get("cookie") ?? "" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as {
      ok: boolean;
      role?: string;
      mustChangePassword?: boolean;
      restaurantId?: string | null;
      home?: string;
    };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/health" ||
    pathname === "/favicon.ico" ||
    pathname === "/favicon.svg" ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/rwanda-") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest)$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  const session = await sessionInfo(request);
  const gated =
    pathname.startsWith("/app") ||
    pathname.startsWith("/platform-admin") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/change-password") ||
    pathname.startsWith("/account");

  if (gated && !session) {
    const signIn = new URL("/sign-in", request.url);
    signIn.searchParams.set("from", pathname);
    const response = NextResponse.redirect(signIn);
    response.cookies.delete("nexora_session");
    response.cookies.delete("nexora_role");
    return response;
  }

  if (session?.mustChangePassword && pathname !== "/change-password" && !pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL("/change-password", request.url));
  }

  if (session && !session.mustChangePassword) {
    if (pathname === "/sign-in" || pathname === "/sign-up") {
      return NextResponse.redirect(new URL(session.home ?? "/app", request.url));
    }
    if (session.role === "PLATFORM_ADMIN" && (pathname.startsWith("/app") || pathname.startsWith("/onboarding"))) {
      return NextResponse.redirect(new URL("/platform-admin", request.url));
    }
    if (session.role === "CUSTOMER" && (pathname.startsWith("/app") || pathname.startsWith("/platform-admin") || pathname.startsWith("/onboarding"))) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
    if (session.role === "OWNER" && !session.restaurantId && pathname.startsWith("/app")) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    if (session.role !== "PLATFORM_ADMIN" && pathname.startsWith("/platform-admin")) {
      return NextResponse.redirect(new URL(session.home ?? "/app", request.url));
    }
  }

  if (!isPublicPath(pathname) && !gated && !session) {
    const signIn = new URL("/sign-in", request.url);
    signIn.searchParams.set("from", pathname);
    return NextResponse.redirect(signIn);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
