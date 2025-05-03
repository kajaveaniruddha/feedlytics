import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.svg"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    assetsDir: ".",
    rollupOptions: {
      output: {
        format: "iife",
        name: "App",
        entryFileNames: "feedlytics_widget.js",
      },
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});