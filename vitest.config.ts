/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@pages": "/src/pages",
      "@store": "/src/store",
      "@types": "/src/types",
      "@hooks": "/src/hooks",
      "@utils": "/src/utils",
      "@constants": "/src/constants",
    },
  },
});
