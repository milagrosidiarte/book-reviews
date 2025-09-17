// app/api/books/[id]/favorite/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";

export const runtime = "nodejs";

export async function POST(_req: Request, ctx: any) {
  const { id } = (ctx.params ?? {}) as { id: string };

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const existing = await Favorite.findOne({
      userId: session.user.id,
      volumeId: id,
    });

    if (existing) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    await Favorite.create({ userId: session.user.id, volumeId: id });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error servidor" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: any) {
  const { id } = (ctx.params ?? {}) as { id: string };

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    await Favorite.deleteOne({ userId: session.user.id, volumeId: id });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Error servidor" }, { status: 500 });
  }
}
