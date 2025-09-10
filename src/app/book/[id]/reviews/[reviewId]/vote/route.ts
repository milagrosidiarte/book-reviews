import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Vote from "@/models/Vote";
import { requireUser } from "@/lib/auth-helpers";

const VoteSchema = z.object({
  value: z.enum(["up", "down"]),
});

export async function POST(
  req: Request,
  { params }: { params: { reviewId: string } }
) {
  const authUser = await requireUser();
  if (!authUser) return NextResponse.json({ error: "No auth" }, { status: 401 });

  try {
    const json = await req.json();
    const parsed = VoteSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    const value = parsed.data.value === "up" ? 1 : -1;

    await connectDB();

    const doc = await Vote.findOneAndUpdate(
      { reviewId: params.reviewId, userId: authUser.userId },
      { value },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ vote: doc }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error servidor" }, { status: 500 });
  }
}
