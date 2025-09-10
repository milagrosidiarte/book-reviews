import { hashPassword, verifyPassword } from "@/lib/password";

describe("password utils", () => {
  it("hashPassword devuelve un string y verifyPassword true/false", async () => {
    const hash = await hashPassword("Secreta123");
    expect(typeof hash).toBe("string");
    expect(await verifyPassword("Secreta123", hash)).toBe(true);
    expect(await verifyPassword("otra", hash)).toBe(false);
  });
});
