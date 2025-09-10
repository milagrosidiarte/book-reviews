import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"; // asegura SSR en dev

async function registerAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "");

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });

  if (!res.ok) {
    // podrías usar cookies/headers para pasar el error y mostrarlo
    throw new Error("No se pudo registrar (email existente o datos inválidos).");
  }

  // tras registrar, vamos al login
  redirect("/login");
}

export default async function RegisterPage() {
  return (
    <section className="max-w-md mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">Crear cuenta</h1>

      <form action={registerAction} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium">Nombre (opcional)</label>
          <input name="name" className="w-full border rounded p-2" />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Email</label>
          <input name="email" type="email" required className="w-full border rounded p-2" />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Contraseña</label>
          <input name="password" type="password" required minLength={8} className="w-full border rounded p-2" />
        </div>

        <button type="submit" className="rounded px-4 py-2 border">
          Crear cuenta
        </button>
      </form>
    </section>
  );
}
