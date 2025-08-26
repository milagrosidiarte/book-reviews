import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ReviewSection from "@/components/ui/ReviewSection";

vi.mock("next/image"); // usa nuestro mock de __mocks__/next/image.tsx

describe("ReviewSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el título y el botón", () => {
    render(<ReviewSection bookId="1" />);
    expect(screen.getByText(/Deja tu reseña/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Enviar/i })).toBeInTheDocument();
  });

  it("permite escribir en el textarea", () => {
    render(<ReviewSection bookId="1" />);
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Excelente libro" } });
    expect(textarea).toHaveValue("Excelente libro");
  });
});
