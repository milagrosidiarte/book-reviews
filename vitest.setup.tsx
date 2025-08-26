/// <reference types="vitest" />
import "@testing-library/jest-dom";
import React from "react";
import { beforeEach, vi } from "vitest";

// Limpieza básica entre pruebas
beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = "";
});

// Mock de next/image para que renderice <img> en tests
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt ?? ""} {...rest} />;
  },
}));

// (Opcional) si uso sonner en el layout
vi.mock("sonner", () => ({
  Toaster: () => null,
  toast: { success: () => {}, error: () => {} },
}));
