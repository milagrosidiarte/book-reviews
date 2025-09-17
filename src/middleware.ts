// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";

const isProtected = (p: string) =>
  p.startsWith("/profile") ||
  p.startsWith("/reviews") ||
  p.startsWith("/favorites") ||
  p.startsWith("/api/reviews") ||
  p.startsWith("/api/user") ||
  // rutas POST/DELETE protegidas con params
  /^\/api\/books\/[^/]+\/(reviews|favorite)$/.test(p);

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  if (!isProtected(url.pathname)) return NextResponse.next();

  // Cookies de sesión posibles de Auth.js/NextAuth
  const sessionCookie =
    req.cookies.get("__Secure-next-auth.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("authjs.session-token")?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(
      new URL(`/login?next=${encodeURIComponent(url.pathname)}`, url),
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/reviews/:path*",
    "/favorites/:path*",
    "/api/reviews/:path*",
    "/api/user/:path*",
    "/api/books/:id/reviews",
    "/api/books/:id/favorite",
  ],
};
