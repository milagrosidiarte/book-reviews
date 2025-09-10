import { vi, afterEach } from "vitest";

// Mocks
vi.mock("@/lib/db", () => ({ connectDB: vi.fn().mockResolvedValue(undefined) }));
const auth = vi.fn();
vi.mock("@/auth", () => ({ auth }));

const Vote = { findOneAndUpdate: vi.fn() };
vi.mock("@/models/Vote", () => ({ default: Vote }));

const importRoute = () => import("@/app/api/reviews/[reviewId]/vote/route");

afterEach(() => vi.clearAllMocks());

describe("POST /api/reviews/[id]/vote", () => {
  it("401 si no hay sesión", async () => {
    auth.mockResolvedValue(null);
    const { POST } = await importRoute();
    const req = new Request("http://x/api/reviews/r1/vote", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ value: "up" }),
    });
    const res = await POST(req, { params: { reviewId: "r1" } as any });
    expect(res.status).toBe(401);
  });

  it("201 si vota logueado", async () => {
    auth.mockResolvedValue({ user: { id: "u1" } });
    Vote.findOneAndUpdate.mockResolvedValue({ _id: "v1" });

    const { POST } = await importRoute();
    const req = new Request("http://x/api/reviews/r1/vote", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ value: "down" }),
    });
    const res = await POST(req, { params: { reviewId: "r1" } as any });
    expect(res.status).toBe(201);
  });
});
