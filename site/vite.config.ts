import { fileURLToPath } from "node:url";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/postcss";

const siteRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: siteRoot,
  base: "/MyPortfolio/",
  plugins: [react()],
  resolve: { alias: { "@": siteRoot } },
  css: { postcss: { plugins: [tailwindcss({ base: siteRoot })] } },
  build: { outDir: path.resolve(siteRoot, "../.build"), emptyOutDir: true },
});
