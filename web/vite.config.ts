import { defineConfig } from "vite";

const here = (path: string) => new URL(path, import.meta.url).pathname;

export default defineConfig({
  root: here("."),
  base: "/",
  esbuild: { jsx: "automatic" },
  server: { port: 5175, strictPort: true },
  build: { outDir: here("../static"), emptyOutDir: true },
});
