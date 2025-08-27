import { describe, it, expect, vi, beforeEach } from "vitest";
import { getBook } from "@/lib/googleBooks";

global.fetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getBook", () => {
  it("devuelve el libro cuando la API responde OK", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "123", volumeInfo: { title: "Test Book" } }),
    });

    const book = await getBook("123");
    expect(book.id).toBe("123");
    expect(book.volumeInfo.title).toBe("Test Book");
  });

  it("lanza error cuando la API falla", async () => {
    (fetch as any).mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(getBook("999")).rejects.toThrow();
  });
});
