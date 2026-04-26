import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' //tailwind bản mới đã được tích hợp

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // THÊM DÒNG NÀY
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})