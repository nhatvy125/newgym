import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' //tailwind bản mới đã được tích hợp
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // THÊM DÒNG NÀY
  ],
  resolve: {
    alias: [
      { find: /^@\/components\/(.*)$/, replacement: path.resolve(__dirname, './src/apps/user/components/$1') },
      { find: /^@\/hooks\/(.*)$/, replacement: path.resolve(__dirname, './src/hooks/$1') },
      { find: /^@\/services\/(.*)$/, replacement: path.resolve(__dirname, './src/services/$1') },
      { find: /^@\/api\/(.*)$/, replacement: path.resolve(__dirname, './src/api/$1') },
      { find: /^@\/assets\/(.*)$/, replacement: path.resolve(__dirname, './src/assets/$1') },
      { find: /^@\/lib\/(.*)$/, replacement: path.resolve(__dirname, './src/lib/$1') },
      { find: /^@\//, replacement: path.resolve(__dirname, './src') },
    ],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        // Giữ nguyên tiền tố /api để backend Spring Boot vẫn nhận đúng route /api/auth và /api/classes
        rewrite: (path) => path,
      }
    }
  }
})