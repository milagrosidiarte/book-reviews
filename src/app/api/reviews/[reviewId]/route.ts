// app/api/reviews/[reviewId]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import { z } from "zod";
import { requireUser } from "@/lib/auth-helpers";

export const runtime = "nodejs";

const ReviewUpdateSchema = z
  .object({
    rating: z.number().int().min(1).max(5).optional(),
    title: z.string().max(120).optional(),
    body: z.string().max(5000).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, "Sin cambios");

export async function PATCH(req: Request, ctx: any) {
  const { reviewId } = (ctx.params ?? {}) as { reviewId: string };

  const authUser = await requireUser();
  if (!authUser) {
    return NextResponse.json({ error: "No auth" }, { status: 401 });
  }

  try {
    const json = await req.json().catch(() => null);
    const parsed = ReviewUpdateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    await connectDB();

    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json({ error: "No existe" }, { status: 404 });
    }

    // comparación de ownership (cast simple para evitar que TS se queje)
    const ownerId = String((review as any).userId);
    if (ownerId !== authUser.userId) {
      return NextResponse.json({ error: "Prohibido" }, { status: 403 });
    }

    Object.assign(review, parsed.data);
    await review.save();

    return NextResponse.json({ review }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Error servidor" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: any) {
  const { reviewId } = (ctx.params ?? {}) as { reviewId: string };

  const authUser = await requireUser();
  if (!authUser) {
    return NextResponse.json({ error: "No auth" }, { status: 401 });
  }

  try {
    await connectDB();

    const review = await Review.findById(reviewId).select("_id userId");
    if (!review) {
      return NextResponse.json({ error: "No existe" }, { status: 404 });
    }

    const ownerId = String((review as any).userId);
    if (ownerId !== authUser.userId) {
      return NextResponse.json({ error: "Prohibido" }, { status: 403 });
    }

    await review.deleteOne();
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Error servidor" }, { status: 500 });
  }
}
