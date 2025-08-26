import { describe, it, expect } from "vitest";
import { toHttps } from "@/lib/img";

describe("toHttps", () => {
  it("reemplaza http por https", () => {
    expect(toHttps("http://a/b.jpg")).toBe("https://a/b.jpg");
  });
  it("no cambia si ya es https", () => {
    expect(toHttps("https://a/b.jpg")).toBe("https://a/b.jpg");
  });
  it("devuelve vacío si es null/undefined", () => {
    expect(toHttps(undefined)).toBe("");
    expect(toHttps(null as any)).toBe("");
  });
});
