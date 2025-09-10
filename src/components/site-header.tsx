import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function SiteHeader() {
  const session = await auth();

  // Server Action para logout
  async function doLogout() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <header className="border-b bg-background">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="font-semibold">
            📚 Book Reviews
          </Link>
        </div>

        {/* Acciones según sesión */}
        <nav className="flex items-center gap-2">
          {!session?.user?.id ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Crear cuenta</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/profile">Perfil</Link>
              </Button>
              <form action={doLogout}>
                <Button type="submit" size="sm" variant="destructive">
                  Salir
                </Button>
              </form>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
