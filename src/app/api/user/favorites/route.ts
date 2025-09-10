import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";
import { requireUser } from "@/lib/auth-helpers";

export async function GET() {
  const authUser = await requireUser();
  if (!authUser) return NextResponse.json({ error: "No auth" }, { status: 401 });

  try {
    await connectDB();
    const list = await Favorite.find({ userId: authUser.userId }).lean();
    return NextResponse.json({ favorites: list });
  } catch {
    return NextResponse.json({ error: "Error servidor" }, { status: 500 });
  }
}
