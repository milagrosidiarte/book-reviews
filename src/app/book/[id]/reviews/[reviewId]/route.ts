import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import { z } from "zod";
import { requireUser } from "@/lib/auth-helpers";

const ReviewUpdateSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().max(120).optional(),
  body: z.string().max(5000).optional(),
}).refine(data => Object.keys(data).length > 0, "Sin cambios");

export async function PATCH(
  req: Request,
  { params }: { params: { reviewId: string } }
) {
  const authUser = await requireUser();
  if (!authUser) return NextResponse.json({ error: "No auth" }, { status: 401 });

  try {
    const json = await req.json();
    const parsed = ReviewUpdateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    await connectDB();

    const review = await Review.findById(params.reviewId);
    if (!review) return NextResponse.json({ error: "No existe" }, { status: 404 });
    if (String(review.userId) !== authUser.userId) {
      return NextResponse.json({ error: "Prohibido" }, { status: 403 });
    }

    Object.assign(review, parsed.data);
    await review.save();

    return NextResponse.json({ review });
  } catch {
    return NextResponse.json({ error: "Error servidor" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { reviewId: string } }
) {
  const authUser = await requireUser();
  if (!authUser) return NextResponse.json({ error: "No auth" }, { status: 401 });

  try {
    await connectDB();

    const review = await Review.findById(params.reviewId);
    if (!review) return NextResponse.json({ error: "No existe" }, { status: 404 });
    if (String(review.userId) !== authUser.userId) {
      return NextResponse.json({ error: "Prohibido" }, { status: 403 });
    }

    await review.deleteOne();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error servidor" }, { status: 500 });
  }
}
