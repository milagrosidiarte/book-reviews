import { afterEach, vi } from "vitest";

// Mocks
const mockConnect = vi.fn().mockResolvedValue(undefined);
vi.mock("@/lib/db", () => ({ connectDB: mockConnect }));

const User = {
  exists: vi.fn(),
  create: vi.fn(),
};
vi.mock("@/models/User", () => ({ default: User }));

// Import dinámico del handler (después de mockear)
const importRoute = () => import("@/app/api/auth/register/route");

afterEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/auth/register", () => {
  it("201 cuando crea usuario nuevo", async () => {
    User.exists.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: "u1" });
    const { POST } = await importRoute();
    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "a@b.com", password: "Secreta123", name: "A" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it("409 cuando email ya existe", async () => {
    User.exists.mockResolvedValue(true);
    const { POST } = await importRoute();
    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "a@b.com", password: "Secreta123" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(409);
  });

  it("400 cuando body inválido", async () => {
    const { POST } = await importRoute();
    const req = new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "mal", password: "123" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
