import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sentryVitePlugin({
    org: "fpt-hy",
    project: "javascript-react"
  })],

  define: {
    global: "globalThis",
  },

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // địa chỉ Spring Boot backend
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    sourcemap: true
  }
});