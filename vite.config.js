import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'animation-vendor': ['framer-motion'],
          'form-vendor': ['react-hook-form', 'react-datepicker'],
          'query-vendor': ['@tanstack/react-query'],
          'ui-vendor': ['sweetalert2', 'react-toastify', 'react-icons'],
        }
      }
    }
  }
})
