import { vi } from "vitest";

// Mock de auth para pruebas de UI
vi.mock("@/auth", () => ({
  auth: vi.fn().mockResolvedValue(null), // simula "no logueado"
  signIn: vi.fn(),
  signOut: vi.fn(),
}));


import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

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
