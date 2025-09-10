import { auth } from "@/auth";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return null; // el caller decide devolver 401 o redirect
  }
  return { userId: session.user.id as string, email: session.user.email! };
}
