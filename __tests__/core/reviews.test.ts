import { describe, it, expect } from "vitest";
import { clampRating, validateReviewText, averageRating, upsertReview, pickImageHttps, Review } from "@/lib/reviews";

describe("clampRating", () => {
  it("limita a 1..5 y redondea", () => {
    expect(clampRating(-2)).toBe(1);
    expect(clampRating(3.4)).toBe(3);
    expect(clampRating(4.6)).toBe(5);
    expect(clampRating(9)).toBe(5);
  });
  it("maneja NaN/Infinity", () => {
    expect(clampRating(NaN)).toBe(1);
    expect(clampRating(Infinity)).toBe(5);
  });
});

describe("validateReviewText", () => {
  it("rechaza vacío/espacios", () => {
    expect(validateReviewText("")).toEqual({ ok: false, error: "empty" });
    expect(validateReviewText("   ")).toEqual({ ok: false, error: "empty" });
  });
  it("valida longitudes", () => {
    expect(validateReviewText("ok")).toEqual({ ok: true }); //2 chars valido con min=2
    expect(validateReviewText("a".repeat(1))).toEqual({ ok: false, error: "too_short" }); // 1 < 2
    expect(validateReviewText("a".repeat(501))).toEqual({ ok: false, error: "too_long" });
  });
});

describe("averageRating", () => {
  it("null si no hay válidos", () => {
    expect(averageRating([])).toBeNull();
    expect(averageRating([NaN])).toBeNull();
  });
  it("1 decimal", () => {
    expect(averageRating([5, 4, 4])).toBe(4.3);
  });
});

describe("upsertReview", () => {
  const base: Review[] = [{ userId: "u1", rating: 5, text: "A", createdAt: new Date(0) }];
  it("inserta si no existe", () => {
    const out = upsertReview(base, { userId: "u2", rating: 3, text: "B", createdAt: new Date(0) });
    expect(out).toHaveLength(2);
  });
  it("actualiza si existe", () => {
    const out = upsertReview(base, { userId: "u1", rating: 2, text: "C", createdAt: new Date(0) });
    expect(out).toHaveLength(1);
    expect(out[0].rating).toBe(2);
    expect(out[0].text).toBe("C");
  });
});

describe("pickImageHttps", () => {
  it("elige en orden y fuerza https", () => {
    expect(pickImageHttps({ smallThumbnail: "http://a/s.jpg" })).toBe("https://a/s.jpg");
    expect(pickImageHttps({ thumbnail: "https://a/t.jpg" })).toBe("https://a/t.jpg");
    expect(pickImageHttps({})).toBe("");
    expect(pickImageHttps()).toBe("");
  });
});
// Nota: los tests de integración (p.ej. que usan getBook) están en __tests__/ui