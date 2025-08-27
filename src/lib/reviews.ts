
export type Review = {
  userId: string;
  rating: number;   // 1..5
  text: string;     // 2..500 chars (por defecto)
  createdAt: Date;
};

export function clampRating(r: number): number {
  // Manejo explícito de no-finitos para alinear con los tests:
  if (Number.isNaN(r)) return 1;
  if (r === Infinity) return 5;
  if (r === -Infinity) return 1;
  // Clamp + redondeo
  return Math.min(5, Math.max(1, Math.round(r)));
}

export function validateReviewText(
  text: string,
  opts: { min?: number; max?: number } = {}
): { ok: true } | { ok: false; error: string } {
  const min = opts.min ?? 2;   // ← ahora 2 para que "ok" sea válido
  const max = opts.max ?? 500;

  const t = (text ?? "").trim();
  if (!t) return { ok: false, error: "empty" };
  if (t.length < min) return { ok: false, error: "too_short" };
  if (t.length > max) return { ok: false, error: "too_long" };
  return { ok: true };
}

export function averageRating(ratings: number[]): number | null {
  const valid = ratings.filter((x) => Number.isFinite(x));
  if (valid.length === 0) return null;
  const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
  return Math.round(avg * 10) / 10; // 1 decimal
}

export function upsertReview(list: Review[], incoming: Review): Review[] {
  const idx = list.findIndex((r) => r.userId === incoming.userId);
  if (idx === -1) return [...list, incoming];
  const copy = list.slice();
  copy[idx] = incoming;
  return copy;
}

// Elige mejor imagen y fuerza https, o "" si no hay
export function pickImageHttps(links?: Record<string, string>): string {
  const order = ["large", "medium", "thumbnail", "smallThumbnail"];
  for (const k of order) {
    const v = links?.[k];
    if (v) return v.replace(/^http:\/\//, "https://");
  }
  return "";
}
