export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    // páginas privadas:
    "/profile/:path*",
    "/reviews/:path*",
    "/favorites/:path*",
    // APIs privadas:
    "/api/reviews/:path*",
    "/api/user/:path*",
    "/api/books/:id/reviews",     // POST protegido
    "/api/books/:id/favorite",    // POST/DELETE protegido
  ],
};
