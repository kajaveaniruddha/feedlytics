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
  define: {
    "process.env.NODE_ENV": JSON.stringify("production")
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.jsx"),
      name: "FeedlyticsWidget",
      formats: ["iife"],
      fileName: () => "feedlytics_widget.js",
    },
    rollupOptions: {},
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
