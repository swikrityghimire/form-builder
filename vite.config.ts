import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    target: ["es2015", "chrome80", "safari14", "firefox78", "edge88"],
    cssTarget: ["chrome80", "safari14", "firefox78", "edge88"],
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes("node_modules")) return;
          if (
            id.includes("react-router-dom") ||
            id.includes("/react/") ||
            id.includes("/react-dom/")
          ) {
            return "vendor";
          }
          if (id.includes("lucide-react") || id.includes("sonner")) {
            return "ui";
          }
          if (id.includes("@dnd-kit")) {
            return "dnd";
          }
        },
      },
    },
  },
});