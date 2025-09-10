import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    // Node por defecto (API/core)
    environment: "node",
    globals: true,
    setupFiles: ["./setupTests.ts"],
    include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
    ],
    // jsdom automáticamente para tests de UI
    environmentMatchGlobs: [
      ["**/__tests__/ui/**", "jsdom"],
      ["**/*.test.tsx", "jsdom"],
    ],
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
});
