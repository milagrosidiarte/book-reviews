export type Review = {
  userId: string;
  rating: number;   // 1..5
  text: string;     // 3..500 chars
  createdAt: Date;
};

export function clampRating(r: number): number {
  if (!Number.isFinite(r)) return 1;
  return Math.min(5, Math.max(1, Math.round(r)));
}

export function validateReviewText(text: string): { ok: true } | { ok: false; error: string } {
  const t = (text ?? "").trim();
  if (!t) return { ok: false, error: "empty" };
  if (t.length < 3) return { ok: false, error: "too_short" };
  if (t.length > 500) return { ok: false, error: "too_long" };
  return { ok: true };
}

export function averageRating(ratings: number[]): number | null {
  const valid = ratings.filter((x) => Number.isFinite(x));
  if (valid.length === 0) return null;
  const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
  return Math.round(avg * 10) / 10;
}

export function upsertReview(list: Review[], incoming: Review): Review[] {
  const idx = list.findIndex((r) => r.userId === incoming.userId);
  if (idx === -1) return [...list, incoming];
  const copy = list.slice();
  copy[idx] = incoming;
  return copy;
}

export function pickImageHttps(links?: Record<string, string>): string {
  const order = ["large", "medium", "thumbnail", "smallThumbnail"];
  for (const k of order) {
    const v = links?.[k];
    if (v) return v.replace(/^http:\/\//, "https://");
  }
  return "";
}
