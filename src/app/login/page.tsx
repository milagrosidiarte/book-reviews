import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function loginAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  // con Auth.js v5, signIn es server-safe
  // `redirectTo` es adónde volvemos tras login
  await signIn("credentials", {
    redirectTo: "/",
    // los nombres de campos deben matchear los definidos en "credentials" del provider
    email,
    password,
  });

  // Si por alguna razón no redirige (normalmente signIn redirige), forzamos:
  redirect("/");
}

export default async function LoginPage() {
  return (
    <section className="max-w-md mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">Iniciar sesión</h1>

      <form action={loginAction} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium">Email</label>
          <input name="email" type="email" required className="w-full border rounded p-2" />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Contraseña</label>
          <input name="password" type="password" required minLength={8} className="w-full border rounded p-2" />
        </div>

        <button type="submit" className="rounded px-4 py-2 border">
          Entrar
        </button>
      </form>

      <p className="text-sm">
        ¿No tenés cuenta? <a href="/register" className="underline">Registrate</a>
      </p>
    </section>
  );
}
