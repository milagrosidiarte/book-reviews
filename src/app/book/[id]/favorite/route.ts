import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";
import { requireUser } from "@/lib/auth-helpers";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const authUser = await requireUser();
  if (!authUser) return NextResponse.json({ error: "No auth" }, { status: 401 });

  try {
    await connectDB();
    const fav = await Favorite.findOneAndUpdate(
      { userId: authUser.userId, volumeId: params.id },
      {}, // no hay más campos
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ favorite: fav }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error servidor" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const authUser = await requireUser();
  if (!authUser) return NextResponse.json({ error: "No auth" }, { status: 401 });

  try {
    await connectDB();
    await Favorite.findOneAndDelete({ userId: authUser.userId, volumeId: params.id });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error servidor" }, { status: 500 });
  }
}
