import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ReviewSection from "@/components/ui/ReviewSection";

vi.mock("next/image");

describe("ReviewSection", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renderiza el título y el botón", () => {
    render(<ReviewSection bookId="1" />);
    // Título actual del componente
    expect(screen.getByRole("heading", { level: 3, name: /Escribir reseña/i })).toBeInTheDocument();
    // Botón actual del componente
    expect(screen.getByRole("button", { name: /Publicar/i })).toBeInTheDocument();
  });

  it("permite escribir en el input", () => {
    render(<ReviewSection bookId="1" />);
    const input = screen.getByPlaceholderText("¿Qué te pareció el libro?");
    fireEvent.change(input, { target: { value: "Excelente libro" } });
    expect(input).toHaveValue("Excelente libro");
  });
});
