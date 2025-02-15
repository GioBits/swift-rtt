import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'

// Cargar variables de entorno desde el archivo .env
dotenv.config({ path: resolve(__dirname, '../.env') })

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg']
  },
  server: {
    host: process.env.VITE_HOST || 'localhost',
    port: parseInt(process.env.VITE_PORT) || 3000
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': resolve(__dirname, 'src/components'),
      '@contexts': resolve(__dirname, 'src/contexts'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@locales': resolve(__dirname, 'src/locales'),
      '@service': resolve(__dirname, 'src/service'),
      '@store': resolve(__dirname, 'src/store'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom', // Para pruebas en un entorno de navegador
    include: ['**/__tests__/**/*.test.js'], // Incluir solo los archivos de prueba
  },
})
