import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
    allowedHosts: true, // Cho phép tất cả các host (bao gồm IP Tailscale)
    proxy: {
      // Cấu hình để "bắn" API sang server trường
      '/api': {
        target: 'https://prod.sis.wellspring.edu.vn',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 4000,
    host: true,
    allowedHosts: ['library.wellspring.edu.vn'],
  }
})