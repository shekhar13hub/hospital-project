import { defineConfig } from 'vitest/config'

// Vitest configuration: use jsdom and a setup file that loads jest-dom matchers
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test.setup.js'],
    globals: true,
  },
})
