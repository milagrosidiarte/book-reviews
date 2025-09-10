import { vi, afterEach } from "vitest";

vi.mock("@/lib/db", () => ({ connectDB: vi.fn().mockResolvedValue(undefined) }));
const auth = vi.fn();
vi.mock("@/auth", () => ({ auth }));

const Favorite = {
  findOne: vi.fn(),
  deleteOne: vi.fn(),
  create: vi.fn(),
};
vi.mock("@/models/Favorite", () => ({ default: Favorite }));

const importRoute = () => import("@/app/api/books/[id]/favorite/route");

afterEach(() => vi.clearAllMocks());

describe("POST/DELETE /api/books/[id]/favorite", () => {
  it("401 si no hay sesión (POST)", async () => {
    auth.mockResolvedValue(null);
    const { POST } = await importRoute();
    const res = await POST(new Request("http://x/api/books/b1/favorite"), {
      params: { id: "b1" } as any,
    });
    expect(res.status).toBe(401);
  });

  it("201 cuando agrega favorito", async () => {
    auth.mockResolvedValue({ user: { id: "u1" } });
    Favorite.findOne.mockResolvedValue(null);
    Favorite.create.mockResolvedValue({ _id: "f1" });

    const { POST } = await importRoute();
    const res = await POST(new Request("http://x/api/books/b1/favorite"), {
      params: { id: "b1" } as any,
    });
    expect(res.status).toBe(201);
    expect(Favorite.create).toHaveBeenCalledWith({ userId: "u1", volumeId: "b1" });
  });

  it("200 cuando quita favorito (DELETE)", async () => {
    auth.mockResolvedValue({ user: { id: "u1" } });
    const { DELETE } = await importRoute();
    const res = await DELETE(new Request("http://x/api/books/b1/favorite"), {
      params: { id: "b1" } as any,
    });
    expect(res.status).toBe(200);
  });
});
