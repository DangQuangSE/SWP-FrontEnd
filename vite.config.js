import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
  },
  server: {
    proxy: {
      "/api": {
        target: "http://14.225.192.15:8085", // địa chỉ Spring Boot backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
