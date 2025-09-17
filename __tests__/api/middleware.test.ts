// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

// Mock del módulo "@/auth" que el middleware reexporta
vi.mock("@/auth", () => {
  const isProtected = (url: URL) =>
    url.pathname.startsWith("/profile") || url.pathname.startsWith("/api/reviews");

  const authMw = (req: NextRequest): NextResponse => {
    const url = new URL(req.url);
    const logged = url.searchParams.get("logged") === "1";

    if (isProtected(url) && !logged) {
      return NextResponse.redirect(
        new URL(`/login?next=${encodeURIComponent(url.pathname)}`, url),
      );
    }

    return NextResponse.next();
  };

  return { auth: authMw };
});

// Importar el middleware DESPUÉS del mock
import { middleware } from "@/middleware";

describe("middleware (auth)", () => {
  it("redirige a /login cuando no hay sesión en ruta protegida", async () => {
    const req = new NextRequest("http://localhost/profile");
    const res = (await middleware(req as any)) as any;

    const loc = res.headers.get("location");
    expect(loc).not.toBeNull();

    // Comparación robusta: pathname + search
    const url = new URL(loc!);
    expect(url.pathname + url.search).toBe("/login?next=%2Fprofile");
  });

  it("deja pasar cuando hay sesión", async () => {
    const req = new NextRequest("http://localhost/profile", {
      headers: { cookie: "authjs.session-token=fake.jwt.token" },
    });
    const res = (await middleware(req as any)) as any;

    expect(res.headers.get("location")).toBeNull();
    expect(res.status).toBe(200);
  });

  it("no interviene en rutas públicas", async () => {
    const req = new NextRequest("http://localhost/about");
    const res = (await middleware(req as any)) as any;

    expect(res.headers.get("location")).toBeNull();
    expect(res.status).toBe(200);
  });
});
