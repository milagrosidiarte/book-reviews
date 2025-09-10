// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

// 1) Mocks de todo lo externo
vi.mock("@/auth", () => ({
  auth: vi.fn().mockResolvedValue(null), // no logueado
}));

vi.mock("@/lib/googleBooks", () => ({
  getBook: vi.fn().mockResolvedValue({
    id: "vol1",
    volumeInfo: {
      title: "El libro de pruebas",
      authors: ["Autor X"],
      description: "<p>Desc</p>",
      imageLinks: { thumbnail: "https://example.com/img.jpg" },
    },
  }),
}));

vi.mock("@/lib/db", () => ({
  connectDB: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/models/Review", () => ({
  default: {
    find: vi.fn().mockReturnValue({ sort: () => ({ lean: () => Promise.resolve([]) }) }),
    findOne: vi.fn().mockReturnValue({ lean: () => Promise.resolve(null) }),
  },
}));

vi.mock("@/models/Favorite", () => ({
  default: { findOne: vi.fn().mockReturnValue({ lean: () => Promise.resolve(null) }) },
}));

vi.mock("@/models/Vote", () => ({
  default: {
    aggregate: vi.fn().mockResolvedValue([]),
    find: vi.fn().mockReturnValue({ lean: () => Promise.resolve([]) }),
    findOneAndUpdate: vi.fn(),
  },
}));

// next/image mock
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// 2) Importar DESPUÉS de mockear
import BookPage from "@/app/book/[id]/page";

// 3) Render: resolver el server component y luego renderizarlo
describe("BookPage", () => {
  it("muestra el título del libro", async () => {
    const ui = await BookPage({ params: Promise.resolve({ id: "vol1" }) } as any);
    render(ui as any);

    expect(await screen.findByRole("heading", { name: /El libro de pruebas/i })).toBeInTheDocument();
    expect(screen.getByText(/Autor X/)).toBeInTheDocument();
  }, 10000); // timeout local por si el entorno va lento
});
