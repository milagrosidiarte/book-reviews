import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";

type Ctx = { params: { id: string } };

// POST = agregar si no existe → 201 (o 200 si ya estaba)
export async function POST(_req: Request, { params }: Ctx) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const existing = await Favorite.findOne({ userId: session.user.id, volumeId: params.id });
    if (existing) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }
    await Favorite.create({ userId: session.user.id, volumeId: params.id });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Error servidor" }, { status: 500 });
  }
}

// DELETE = quitar → 200 siempre que termine bien
export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    await Favorite.deleteOne({ userId: session.user.id, volumeId: params.id });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Error servidor" }, { status: 500 });
  }
}
