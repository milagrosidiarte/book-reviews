import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
});
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
const ReviewCreateSchema = z.object({
  volumeId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  body: z.string().max(5000).optional(),
});

describe("validation", () => {
  it("register válido/ inválido", () => {
    expect(RegisterSchema.safeParse({ email: "a@b.com", password: "12345678" }).success).toBe(true);
    expect(RegisterSchema.safeParse({ email: "x", password: "123" }).success).toBe(false);
  });

  it("login válido/ inválido", () => {
    expect(LoginSchema.safeParse({ email: "a@b.com", password: "12345678" }).success).toBe(true);
    expect(LoginSchema.safeParse({ email: "a@b.com" }).success).toBe(false);
  });

  it("review create válido/ inválido", () => {
    expect(ReviewCreateSchema.safeParse({ volumeId: "abc", rating: 5 }).success).toBe(true);
    expect(ReviewCreateSchema.safeParse({ volumeId: "", rating: 10 }).success).toBe(false);
  });
});
