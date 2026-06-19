import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/KIM-FLAGI/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('atlasCountries.js')) return 'atlas-data'
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
})
