import { vi, afterEach } from "vitest";

// Mocks
const mockConnect = vi.fn().mockResolvedValue(undefined);
vi.mock("@/lib/db", () => ({ connectDB: mockConnect }));

// auth(): logged/unlogged
const auth = vi.fn();
vi.mock("@/auth", () => ({ auth }));

// Review model mock
const reviewDoc = (overrides: any = {}) => ({
  _id: "r1",
  userId: "u1",
  rating: 3,
  title: "t",
  body: "b",
  save: vi.fn().mockResolvedValue(undefined),
  deleteOne: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

const Review = {
  findById: vi.fn(),
};
vi.mock("@/models/Review", () => ({ default: Review }));

const importRoute = () => import("@/app/api/reviews/[reviewId]/route");

afterEach(() => {
  vi.clearAllMocks();
});

describe("PATCH /api/reviews/[reviewId]", () => {
  it("401 si no hay sesión", async () => {
    auth.mockResolvedValue(null);
    const { PATCH } = await importRoute();

    const req = new Request("http://x/api/reviews/r1", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ rating: 4 }),
    });

    const res = await PATCH(req, { params: { reviewId: "r1" } as any });
    expect(res.status).toBe(401);
  });

  it("403 si no es el dueño", async () => {
    auth.mockResolvedValue({ user: { id: "otro" } });
    Review.findById.mockResolvedValue(reviewDoc({ userId: "u1" }));

    const { PATCH } = await importRoute();
    const req = new Request("http://x/api/reviews/r1", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ rating: 4 }),
    });

    const res = await PATCH(req, { params: { reviewId: "r1" } as any });
    expect(res.status).toBe(403);
  });

  it("200 si es el dueño y actualiza", async () => {
    const doc = reviewDoc({ userId: "u1" });
    auth.mockResolvedValue({ user: { id: "u1" } });
    Review.findById.mockResolvedValue(doc);

    const { PATCH } = await importRoute();
    const req = new Request("http://x/api/reviews/r1", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ rating: 4 }),
    });

    const res = await PATCH(req, { params: { reviewId: "r1" } as any });
    expect(res.status).toBe(200);
    expect(doc.save).toHaveBeenCalled();
  });
});

describe("DELETE /api/reviews/[reviewId]", () => {
  it("403 si no es el dueño", async () => {
    auth.mockResolvedValue({ user: { id: "otro" } });
    Review.findById.mockResolvedValue(reviewDoc({ userId: "u1" }));
    const { DELETE } = await importRoute();

    const res = await DELETE(new Request("http://x/api/reviews/r1"), {
      params: { reviewId: "r1" } as any,
    });
    expect(res.status).toBe(403);
  });

  it("200 si borra el dueño", async () => {
    const doc = reviewDoc({ userId: "u1" });
    auth.mockResolvedValue({ user: { id: "u1" } });
    Review.findById.mockResolvedValue(doc);
    const { DELETE } = await importRoute();

    const res = await DELETE(new Request("http://x/api/reviews/r1"), {
      params: { reviewId: "r1" } as any,
    });
    expect(res.status).toBe(200);
    expect(doc.deleteOne).toHaveBeenCalled();
  });
});
