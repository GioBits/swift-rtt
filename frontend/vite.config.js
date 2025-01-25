import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import { resolve } from 'path'

// Cargar variables de entorno desde el archivo .env
dotenv.config({ path: resolve(__dirname, '../.env') })

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.VITE_HOST || 'localhost',
    port: parseInt(process.env.VITE_PORT) || 3000
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom', // Para pruebas en un entorno de navegador
    include: ['**/__tests__/**/*.test.js'], // Incluir solo los archivos de prueba
  },
})
