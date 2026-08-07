import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative assets keep the build working under any GitHub Pages repository path.
  base: './',
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
})
