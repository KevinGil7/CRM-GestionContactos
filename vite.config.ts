import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// Solución alternativa si __dirname no existe
export default defineConfig({
  plugins: [react(), tailwindcss() ],
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'), // Asegúrate que __dirname esté definido
    },
  },
})
