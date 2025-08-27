import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("next/image");

vi.mock("@/lib/googleBooks", () => ({
  getBook: vi.fn().mockResolvedValue({
    id: "abc",
    volumeInfo: { title: "Libro mockeado", imageLinks: {} },
  }),
}));

// Importá la page DESPUÉS de mockear
import BookPage from "@/app/book/[id]/page";

describe("BookPage", () => {
  it("muestra el título del libro", async () => {
    // BookPage es async (Server Component) y devuelve JSX (Promise)
    const ui = await BookPage({ params: { id: "abc" } as any });
    render(ui as any);
    expect(await screen.findByText("Libro mockeado")).toBeInTheDocument();
  });
});
