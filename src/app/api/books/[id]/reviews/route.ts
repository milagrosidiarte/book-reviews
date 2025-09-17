// app/api/books/[id]/reviews/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: any) {
  const { id } = (ctx.params ?? {}) as { id: string };

  try {
    await connectDB();
    const reviews = await Review.find({ volumeId: id });
    return NextResponse.json(reviews, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Error servidor" }, { status: 500 });
  }
}

export async function POST(_req: Request, ctx: any) {
  const { id } = (ctx.params ?? {}) as { id: string };

  try {
    const body = await _req.json();

    await connectDB();
    const newReview = await Review.create({
      volumeId: id,
      ...body,
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error servidor" }, { status: 500 });
  }
}
