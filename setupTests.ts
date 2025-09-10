// setupTests.ts
import { afterEach } from "vitest";

// Env mínimos para handlers/SSR
process.env.NEXTAUTH_URL ||= "http://localhost:3000";
process.env.NEXTAUTH_SECRET ||= "test-secret";
process.env.MONGODB_URI ||= "mongodb://127.0.0.1:27017/test";

// Limpieza de Testing Library SOLO en jsdom
afterEach(async () => {
  if (typeof window !== "undefined") {
    const { cleanup } = await import("@testing-library/react");
    cleanup();
  }
});
