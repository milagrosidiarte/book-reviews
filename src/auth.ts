import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyPassword } from "@/lib/password";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Exporta helpers de Auth.js v5
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      // Tipar 'credentials' y validar con Zod
      authorize: async (credentials) => {
        // credentials puede venir undefined: chequeamos y validamos
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        await connectDB();
        const user = await User.findOne({ email }).exec();
        if (!user) return null;

        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) return null;

        // Lo que retorne acá se guarda en el token (callbacks.jwt)
        return {
          id: String(user._id),
          email: user.email,
          name: user.name ?? "",
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },

  // Si tenés página propia de login:
  // pages: { signIn: "/login" },

  trustHost: true,
});
