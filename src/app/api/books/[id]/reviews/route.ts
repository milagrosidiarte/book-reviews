import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import { z } from "zod";
import { requireUser } from "@/lib/auth-helpers";

export const runtime = "nodejs";

const ReviewCreateSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  body: z.string().max(5000).optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const reviews = await Review.find({ volumeId: params.id })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ reviews });
  } catch {
    return NextResponse.json({ error: "Error servidor" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const authUser = await requireUser();
  if (!authUser) return NextResponse.json({ error: "No auth" }, { status: 401 });

  try {
    const json = await req.json();
    const parsed = ReviewCreateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    const { rating, title, body } = parsed.data;

    await connectDB();

    // upsert: si ya tiene reseña para este libro, la actualizamos
    const doc = await Review.findOneAndUpdate(
      { userId: authUser.userId, volumeId: params.id },
      { rating, title, body },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ review: doc }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error servidor" }, { status: 500 });
  }
}
