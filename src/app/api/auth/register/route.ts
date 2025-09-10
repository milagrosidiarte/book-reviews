import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/password";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = RegisterSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    const { email, password, name } = parsed.data;

    await connectDB();

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ error: "Email ya registrado" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    await User.create({ email, passwordHash, name });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Error servidor" }, { status: 500 });
  }
}
